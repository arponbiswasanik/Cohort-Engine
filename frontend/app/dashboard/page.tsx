"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const forecastData = [
  { month: 'Jan', actual: 95000, predicted: null },
  { month: 'Feb', actual: 102000, predicted: null },
  { month: 'Mar', actual: 108000, predicted: null },
  { month: 'Apr', actual: 115000, predicted: 115000 },
  { month: 'May', actual: null, predicted: 124500 },
  { month: 'Jun', actual: null, predicted: 136000 },
  { month: 'Jul', actual: null, predicted: 145000 },
];

export default function DashboardOverviewPage() {
  
  const [hasData, setHasData] = useState(false); 

  
if (!hasData) {
    return (
      <main className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Data Available</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Your dashboard is currently empty. Please upload your historical revenue dataset to generate AI forecasts and churn metrics.
          </p>
          
          {/* Aligned Buttons Area */}
          <div className="flex flex-col items-center gap-4">
            <Link 
              href="/dashboard/datasets"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              Go to Datasets
            </Link>

            {/* Test Button just to toggle state manually for now */}
            <button 
              onClick={() => setHasData(true)}
              className="text-xs text-slate-400 hover:text-indigo-600 hover:underline transition-all"
            >
              Preview with dummy data
            </button>
          </div>
        </div>
      </main>
    );
  }

  
  return (
    <main className="p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue Forecast Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor your ensemble model predictions and core SaaS metrics.</p>
        </div>
      </header>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Predicted MRR (Next 30 Days)", value: "$124,500", trend: "+12.5%", color: "text-emerald-600" },
          { label: "Forecasted Churn Rate", value: "2.4%", trend: "-0.8%", color: "text-emerald-600" },
          { label: "Active Cohorts", value: "142", trend: "Steady", color: "text-slate-500" },
          { label: "Ensemble Model Accuracy", value: "94.2%", trend: "+1.2%", color: "text-emerald-600" },
        ].map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-2">{metric.label}</h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
              <span className={`text-xs font-semibold ${metric.color} bg-slate-50 px-2 py-1 rounded-md`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">Revenue Projection Curve</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="w-3 h-3 rounded-full bg-slate-800"></span> Actual
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Predicted
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="actual" stroke="#1e293b" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Insights Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-6">Top Churn Factors</h3>
          <div className="flex-1 space-y-4">
            {[
              { factor: "Decreased Login Frequency", impact: "High" },
              { factor: "Support Ticket Volume", impact: "Medium" },
              { factor: "Feature Adoption Drop", impact: "High" },
              { factor: "Payment Failure History", impact: "Low" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">{item.factor}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  item.impact === 'High' ? 'bg-rose-100 text-rose-700' : 
                  item.impact === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}