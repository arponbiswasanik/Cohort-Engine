"use client";

import { useState } from "react";

// Dummy Datasets
const initialDatasets = [
  { id: 1, name: "Q4_2025_Revenue_Export.csv", source: "Manual Upload", size: "2.4 MB", rows: 14500, status: "Processed", date: "May 28, 2026" },
  { id: 2, name: "Stripe_Active_Subscriptions", source: "Stripe API", size: "Live Sync", rows: 8240, status: "Syncing", date: "June 1, 2026" },
  { id: 3, name: "historical_churn_data_2024.csv", source: "Manual Upload", size: "5.1 MB", rows: 32000, status: "Processed", date: "May 15, 2026" },
];

export default function DatasetsPage() {
  const [datasets] = useState(initialDatasets);
  const [isDragging, setIsDragging] = useState(false);

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Here we will handle the actual file upload logic later
    alert("File upload feature will be connected to the backend API.");
  };

  return (
    <main className="p-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Datasets & Integrations</h1>
          <p className="text-sm text-slate-500 mt-1">Upload CSV files or connect live billing platforms for model training.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          Connect API
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Drag & Drop Upload Zone */}
        <div className="lg:col-span-1">
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors min-h-[300px] ${
              isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDragging ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <h3 className="text-slate-900 font-semibold mb-1">Upload New Dataset</h3>
            <p className="text-xs text-slate-500 mb-6 px-4">Drag and drop your CSV files here, or click to browse from your computer.</p>
            <label className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
              Browse Files
              <input type="file" className="hidden" accept=".csv" />
            </label>
          </div>
        </div>

        {/* Connected Datasets Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-semibold text-slate-900">Active Data Sources</h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Dataset Name</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Rows (Records)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {datasets.map((data) => (
                  <tr key={data.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-900 flex items-center gap-3">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      {data.name}
                    </td>
                    <td className="p-4 text-slate-500">{data.source}</td>
                    <td className="p-4 font-semibold text-slate-600">{data.rows.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit ${
                        data.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {data.status === 'Syncing' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                        {data.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right text-slate-500 text-xs">{data.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}