
import React, { useState, useEffect } from 'react';
import { mockStudentsList } from '../store/mockStore';
import { generateStudentIntervention } from '../services/geminiService';
import { serviceNow } from '../services/serviceNowService';
import { StudentProfileFull } from '../types';

export const StudentInsights: React.FC = () => {
  const [students, setStudents] = useState<StudentProfileFull[]>(mockStudentsList);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (serviceNow.isConnected()) {
      setFetching(true);
      serviceNow.getStudents()
        .then(data => setStudents(data))
        .catch(err => console.error("Error fetching students", err))
        .finally(() => setFetching(false));
    }
  }, []);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleAnalyze = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const summary = `Student: ${selectedStudent.name}, GPA: ${selectedStudent.gpa}, Attendance: ${selectedStudent.attendance}%, Weakest Skill: ${selectedStudent.weakestSkill}`;
      const result = await generateStudentIntervention(summary);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      alert('AI Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">Student Insights AI</h2>
           <p className="text-slate-500">Deep-dive analysis to generate personalized intervention plans.</p>
        </div>
        {fetching && <span className="text-indigo-600 font-bold animate-pulse text-sm">Syncing Roster...</span>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student List */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-[600px] flex flex-col">
           <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Class Roster</h3>
           </div>
           <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {students.map(student => (
                 <div 
                   key={student.id} 
                   onClick={() => { setSelectedStudentId(student.id); setAnalysis(null); }}
                   className={`p-4 rounded-xl cursor-pointer transition-all border ${
                     selectedStudentId === student.id 
                       ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                       : 'hover:bg-slate-50 border-transparent'
                   }`}
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                          {student.avatar}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className={`text-xs font-bold ${student.gpa < 2.5 ? 'text-red-500' : 'text-emerald-600'}`}>GPA: {student.gpa}</p>
                       </div>
                    </div>
                 </div>
              ))}
              {students.length === 0 && !fetching && (
                <div className="p-4 text-center text-slate-400 text-sm">No students found.</div>
              )}
           </div>
        </div>

        {/* Analysis Panel */}
        <div className="lg:col-span-2">
           {selectedStudent ? (
             <div className="space-y-6">
                {/* Student Stats Header */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap gap-6 items-center">
                   <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-700">
                      {selectedStudent.avatar}
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedStudent.name}</h3>
                      <p className="text-slate-500 text-sm">Computer Science Major</p>
                   </div>
                   <div className="ml-auto flex gap-4">
                      <div className="text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Attendance</p>
                         <p className="text-xl font-bold text-slate-800">{selectedStudent.attendance}%</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Weakness</p>
                         <p className="text-xl font-bold text-red-500">{selectedStudent.weakestSkill}</p>
                      </div>
                   </div>
                </div>

                {/* AI Action Area */}
                {!analysis && (
                   <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🧠</div>
                      <h3 className="text-2xl font-bold mb-2">Generate Intervention Plan</h3>
                      <p className="text-indigo-100 mb-6 max-w-md mx-auto">
                         Use Gemini AI to analyze {selectedStudent.name}'s performance patterns and suggest specific teaching strategies.
                      </p>
                      <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
                      >
                         {loading ? 'Analyzing...' : 'Run Analysis'}
                      </button>
                   </div>
                )}

                {/* Analysis Result */}
                {analysis && (
                   <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                         <h3 className="font-bold flex items-center gap-2"><span>✨</span> AI Recommendation</h3>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            analysis.interventionLevel === 'High' ? 'bg-red-500' : 'bg-emerald-500'
                         }`}>
                            {analysis.interventionLevel} Priority
                         </span>
                      </div>
                      <div className="p-8 space-y-6">
                         <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Summary</h4>
                            <p className="text-slate-700 leading-relaxed font-medium">{analysis.summary}</p>
                         </div>
                         
                         <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Recommended Strategies</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {analysis.strategies?.map((s: any, i: number) => (
                                  <div key={i} className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                     <h5 className="font-bold text-indigo-900 mb-1">{s.title}</h5>
                                     <p className="text-xs text-indigo-700">{s.description}</p>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Draft Email to Student</h4>
                            <div className="bg-slate-50 p-6 rounded-2xl italic text-slate-600 text-sm border border-slate-200">
                               {analysis.emailDraft}
                            </div>
                            <button className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Copy to Clipboard</button>
                         </div>
                      </div>
                   </div>
                )}
             </div>
           ) : (
             <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p>Select a student to begin analysis</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
