import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { supabaseConfigured } from '../lib/supabase';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {!supabaseConfigured && <p className="club-demo-notice">Portfolio demo · Reservations stay in this browser. No real court booking or payment is made.</p>}
      <main id="main-content" tabIndex={-1} className="flex-grow flex flex-col relative min-w-0"><Outlet /></main>
      <Footer />
    </div>
  );
}
