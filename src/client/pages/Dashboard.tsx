
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { mockUser, mockRiskProfile, mockNudges, mockEvents } from '../store/mockStore';
import { useNavigate } from 'react-router-dom';
import { AIConsultant } from '../components/AIConsultant';
import { useCourses } from '../context/CourseContext';
import { serviceNow } from '../services/serviceNowService';
import { Layout as LayoutIcon, X, Check, Grid, Clock, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';

// Widget Configuration Types
type WidgetId = 'risk' | 'nudge' | 'courses' | 'analytics' | 'compliance' | 'deadlines';

interface WidgetConfig {
  id: WidgetId;
  label: string;
  enabled: boolean;
  colSpan: 'col-span-1' | 'col-span-2' | 'col-span-3';
}

const DEFAULT_LAYOUT: WidgetConfig[] = [
  { id: 'risk', label: 'Risk Overview', enabled: true, colSpan: 'col-span-2' },
  { id: 'nudge', label: 'Nudge AI', enabled: true, colSpan: 'col-span-1' },
  { id: 'courses', label: 'Active Courses', enabled: true, colSpan: 'col-span-2' },
  { id: 'analytics', label: 'Engagement Analytics', enabled: true, colSpan: 'col-span-1' },
  { id: 'deadlines', label: 'Upcoming Deadlines', enabled: true, colSpan: 'col-span-1' },
  { id: 'compliance', label: 'Compliance Status', enabled: true, colSpan: 'col-span-1' },
];

const activityData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 85 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 90 },
  { day: 'Sun', score: 88 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { courses, loading, refreshData } = useCourses();
  const enrolledCourses = courses.filter(c => c.enrolled);

  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('dashboard_layout');
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
  });

  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    // Refresh data on mount to ensure SNow data is fresh
    if (serviceNow.isConnected()) {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleWidget = (id: WidgetId) => {
    const newWidgets = widgets.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    );
    setWidgets(newWidgets);
    localStorage.setItem('dashboard_layout', JSON.stringify(newWidgets));
  };

  // --- Widget Components ---

  const RiskWidget = () => (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Hello, {mockUser.name}</h2>
                <p className="text-slate-500 text-sm">Here is your Student Success Overview.</p>
            </div>
            {serviceNow.isConnected() && (
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-indigo-400 animate-ping' : 'bg-emerald-500'}`}></span>
                {loading ? 'Syncing...' : 'Live Data'}
                </div>
            )}
            </div>
            
            <div className="flex gap-8">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Score</p>
                <p className="text-3xl font-black text-slate-900">{mockRiskProfile.attendanceScore}%</p>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Level</p>
                <div className={`inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-xs font-bold border ${
                mockRiskProfile.overallRisk === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                mockRiskProfile.overallRisk === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                'bg-red-50 text-red-700 border-red-100'
                }`}>
                    <span className={`w-2 h-2 rounded-full ${
                    mockRiskProfile.overallRisk === 'Low' ? 'bg-emerald-500' : 
                    mockRiskProfile.overallRisk === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                    }`}></span>
                    {mockRiskProfile.overallRisk} Risk
                </div>
            </div>
            </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-50 to-transparent"></div>
    </div>
  );

  const NudgeWidget = () => (
    <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🤖</span>
                <h3 className="font-bold">Nudge AI</h3>
            </div>
            <p className="text-indigo-100 text-sm mb-6 flex-1">
                "{mockNudges[0].message}"
            </p>
            <button 
            onClick={() => navigate('/engagement')}
            className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-colors"
            >
                View All Nudges
            </button>
        </div>
    </div>
  );

  const CoursesWidget = () => (
    <div className="space-y-6 h-full">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">My Courses</h3>
            <button onClick={() => navigate('/courses')} className="text-sm font-semibold text-indigo-600 hover:underline">View Catalog</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading && enrolledCourses.length === 0 ? (
            // Loading Skeleton
            [1,2].map(i => (
                <div key={i} className="card-pro p-5 h-40 animate-pulse flex flex-col justify-between">
                    <div className="flex justify-between">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                    <div className="w-20 h-4 bg-slate-100 rounded"></div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full"></div>
                </div>
            ))
            ) : enrolledCourses.length > 0 ? (
            enrolledCourses.slice(0, 4).map(course => ( // Limit to 4 for widget view
                <div key={course.id} className="card-pro p-5 cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => navigate('/courses')}>
                <div className="flex items-start justify-between mb-4">
                    <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{course.category}</span>
                    </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-1 truncate">{course.title}</h4>
                <p className="text-xs text-slate-500 mb-4">{course.instructor}</p>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                        <span className="text-indigo-600">{course.progress}% Complete</span>
                        <span className="text-slate-400">{course.completedModules}/{course.totalModules} Mod</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                </div>
                </div>
            ))) : (
            <div className="col-span-2 bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center">
                <p className="text-slate-500 text-sm font-bold mb-2">No active enrollments.</p>
                <button onClick={() => navigate('/courses')} className="text-indigo-600 font-bold text-xs hover:underline">Browse the Catalog to enroll.</button>
            </div>
            )}
        </div>
    </div>
  );

  const AnalyticsWidget = () => (
    <div className="h-full flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Engagement Trend</h3>
        <div className="card-pro p-6 flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );

  const ComplianceWidget = () => (
    <div className="h-full flex flex-col">
       <h3 className="text-lg font-bold text-slate-800 mb-4 opacity-0 lg:block hidden">Compliance</h3> {/* Spacer title */}
       <div className="card-pro p-6 bg-slate-900 text-white border-none flex-1 flex flex-col justify-center">
            <h4 className="font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400"/> Compliance Status</h4>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Action Required</span>
            </div>
            <button onClick={() => navigate('/compliance')} className="w-full py-3 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">
                Complete Home Audit
            </button>
       </div>
    </div>
  );

  const DeadlinesWidget = () => {
    // Filter deadlines: In future, sort asc
    const upcoming = mockEvents
      .filter(e => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Deadlines</h3>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-1">
                {upcoming.length > 0 ? (
                    <div className="space-y-4">
                        {upcoming.map(e => (
                             <div key={e.id} className="flex items-center gap-3">
                                <div className="text-center bg-slate-50 p-2 rounded-lg border border-slate-100 min-w-[3.5rem]">
                                    <span className="block text-[10px] text-slate-400 uppercase font-bold">{new Date(e.date).toLocaleDateString('en-US', {month: 'short'})}</span>
                                    <span className="block text-xl font-black text-slate-900 leading-none">{new Date(e.date).getDate()}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{e.title}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                       <Clock className="w-3 h-3" /> {e.type}
                                    </p>
                                </div>
                             </div>
                        ))}
                        <button onClick={() => navigate('/calendar')} className="w-full mt-2 text-center text-xs font-bold text-indigo-600 hover:underline">View Calendar</button>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                        <CalendarIcon className="w-8 h-8 mb-2 opacity-50"/>
                        <p className="text-sm">No upcoming deadlines.</p>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
         <button 
           onClick={() => setIsCustomizing(true)}
           className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
         >
            <LayoutIcon className="w-4 h-4" /> Customize View
         </button>
      </div>
      
      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-fr">
         {widgets.map(widget => {
            if (!widget.enabled) return null;
            
            // Map IDs to Components
            let Component = null;
            switch(widget.id) {
                case 'risk': Component = RiskWidget; break;
                case 'nudge': Component = NudgeWidget; break;
                case 'courses': Component = CoursesWidget; break;
                case 'analytics': Component = AnalyticsWidget; break;
                case 'compliance': Component = ComplianceWidget; break;
                case 'deadlines': Component = DeadlinesWidget; break;
            }

            if (!Component) return null;

            return (
                <div key={widget.id} className={`lg:${widget.colSpan}`}>
                    <Component />
                </div>
            );
         })}
      </div>

      <AIConsultant />

      {/* Customization Modal */}
      {isCustomizing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Personalize Dashboard</h3>
                        <p className="text-xs text-slate-500">Toggle widgets to focus on what matters.</p>
                    </div>
                    <button onClick={() => setIsCustomizing(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                    {widgets.map(widget => (
                        <div 
                          key={widget.id} 
                          onClick={() => toggleWidget(widget.id)}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                              widget.enabled 
                              ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    widget.enabled ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <Grid className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${widget.enabled ? 'text-indigo-900' : 'text-slate-600'}`}>{widget.label}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{widget.colSpan.replace('col-span-', '')} Col Span</p>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                widget.enabled ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'
                            }`}>
                                {widget.enabled && <Check className="w-3 h-3 text-white" />}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <button onClick={() => setIsCustomizing(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
