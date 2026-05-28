import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Clock,
  MessageSquare,
  Send,
  Trophy,
  PartyPopper,
  Briefcase } from
'lucide-react';
import { toast } from 'sonner';
export function Events() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        'Inquiry sent! Our team will contact you shortly to finalize details.'
      );
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };
  const eventTypes = [
  {
    id: 'tournament',
    name: 'Tournament',
    icon: Trophy,
    color: 'text-pastel-gold'
  },
  {
    id: 'birthday',
    name: 'Birthday/Party',
    icon: PartyPopper,
    color: 'text-pastel-coral'
  },
  {
    id: 'corporate',
    name: 'Corporate Event',
    icon: Briefcase,
    color: 'text-pastel-blue'
  }];

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-4xl md:text-5xl font-display font-bold uppercase tracking-wide text-slate-900 dark:text-white mb-4">
            
            Rent for <span className="text-gradient">Events</span>
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="text-lg text-slate-600 dark:text-slate-400">
            
            Need the whole court for a tournament, sports fest, or private
            party? We offer flexible packages for exclusive full-facility use.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Packages Info */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-display font-semibold uppercase tracking-wide mb-6">
              Event Packages
            </h2>

            <motion.div
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Half-Day Package
                  </h3>
                  <p className="text-sm text-slate-500">
                    Perfect for quick leagues
                  </p>
                </div>
                <span className="px-3 py-1 bg-pastel-blue/10 text-pastel-blue text-sm font-semibold rounded-full">
                  6 Hours
                </span>
              </div>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <li>• Exclusive court access</li>
                <li>• Scoreboard & PA system included</li>
                <li>• Dedicated staff assistance</li>
              </ul>
              <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                ₱2,000{' '}
                <span className="text-sm font-normal text-slate-500">
                  starting
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.1
              }}
              className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-lg relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-pastel-coral/20 rounded-bl-full -mr-4 -mt-4"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="text-xl font-bold">Full-Day Package</h3>
                  <p className="text-sm text-slate-400">
                    For major tournaments
                  </p>
                </div>
                <span className="px-3 py-1 bg-pastel-coral text-white text-sm font-semibold rounded-full">
                  12 Hours
                </span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300 mb-4 relative z-10">
                <li>• All Half-Day inclusions</li>
                <li>• Free use of holding area</li>
                <li>• Flexible setup time</li>
              </ul>
              <div className="text-2xl font-display font-bold relative z-10">
                ₱3,800{' '}
                <span className="text-sm font-normal text-slate-400">
                  starting
                </span>
              </div>
            </motion.div>

            <div className="p-6 rounded-2xl bg-pastel-gold/10 border border-pastel-gold/20">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Custom Requirements?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Need specific arrangements, catering space, or multi-day
                booking? Fill out the form and we'll tailor a package for you.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-display font-semibold uppercase tracking-wide mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                Event Inquiry Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Event Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {eventTypes.map((type) =>
                    <label key={type.id} className="cursor-pointer">
                        <input
                        type="radio"
                        name="eventType"
                        value={type.id}
                        className="peer sr-only"
                        required />
                      
                        <div className="flex flex-col items-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 peer-checked:border-pastel-blue peer-checked:bg-pastel-blue/5 peer-checked:ring-1 peer-checked:ring-pastel-blue transition-all">
                          <type.icon
                          size={24}
                          className={`mb-2 ${type.color}`} />
                        
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {type.name}
                          </span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Target Date
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18} />
                      
                      <input
                        type="date"
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pastel-blue focus:border-transparent" />
                      
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Estimated Guests/Players
                    </label>
                    <div className="relative">
                      <Users
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18} />
                      
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 50"
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pastel-blue focus:border-transparent" />
                      
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Juan Dela Cruz"
                      className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pastel-blue focus:border-transparent" />
                    
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 6789"
                      className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pastel-blue focus:border-transparent" />
                    
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Additional Details
                  </label>
                  <div className="relative">
                    <MessageSquare
                      className="absolute left-3 top-3 text-slate-400"
                      size={18} />
                    
                    <textarea
                      rows={4}
                      placeholder="Tell us more about your event (e.g., need catering space, specific hours...)"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pastel-blue focus:border-transparent resize-none">
                    </textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2">
                  
                  {isSubmitting ?
                  <>
                      <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      
                        <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4">
                      </circle>
                        <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                      </svg>
                      Sending Inquiry...
                    </> :

                  <>
                      Send Inquiry <Send size={18} />
                    </>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>);

}