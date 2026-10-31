import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="club-footer">
      <div className="club-container">
        <div className="club-footer-main">
          <div><Link to="/" className="club-brand"><img src="/margal-logo.jpg" alt="" width="44" height="44" /><span>Margal<small>Sports Center</small></span></Link><p>See you on the court, Ka-Margal.</p></div>
          <div><h2>Come by</h2><p>Brgy. Cambaog, Bustos,<br />Bulacan, Philippines</p><a href="https://www.google.com/maps/search/?api=1&query=Margal+Sports+Center+Cambaog+Bustos+Bulacan" target="_blank" rel="noopener noreferrer">Find us on Maps <ArrowUpRight size={15} /></a></div>
          <div><h2>Get in touch</h2><a href="tel:+639216638243">0921 663 8243</a><p>Open daily<br />8 AM–midnight</p></div>
        </div>
        <div className="club-footer-bottom"><span>© {new Date().getFullYear()} Margal Sports Center</span><nav aria-label="Footer navigation"><Link to="/book">Book a court</Link><Link to="/events">Event rentals</Link><Link to="/profile">My profile</Link></nav></div>
      </div>
    </footer>
  );
}
