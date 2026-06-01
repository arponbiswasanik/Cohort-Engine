"use client";

import { useState } from "react";

// Updated dummy customer data with Probability Scores and Details
const initialCustomers = [
  { 
    id: 1, name: "Acme Corp", cohort: "Jan 2026", 
    monthlyLTV: 12000, yearlyLTV: 9500, 
    monthlyRisk: "High Risk", yearlyRisk: "Safe", 
    monthlyProb: 85, yearlyProb: 15,
    factors: ["Logins dropped by 45%", "2 recent payment failures"],
    emailGenerated: false 
  },
  { 
    id: 2, name: "NovaTech Solutions", cohort: "Feb 2026", 
    monthlyLTV: 8500, yearlyLTV: 7800, 
    monthlyRisk: "Safe", yearlyRisk: "Safe", 
    monthlyProb: 12, yearlyProb: 8,
    factors: ["Consistent daily usage", "Upgraded plan recently"],
    emailGenerated: false 
  },
  { 
    id: 3, name: "SaaSify Ltd", cohort: "Jan 2026", 
    monthlyLTV: 15000, yearlyLTV: 11000, 
    monthlyRisk: "High Risk", yearlyRisk: "Medium Risk", 
    monthlyProb: 78, yearlyProb: 45,
    factors: ["Support ticket volume increased 3x", "Key features unused"],
    emailGenerated: false 
  },
  { 
    id: 4, name: "Quantum Labs", cohort: "March 2026", 
    monthlyLTV: 5400, yearlyLTV: 5200, 
    monthlyRisk: "Safe", yearlyRisk: "Safe", 
    monthlyProb: 5, yearlyProb: 5,
    factors: ["High team collaboration", "Zero support tickets"],
    emailGenerated: false 
  },
];

export default function CustomersPage() {
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly");
  const [customers, setCustomers] = useState(initialCustomers);
  
  // States for new features
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({ key: 'ltv', direction: 'desc' });
  const [selectedCustomer, setSelectedCustomer] = useState<typeof initialCustomers[0] | null>(null);
  
  const [activeEmail, setActiveEmail] = useState<{ clientName: string; body: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  // Toggle timeframe
  const handleToggle = (type: "monthly" | "yearly") => {
    setTimeframe(type);
  };

  // Sort logic
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Process data for rendering (Filter & Sort)
  const processedCustomers = [...customers]
    .filter(c => {
      const currentRisk = timeframe === "monthly" ? c.monthlyRisk : c.yearlyRisk;
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === "All" || currentRisk === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      const aVal = sortConfig.key === 'ltv' ? (timeframe === "monthly" ? a.monthlyLTV : a.yearlyLTV) : a.name;
      const bVal = sortConfig.key === 'ltv' ? (timeframe === "monthly" ? b.monthlyLTV : b.yearlyLTV) : b.name;
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Simulated AI Email Generator
  const generateEmail = (e: React.MouseEvent, id: number, clientName: string) => {
    e.stopPropagation(); // Prevent row click when clicking button
    setGenerating(true);
    setActiveEmail(null);
    
    setTimeout(() => {
      setActiveEmail({
        clientName: clientName,
        body: `Subject: Action Required: Optimizing Your Cohort Engine Workflow\n\nDear ${clientName} Team,\n\nWe noticed a shift in your usage metrics based on our recent calculations. To ensure you maintain a healthy lifetime trajectory, let's schedule a review to address the top risk factors immediately.\n\nBest,\nRetention Team`
      });
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, emailGenerated: true } : c));
      setGenerating(false);
    }, 1200);
  };

  return (
    <main className="p-8 relative">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Lifetime & Risk Matrix</h1>
          <p className="text-sm text-slate-500 mt-1">Analyze client health vectors and trigger AI retention actions.</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm border-none focus:ring-0 w-32 outline-none text-slate-700"
            />
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-sm border-none bg-transparent focus:ring-0 text-slate-600 outline-none cursor-pointer"
            >
              <option value="All">All Risks</option>
              <option value="High Risk">High Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="Safe">Safe</option>
            </select>
          </div>

          {/* Timeframe Toggle */}
          <div className="bg-slate-200/60 p-1 rounded-xl flex gap-1">
            <button 
              onClick={() => handleToggle("monthly")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${timeframe === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => handleToggle("yearly")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${timeframe === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Yearly
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative">
        
        {/* Customer Data Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 cursor-pointer hover:text-slate-900" onClick={() => handleSort('name')}>
                    Client Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4">Cohort</th>
                  <th className="p-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('ltv')}>
                    Calculated LTV {sortConfig.key === 'ltv' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4">Risk Probability</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {processedCustomers.map((customer) => {
                  const currentRisk = timeframe === "monthly" ? customer.monthlyRisk : customer.yearlyRisk;
                  const currentLTV = timeframe === "monthly" ? customer.monthlyLTV : customer.yearlyLTV;
                  const currentProb = timeframe === "monthly" ? customer.monthlyProb : customer.yearlyProb;

                  return (
                    <tr 
                      key={customer.id} 
                      onClick={() => setSelectedCustomer(customer)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="p-4 pl-6 font-medium text-slate-900">{customer.name}</td>
                      <td className="p-4 text-slate-500">{customer.cohort}</td>
                      <td className="p-4 font-semibold">${currentLTV.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-24 text-center ${
                            currentRisk === 'High Risk' ? 'bg-rose-100 text-rose-700' : 
                            currentRisk === 'Medium Risk' ? 'bg-amber-100 text-amber-700' : 
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {currentRisk}
                          </span>
                          <div className="hidden sm:flex flex-col gap-1 w-16">
                            <span className="text-[10px] text-slate-400 font-medium">{currentProb}% Churn</span>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${currentProb > 50 ? 'bg-rose-500' : currentProb > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${currentProb}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={(e) => generateEmail(e, customer.id, customer.name)}
                          disabled={currentRisk === 'Safe'}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                            currentRisk === 'Safe' 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                              : customer.emailGenerated 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                          }`}
                        >
                          {customer.emailGenerated ? "Regenerate" : "AI Email"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {processedCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No clients match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Email Generation Panel Sidebox */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="font-semibold text-slate-900 mb-4">Retention Strategy Engine</h3>
          
          {generating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <span className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-3"></span>
              <p className="text-xs font-medium">Drafting predictive template...</p>
            </div>
          ) : activeEmail ? (
            <div className="flex-1 flex flex-col">
              <div className="text-xs text-slate-400 mb-2 font-medium">Targeting: {activeEmail.clientName}</div>
              <textarea 
                className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
                value={activeEmail.body}
                readOnly
              />
              <button className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                Copy Email Template
              </button>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <svg className="w-8 h-8 mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
              <p className="text-xs font-medium">Click on any high risk client's "AI Email" button to compile a tailored retention plan.</p>
            </div>
          )}
        </div>

      </div>

      {/* Customer Detail Drawer (Slide Over) */}
      {selectedCustomer && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedCustomer(null)}
          ></div>
          
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Cohort: {selectedCustomer.cohort}</p>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Financial Vectors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Monthly LTV</p>
                    <p className="text-lg font-bold text-slate-900">${selectedCustomer.monthlyLTV.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Yearly Adjusted LTV</p>
                    <p className="text-lg font-bold text-slate-900">${selectedCustomer.yearlyLTV.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Model Diagnosis</h3>
                <div className="space-y-3">
                  {selectedCustomer.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100/50">
                      <svg className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      <p className="text-sm text-slate-700">{factor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
               <button 
                  onClick={(e) => {
                    generateEmail(e, selectedCustomer.id, selectedCustomer.name);
                    setSelectedCustomer(null);
                  }}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
               >
                 Draft Retention Email
               </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}