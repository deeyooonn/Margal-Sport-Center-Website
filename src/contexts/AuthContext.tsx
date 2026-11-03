import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured, type Profile } from '../lib/supabase';

// ─── Context Types ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) return null;
    return data as Profile;
  } catch {
    return null;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured); // false immediately when not configured
  const [authRevision, setAuthRevision] = useState(0);
  const currentUserId = useRef<string | null>(null);
  const profileRevision = useRef(0);

  const refreshProfile = async () => {
    if (!user || !supabaseConfigured) return;
    const revision = ++profileRevision.current;
    const p = await fetchProfile(user.id);
    if (currentUserId.current === user.id && revision === profileRevision.current) {
      setProfile(p);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Keep public pages available when online account services are unconfigured.
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;
    let receivedEvent = false;
    const applySession = (next: Session | null) => {
      if (!active) return;
      currentUserId.current = next?.user.id ?? null;
      profileRevision.current++;
      setProfile(null);
      setSession(next);
      setUser(next?.user ?? null);
      setAuthRevision(value => value + 1);
      setLoading(Boolean(next?.user));
    };

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, next) => {
        receivedEvent = true;
        applySession(next);
      }
    );

    supabase.auth.getSession().then(({ data, error }) => {
      if (!receivedEvent) applySession(error ? null : data.session);
    }).catch(() => {
      if (!receivedEvent) applySession(null);
    });

    return () => {
      active = false;
      currentUserId.current = null;
      profileRevision.current++;
      subscription.unsubscribe();
    };
  }, []);

  // Profile I/O runs after auth notifications finish. Ignore stale requests.
  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    let active = true;
    const revision = ++profileRevision.current;
    fetchProfile(user.id).then(next => {
      if (active && currentUserId.current === user.id && revision === profileRevision.current) {
        setProfile(next);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [user, authRevision]);

  const signOut = async () => {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    currentUserId.current = null;
    profileRevision.current++;
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, session, profile, isAdmin, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
