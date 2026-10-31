import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Clock, MapPin } from 'lucide-react';

export function Landing() {
  return (
    <div className="club-home">
      <section className="club-container club-hero" aria-labelledby="home-title">
        <div className="club-hero-copy">
          <p className="club-eyebrow"><span /> Your neighborhood court · Since 2022</p>
          <h1 id="home-title">Your game.<br /><span>Your rules.</span></h1>
          <p className="club-intro">Bring your people. Make time to play. Book a private court session at Margal Sports Center in Bustos, Bulacan.</p>
          <div className="club-hero-actions">
            <Link to="/book" className="club-button">Book a court <ArrowUpRight size={19} /></Link>
            <a href="#court-rates" className="club-text-link">View court rates <ArrowRight size={17} /></a>
          </div>
          <div className="club-hero-location"><MapPin size={16} /><span>Brgy. Cambaog, Bustos, Bulacan</span></div>
        </div>
        <div className="club-court-panel">
          <div className="club-court-caption"><span>Margal Sports Center</span><span>Bustos, Bulacan</span></div>
          <svg className="club-court" viewBox="0 0 460 330" fill="none" aria-hidden="true">
            <rect x="26" y="24" width="408" height="282" rx="2" />
            <path d="M230 24v282" /><circle cx="230" cy="165" r="44" /><circle cx="230" cy="165" r="5" />
            <path d="M26 103h77v124H26M434 103h-77v124h77" />
            <path d="M103 121a44 44 0 0 1 0 88M357 121a44 44 0 0 0 0 88" />
            <path d="M26 54h30a111 111 0 0 1 0 222H26M434 54h-30a111 111 0 0 0 0 222h30" />
            <path d="M44 146v38m372-38v38" /><circle cx="52" cy="165" r="8" /><circle cx="408" cy="165" r="8" />
          </svg>
          <div className="club-court-bottom"><span>A little less scrolling.<br /><strong>A little more game time.</strong></span><span className="club-court-number" aria-hidden="true">01</span></div>
        </div>
      </section>
      <section id="court-rates" className="club-rates" aria-labelledby="rates-title">
        <div className="club-container club-rate-grid">
          <div className="club-rate-heading"><p className="club-eyebrow">Plan your session</p><h2 id="rates-title">One court. Your time.</h2><p><Clock size={16} /> Open daily, 8 AM–midnight</p></div>
          <Link to="/book" className="club-rate-option"><div><span className="club-rate-name">Day session</span><ArrowUpRight size={20} /></div><p className="club-rate-price">₱300 <span>/ hour</span></p><p className="club-rate-hours">8 AM – 6 PM</p><span className="club-rate-action">Find a daytime slot <ArrowRight size={16} /></span></Link>
          <Link to="/book" className="club-rate-option"><div><span className="club-rate-name">Evening session</span><ArrowUpRight size={20} /></div><p className="club-rate-price">₱400 <span>/ hour</span></p><p className="club-rate-hours">6 PM – midnight</p><span className="club-rate-action">Find an evening slot <ArrowRight size={16} /></span></Link>
        </div>
      </section>
      <section className="club-container club-events" aria-labelledby="events-title">
        <div><p className="club-eyebrow">More room to get together</p><h2 id="events-title">Planning something bigger?</h2><p>Explore venue rentals for your next gathering or sports event.</p></div>
        <Link to="/events" className="club-button club-button-outline">Explore event rentals <ArrowUpRight size={19} /></Link>
      </section>
    </div>
  );
}
