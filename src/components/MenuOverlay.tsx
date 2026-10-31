import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';

interface MenuOverlayProps { isOpen: boolean; onClose: () => void; returnFocusRef: RefObject<HTMLButtonElement>; }
const links = [['Home', '/'], ['Book a court', '/book'], ['Event rentals', '/events'], ['My profile', '/profile'], ['Log in', '/login'], ['Create an account', '/signup']];

export function MenuOverlay({ isOpen, onClose, returnFocusRef }: MenuOverlayProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!isOpen) { if (element.open) element.close(); return; }
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, [isOpen]);
  return (
    <dialog ref={dialog} id="site-menu" className="club-menu" aria-labelledby="menu-title" onClose={() => returnFocusRef.current?.focus()} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="club-menu-content">
        <div className="club-menu-top"><h2 id="menu-title">Around the court</h2><button className="club-icon-button" onClick={onClose} aria-label="Close menu"><X size={22} /></button></div>
        <nav aria-label="All pages">{links.map(([name, path], index) => <NavLink key={path} to={path} end={path === '/'} onClick={onClose}><span className="club-menu-index">0{index + 1}</span><span>{name}</span><ArrowUpRight size={20} /></NavLink>)}</nav>
        <div className="club-menu-info"><p>Brgy. Cambaog, Bustos, Bulacan</p><a href="tel:+639216638243">0921 663 8243</a><p>Daily · 8 AM–midnight</p></div>
      </div>
    </dialog>
  );
}
