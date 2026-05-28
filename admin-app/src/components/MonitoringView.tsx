import React, { useState, useEffect } from 'react';
import { Activity, Users, Server, Zap, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_ONLINE_USERS = [
  { id: 1, name: 'Alex Johnson', role: 'UI Developer', online: true },
  { id: 2, name: 'Sarah Miller', role: 'Product Designer', online: true },
  { id: 3, name: 'David Lee', role: 'Template Architect', online: false },
  { id: 4, name: 'Emma Wilson', role: 'Content Creator', online: true },
  { id: 5, name: 'Michael Chen', role: 'UI Developer', online: true },
  { id: 6, name: 'Rachel Adams', role: 'No-Code Expert', online: false },
];

export default function MonitoringView() {
  const [data, setData] = useState<any[]>([]);
  const [totalOnline, setTotalOnline] = useState(142);
  const [loading, setLoading] = useState(true);

  // Simulate real-time data flow
  useEffect(() => {
    // Generate initial 24h data
    const initialData = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      initialData.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        connections: Math.floor(Math.random() * 100) + 50,
      });
    }
    setData(initialData);
    setLoading(false);

    // Update every 5 seconds to simulate live feed
    const interval = setInterval(() => {
      setTotalOnline(prev => {
        const jump = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return prev + jump > 0 ? prev + jump : prev;
      });
      
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          connections: totalOnline + (Math.floor(Math.random() * 10) - 5)
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#121315] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
          <Activity size={15} className="text-emerald-500" /> Platform Telemetry & Monitoring
        </h4>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            System Healthy
          </span>
          <button className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/60 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left column: Metrics & Graph */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={64} />
              </div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Workers Online</span>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold text-emerald-500 font-mono tracking-tighter">{totalOnline}</span>
                <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-bold mb-1 tracking-wider uppercase">Live</span>
              </div>
            </div>
            
            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={64} />
              </div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Avg Response Time</span>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold text-indigo-500 font-mono tracking-tighter">124</span>
                <span className="text-xs text-neutral-500 mb-1 font-bold tracking-wider">ms</span>
              </div>
            </div>

            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Server size={64} />
              </div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Server Load</span>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold text-amber-500 font-mono tracking-tighter">42</span>
                <span className="text-xs text-neutral-500 mb-1 font-bold tracking-wider">%</span>
              </div>
            </div>
          </div>

          {/* Grafana-style Chart */}
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#fafafa] dark:bg-[#0c0d0e] shadow-inner relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" /> Connection Spikes (24h)
              </h3>
              <span className="text-[10px] uppercase font-bold text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-2 py-1 rounded bg-white dark:bg-[#121315]">
                Real-Time
              </span>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#666' }} 
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#666' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121315', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    labelStyle={{ color: '#888' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="connections" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorConnections)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column: User Status List */}
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800/80 mb-4">
            <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">
              Worker Status
            </h3>
            <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-900/60 px-2 py-0.5 rounded">
              LIVE
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {MOCK_ONLINE_USERS.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center text-[10px] shrink-0 border border-indigo-500/20">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100">{user.name}</h4>
                    <span className="text-[9px] text-neutral-500">{user.role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900/60 px-2 py-1 rounded-md">
                  <div className={`w-1.5 h-1.5 rounded-full ${user.online ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-neutral-500'}`} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                    {user.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
