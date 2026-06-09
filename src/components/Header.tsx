import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MenuOverlay } from './MenuOverlay';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isOnProfile = location.pathname === '/profile';
  const { profile: supabaseProfile } = useAuth();

  const [localProfile, setLocalProfile] = useState<{ name: string; avatar: string }>(() => {
    try {
      const stored = localStorage.getItem('margal_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          name: parsed.name || 'Ka-Margal',
          avatar: parsed.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      name: 'Ka-Margal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
    };
  });

  // Effective profile: prefer Supabase, fall back to localStorage
  const profile = supabaseProfile
    ? { name: supabaseProfile.name, avatar: supabaseProfile.avatar_url }
    : localProfile;

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('margal_user_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          setLocalProfile({
            name: parsed.name || 'Ka-Margal',
            avatar: parsed.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('margal_profile_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('margal_profile_updated', handleStorageChange);
    };
  }, []);

  return (
    <>
      <header className="relative w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16 sm:h-20">
            {/* Hamburger trigger — left */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="p-2.5 -ml-2.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 hover:border-pastel-coral dark:hover:border-pastel-coral text-slate-700 dark:text-slate-200 transition-colors group">
                <Menu
                  size={20}
                  className="group-hover:text-pastel-coral transition-colors" />
              </button>
            </div>

            {/* Centered logo — middle */}
            <Link
              to="/"
              className="flex items-center gap-2 group justify-self-center">
              <img 
                src="/margal-logo.jpg" 
                alt="Margal Sports Center Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full border border-slate-200 dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-base leading-none tracking-wider text-slate-900 dark:text-white uppercase">
                  Margal
                </span>
                <span className="text-[9px] font-bold text-pastel-coral dark:text-pastel-coral-light tracking-widest uppercase">
                  Sports Center
                </span>
              </div>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-3 justify-self-end">
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/profile" className={`flex items-center gap-2 border bg-slate-50 dark:bg-slate-900/50 p-1 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer select-none ${isOnProfile ? 'border-pastel-blue dark:border-pastel-blue shadow-sm ring-2 ring-pastel-blue/20' : 'border-slate-200 dark:border-slate-800'}`}>
                <img
                  src={profile.avatar}
                  alt="User Profile"
                  className="w-7 h-7 rounded-full object-cover border border-[#C69214] shadow-sm shrink-0"
                />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 hidden sm:inline uppercase tracking-wider max-w-[80px] truncate">
                  {profile.name}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}