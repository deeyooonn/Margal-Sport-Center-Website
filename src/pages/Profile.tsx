import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Clock,
  Facebook,
  Mail,
  Phone,
  Shield,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Clock3,
  Award,
  LogOut,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { supabase, supabaseConfigured } from '../lib/supabase';

// ─── Sports avatar choices ─────────────────────────────────────────────────
const sportsAvatars = [
  {
    name: 'Elite Player',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
  },
  {
    name: 'Court Champion',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=256&auto=format&fit=crop'
  },
  {
    name: 'Athletic Pro',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop'
  },
  {
    name: 'Active Star',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop'
  }
];

export function Profile() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut, refreshProfile } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings();

  // Fallback to localStorage profile for demo/admin mode
  const localProfile = (() => {
    try {
      const stored = localStorage.getItem('margal_user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  })();

  // Prefer Supabase profile, fall back to localStorage
  const activeProfile = profile ?? localProfile ?? {
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@example.com',
    phone: '0917-555-0123',
    fb_link: 'facebook.com/ka.margal.player',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    tier: 'Ka-Margal Elite',
    role: 'user'
  };

  // ─── Edit State ─────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState(activeProfile.name ?? '');
  const [editEmail, setEditEmail] = useState(activeProfile.email ?? '');
  const [editPhone, setEditPhone] = useState(activeProfile.phone ?? '');
  const [editFB, setEditFB] = useState(activeProfile.fb_link ?? '');
  const [selectedAvatar, setSelectedAvatar] = useState(activeProfile.avatar_url ?? sportsAvatars[0].url);
  const [editRole, setEditRole] = useState(activeProfile.role ?? 'user');

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('margal_user_profile');
    toast.success('Signed out successfully!');
    navigate('/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updates = {
      name: editName,
      email: editEmail,
      phone: editPhone,
      fb_link: editFB,
      avatar_url: selectedAvatar,
      role: editRole as 'user' | 'admin',
    };

    if (user && supabaseConfigured) {
      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to save changes: ' + error.message);
        setIsSaving(false);
        return;
      }
      await refreshProfile();
    } else {
      // Fallback: save to localStorage for demo mode
      const updated = { ...localProfile, ...updates };
      localStorage.setItem('margal_user_profile', JSON.stringify(updated));
      window.dispatchEvent(new Event('margal_profile_updated'));
    }

    setIsEditing(false);
    setIsSaving(false);
    toast.success('Profile saved successfully!');
  };

  const handleCancel = () => {
    setEditName(activeProfile.name ?? '');
    setEditEmail(activeProfile.email ?? '');
    setEditPhone(activeProfile.phone ?? '');
    setEditFB(activeProfile.fb_link ?? '');
    setSelectedAvatar(activeProfile.avatar_url ?? sportsAvatars[0].url);
    setEditRole(activeProfile.role ?? 'user');
    setIsEditing(false);
  };

  // ─── Booking History ─────────────────────────────────────────────────────────
  // Combine Supabase bookings with any historical demo bookings
  const pastBookings = useMemo(() => {
    const supabaseBookings = bookings.map(b => ({
      id: b.id,
      dateString: new Date(b.booking_date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      }),
      slots: b.time_slots.map((s: any) => s.timeLabel),
      total: b.total_amount,
      status: b.status as 'upcoming' | 'completed'
    }));

    // Only include historical demo data if not using Supabase auth
    const history = user ? [] : [
      {
        id: 'past-1',
        dateString: 'Wednesday, May 20, 2026',
        slots: ['6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'],
        total: 800,
        status: 'completed' as const
      },
      {
        id: 'past-2',
        dateString: 'Friday, May 15, 2026',
        slots: ['9:00 AM - 10:00 AM'],
        total: 300,
        status: 'completed' as const
      }
    ];

    return [...supabaseBookings, ...history];
  }, [bookings, user]);

  const createdDate = activeProfile.created_at
    ? new Date(activeProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'April 2023';

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-12 relative overflow-hidden">
      {/* Decorative Brand blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pastel-blue/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pastel-blue-dark/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Profile Card Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-pastel-blue/10 rounded-bl-full pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={isEditing ? selectedAvatar : activeProfile.avatar_url}
                alt="Profile Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-pastel-blue dark:border-pastel-blue-dark shadow-md"
              />
              <div className="absolute bottom-1 right-1 bg-pastel-gold text-slate-950 p-1.5 rounded-full shadow-md">
                <Award size={16} />
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left space-y-2">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2.5">
                <h1 className="text-3xl font-display font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                  {isEditing ? editName || 'Your Name' : activeProfile.name}
                </h1>
                <span className="px-3 py-1 bg-pastel-blue/10 text-pastel-blue-dark dark:text-pastel-blue-light text-[10px] font-bold uppercase tracking-widest rounded-full border border-pastel-blue/20">
                  {activeProfile.tier ?? 'Ka-Margal Elite'}
                </span>
                {user && (
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-widest rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span> Live
                  </span>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <Calendar size={15} className="text-pastel-coral" />
                <span>Member since {createdDate}</span>
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin size={13} />
                <span>Bustos, Bulacan, Philippines</span>
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Account Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800">

              <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-display font-semibold uppercase tracking-wide flex items-center gap-2">
                  <User size={18} className="text-pastel-blue shrink-0" />
                  <span>Profile Details</span>
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700"
                  >
                    <Edit size={12} /> Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSave} className="space-y-4">

                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Choose Sports Character
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {sportsAvatars.map((av, index) => {
                        const isSelected = selectedAvatar === av.url;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedAvatar(av.url)}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer hover:scale-105 ${isSelected ? 'border-[#C69214] scale-105 shadow-md' : 'border-transparent opacity-70'}`}
                          >
                            <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#C69214]/10 flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-[#C69214] drop-shadow-sm" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} placeholder="Juan Dela Cruz"
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent text-sm font-semibold" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input type="email" required value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="juan@example.com"
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent text-sm font-semibold" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input type="tel" required value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="0917-555-0123"
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent text-sm font-semibold" />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Facebook Link</label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input type="text" value={editFB} onChange={e => setEditFB(e.target.value)} placeholder="facebook.com/ka.margal.player"
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent text-sm font-semibold" />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Account Role</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <select value={editRole} onChange={e => setEditRole(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent text-sm font-semibold cursor-pointer">
                        <option value="user">User (Standard Account)</option>
                        <option value="admin">Admin (Override Account)</option>
                      </select>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={handleCancel}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs">
                      <X size={14} /> Cancel
                    </button>
                    <button type="submit" disabled={isSaving}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow-sm disabled:opacity-70">
                      {isSaving ? (
                        <><svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Saving...</>
                      ) : (
                        <><Save size={14} /> Save</>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Static View */
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                    <Mail className="text-slate-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Email Address</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{activeProfile.email ?? '—'}</div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                    <Phone className="text-slate-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mobile Number</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{activeProfile.phone ?? '—'}</div>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                    <Facebook className="text-slate-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Facebook Link</div>
                      {activeProfile.fb_link ? (
                        <a href={activeProfile.fb_link.startsWith('http') ? activeProfile.fb_link : `https://${activeProfile.fb_link}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold text-pastel-blue hover:text-pastel-blue-dark dark:hover:text-pastel-blue-light transition-colors mt-0.5 inline-block break-all">
                          {activeProfile.fb_link}
                        </a>
                      ) : <div className="text-sm font-semibold text-slate-400 mt-0.5">—</div>}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                    <Shield className="text-slate-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Account Role</div>
                      <div className={`text-sm font-bold mt-0.5 ${isAdmin ? 'text-pastel-blue' : 'text-slate-700 dark:text-slate-300'}`}>
                        {isAdmin ? '🔑 Admin Override Mode' : '👤 Standard Customer'}
                      </div>
                    </div>
                  </div>

                  {/* Verified */}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                    <Shield className="text-slate-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Account Status</div>
                      <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                        <CheckCircle2 size={14} /> {user ? 'Live Supabase Account' : 'Demo Mode'}
                      </div>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="w-full mt-6 py-3 px-4 rounded-xl border border-pastel-coral/60 hover:border-pastel-coral text-pastel-coral hover:bg-pastel-coral/5 dark:hover:bg-pastel-coral/10 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-sm"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking History */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-display font-semibold mb-6 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Clock3 size={18} className="text-pastel-coral" />
                <span>My Booking History</span>
              </h2>

              {bookingsLoading ? (
                <div className="flex justify-center py-10">
                  <svg className="animate-spin h-8 w-8 text-pastel-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm font-semibold">
                      No bookings yet. <Link to="/book" className="text-pastel-blue hover:underline">Book a Court</Link> to reserve your slot!
                    </div>
                  ) : (
                    pastBookings.map(b => (
                      <div key={b.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 relative overflow-hidden group hover:border-pastel-blue/40 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{b.dateString}</span>
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${b.status === 'completed' ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-pastel-coral/10 text-pastel-coral dark:text-pastel-coral-light'}`}>
                            {b.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-semibold">
                          {b.slots.map((label: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-400 shrink-0" />
                              <span>{label}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-400 uppercase tracking-wider text-[10px]">Amount</span>
                          <span className="text-slate-900 dark:text-white text-sm font-bold">₱{b.total}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
