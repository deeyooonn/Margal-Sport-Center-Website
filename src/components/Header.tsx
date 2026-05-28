import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, Dribbble } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MenuOverlay } from './MenuOverlay';
export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors ${isLanding ? 'border-transparent bg-transparent' : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md'}`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Hamburger trigger */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="p-2.5 -ml-2.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 hover:border-pastel-coral dark:hover:border-pastel-coral text-slate-700 dark:text-slate-200 transition-colors group">
              
              <Menu
                size={20}
                className="group-hover:text-pastel-coral transition-colors" />
              
            </button>

            {/* Centered logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2">
              
              <div className="p-1.5 bg-gradient-to-br from-pastel-blue to-pastel-blue-dark rounded-lg text-white shadow-sm group-hover:shadow-md transition-all">
                <Dribbble size={20} />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-display font-bold text-base leading-none tracking-wider text-slate-900 dark:text-white uppercase">
                  Margal
                </span>
                <span className="text-[9px] font-bold text-pastel-coral dark:text-pastel-coral-light tracking-widest uppercase">
                  Sports Center
                </span>
              </div>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                aria-label="Toggle theme">
                
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link
                to="/book"
                className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-white border border-slate-900 dark:border-white rounded-full hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors">
                
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>);

}