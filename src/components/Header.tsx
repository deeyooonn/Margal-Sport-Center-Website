import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MenuOverlay } from './MenuOverlay';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setIsMenuOpen(false);
  return (
    <>
      <a className="club-skip-link" href="#main-content">Skip to content</a>
      <header className="club-header">
        <div className="club-container club-header-inner">
          <Link to="/" className="club-brand" aria-label="Margal Sports Center home"><img src="/margal-logo.jpg" alt="" width="44" height="44" /><span>Margal<small>Sports Center</small></span></Link>
          <nav className="club-desktop-nav" aria-label="Main navigation">
            <NavLink to="/" end>Home</NavLink><NavLink to="/book">Book a court</NavLink><NavLink to="/events">Events</NavLink><NavLink to="/profile">My profile</NavLink>
          </nav>
          <div className="club-header-actions">
            <button onClick={toggleTheme} className="club-icon-button" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button ref={menuTrigger} onClick={() => setIsMenuOpen(true)} className="club-icon-button" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={isMenuOpen} aria-controls="site-menu"><Menu size={22} /></button>
          </div>
        </div>
      </header>
      <MenuOverlay isOpen={isMenuOpen} onClose={closeMenu} returnFocusRef={menuTrigger} />
    </>
  );
}
