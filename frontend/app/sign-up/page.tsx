"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export default function SignUpPage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 text-slate-600 ${outfit.className} selection:bg-indigo-500/20`}>
      
      {/* Left Side: Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 sm:px-16 md:px-24 relative z-10 py-12">
        
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
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Launch your engine</h1>
            <p className="text-sm text-slate-500 font-light">Create an account to start analyzing churn.</p>
          </motion.div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            <motion.div variants={fadeUpVariant} className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="firstName">
                  First Name
                </label>
                <input 
                  type="text" 
                  id="firstName"
                  placeholder="Jane"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="lastName">
                  Last Name
                </label>
                <input 
                  type="text" 
                  id="lastName"
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
                Work Email
              </label>
              <input 
                type="email" 
                id="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                required
              />
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input 
                type="password" 
                id="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                required
              />
            </motion.div>

            <motion.button 
              variants={fadeUpVariant}
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:-translate-y-0.5 mt-2"
            >
              Create free account
            </motion.button>
          </form>

          <motion.div variants={fadeUpVariant} className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-slate-200"></div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </motion.div>

          <motion.button 
            variants={fadeUpVariant}
            className="w-full mt-8 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </motion.button>

          <motion.p variants={fadeUpVariant} className="mt-8 text-center text-sm text-slate-500 font-light">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side: Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        
        {/* Dark Background Gradients for Contrast */}
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
            Stop guessing why users leave.
          </h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed mb-10">
            Deploy a complete machine learning pipeline engineered for SaaS revenue forecasting. Connect your data and generate highly accurate retention predictions in minutes.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-600"></div>
            </div>
            <div className="text-sm font-medium text-slate-300">
              Join 500+ data-driven companies.
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}