import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { supabaseConfigured } from '../lib/supabase';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {!supabaseConfigured && <p className="club-demo-notice" role="status">Online reservations are currently unavailable. Please contact the venue to book.</p>}
      <main id="main-content" tabIndex={-1} className="flex-grow flex flex-col relative min-w-0"><Outlet /></main>
      <Footer />
    </div>
  );
}
