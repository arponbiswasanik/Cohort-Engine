"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  BarChart, Bar, Tooltip as BarTooltip
} from 'recharts';

const clusterData = [
  { name: 'Acme Corp', ltv: 12000, engagement: 35, cluster: 'high-risk' },
  { name: 'SaaSify Ltd', ltv: 15000, engagement: 42, cluster: 'high-risk' },
  { name: 'TechFlow', ltv: 11000, engagement: 28, cluster: 'high-risk' },
  { name: 'NovaTech', ltv: 8500, engagement: 85, cluster: 'safe' },
  { name: 'Quantum', ltv: 5400, engagement: 92, cluster: 'safe' },
  { name: 'CloudSync', ltv: 7200, engagement: 78, cluster: 'safe' },
  { name: 'VIP Corp', ltv: 25000, engagement: 95, cluster: 'vip' },
  { name: 'MegaTron', ltv: 22000, engagement: 88, cluster: 'vip' },
];

const featureImportance = [
  { feature: 'Login Frequency', impact: 85 },
  { feature: 'Support Tickets', impact: 65 },
  { feature: 'Payment Failures', impact: 55 },
  { feature: 'Feature Adoption', impact: 40 },
];

const COLORS = { 'high-risk': '#ef4444', 'safe': '#10b981', 'vip': '#6366f1' };

export default function ModelsPage() {
  const [hasData, setHasData] = useState(false); // Empty State Logic

  if (!hasData) {
    return (
      <main className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Model Untrained</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Your tree-based ensemble model requires historical dataset to perform clustering and feature importance analysis.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/dashboard/datasets" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              Go to Datasets
            </Link>
            <button onClick={() => setHasData(true)} className="text-xs text-slate-400 hover:text-indigo-600 hover:underline transition-all">
              Preview with dummy data
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900">Ensemble Model Metrics</h1>
        <p className="text-sm text-slate-500 mt-1">Evaluate tree-based model performance and customer clustering distributions.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Model Accuracy (R²)", value: "0.942", desc: "Highly Accurate" },
          { label: "Root Mean Square Error", value: "$420.50", desc: "Lower is better" },
          { label: "Total Data Points", value: "87,000", desc: "Training set size" },
        ].map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-medium text-slate-500 mb-1">{metric.label}</h3>
            <div className="flex items-baseline gap-2 mt-2"><span className="text-3xl font-bold text-slate-900">{metric.value}</span></div>
            <p className="text-xs text-slate-400 mt-2 font-medium">{metric.desc}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
          <div className="mb-6 flex justify-between items-start">
             <div><h3 className="font-semibold text-slate-900">K-Means Customer Clustering</h3><p className="text-xs text-slate-500 mt-1">LTV vs User Engagement Score</p></div>
             <div className="flex flex-col gap-2 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> VIP Clients</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Safe Zone</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> High Risk</span>
             </div>
          </div>
          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" dataKey="engagement" name="Engagement" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} domain={[0, 100]} />
                <YAxis type="number" dataKey="ltv" name="LTV" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value, name) => name === 'LTV' ? [`$${value}`, name] : [value, name]} />
                <Scatter name="Clients" data={clusterData} fill="#8884d8">
                  {clusterData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.cluster as keyof typeof COLORS]} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
          <div className="mb-6"><h3 className="font-semibold text-slate-900">Feature Importance</h3><p className="text-xs text-slate-500 mt-1">Variables driving the ensemble predictions</p></div>
          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis type="category" dataKey="feature" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <BarTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="impact" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}