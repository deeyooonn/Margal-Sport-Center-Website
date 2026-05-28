import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  Dribbble,
  Facebook,
  Instagram } from
'lucide-react';
export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-br from-pastel-blue to-pastel-blue-dark rounded-md text-white">
                <Dribbble size={20} />
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-white uppercase">
                Margal
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Your Game, Your Rules! No waiting. No strangers. Just pure game
              time.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-pastel-blue transition-colors">
                
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-pastel-coral transition-colors">
                
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white tracking-wide mb-4 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/book" className="hover:text-white transition-colors">
                  Book a Court
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-white transition-colors">
                  
                  Event Rentals
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors">
                  
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="hover:text-white transition-colors">
                  
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display font-semibold text-white tracking-wide mb-4 uppercase">
              Visit Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-pastel-coral shrink-0 mt-0.5" />
                
                <span>Brgy. Cambaog, Bustos, Bulacan, Philippines</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-pastel-blue shrink-0" />
                <span>0921 663 8243</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-pastel-gold shrink-0" />
                <span>Open Daily: 8:00 AM - 12:00 MN</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} Margal Sports Center. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>);

}