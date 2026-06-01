"use client";

import { useState } from "react";

export default function DatasetsPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState("Just now");
  const [activeTab, setActiveTab] = useState<"preview" | "schema">("preview");
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSynced(`Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }, 1500);
  };

  const handleMockConnect = (platform: string) => {
    setConnectingPlatform(platform);
    setTimeout(() => {
      alert(`${platform} integration setup is ready. In production, this opens the OAuth2/Secure Credential handshake protocol.`);
      setConnectingPlatform(null);
    }, 1000);
  };

  // Mock Raw Data for Preview
  const previewData = [
    { id: "7590-VHVEG", gender: "Female", senior: 0, partner: "Yes", dependents: "No", tenure: 1, contract: "Month-to-month", charges: 29.85, total: 29.85 },
    { id: "5575-GNVDE", gender: "Male", senior: 0, partner: "No", dependents: "No", tenure: 34, contract: "One year", charges: 56.95, total: 1889.5 },
    { id: "3668-QPYBK", gender: "Male", senior: 0, partner: "No", dependents: "No", tenure: 2, contract: "Month-to-month", charges: 53.85, total: 108.15 },
    { id: "7795-CFOCW", gender: "Male", senior: 0, partner: "No", dependents: "No", tenure: 45, contract: "One year", charges: 42.30, total: 1840.75 },
    { id: "9237-HQITU", gender: "Female", senior: 0, partner: "No", dependents: "No", tenure: 2, contract: "Month-to-month", charges: 70.70, total: 151.65 },
    { id: "9305-CDSKC", gender: "Female", senior: 0, partner: "No", dependents: "No", tenure: 8, contract: "Month-to-month", charges: 99.65, total: 820.5 },
  ];

  const schemaData = [
    { field: "customerID", type: "String (PK)", missing: "0%", desc: "Unique identifier for each client account." },
    { field: "tenure", type: "Integer", missing: "0%", desc: "Number of months the customer has stayed." },
    { field: "Contract", type: "Categorical", missing: "0%", desc: "The contract term (Month-to-month, One year, Two year)." },
    { field: "MonthlyCharges", type: "Float", missing: "0%", desc: "The amount charged to the customer monthly." },
    { field: "TotalCharges", type: "Float", missing: "0.15%", desc: "The total amount charged to the customer." },
    { field: "Churn", type: "Boolean (Target)", missing: "0%", desc: "Whether the customer churned or not (Target Variable)." },
  ];

  return (
    <main className="p-8 space-y-8">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Integration Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Manage pipeline connections, upload assets, and monitor synchronization metrics.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
        >
          {isSyncing ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Syncing Architecture...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Force Pipeline Sync
            </>
          )}
        </button>
      </header>

      {/* METRIC READOUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { 
            title: "Total Matched Rows", 
            value: "7,043", 
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>, 
            color: "bg-indigo-50 text-indigo-600" 
          },
          { 
            title: "Data Stream Health", 
            value: "99.8%", 
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>, 
            color: "bg-emerald-50 text-emerald-600" 
          },
          { 
            title: "Extracted Features", 
            value: "21 Dimensions", 
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>, 
            color: "bg-amber-50 text-amber-600" 
          },
          { 
            title: "Pipeline Sync", 
            value: lastSynced, 
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
            color: "bg-blue-50 text-blue-600" 
          }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-slate-200 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.color}`}>{kpi.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{kpi.title}</p>
              <p className="text-xl font-extrabold text-slate-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ENTERPRISE PIPELINE CONNECTIONS PANEL */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900">Data Stream Connectors</h3>
          <p className="text-xs text-slate-400 font-medium">Link infrastructure data or billing systems directly into the ML ingestion pipe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Sandbox CSV */}
          <div className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
              Active Sandbox
            </div>
            <div>
              <div className="mb-4 text-indigo-600 bg-indigo-100/50 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">historical_churn_data.csv</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Pre-populated operational framework serving live cohort profiles into the Random Forest engine.</p>
            </div>
            <div className="mt-5 pt-3 border-t border-indigo-100/60 flex justify-between items-center text-xs">
              <span className="text-indigo-600 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span> Connected
              </span>
              <span className="text-slate-400 font-medium">Source File</span>
            </div>
          </div>

          {/* Stripe Connector */}
          <div className="p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="mb-4 text-slate-600 bg-slate-50 border border-slate-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Stripe Gateway Integration</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Stream real-time MRR charges, contract transformations, and billing logs automatically via secure webhooks.</p>
            </div>
            <button 
              onClick={() => handleMockConnect("Stripe")}
              className="mt-5 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors shadow-sm"
            >
              Link Stripe System
            </button>
          </div>

          {/* PostgreSQL Connector */}
          <div className="p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="mb-4 text-slate-600 bg-slate-50 border border-slate-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Relational DB Instance</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Sync structural user parameters directly from application shards (PostgreSQL, MySQL, or Snowflake warehousing).</p>
            </div>
            <button 
              onClick={() => handleMockConnect("PostgreSQL Connection String")}
              className="mt-5 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors shadow-sm"
            >
              Mount Production DB
            </button>
          </div>
        </div>
      </section>

      {/* ACTIVE DATA PREVIEW TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[400px]">
        
        {/* Tabs Controller */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded">CSV Stream</span>
            <h4 className="text-sm font-bold text-slate-800">historical_churn_data.csv Preview</h4>
          </div>
          
          <div className="flex bg-slate-200/60 p-1 rounded-xl">
            <button onClick={() => setActiveTab("preview")} className={`px-4 py-1 text-xs font-semibold rounded-lg transition-all ${activeTab === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Data Matrix</button>
            <button onClick={() => setActiveTab("schema")} className={`px-4 py-1 text-xs font-semibold rounded-lg transition-all ${activeTab === "schema" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Model Schema</button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto">
          {activeTab === "preview" ? (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">CustomerID</th>
                  <th className="p-4">Tenure (Months)</th>
                  <th className="p-4">Contract Structure</th>
                  <th className="p-4">Monthly Rate</th>
                  <th className="p-4">Aggregate Billings</th>
                  <th className="p-4">Demographics (Partner)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700 font-semibold">
                {previewData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-indigo-600">{row.id}</td>
                    <td className="p-4 text-slate-900">{row.tenure} m</td>
                    <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{row.contract}</span></td>
                    <td className="p-4 font-mono">${row.charges}</td>
                    <td className="p-4 font-mono">${row.total}</td>
                    <td className="p-4 text-slate-500">Partner: {row.partner} / Dep: {row.dependents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-1/4">Feature Target</th>
                  <th className="p-4 w-1/4">Data Construct</th>
                  <th className="p-4 w-1/6">Null Vectors</th>
                  <th className="p-4 w-1/3">Engine Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700 font-semibold">
                {schemaData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-800">{row.field}</td>
                    <td className="p-4"><span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">{row.type}</span></td>
                    <td className="p-4 text-slate-400 font-mono">{row.missing}</td>
                    <td className="p-4 text-slate-500 leading-relaxed font-normal">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Footer info strip */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 flex justify-between items-center font-medium">
          <p>Displaying abstract representative metadata for demo verification.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sandbox Pipeline Secured
          </div>
        </div>
      </div>
    </main>
  );
}