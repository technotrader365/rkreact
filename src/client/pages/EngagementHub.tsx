
import React, { useState, useEffect } from 'react';
import { serviceNow } from '../services/serviceNowService';
import { useUser } from '../context/UserContext';
import { Nudge } from '../types';
import { mockNudges } from '../store/mockStore';

export const EngagementHub: React.FC = () => {
  const { user } = useUser();
  const [nudges, setNudges] = useState<Nudge[]>(mockNudges);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serviceNow.isConnected()) {
      setLoading(true);
      serviceNow.getNudges(user.email)
        .then(data => setNudges(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user.email]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Engagement & Nudge Hub</h2>
          <p className="text-slate-500">Manage proactive AI alerts, tutor sessions, and study resources.</p>
        </div>
        {loading && <span className="text-indigo-600 animate-pulse text-xs font-bold">Checking Alerts...</span>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-bold flex items-center gap-2"><span>💬</span> Recent Empathetic Nudges</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {nudges.length > 0 ? nudges.map((nudge, i) => (
                <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase px-2 py-0.5 bg-indigo-50 rounded-md">{nudge.type}</span>
                    <span className="text-xs text-slate-400">{nudge.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-4">{nudge.message}</p>
                  {nudge.actionLabel && (
                    <button className="text-xs font-bold text-slate-900 border border-slate-200 px-4 py-2 rounded-lg hover:bg-white transition-all">
                      {nudge.actionLabel}
                    </button>
                  )}
                </div>
              )) : (
                <div className="p-8 text-center text-slate-400">No active alerts. You are doing great!</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📅</span> Study Room Booking
            </h3>
            <p className="text-indigo-100 text-sm mb-6">AI recommends a quiet room for your upcoming CS201 project deadline.</p>
            <div className="space-y-3">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                <p className="text-xs text-white/70">Library Floor 3 - Room 304</p>
                <p className="text-sm font-bold">Tomorrow, 10:00 - 12:00</p>
              </div>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-50 transition-colors">
                Quick Book Room
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🧑‍🏫</span> Assigned Tutors
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">SP</div>
                <div>
                  <p className="text-sm font-bold">Sarah Palmer</p>
                  <p className="text-xs text-slate-400">Computer Science</p>
                </div>
                <button className="ml-auto text-xs font-bold text-indigo-600">Chat</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700">RK</div>
                <div>
                  <p className="text-sm font-bold">Raj Kumar</p>
                  <p className="text-xs text-slate-400">Mathematics</p>
                </div>
                <button className="ml-auto text-xs font-bold text-indigo-600">Chat</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
