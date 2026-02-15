
import React, { useState, useEffect } from 'react';
import { AppStatus, ScanResult } from './types';
import { analyzeWebsite } from './services/geminiService';
import { AnalysisDashboard } from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let sanitizedUrl = url.trim();
    if (!/^https?:\/\//i.test(sanitizedUrl)) {
      sanitizedUrl = 'https://' + sanitizedUrl;
    }

    setStatus(AppStatus.SCANNING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeWebsite(sanitizedUrl);
      setResult(data);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || 'The neural network could not bridge the connection.');
      setStatus(AppStatus.ERROR);
    }
  };

  const triggerStressTest = () => {
    setStatus(AppStatus.STRESS_TESTING);
    setTimeout(() => {
      setStatus(AppStatus.COMPLETED);
    }, 8500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-blue-500/50 flex flex-col font-['Inter']">
      {/* Background Matrix Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[180px] rounded-full animate-[pulse_12s_infinite]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_0.8px,transparent_0.8px)] [background-size:32px_32px] opacity-[0.15]"></div>
      </div>

      <header className="p-10 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setStatus(AppStatus.IDLE)}>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(37,99,235,0.4)] group-hover:rotate-12 transition-all duration-500">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
              LinkScan<span className="text-blue-500">AI</span>
            </h1>
            <span className="text-[9px] font-black tracking-[0.5em] text-blue-500/50 uppercase ml-1">Recon Modules Engaged</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">
          <a href="#" className="hover:text-blue-400 transition-all border-b border-transparent hover:border-blue-400/30 pb-1">Protocols</a>
          <a href="#" className="hover:text-blue-400 transition-all border-b border-transparent hover:border-blue-400/30 pb-1">Node API</a>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-500/80">CORE STABLE</span>
          </div>
        </div>
      </header>

      <main className="flex-grow px-8 py-10 md:py-20 flex flex-col items-center">
        {status === AppStatus.IDLE ? (
          <div className="max-w-5xl w-full text-center space-y-16 animate-in fade-in zoom-in-95 duration-1000">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[11px] font-black tracking-[0.3em] uppercase mb-4 shadow-xl">
                <i className="fa-solid fa-tower-broadcast animate-pulse"></i> Ultra-Deep Technical Reconnaissance
              </div>
              <h2 className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase italic leading-[0.85] select-none">
                Scan The <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 drop-shadow-sm">Infra.</span>
              </h2>
              <p className="text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
                Autonomous agent for IP mapping, DNS propagation, <span className="text-blue-400">CDN detection</span>, and volumetric stress auditing.
              </p>
            </div>

            <form onSubmit={handleScan} className="max-w-3xl mx-auto relative group">
              <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl focus-within:border-blue-500/40 transition-all shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)]">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="TARGET URL (e.g. apple.com)"
                  className="w-full bg-transparent px-10 py-9 text-2xl outline-none placeholder:text-slate-800 font-mono uppercase tracking-tight text-white"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-4 top-4 bottom-4 px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black italic tracking-[0.2em] uppercase transition-all flex items-center gap-3 shadow-2xl active:scale-95"
                >
                  START RECON <i className="fa-solid fa-bolt-lightning text-xs"></i>
                </button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-10">
                 {['WHOIS Data', 'DNS Trace', 'CDN Detect', 'Stress Audit'].map((t) => (
                   <span key={t} className="text-[10px] font-black tracking-[0.3em] text-slate-600 flex items-center gap-3 uppercase">
                     <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> {t}
                   </span>
                 ))}
              </div>
            </form>
          </div>
        ) : null}

        {status === AppStatus.SCANNING && (
          <div className="max-w-xl w-full text-center space-y-10 py-32 animate-in fade-in duration-500">
            <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
               <div className="absolute inset-0 border-[6px] border-blue-500/10 rounded-full"></div>
               <div className="absolute inset-0 border-[6px] border-blue-500 border-t-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
               <div className="absolute inset-4 border-[2px] border-purple-500/20 border-b-transparent rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
               <i className="fa-solid fa-fingerprint text-5xl text-blue-500 animate-pulse"></i>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Deep Link Analysis</h3>
              <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Tracing edge nodes & security headers...</p>
            </div>
          </div>
        )}

        {(status === AppStatus.COMPLETED || status === AppStatus.STRESS_TESTING) && result && (
          <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex justify-between items-center border-b border-white/5 pb-8">
              <button 
                onClick={() => setStatus(AppStatus.IDLE)}
                className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black tracking-[0.3em] text-[10px] uppercase group bg-white/5 px-6 py-3 rounded-2xl border border-white/5"
              >
                <i className="fa-solid fa-power-off text-red-500 group-hover:scale-125 transition-transform"></i>
                Eject Recon Session
              </button>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black tracking-[0.3em] text-emerald-400 bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20 uppercase shadow-lg shadow-emerald-500/5">
                   {status === AppStatus.STRESS_TESTING ? 'SST-PROTOCOLS: ACTIVE' : 'RECONNAISSANCE SYNCED'}
                 </span>
              </div>
            </div>
            <AnalysisDashboard 
              data={result} 
              onStressTest={triggerStressTest}
              isTesting={status === AppStatus.STRESS_TESTING}
            />
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-2xl w-full glass border-red-500/30 p-16 rounded-[4rem] text-center space-y-10 animate-in zoom-in-95 duration-500 shadow-2xl">
            <div className="w-28 h-28 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <i className="fa-solid fa-ban text-5xl text-red-500 animate-bounce"></i>
            </div>
            <div className="space-y-4">
               <h3 className="text-4xl font-black italic uppercase text-red-500 tracking-tighter">Protocol Violation</h3>
               <p className="text-slate-400 text-xl leading-relaxed font-medium">{error}</p>
            </div>
            <button 
              onClick={() => setStatus(AppStatus.IDLE)}
              className="px-14 py-5 bg-white/5 hover:bg-white/10 rounded-3xl font-black tracking-[0.2em] uppercase transition-all border border-white/10 shadow-xl"
            >
              Restart Recon
            </button>
          </div>
        )}
      </main>

      <footer className="p-16 border-t border-white/5 mt-20 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-2">
            <p className="text-[12px] font-black tracking-[0.4em] uppercase text-white">
              LinkScan Tactical Reconnaissance
            </p>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Neural Core 09 • Powered by Gemini 3 Flash
            </p>
          </div>
          
          <div className="text-center bg-white/5 px-8 py-4 rounded-3xl border border-white/10 shadow-2xl">
             <p className="text-[11px] font-black tracking-[0.3em] uppercase mb-1">
               Made with <i className="fa-solid fa-heart text-red-500 animate-pulse mx-1"></i> in India
             </p>
             <p className="text-[10px] font-bold text-blue-400 tracking-[0.5em] uppercase">
               By ~ PEACEGHOST
             </p>
          </div>

          <div className="flex gap-12 text-2xl text-slate-600">
             <i className="fa-brands fa-x-twitter cursor-pointer hover:text-white transition-all hover:scale-125"></i>
             <i className="fa-brands fa-github cursor-pointer hover:text-white transition-all hover:scale-125"></i>
             <i className="fa-brands fa-discord cursor-pointer hover:text-indigo-400 transition-all hover:scale-125"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
