
import React, { useState, useEffect, useRef } from 'react';
import { getAIConsultation } from '../services/geminiService';

export const AIConsultant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    const newMessages = [...messages, { role: 'user' as const, parts: [{ text: userMsg }] }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    
    try {
      const context = "Student is current top-tier performer. Link: ServiceNow dev12345. Current Focus: High-density cognitive labs.";
      const aiResponse = await getAIConsultation(newMessages, context);
      setMessages([...newMessages, { role: 'model' as const, parts: [{ text: aiResponse || '' }] }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'model' as const, parts: [{ text: "Neural Link timed out. Please check your connection." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      {open ? (
        <div className="w-[420px] h-[600px] bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(37,99,235,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-700 border border-slate-100">
          <div className="p-8 bg-blue-600 flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 shimmer opacity-10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black text-sm shadow-xl">S</div>
              <div>
                <p className="text-sm font-black text-white tracking-tight">SnapX Sage</p>
                <p className="text-[8px] text-yellow-300 font-black tracking-[0.4em] uppercase">Brain-Link Stable</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 transition-colors font-black relative z-10">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scroll bg-slate-50/30">
             {messages.length === 0 && (
               <div className="text-center py-20 space-y-6">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">🧠</div>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] max-w-[200px] mx-auto leading-relaxed">
                   Mission Sage awaiting queries...
                 </p>
               </div>
             )}
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                 <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs font-medium leading-relaxed shadow-sm ${
                   m.role === 'user' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-slate-100 text-slate-600'
                 }`}>
                   {m.parts[0].text}
                 </div>
               </div>
             ))}
             {loading && (
                <div className="flex gap-2 p-5 bg-white border border-slate-100 rounded-[2rem] max-w-fit animate-pulse">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-60"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-30"></div>
                </div>
             )}
          </div>

          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the University AI..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-xs text-slate-800 outline-none focus:border-blue-400 transition-all placeholder:text-slate-400 pr-20"
                />
                <button 
                  onClick={handleSend} 
                  className="absolute right-3 w-12 h-12 gradient-snapx rounded-[1.2rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="text-sm">➔</span>
                </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          className="w-24 h-24 gradient-snapx rounded-[2.5rem] shadow-[0_20px_60px_rgba(37,99,235,0.2)] flex items-center justify-center text-4xl hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all group relative overflow-hidden border-4 border-white"
        >
          <div className="absolute inset-0 shimmer opacity-30"></div>
          <span className="relative z-10 group-hover:rotate-12 transition-transform">🧠</span>
        </button>
      )}
    </div>
  );
};
