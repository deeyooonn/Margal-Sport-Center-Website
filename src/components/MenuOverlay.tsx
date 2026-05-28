import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  ArrowUpRight } from
'lucide-react';
interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}
const navLinks = [
{
  name: 'Home',
  path: '/'
},
{
  name: 'Book Court',
  path: '/book'
},
{
  name: 'Events',
  path: '/events'
},
{
  name: 'Log In',
  path: '/login'
},
{
  name: 'Sign Up',
  path: '/signup'
}];

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const location = useLocation();
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        transition={{
          duration: 0.3
        }}
        className="fixed inset-0 z-[100] overflow-y-auto">
        
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
          onClick={onClose} />
        

          {/* Pastel gradient glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pastel-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pastel-blue-dark/25 rounded-full blur-3xl pointer-events-none" />

          {/* Content */}
          <motion.div
          initial={{
            y: -20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          exit={{
            y: -20,
            opacity: 0
          }}
          transition={{
            delay: 0.1,
            duration: 0.4
          }}
          className="relative min-h-screen flex flex-col text-white">
          
            {/* Top bar with close */}
            <div className="flex justify-between items-center p-6 sm:p-8">
              <span className="font-display text-sm uppercase tracking-[0.3em] text-pastel-gold-light">
                Menu
              </span>
              <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded-full border border-white/20 hover:border-pastel-gold hover:text-pastel-gold-light transition-colors">
              
                <X size={20} />
              </button>
            </div>

            {/* Center nav */}
            <nav className="flex-grow flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto w-full">
              <ul className="space-y-2 sm:space-y-3">
                {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.li
                    key={link.path}
                    initial={{
                      opacity: 0,
                      x: -20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: 0.15 + idx * 0.06
                    }}>
                    
                      <Link
                      to={link.path}
                      onClick={onClose}
                      className={`group flex items-baseline gap-4 sm:gap-6 font-display font-bold uppercase tracking-tight transition-colors ${isActive ? 'text-pastel-gold-light' : 'text-white hover:text-pastel-coral-light'}`}>
                      
                        <span className="text-xs sm:text-sm font-body font-normal text-white/40 tabular-nums">
                          0{idx + 1}
                        </span>
                        <span className="text-5xl sm:text-7xl lg:text-8xl leading-none">
                          {link.name}
                        </span>
                        <ArrowUpRight
                        size={28}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      
                      </Link>
                    </motion.li>);

              })}
              </ul>
            </nav>

            {/* Footer info */}
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.5
            }}
            className="border-t border-white/10 px-6 sm:px-12 lg:px-20 py-8 max-w-6xl mx-auto w-full">
            
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3 text-white/70">
                  <MapPin
                  size={18}
                  className="text-pastel-coral-light shrink-0 mt-0.5" />
                
                  <span>Brgy. Cambaog, Bustos, Bulacan</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Phone
                  size={18}
                  className="text-pastel-blue-light shrink-0" />
                
                  <span>0921 663 8243</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Clock
                  size={18}
                  className="text-pastel-gold-light shrink-0" />
                
                  <span>Daily 8:00 AM – 12:00 MN</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-6 text-xs uppercase tracking-widest font-semibold text-white/50">
                  <a
                  href="#"
                  className="hover:text-pastel-coral-light transition-colors flex items-center gap-2">
                  
                    <Facebook size={14} /> Facebook
                  </a>
                  <a
                  href="#"
                  className="hover:text-pastel-coral-light transition-colors flex items-center gap-2">
                  
                    <Instagram size={14} /> Instagram
                  </a>
                </div>
                <span className="text-xs uppercase tracking-widest text-pastel-gold-light/80 font-display">
                  Est. 2022 // Bustos, Bulacan
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}