import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, supabaseConfigured } from '../lib/supabase';

export function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!supabaseConfigured) {
      toast.error('Supabase not connected yet. Add your .env.local credentials to enable real sign-up.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = (formData.get('name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const phone = (formData.get('phone') as string).trim();
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone }, // stored in raw_user_meta_data → triggers handle_new_user()
      },
    });

    if (error) {
      toast.error(error.message || 'Signup failed. Please try again.');
      setIsLoading(false);
      return;
    }

    // If email confirmation is disabled in Supabase, session is available immediately
    if (data.session) {
      toast.success('Account created! Welcome to Margal Sports Center.');
      navigate('/book');
    } else {
      // Email confirmation required
      setEmailSent(true);
      toast.success('Check your email to confirm your account!');
    }

    setIsLoading(false);
  };

  // ─── Email Sent Confirmation Screen ───────────────────────────────────────
  if (emailSent) {
    return (
      <div className="flex-grow flex items-center justify-center py-12 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pastel-blue-dark/20 rounded-full blur-3xl pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative z-10"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-pastel-blue/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-pastel-blue" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">
            Check Your Email
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            We sent a confirmation link to your email address. Click it to activate your account and start booking!
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
          >
            Go to Login <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pastel-blue-dark/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-pastel-blue/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative z-10"
      >
        <div className="text-center">
          <img
            src="/margal-logo.jpg"
            alt="Margal Logo"
            className="mx-auto w-16 h-16 object-contain rounded-full border-2 border-[#1A3673] shadow-md mb-4"
          />
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            Join the Club
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Create an account to book courts faster
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-coral focus:border-transparent transition-shadow"
                  placeholder="Juan Dela Cruz"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-coral focus:border-transparent transition-shadow"
                  placeholder="player@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-coral focus:border-transparent transition-shadow"
                  placeholder="0912 345 6789"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pastel-coral focus:border-transparent transition-shadow"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-pastel-coral hover:bg-pastel-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-coral transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-pastel-coral hover:text-pastel-coral-dark dark:hover:text-pastel-coral-light transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}