"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

// ----------------------------------------------------------------------
// 1. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------
export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-slate-50 text-slate-600 ${outfit.className} selection:bg-indigo-500/20 overflow-x-hidden relative`}>
      <Navbar />
      <main className="pt-32 pb-20 relative z-10">
        <Hero />
        <Metrics />
        <FeatureRiskOracle />
        <FeatureSimulations />
        <Steps />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. REUSABLE ANIMATION VARIANT
// ----------------------------------------------------------------------
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// ----------------------------------------------------------------------
// 3. INDIVIDUAL SECTION COMPONENTS
// ----------------------------------------------------------------------

function Navbar() {
  const [hoveredNav, setHoveredNav] = useState("get-started");

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-slate-900 font-bold tracking-tight text-lg">Cohort Engine</span>
        </div>
        
        <div className="flex items-center gap-1" onMouseLeave={() => setHoveredNav("get-started")}>
          {[
            { id: "resources", label: "Resources", href: "/dashboard", hideMobile: true },
            { id: "sign-in", label: "Sign in", href: "/sign-in" },
            { id: "get-started", label: "Get started", href: "/sign-up" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onMouseEnter={() => setHoveredNav(item.id)}
              className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 z-10 ${
                item.hideMobile ? "hidden sm:block" : ""
              } ${hoveredNav === item.id ? "text-white" : "text-slate-600"}`}
            >
              {hoveredNav === item.id && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-slate-900 rounded-lg shadow-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <motion.section 
      initial="hidden" animate="visible" 
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
      className="max-w-7xl mx-auto px-6 pt-10 text-center"
    >
      <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide mb-8">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        A dedicated retention analyst for every user
      </motion.div>
      
      <motion.h1 variants={fadeUpVariant} className="text-6xl md:text-8xl font-semibold tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.05] mb-8">
        Turn attrition vectors into <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          proactive retention
        </span>
      </motion.h1>

      <motion.p variants={fadeUpVariant} className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
        Go beyond static dashboards. By combining advanced survival analysis with AI-generated mitigation plans, our platform seamlessly turns early warning signs into effective retention strategies.
      </motion.p>

      {/* Button Section Updated */}
      <motion.div variants={fadeUpVariant} className="flex items-center justify-center">
        <Link href="/sign-up" className="inline-flex px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all items-center gap-2 shadow-xl shadow-slate-900/10 hover:-translate-y-0.5">
          Launch Engine
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </motion.div>
    </motion.section>
  );
}

function Metrics() {
  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
      className="max-w-5xl mx-auto px-6 mt-24 mb-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-slate-200 bg-white/50 backdrop-blur-md rounded-3xl px-8 shadow-sm">
        <div className="text-center md:text-left">
          <p className="text-5xl font-semibold text-slate-900 mb-2">40<span className="text-indigo-600">%</span></p>
          <p className="text-sm font-medium text-slate-500">Reduction in unexpected churn</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-5xl font-semibold text-slate-900 mb-2">3.5<span className="text-indigo-600">x</span></p>
          <p className="text-sm font-medium text-slate-500">Increase in saved revenue</p>
        </div>
        <div className="text-center md:text-left border-t border-slate-200 md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Validated Predictive Modeling</h4>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            A complete machine learning pipeline engineered for SaaS revenue forecasting. Built with rigorous statistical validation across a 500-company dataset to ensure high-accuracy predictions and drive measurable business impact.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function FeatureRiskOracle() {
  return (
    <motion.section 
      id="demo" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
      className="max-w-7xl mx-auto px-6 mb-32 flex flex-col md:flex-row items-center gap-16"
    >
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight">
          Identify intent with the <span className="text-indigo-600">Risk Oracle</span>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed font-light">
          Filters high-risk users and nudges them towards retention. The Random Forest classifier scores every account dynamically, giving you the exact probability of flight risk.
        </p>
        <ul className="space-y-4 pt-4 font-light">
          {['Discovers negative signals in real-time', 'Analyzes contract and billing structures', 'Flags accounts requiring immediate attention'].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-700">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">✓</div>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full">
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-200 to-slate-100 p-[1px] shadow-2xl shadow-slate-200/50">
          <div className="absolute inset-0 bg-indigo-500/5 blur-xl"></div>
          <div className="relative bg-white rounded-2xl p-8 overflow-hidden h-[400px] flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-lg relative z-10 animate-pulse">
              <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
              <div className="text-4xl font-semibold text-slate-900 mb-1">87.4%</div>
              <div className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-6">High Flight Risk</div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-300 rounded"></div>
                <div className="h-2 w-4/5 bg-slate-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function FeatureSimulations() {
  const [hoveredBar, setHoveredBar] = useState(2); 
  const bars = [40, 60, 90, 30];

  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
      className="max-w-7xl mx-auto px-6 mb-32 flex flex-col md:flex-row-reverse items-center gap-16"
    >
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight">
          Test strategies with <span className="text-sky-500">Simulations</span>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed font-light">
          Run deep-dive scenarios without touching live data. Modify pricing, adjust contract lengths, and immediately see how interventions alter the survival probability curve.
        </p>
      </div>
      <div className="flex-1 w-full">
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-200 to-slate-100 p-[1px] shadow-2xl shadow-slate-200/50">
           <div className="absolute inset-0 bg-sky-500/5 blur-xl"></div>
          <div className="relative bg-white rounded-2xl p-8 overflow-hidden h-[400px] flex items-end">
             <div 
               className="w-full flex items-end justify-between gap-4 h-48 opacity-90" 
               onMouseLeave={() => setHoveredBar(2)}
             >
                {bars.map((height, index) => {
                  const isActive = hoveredBar === index;
                  
                  return (
                    <div 
                      key={index}
                      onMouseEnter={() => setHoveredBar(index)}
                      className={`w-1/5 rounded-t-lg transition-all duration-300 ease-out cursor-pointer relative ${
                        isActive 
                          ? "bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.4)] border-transparent scale-y-[1.03] origin-bottom" 
                          : "bg-slate-200 border border-b-0 border-slate-300 hover:bg-slate-300"
                      }`}
                      style={{ height: `${height}%` }}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="simulated-badge"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap z-10"
                        >
                          Simulated
                        </motion.div>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Steps() {
  const [hoveredStep, setHoveredStep] = useState(2);

  const stepsData = [
    { title: "Connect Database", desc: "Link your CRM or raw CSV data securely." },
    { title: "Train the Agent", desc: "Engine compiles PCA clusters and survival curves." },
    { title: "Deploy Interventions", desc: "Llama 3 generates dynamic mitigation emails." }
  ];

  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
      className="max-w-4xl mx-auto px-6 mb-32 text-center"
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-16">Get started in minutes</h2>
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        onMouseLeave={() => setHoveredStep(2)}
      >
        <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        
        {stepsData.map((step, index) => {
          const isActive = hoveredStep === index;
          return (
            <div 
              key={index} 
              onMouseEnter={() => setHoveredStep(index)}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold mb-6 transition-all duration-300 ${
                isActive 
                  ? "bg-indigo-600 border border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-110" 
                  : "bg-white border border-slate-200 text-slate-900 shadow-md group-hover:scale-105"
              }`}>
                {index + 1}
              </div>
              <h3 className={`font-medium mb-2 transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-slate-900"}`}>
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 font-light px-4">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

function CTA() {
  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
      className="max-w-5xl mx-auto px-6 relative mb-10"
    >
      <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-6 relative z-10">
          Give a white glove experience to every prospect.
        </h2>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto relative z-10 font-light">
          First version ready in minutes. Scale personalized retention without growing your support team.
        </p>
        <div className="relative z-10">
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5">
            Create free account
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">C</span>
           </div>
           <span className="text-slate-900 font-medium text-sm">Cohort Engine</span>
        </div>
        <div className="flex gap-8 text-sm text-slate-500 font-light">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">System Status</span>
        </div>
      </div>
    </footer>
  );
}