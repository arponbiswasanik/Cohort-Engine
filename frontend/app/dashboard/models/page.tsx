"use client";

import { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function ForecastModelsPage() {
  //Interactive Simulation States
  const [simTenure, setSimTenure] = useState(34);
  const [simCharges, setSimCharges] = useState(70);
  const [simContract, setSimContract] = useState("One year");

  //Calculate Base Risk
  const calculateSimulatedRisk = () => {
    let baseRisk = 35;
    
    if (simContract === "Month-to-month") baseRisk += 30;
    if (simContract === "One year") baseRisk += 5;
    if (simContract === "Two year") baseRisk -= 20;

    baseRisk -= (simTenure / 72) * 25;
    baseRisk += (simCharges / 150) * 20;

    return Math.min(99, Math.max(1, Math.round(baseRisk)));
  };

  const currentRisk = calculateSimulatedRisk();

  //Generate Live Future Trajectory based on current variables
  const generateTrajectory = () => {
    const data = [];
    let slope = simContract === "Month-to-month" ? 1.8 : (simContract === "One year" ? 0.4 : -0.5);
    
    // High tenure customers stabilize, low tenure fluctuates more
    const stabilityFactor = simTenure > 24 ? 0.5 : 1.2;

    for (let month = 0; month <= 12; month++) {
      let projectedRisk = currentRisk + (month * slope * stabilityFactor);
      projectedRisk = Math.min(99, Math.max(1, Math.round(projectedRisk)));
      data.push({ 
        month: month === 0 ? "Now" : `+${month}M`, 
        risk: projectedRisk 
      });
    }
    return data;
  };

  const trajectoryData = generateTrajectory();

  // Dynamic Colors based on Risk Level
  const getRiskColor = (risk: number) => {
    if (risk > 60) return { main: '#f43f5e', light: '#ffe4e6' }; // Rose / High Risk
    if (risk > 30) return { main: '#f59e0b', light: '#fef3c7' }; // Amber / Medium Risk
    return { main: '#10b981', light: '#d1fae5' }; // Emerald / Safe
  };

  const activeColor = getRiskColor(currentRisk);

  return (
    <main className="p-8 h-[calc(100vh-4rem)] flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Scenario Analysis Engine</h1>
        <p className="text-sm text-slate-500 mt-1">Simulate hypothetical operational variables to forecast dynamic churn trajectories.</p>
      </header>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col xl:flex-row">
        
        {/* LEFT PANEL: The Simulator Controls */}
        <div className="w-full xl:w-2/5 p-8 border-b xl:border-b-0 xl:border-r border-slate-100 bg-slate-50/50 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900">Simulation Parameters</h3>
            <p className="text-xs text-slate-500 mt-1">Adjust the sliders to see real-time impact on the machine learning heuristic.</p>
          </div>

          <div className="space-y-8">
            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-semibold text-slate-700">Hypothetical Tenure</label>
                <span className="text-indigo-600 font-mono font-bold text-sm bg-indigo-50 px-3 py-1 rounded-lg">{simTenure} Months</span>
              </div>
              <input 
                type="range" min="1" max="72" 
                value={simTenure} onChange={(e) => setSimTenure(Number(e.target.value))} 
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none transition-all" 
              />
            </div>

            {/* Monthly Charges Slider */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-semibold text-slate-700">Monthly Billing</label>
                <span className="text-indigo-600 font-mono font-bold text-sm bg-indigo-50 px-3 py-1 rounded-lg">${simCharges} / mo</span>
              </div>
              <input 
                type="range" min="15" max="150" 
                value={simCharges} onChange={(e) => setSimCharges(Number(e.target.value))} 
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none transition-all" 
              />
            </div>

            {/* Contract Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Contract Architecture</label>
              <select 
                value={simContract} onChange={(e) => setSimContract(e.target.value)} 
                className="w-full p-3.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium transition-all cursor-pointer shadow-sm"
              >
                <option value="Month-to-month">Month-to-month Contract</option>
                <option value="One year">One Year Contract</option>
                <option value="Two year">Two Year Contract</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Visualization & Readout */}
        <div className="w-full xl:w-3/5 p-8 flex flex-col relative">
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Projected Risk Trajectory</h3>
              <p className="text-xs text-slate-500 mt-1">12-Month forecasting based on active simulation logic.</p>
            </div>
            
            {/* Live Big Number */}
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Base Risk</p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-5xl font-extrabold tracking-tight font-mono" style={{ color: activeColor.main }}>
                  {currentRisk}
                </span>
                <span className="text-xl font-bold text-slate-400">%</span>
              </div>
            </div>
          </div>

          {/* The Dynamic Real-time Area Chart */}
          <div className="flex-1 w-full min-h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeColor.main} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={activeColor.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '13px', fontWeight: 600, color: '#334155' }}
                  formatter={(val: number) => [`${val}%`, 'Risk Level']}
                />
                <Area 
                  type="monotone" 
                  dataKey="risk" 
                  stroke={activeColor.main} 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRisk)"
                  animationDuration={400} // Smooth fast animation
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeColor.main }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: activeColor.main }}></span>
            </span>
            <p className="text-xs font-semibold text-slate-500">Live Engine Active</p>
          </div>
          
        </div>
      </div>
    </main>
  );
}