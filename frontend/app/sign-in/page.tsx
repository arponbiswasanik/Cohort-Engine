"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Outfit } from "next/font/google";
import { createClient } from "@/utils/supabase/client";

const outfit = Outfit({ subsets: ["latin"] });

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: 'Signed in successfully!' });
      
      // log in successful, redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard"); 
      }, 1000);
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 text-slate-600 ${outfit.className} selection:bg-indigo-500/20`}>
      
      {/* Left Side: Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 sm:px-16 md:px-24 relative z-10">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">C</span>
           </div>
           <span className="text-slate-900 font-bold tracking-tight text-lg">Cohort Engine</span>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="w-full max-w-sm"
        >
          <motion.div variants={fadeUpVariant} className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm text-slate-500 font-light">Sign in to your account to continue.</p>
          </motion.div>

          {/* Alert Message */}
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                message.type === 'error' 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSignIn}>
            <motion.div variants={fadeUpVariant}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
                Work Email
              </label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                required
              />
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                required
              />
            </motion.div>

            <motion.button 
              variants={fadeUpVariant}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:-translate-y-0.5 mt-2 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <motion.p variants={fadeUpVariant} className="mt-10 text-center text-sm text-slate-500 font-light">
            Don't have an account?{" "}
            <Link href="/sign-up" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side: Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        
        {/* Dark Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 max-w-lg px-12">
          <div className="inline-flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white font-bold tracking-tight text-2xl">Cohort Engine</span>
          </div>

          <h2 className="text-4xl font-semibold text-white tracking-tight mb-6">
            Resume your forecasts.
          </h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed mb-10">
            Log back in to monitor your retention pipelines, view the latest predictions, and tweak your ML models directly from your dashboard.
          </p>
        </div>
        
      </div>
    </div>
  );
}