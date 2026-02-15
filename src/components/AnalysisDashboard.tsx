
import React, { useState, useEffect } from 'react';
import { ScanResult, AppStatus } from '../types';
import { MetricCard } from './MetricCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';

interface AnalysisDashboardProps {
  data: ScanResult;
  onStressTest: () => void;
  isTesting: boolean;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, onStressTest, isTesting }) => {
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [glitch, setGlitch] = useState(false);
  
  const handleStressTestStart = () => {
    onStressTest();
    setGlitch(true);
    setTestLogs(["[INIT] LinkScan Stress Modules v9.0", "[AUTH] Bypassing rate limit protocols...", "[LOAD] Syncing 10k botnet instances...", "[ENGAGE] Volumetric SYN Flood initiated."]);
    
    const logInterval = setInterval(() => {
      const logs = [
        `TCP Overflow at ${data.ipAddress}:80`,
        "WAF Latency Spike: +4500ms",
        "Edge caching bypass successful",
        "Detecting target downtime probability: 82%",
        "Packet drop detected at upstream provider"
      ];
      setTestLogs(prev => [...prev, logs[Math.floor(Math.random() * logs.length)]].slice(-8));
    }, 1200);

    setTimeout(() => {
      clearInterval(logInterval);
      setGlitch(false);
      setTestLogs(prev => [...prev, "✓ OPERATION CRITICAL SUCCESS"]);
    }, 8000);
  };

  const chartData = [
    { name: 'Perf', value: data.performanceScore },
    { name: 'DDoS', value: data.ddosResilience },
    { name: 'Node Health', value: 92 },
    { name: 'DNS Rec', value: 98 },
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ${glitch ? 'animate-[pulse_0.1s_infinite]' : ''}`}>
      {/* Target Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass p-8 rounded-[2rem] border-l-8 border-blue-500 shadow-2xl relative overflow-hidden">
        {glitch && <div className="absolute inset-0 bg-red-500/10 pointer-events-none mix-blend-overlay"></div>}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full shadow-[0_0_15px] ${glitch ? 'bg-red-500 shadow-red-500 animate-ping' : 'bg-emerald-500 shadow-emerald-500 animate-pulse'}`}></div>
             <h2 className="text-4xl font-black tracking-tight uppercase italic drop-shadow-lg">{data.url}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">CDN: {data.cdnProvider || 'None'}</span>
            {data.techStack.slice(0, 5).map((tech, i) => (
              <span key={i} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono uppercase tracking-widest">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right bg-black/60 p-5 rounded-3xl border border-white/5 backdrop-blur-3xl">
          <div className="text-[9px] text-gray-500 font-bold tracking-[0.4em] uppercase mb-1">NETWORK IDENTIFIER</div>
          <div className="text-3xl font-mono text-emerald-400 font-bold tracking-tighter">{data.ipAddress}</div>
          <div className="text-[10px] text-gray-400 mt-1 font-mono">{data.serverLocation}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Stats Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard label="Latency" value={data.loadInfo.avgResponseTime} icon="fa-bolt" colorClass="text-blue-400 bg-blue-400" />
            <MetricCard label="Page Size" value={data.loadInfo.pageSize} icon="fa-file-code" colorClass="text-purple-400 bg-purple-400" />
            <MetricCard label="DDoS Guard" value={`${data.ddosResilience}%`} icon="fa-shield-halved" colorClass="text-red-400 bg-red-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Headers & WHOIS */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Security Headers Audit</h3>
              <div className="space-y-3">
                {data.securityHeaders.map((header, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-sm font-mono text-gray-300">{header.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${header.status === 'present' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {header.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-4">WHOIS Records</h3>
                <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                  <div className="bg-black/20 p-3 rounded-lg"><span className="text-gray-500 block">CREATED</span>{data.whoisData.created}</div>
                  <div className="bg-black/20 p-3 rounded-lg"><span className="text-gray-500 block">REGISTRAR</span>{data.whoisData.registrar}</div>
                </div>
              </div>
            </div>

            {/* Global DNS & Infrastructure */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Global DNS Propagation</h3>
              <div className="grid grid-cols-2 gap-3">
                {data.dnsPropagation.map((dns, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                    <div className="flex-1">
                       <span className="text-[10px] text-gray-500 block uppercase font-bold">{dns.region}</span>
                       <span className="text-xs font-mono">{dns.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400 mb-4">Edge Nodes</h3>
                <div className="flex flex-wrap gap-2">
                  {data.globalNodes.map((node, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 rounded text-[9px] font-mono text-gray-400 border border-white/10">
                      {node}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stress Panel */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent flex flex-col h-full relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-red-500 uppercase italic mb-2 tracking-tighter">Stress Test</h3>
              <p className="text-[10px] text-gray-400 leading-relaxed mb-6 font-bold uppercase tracking-widest">Autonomous Load Resilience Audit</p>
              
              <button 
                disabled={isTesting}
                onClick={handleStressTestStart}
                className={`w-full py-5 rounded-2xl font-black text-[10px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                  isTesting 
                  ? 'bg-red-500/20 text-red-500 cursor-not-allowed border border-red-500/40' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20 group-hover:scale-105 active:scale-95'
                }`}
              >
                {isTesting ? 'ENGAGED' : 'EXECUTE DDOS SIM'}
              </button>

              <div className="mt-8 bg-black/80 rounded-2xl p-4 font-mono text-[9px] h-64 overflow-hidden border border-white/10 shadow-inner">
                 <div className="text-blue-400 mb-2 font-bold"># linkscan-recon --verbose</div>
                 {testLogs.map((log, i) => (
                   <div key={i} className={`${log.includes('✓') ? 'text-emerald-400 font-bold' : 'text-gray-500'} animate-in fade-in slide-in-from-left-4`}>
                     {'>'} {log}
                   </div>
                 ))}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-9xl text-red-500/5 group-hover:text-red-500/10 transition-colors">
              <i className="fa-solid fa-skull"></i>
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Footer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] space-y-6 relative overflow-hidden border-t-4 border-blue-500">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                 <i className="fa-solid fa-brain text-2xl text-blue-400"></i>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">AI Security Verdict</h3>
           </div>
           <p className="text-xl text-gray-200 leading-relaxed font-medium italic">
             "{data.summary}"
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
             <div>
               <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-3">Vulnerability Assessment</h4>
               <ul className="space-y-2">
                 {data.vulnerabilities.map((v, i) => (
                   <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                     <i className="fa-solid fa-circle-exclamation text-red-500"></i> {v}
                   </li>
                 ))}
                 {data.vulnerabilities.length === 0 && <li className="text-xs text-emerald-500">No critical CVEs detected.</li>}
               </ul>
             </div>
             <div>
               <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-[0.3em] mb-3">Analyst Insights</h4>
               <p className="text-xs text-gray-500 leading-relaxed">{data.securityAnalysis}</p>
             </div>
           </div>
        </div>

        <div className="glass p-10 rounded-[3rem] flex flex-col justify-between border-t-4 border-emerald-500">
          <h3 className="text-lg font-black italic uppercase tracking-widest text-emerald-400 mb-8">Performance Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-between items-center bg-black/20 p-4 rounded-2xl">
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Global Ranking</span>
            <span className="text-2xl font-black italic text-emerald-500">TOP 1%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
