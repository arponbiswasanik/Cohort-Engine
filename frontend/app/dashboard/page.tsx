"use client";

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