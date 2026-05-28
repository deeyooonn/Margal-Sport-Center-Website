import React, { Children } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowDown,
  Facebook,
  Instagram,
  MapPin,
  Dribbble } from
'lucide-react';
const fadeIn = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  transition: {
    duration: 0.5
  }
};
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};
export function Landing() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section — Sleepless Grounds inspired */}
      <section className="relative overflow-hidden min-h-[calc(100vh-5rem)] flex items-center bg-gradient-to-br from-pastel-blue-light/50 via-white to-pastel-blue/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 -mt-16 sm:-mt-20 pt-16 sm:pt-20">
        {/* Radial gradient glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pastel-blue/40 dark:bg-pastel-blue-dark/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pastel-blue-dark/25 dark:bg-pastel-blue/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop')] bg-cover bg-center opacity-[0.04] dark:opacity-[0.08] mix-blend-overlay pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}>
            
            {/* Logo mark */}
            <motion.div variants={fadeIn} className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-pastel-blue to-pastel-blue-dark rounded-2xl text-white shadow-lg">
                <Dribbble size={36} strokeWidth={2.5} />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeIn}
              className="font-display font-bold uppercase tracking-tighter leading-[0.85] text-slate-900 dark:text-white mb-6">
              
              <span className="block text-[clamp(3rem,11vw,9rem)]">
                Your Game
              </span>
              <span className="block text-[clamp(3rem,11vw,9rem)] text-gradient">
                Your Rules!
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={fadeIn}
              className="text-pastel-gold-dark dark:text-pastel-gold-light text-sm sm:text-base font-display font-semibold uppercase tracking-[0.25em] mb-4">
              
              Est. 2022 &nbsp;//&nbsp; Bustos, Bulacan
            </motion.p>

            <motion.p
              variants={fadeIn}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-10">
              
              No waiting. No strangers. Just pure game time.
            </motion.p>

            {/* Quick links */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-12 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              
              <a
                href="#"
                className="inline-flex items-center gap-1.5 hover:text-pastel-coral dark:hover:text-pastel-coral-light transition-colors">
                
                <Facebook size={14} /> Facebook
              </a>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 hover:text-pastel-coral dark:hover:text-pastel-coral-light transition-colors">
                
                <Instagram size={14} /> Instagram
              </a>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 hover:text-pastel-coral dark:hover:text-pastel-coral-light transition-colors">
                
                <MapPin size={14} /> Directions
              </a>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-center gap-4">
              
              <Link
                to="/book"
                className="group inline-flex justify-center items-center gap-3 px-8 py-4 border-2 border-pastel-gold-dark dark:border-pastel-gold-light text-pastel-gold-dark dark:text-pastel-gold-light font-display font-bold uppercase tracking-[0.2em] text-sm hover:bg-pastel-gold-dark hover:text-white dark:hover:bg-pastel-gold-light dark:hover:text-slate-900 transition-all">
                
                Book Court
                <ArrowDown
                  size={16}
                  className="group-hover:translate-y-1 transition-transform" />
                
              </Link>
              <Link
                to="/events"
                className="group inline-flex justify-center items-center gap-3 px-8 py-4 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-display font-bold uppercase tracking-[0.2em] text-sm hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all">
                
                Events
                <ArrowDown
                  size={16}
                  className="group-hover:translate-y-1 transition-transform" />
                
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              icon: CalendarCheck,
              title: 'Instant Booking',
              desc: 'Reserve your slot online in seconds. No more walk-in disappointments.',
              color: 'text-pastel-blue'
            },
            {
              icon: ShieldCheck,
              title: 'Exclusive Access',
              desc: 'The whole court is yours. Private, safe, and uninterrupted gameplay.',
              color: 'text-pastel-coral'
            },
            {
              icon: Users,
              title: 'Community Ready',
              desc: 'Perfect for barkada games, leagues, and corporate sports fests.',
              color: 'text-pastel-gold'
            }].
            map((feature, idx) =>
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: idx * 0.1
              }}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              
                <div
                className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 ${feature.color}`}>
                
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.desc}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Rates Preview */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold uppercase tracking-wide mb-4">
              Court Rates
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Simple, transparent pricing for your next game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Day Rate */}
            <motion.div
              initial={{
                opacity: 0,
                x: -20
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              className="relative p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-blue/10 rounded-bl-full -mr-4 -mt-4"></div>
              <h3 className="text-2xl font-display font-semibold uppercase mb-2">
                Day Rate
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                <Clock size={16} /> 8:00 AM - 6:00 PM
              </p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-display font-bold text-slate-900 dark:text-white">
                  ₱300
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  / hour
                </span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Zap size={16} className="text-pastel-gold" /> Natural
                  lighting
                </li>
                <li className="flex items-center gap-2">
                  <Zap size={16} className="text-pastel-gold" /> Free scoreboard
                  use
                </li>
              </ul>
              <Link
                to="/book"
                className="block w-full py-3 px-4 bg-slate-100 dark:bg-slate-700 text-center rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                
                Book Day Slot
              </Link>
            </motion.div>

            {/* Night Rate */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              className="relative p-8 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white shadow-xl overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-coral/20 rounded-bl-full -mr-4 -mt-4"></div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-pastel-coral text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Prime Time
              </div>
              <h3 className="text-2xl font-display font-semibold uppercase mb-2">
                Night Rate
              </h3>
              <p className="text-slate-400 mb-6 flex items-center gap-2">
                <Clock size={16} /> 6:00 PM - 12:00 MN
              </p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-display font-bold">₱400</span>
                <span className="text-slate-400">/ hour</span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-center gap-2">
                  <Zap size={16} className="text-pastel-coral" /> Full court
                  lighting
                </li>
                <li className="flex items-center gap-2">
                  <Zap size={16} className="text-pastel-coral" /> Cooler evening
                  temp
                </li>
              </ul>
              <Link
                to="/book"
                className="block w-full py-3 px-4 bg-pastel-coral hover:bg-pastel-coral-dark text-white text-center rounded-xl font-semibold transition-colors">
                
                Book Night Slot
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pastel-blue to-pastel-blue-dark opacity-90 dark:opacity-80"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-wide mb-6">
            Ready to play, Ka-Margal?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/90">
            Secure your court time now and experience the best hardwood in
            Bustos.
          </p>
          <Link
            to="/book"
            className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:scale-105 transition-transform shadow-xl">
            
            See Available Slots
          </Link>
        </div>
      </section>
    </div>);

}
function Clock(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>);

}