"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

export default function CustomersPage() {
  const [hasData, setHasData] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly");
  const [customers, setCustomers] = useState<any[]>([]);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 50;

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({ key: 'ltv', direction: 'desc' });
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [activeEmail, setActiveEmail] = useState<{ clientName: string; body: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const response = await fetch(`https://cohort-engine.onrender.com/api/customers?limit=${ITEMS_PER_PAGE}&skip=${skip}`);
        
        if (!response.ok) throw new Error("API Network error");
        const result = await response.json();
        
        if (result.status === "success" && result.data.length > 0) {
          const mappedCustomers = result.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            cohort: c.contract,
            monthlyLTV: c.monthly_charges,
            yearlyLTV: c.estimated_ltv, 
            expectedMonths: c.expected_lifetime_months, 
            monthlyRisk: c.risk_status,
            yearlyRisk: c.risk_status,
            monthlyProb: c.risk_percentage,
            yearlyProb: c.risk_percentage,
            factors: [`Contract Model: ${c.contract}`, `Current Billing Rate: $${c.monthly_charges}/mo`],
            emailGenerated: false
          }));
          
          setCustomers(mappedCustomers);
          setTotalItems(result.pagination.total);
          setHasData(true);
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [page]); 

  const generateSurvivalCurve = (riskPercentage: number) => {
    const churnRate = riskPercentage / 100;
    const data = [];
    for (let i = 0; i <= 12; i+=2) {
      data.push({
        month: `Month ${i}`,
        probability: Math.max(0, Math.round(100 * Math.pow(1 - churnRate, i)))
      });
    }
    return data;
  };

  const handleToggle = (type: "monthly" | "yearly") => setTimeframe(type);
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

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

  const generateEmail = async (e: React.MouseEvent, customer: any) => {
    e.stopPropagation();
    setGenerating(true);
    setActiveEmail(null);
    setIsCopied(false);
    
    try {
      const response = await fetch("https://cohort-engine.onrender.com/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customer.id,
          risk_percentage: customer.monthlyProb,
          contract: customer.cohort,
          monthly_charges: customer.monthlyLTV
        })
      });

      if (!response.ok) throw new Error("Failed to generate email");
      const data = await response.json();
      
      setActiveEmail({
        clientName: customer.name,
        body: data.strategy_email
      });
      
      setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, emailGenerated: true } : c));
    } catch (error) {
      console.error("Generation Error:", error);
      alert("Failed to connect to the AI Agent. Ensure your backend is running and Groq API key is valid.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (activeEmail) {
      navigator.clipboard.writeText(activeEmail.body);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2050);
    }
  };

  if (isLoading && customers.length === 0) {
    return (
      <main className="p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <span className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></span>
          <p className="font-medium text-sm animate-pulse">Syncing with ML Engine...</p>
        </div>
      </main>
    );
  }

  if (!hasData && !isLoading) {
    return (
      <main className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Clients Found</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Your customer matrix is currently empty. Connect your billing data to analyze lifetime values and churn risks.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/dashboard/datasets" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              Go to Datasets
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 relative">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Lifetime & Risk Matrix</h1>
          <p className="text-sm text-slate-500 mt-1">Analyze client health vectors and trigger retention actions.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="text-sm border-none focus:ring-0 w-32 outline-none text-slate-700" />
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="text-sm border-none bg-transparent focus:ring-0 text-slate-600 outline-none cursor-pointer">
              <option value="All">All Risks</option>
              <option value="High Risk">High Risk</option>
              <option value="Safe">Safe</option>
            </select>
          </div>
          <div className="bg-slate-200/60 p-1 rounded-xl flex gap-1">
            <button onClick={() => handleToggle("monthly")} className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${timeframe === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Monthly</button>
            <button onClick={() => handleToggle("yearly")} className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${timeframe === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Yearly</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative">
        {/* Left Side: Customers Table */}
        <div className="xl:col-span-2 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px] relative">
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center">
                <span className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></span>
              </div>
            )}

            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="p-4 pl-6 cursor-pointer hover:text-slate-900 bg-slate-50" onClick={() => handleSort('name')}>Client Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th className="p-4 bg-slate-50">Contract</th>
                    <th className="p-4 cursor-pointer hover:text-slate-900 bg-slate-50" onClick={() => handleSort('ltv')}>Est. Revenue {sortConfig.key === 'ltv' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th className="p-4 bg-slate-50">ML Risk Prob.</th>
                    <th className="p-4 pr-6 text-right bg-slate-50">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                  {processedCustomers.map((customer) => {
                    const currentRisk = timeframe === "monthly" ? customer.monthlyRisk : customer.yearlyRisk;
                    const currentLTV = timeframe === "monthly" ? customer.monthlyLTV : customer.yearlyLTV;
                    const currentProb = timeframe === "monthly" ? customer.monthlyProb : customer.yearlyProb;

                    return (
                      <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                        <td className="p-4 pl-6 font-medium text-indigo-600 group-hover:text-indigo-700 underline underline-offset-4">{customer.name}</td>
                        <td className="p-4 text-slate-500">{customer.cohort}</td>
                        <td className="p-4 font-semibold">${currentLTV.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-24 text-center ${currentRisk === 'High Risk' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{currentRisk}</span>
                            <div className="hidden sm:flex flex-col gap-1 w-16">
                              <span className="text-[10px] text-slate-400 font-medium">{currentProb}% Churn</span>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${currentProb > 50 ? 'bg-rose-500' : currentProb > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${currentProb}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button onClick={(e) => generateEmail(e, customer)} disabled={currentRisk === 'Safe'} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${currentRisk === 'Safe' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : customer.emailGenerated ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                            {customer.emailGenerated ? "Regenerate" : "Email"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {processedCustomers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No clients match your filters.</td></tr>}
                </tbody>
              </table>
            </div>
            
            {/* PAGINATION CONTROLS */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between z-10">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(page * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-semibold text-slate-700">{totalItems}</span> clients
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1 || isLoading}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm">
                  Previous
                </button>
                <button 
                  onClick={() => setPage(p => p + 1)} 
                  disabled={page * ITEMS_PER_PAGE >= totalItems || isLoading}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 flex items-center gap-2 px-2 font-medium">
            <svg className="w-4 h-4 text-indigo-500 animate-pulse shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            💡 Note: Click on any Client Name to open a detailed panel featuring their expected lifetime curve and in-depth metrics.
          </p>
        </div>

        {/* Right Side: Retention Strategy Engine */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[600px]">
          <h3 className="font-semibold text-slate-900 mb-4">Retention Strategy Engine</h3>
          {generating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <span className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-3"></span>
              <p className="text-xs font-medium">Consulting LLaMA 3.1 Model...</p>
            </div>
          ) : activeEmail ? (
            <div className="flex-1 flex flex-col">
              <div className="text-xs text-slate-400 mb-2 font-medium">Targeting: {activeEmail.clientName}</div>
              <textarea className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed focus:outline-none focus:border-indigo-500 resize-none" value={activeEmail.body} readOnly />
              <button 
                onClick={handleCopy}
                className={`w-full mt-4 py-2.5 font-semibold text-sm rounded-xl transition-colors shadow-sm ${
                  isCopied ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isCopied ? "✓ Copied to Clipboard!" : "Copy Email Template"}
              </button>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <svg className="w-8 h-8 mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
              <p className="text-xs font-medium">Click on any high risk client's "Email" button to compile a tailored retention plan using LLaMA 3.1.</p>
            </div>
          )}
        </div>
      </div>

      {/* EXTENDED DRAWER & BIGGER CONTENT */}
      {selectedCustomer && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedCustomer(null)}></div>
          <div className="fixed inset-y-0 right-0 w-full md:w-[560px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-slate-200 overflow-y-auto">
            
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedCustomer.name}</h2>
                <p className="text-sm text-slate-500 font-semibold mt-1.5">{selectedCustomer.cohort}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2.5 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-8 flex-1 space-y-10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Financial Vectors</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-sm font-medium text-slate-500 mb-1.5">Monthly MRR</p>
                    <p className="text-2xl font-extrabold text-slate-900">${selectedCustomer.monthlyLTV.toLocaleString()}</p>
                  </div>
                  <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100/70">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm text-indigo-700 font-bold">Estimated LTV</p>
                      <svg className="w-4 h-4 text-indigo-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-2xl font-extrabold text-indigo-900">${selectedCustomer.yearlyLTV.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                    <p className="text-xs font-semibold text-indigo-500 mt-1.5">Exp. Lifetime: {selectedCustomer.expectedMonths} months</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Retention Probability Curve</h3>
                <p className="text-xs text-slate-400 mb-5">Forecasted survival trajectory based on {selectedCustomer.monthlyProb}% churn risk factor.</p>
                <div className="h-48 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateSurvivalCurve(selectedCustomer.monthlyProb)} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedCustomer.monthlyRisk === 'Safe' ? '#10b981' : '#f43f5e'} stopOpacity={0.25}/>
                          <stop offset="95%" stopColor={selectedCustomer.monthlyRisk === 'Safe' ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} domain={[0, 100]} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)', fontSize: '13px' }}
                        formatter={(value: any) => [`${value}%`, 'Retention Prob.']}
                      />
                      <Area
                        type="monotone" 
                        dataKey="probability" 
                        stroke={selectedCustomer.monthlyRisk === 'Safe' ? '#10b981' : '#f43f5e'} 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#colorProb)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Model Diagnosis</h3>
                <div className="space-y-3.5">
                  {selectedCustomer.factors.map((factor: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <svg className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className="text-base text-slate-700 font-medium leading-relaxed">{factor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-100 bg-slate-50 sticky bottom-0">
               <button onClick={(e) => { generateEmail(e, selectedCustomer); setSelectedCustomer(null); }} className="w-full py-3.5 bg-indigo-600 text-white font-bold text-base rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-[0.99]">
                 Draft Retention Email
               </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}