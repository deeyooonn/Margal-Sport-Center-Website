-- New isolated Margal tables in the existing active Client Scrapper project.
-- The inactive original MARGAL project is preserved without modification.
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  email text,
  phone text,
  fb_link text,
  avatar_url text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  tier text NOT NULL DEFAULT 'Standard',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE FUNCTION public.is_margal_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') $$;
REVOKE ALL ON FUNCTION public.is_margal_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_margal_admin() TO authenticated;

CREATE FUNCTION public.handle_margal_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'name', ''), NEW.email, NEW.raw_user_meta_data->>'phone');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_margal_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_margal_new_user();

CREATE FUNCTION public.protect_margal_profile_role() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF auth.role() = 'authenticated' AND NOT public.is_margal_admin()
     AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.tier IS DISTINCT FROM OLD.tier) THEN
    RAISE EXCEPTION 'Account privileges can only be changed by an administrator' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER protect_margal_role BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_margal_profile_role();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
CREATE POLICY profile_read ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_margal_admin());
CREATE POLICY profile_update ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.is_margal_admin())
WITH CHECK (id = auth.uid() OR public.is_margal_admin());

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  time_slots jsonb NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  customer_name text,
  customer_phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bookings_user_created ON public.bookings (user_id, created_at DESC);
CREATE INDEX bookings_active_date ON public.bookings (booking_date) WHERE status <> 'cancelled';

CREATE TABLE public.booking_slots (
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  hour integer NOT NULL CHECK (hour BETWEEN 8 AND 23),
  PRIMARY KEY (booking_date, hour)
);
ALTER TABLE public.booking_slots ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.booking_slots FROM anon, authenticated;
GRANT ALL ON public.booking_slots TO service_role;

CREATE FUNCTION public.validate_margal_booking() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE slot_count integer; distinct_hours integer;
BEGIN
  IF TG_OP = 'UPDATE' AND auth.role() = 'authenticated' AND NOT public.is_margal_admin()
     AND ((to_jsonb(NEW) - 'status') IS DISTINCT FROM (to_jsonb(OLD) - 'status') OR NEW.status <> 'cancelled') THEN
    RAISE EXCEPTION 'Customers can only cancel their own bookings' USING ERRCODE = '42501';
  END IF;
  IF jsonb_typeof(NEW.time_slots) <> 'array' OR jsonb_array_length(NEW.time_slots) NOT BETWEEN 1 AND 16 THEN
    RAISE EXCEPTION 'Choose between one and sixteen hourly slots' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(NEW.time_slots) s WHERE
      jsonb_typeof(s->'hour') IS DISTINCT FROM 'number' OR (s->>'hour')::integer NOT BETWEEN 8 AND 23) THEN
    RAISE EXCEPTION 'Invalid booking hour' USING ERRCODE = '22023';
  END IF;
  SELECT count(*), count(DISTINCT (s->>'hour')::integer) INTO slot_count, distinct_hours
  FROM jsonb_array_elements(NEW.time_slots) s;
  IF slot_count <> distinct_hours THEN RAISE EXCEPTION 'Duplicate booking hour' USING ERRCODE = '22023'; END IF;
  SELECT jsonb_agg(s || jsonb_build_object('rate', CASE WHEN (s->>'hour')::integer >= 18 THEN 400 ELSE 300 END)),
    sum(CASE WHEN (s->>'hour')::integer >= 18 THEN 400 ELSE 300 END)
  INTO NEW.time_slots, NEW.total_amount FROM jsonb_array_elements(NEW.time_slots) s;
  RETURN NEW;
END;
$$;
CREATE TRIGGER validate_booking BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.validate_margal_booking();

CREATE FUNCTION public.sync_margal_booking_slots() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  DELETE FROM public.booking_slots WHERE booking_id = NEW.id;
  IF NEW.status <> 'cancelled' THEN
    INSERT INTO public.booking_slots (booking_id, booking_date, hour)
    SELECT NEW.id, NEW.booking_date, (s->>'hour')::integer FROM jsonb_array_elements(NEW.time_slots) s;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER sync_booking_slots AFTER INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.sync_margal_booking_slots();

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.bookings FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
CREATE POLICY bookings_read ON public.bookings FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_margal_admin());
CREATE POLICY bookings_insert ON public.bookings FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND status = 'upcoming');
CREATE POLICY bookings_update ON public.bookings FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.is_margal_admin())
WITH CHECK (public.is_margal_admin() OR (user_id = auth.uid() AND status = 'cancelled'));

CREATE FUNCTION public.get_booked_slots(p_booking_date date)
RETURNS TABLE (id uuid, booking_date date, time_slots jsonb, status text, customer_name text, customer_phone text, notes text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT b.id, b.booking_date, b.time_slots, b.status,
    CASE WHEN public.is_margal_admin() THEN b.customer_name END,
    CASE WHEN public.is_margal_admin() THEN b.customer_phone END,
    CASE WHEN public.is_margal_admin() THEN b.notes END
  FROM public.bookings b
  WHERE auth.uid() IS NOT NULL AND b.booking_date = p_booking_date AND b.status <> 'cancelled';
$$;
REVOKE ALL ON FUNCTION public.get_booked_slots(date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(date) TO authenticated;
