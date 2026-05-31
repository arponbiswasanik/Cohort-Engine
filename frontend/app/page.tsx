"use client";

import { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, Tooltip as ScatterTooltip
} from "recharts";

const CLUSTER_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const CLUSTER_NAMES = ['Loyal VIPs', 'Steady Subscribers', 'Value Seekers', 'High-Risk Flight Risks'];

export default function Dashboard() {
  // Base Data States
  const [survivalData, setSurvivalData] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Engine States
  const [searchId, setSearchId] = useState("3668-QPYBK"); // Defaulting to a known high-risk user
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  // Advanced Feature States
  const [simData, setSimData] = useState<any>(null);
  const [simulatedRisk, setSimulatedRisk] = useState<number | null>(null);
  const [loadingSim, setLoadingSim] = useState(false);
  
  const [agentEmail, setAgentEmail] = useState<string | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(false);

  // Boot up data fetch
  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/survival").then(res => res.json()),
      fetch("http://127.0.0.1:8000/api/clusters").then(res => res.json())
    ]).then(([survivalRes, clusterRes]) => {
      setSurvivalData(survivalRes.data);
      setClusterData(clusterRes.data);
      setLoading(false);
    });
  }, []);

  // 1. Core Prediction Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPrediction(true);
    setSimulatedRisk(null);
    setAgentEmail(null);
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/predict/${searchId}`);
      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
        setSimData(data.features); // Load their original features into the simulator
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  // 2. Run the "What-If" Simulation
  const runSimulation = async () => {
    setLoadingSim(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: prediction.customer_id,
          ...simData
        })
      });
      const data = await res.json();
      setSimulatedRisk(data.simulated_risk_percentage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSim(false);
    }
  };

  // 3. Generate Llama 3 Retention Strategy
  const generateStrategy = async () => {
    setLoadingAgent(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: prediction.customer_id,
          risk_percentage: prediction.churn_risk_percentage,
          contract: simData.Contract,
          monthly_charges: simData.MonthlyCharges
        })
      });
      const data = await res.json();
      setAgentEmail(data.strategy_email);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAgent(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">Initializing AI Architecture...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Cohort Engine</h1>
          <p className="text-gray-500 text-lg">Predictive & Prescriptive AI Analytics Pipeline</p>
        </div>

        {/* TOP ROW: Search & Interactive Commands */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Search Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Risk Oracle</h2>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Customer ID" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Search</button>
            </form>

            {prediction && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium uppercase">Customer ID</p>
                  <p className="text-xl font-bold">{prediction.customer_id}</p>
                </div>
                <div className={`p-6 rounded-xl border ${prediction.risk_status === 'High Risk' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <p className="text-sm font-medium uppercase tracking-wider mb-1">Baseline Churn Risk</p>
                  <p className="text-5xl font-extrabold">{prediction.churn_risk_percentage}%</p>
                  <p className="text-sm mt-2 font-semibold opacity-80 uppercase">{prediction.risk_status}</p>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Command Center (Simulation & AI) */}
          {prediction && simData && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 lg:col-span-2 flex flex-col md:flex-row gap-8">
              
              {/* Simulation Engine */}
              <div className="flex-1 space-y-4">
                <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                  <span>⚙️</span> "What-If" Interventions
                </h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contract Type</label>
                  <select value={simData.Contract} onChange={(e) => setSimData({...simData, Contract: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-gray-50">
                    <option value="Month-to-month">Month-to-month</option>
                    <option value="One year">One year</option>
                    <option value="Two year">Two year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Bill (${simData.MonthlyCharges})</label>
                  <input type="range" min="20" max="120" step="5" value={simData.MonthlyCharges} onChange={(e) => setSimData({...simData, MonthlyCharges: parseFloat(e.target.value)})} className="w-full" />
                </div>

                <button onClick={runSimulation} className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                  {loadingSim ? "Calculating..." : "Run Scenario via Random Forest"}
                </button>

                {simulatedRisk !== null && (
                  <div className={`p-4 mt-4 rounded-xl border ${simulatedRisk < prediction.churn_risk_percentage ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <p className="text-sm font-semibold">Simulated Risk Level</p>
                    <p className="text-2xl font-bold">{simulatedRisk}%</p>
                  </div>
                )}
              </div>

              {/* Generative AI Agent */}
              <div className="flex-1 space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                  <span>✨</span> Llama 3 Agent
                </h2>
                <p className="text-sm text-gray-500">Generate a personalized intervention strategy based on current structural variables.</p>
                
                <button onClick={generateStrategy} className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">
                  {loadingAgent ? "Groq LPU Processing..." : "Draft Strategy Email"}
                </button>

                {agentEmail && (
                  <div className="mt-4 p-4 bg-gray-900 text-gray-100 rounded-xl text-sm leading-relaxed border border-gray-700 shadow-inner">
                    {agentEmail}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* BOTTOM ROW: The Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Clustering Map */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Behavioral Matrix</h2>
            <p className="text-sm text-gray-500 mb-6">Unsupervised PCA Projection</p>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="x" type="number" hide />
                  <YAxis dataKey="y" type="number" hide />
                  <ZAxis dataKey="z" type="number" range={[20, 100]} />
                  <ScatterTooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow-lg text-xs font-bold" style={{ color: CLUSTER_COLORS[data.cluster_group] }}>
                            {CLUSTER_NAMES[data.cluster_group]}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={clusterData} opacity={0.6}>
                    {clusterData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[entry.cluster_group]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Survival Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Macro Retention Curve</h2>
            <p className="text-sm text-gray-500 mb-6">Kaplan-Meier Base Estimation</p>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={survivalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 1]} tickFormatter={(t) => `${(t * 100).toFixed(0)}%`} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <LineTooltip formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Retention']} />
                  <Line type="monotone" dataKey="survival_probability" stroke="#2563eb" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}