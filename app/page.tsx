"use client";
import { useState, useEffect } from 'react';
import { ShieldAlert, Zap, Search, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Check if the result is safe to determine colors
  const isSafe = result.toLowerCase().includes('safe');

  // Load history when the page first opens
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/transactions/history');
      const data = await response.json();
      setHistory(data.reverse()); // Show newest transactions at the top
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const analyzeTransaction = async () => {
    setLoading(true);
    setResult(''); // Clear previous result
    try {
      const response = await fetch('http://localhost:8080/api/transactions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), location, category })
      });
      const data = await response.text();
      setResult(data);
      fetchHistory(); // Refresh the table after a new scan
    } catch (error) {
      setResult("Error connecting to Sentinel Backend.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center gap-4 mb-12 border-b border-slate-800 pb-6">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Financial Sentinel</h1>
            <p className="text-slate-400">AI-Powered Fraud Intelligence powered by Llama 3.2</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap size={20} className="text-yellow-400" /> New Transaction
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Transaction Amount ($)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. Dubai, UAE"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. Luxury Watch"
                />
              </div>
              <button 
                onClick={analyzeTransaction}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition-all disabled:opacity-50"
              >
                {loading ? "Sentinel is Thinking..." : "Analyze with AI"}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
              <Search size={20} /> Analysis Result
            </h2>
            
            {result ? (
              <div className={`p-5 rounded-xl border-2 leading-relaxed transition-all duration-500 flex-grow
                ${loading ? 'animate-pulse bg-slate-800 border-slate-700' : 
                  isSafe ? 'bg-green-950/30 border-green-800 text-green-300' : 'bg-red-950/30 border-red-800 text-red-300'}`}>
                <div className="flex items-start gap-3">
                    {isSafe ? <CheckCircle className="mt-1 flex-shrink-0" /> : <AlertTriangle className="mt-1 flex-shrink-0" />}
                    <p className="text-sm md:text-base">{result}</p>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl italic">
                {loading ? "Processing transaction patterns..." : "Waiting for transaction data..."}
              </div>
            )}
          </div>
        </div>

        {/* History Table Section */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" />
            <h2 className="text-xl font-bold">Recent Security Audits</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.length > 0 ? history.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-blue-400">${tx.amount.toFixed(2)}</td>
                    <td className="p-4 text-slate-300 capitalize">{tx.category}</td>
                    <td className="p-4 text-slate-300">{tx.location}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                        ${tx.flagged ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                        {tx.flagged ? 'FLAGGED' : 'CLEARED'}
                      </span>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-500 italic">
                            No historical records found in MySQL database.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}