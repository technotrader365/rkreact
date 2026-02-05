
import React, { useState } from 'react';
import { useCourses } from '../context/CourseContext';
import { useUser } from '../context/UserContext';
import { Course } from '../types';
import { Search, Users, Star, Edit, Check } from 'lucide-react';

export const Courses: React.FC = () => {
  const { courses, enroll, markModuleComplete } = useCourses();
  const { user } = useUser();
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [view, setView] = useState<'my-courses' | 'catalog'>('my-courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const isAdmin = user.role === 'admin' || user.role === 'teacher';

  // Filter logic
  const filteredCourses = (view === 'my-courses' 
    ? courses.filter(c => isAdmin ? true : c.enrolled) // Admins see all in "My Courses" view contextually or just all managed courses
    : [...courses].sort((a, b) => (b.recommended === a.recommended) ? 0 : b.recommended ? 1 : -1)
  ).filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = (courseId: string) => {
    enroll(courseId);
    const updatedCourse = courses.find(c => c.id === courseId);
    if (updatedCourse) setActiveCourse({ ...updatedCourse, enrolled: true });
  };

  const saveEdit = () => {
    setEditingId(null);
    // In real app, dispatch update to context/backend
  };

  if (activeCourse) {
    const isEnrolled = activeCourse.enrolled;
    const currentCourseState = courses.find(c => c.id === activeCourse.id) || activeCourse;

    return (
      <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in">
        {/* Course Player - Sidebar */}
        <div className="w-80 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50">
              <button onClick={() => setActiveCourse(null)} className="text-xs font-bold text-slate-500 hover:text-indigo-600 mb-2">← Back to {view === 'my-courses' ? 'My Courses' : 'Catalog'}</button>
              <h3 className="font-bold text-slate-900">{currentCourseState.title}</h3>
              {isEnrolled && (
                <div className="mt-3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 transition-all duration-500" style={{width: `${currentCourseState.progress}%`}}></div>
                </div>
              )}
           </div>
           <div className="flex-1 overflow-y-auto">
              {[1, 2, 3, 4, 5].map((m) => {
                const isCompleted = m <= currentCourseState.completedModules;
                return (
                 <div key={m} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${m === currentCourseState.completedModules + 1 ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'opacity-70'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Module {m}</p>
                      {isCompleted && <span className="text-emerald-500 text-xs font-bold">✓</span>}
                    </div>
                    <p className="text-sm font-medium text-slate-800">Concept Deep Dive</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-100 text-slate-500">Video • 10m</span>
                       {isAdmin && <span className="text-[10px] text-indigo-600 font-bold ml-auto">Edit</span>}
                    </div>
                 </div>
              )})}
              {isAdmin && (
                <div className="p-4 text-center border-t border-slate-100">
                   <button className="text-xs font-bold text-indigo-600">+ Add Module</button>
                </div>
              )}
           </div>
        </div>

        {/* Course Player - Content */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col relative overflow-hidden">
           {/* Admin Banner */}
           {isAdmin && (
             <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white text-xs font-bold text-center py-1 z-20">
               Admin View - Editing Mode Enabled
             </div>
           )}

           {!isEnrolled && !isAdmin && (
             <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex items-center justify-center p-12 text-center">
                <div className="max-w-lg bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
                   <h2 className="text-2xl font-bold text-slate-900 mb-4">Enroll to Start Learning</h2>
                   <p className="text-slate-500 mb-8">{currentCourseState.description}</p>
                   <button 
                     onClick={() => handleEnroll(currentCourseState.id)}
                     className="btn-primary px-8 py-3 rounded-xl text-sm w-full"
                   >
                     Enroll Now
                   </button>
                </div>
             </div>
           )}

           <div className="aspect-video bg-slate-900 rounded-xl mb-8 flex items-center justify-center relative overflow-hidden group">
              <img src={currentCourseState.thumbnail} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              {isEnrolled || isAdmin ? (
                <button className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl pl-1 border-2 border-white hover:scale-110 transition-transform">
                   ▶
                </button>
              ) : (
                <div className="relative z-10 text-white font-bold tracking-widest uppercase">Preview Locked</div>
              )}
           </div>
           <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Module {currentCourseState.completedModules + 1}: Core Fundamentals</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                 {currentCourseState.description} In this lesson, we cover the foundational elements required to pass the final assessment. 
                 Please ensure you have reviewed the reading materials before starting the video.
              </p>
              
              {!isAdmin && isEnrolled && (
                <div className="flex gap-4">
                   <button 
                     onClick={() => markModuleComplete(currentCourseState.id)}
                     className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                       currentCourseState.completedModules >= currentCourseState.totalModules 
                       ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                       : 'btn-primary'
                     }`}
                     disabled={currentCourseState.completedModules >= currentCourseState.totalModules}
                   >
                     {currentCourseState.completedModules >= currentCourseState.totalModules ? 'Course Completed!' : 'Mark Module Complete'}
                   </button>
                </div>
              )}
              
              {isAdmin && (
                 <div className="flex gap-4">
                    <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black">Upload New Video</button>
                    <button className="px-6 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">Edit Description</button>
                 </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col xl:flex-row justify-between items-end gap-6">
         <div>
            <h2 className="text-3xl font-bold text-slate-900">
               {isAdmin ? 'Course Manager' : 'Learning Center'}
            </h2>
            <p className="text-slate-500 mt-1">
               {isAdmin ? 'Manage your curriculum and content.' : 'Access your enrolled courses or explore new skills.'}
            </p>
         </div>
         <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Search courses..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
               />
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
               <button 
                 onClick={() => setView('my-courses')}
                 className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'my-courses' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {isAdmin ? 'Managed Courses' : 'My Courses'}
               </button>
               {!isAdmin && (
                <button 
                  onClick={() => setView('catalog')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'catalog' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Browse Catalog
                </button>
               )}
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredCourses.length > 0 ? filteredCourses.map(course => (
            <div key={course.id} className="card-pro group overflow-hidden flex flex-col h-full relative transform transition-all hover:scale-[1.02]">
               
               <div className="h-40 relative p-6 flex flex-col justify-between transition-all group-hover:h-32">
                  <div className="absolute inset-0">
                     <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/20"></div>
                  </div>
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit border border-white/20">
                       {course.category}
                    </span>
                  </div>
                  {isAdmin && editingId === course.id ? (
                     <div className="relative z-10 bg-white p-2 rounded-lg flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Editing...</span>
                        <button onClick={saveEdit} className="p-1 bg-emerald-500 text-white rounded"><Check className="w-3 h-3"/></button>
                     </div>
                  ) : (
                    <div className="relative z-10 h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-xl text-white border border-white/20">
                       🎓
                    </div>
                  )}
               </div>
               
               <div className="p-6 flex-1 flex flex-col relative">
                  {isAdmin && editingId === course.id ? (
                    <input className="font-bold text-lg mb-2 border rounded p-1 w-full" defaultValue={course.title} />
                  ) : (
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex justify-between items-start">
                       {course.title}
                       {isAdmin && (
                          <button onClick={(e) => { e.stopPropagation(); setEditingId(course.id); }} className="text-slate-400 hover:text-indigo-600">
                             <Edit className="w-4 h-4"/>
                          </button>
                       )}
                    </h3>
                  )}
                  
                  <p className="text-sm text-slate-500 mb-2">by {course.instructor}</p>
                  
                  {/* Rating and Enrollment Stats */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-4 group-hover:opacity-50 transition-opacity">
                     {course.rating && (
                       <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{course.rating}</span>
                       </div>
                     )}
                     {course.studentsEnrolled && (
                       <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.studentsEnrolled.toLocaleString()} Students</span>
                       </div>
                     )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-6 leading-relaxed group-hover:opacity-0 transition-opacity">{course.description}</p>
                  
                  {/* Hover Overlay Content */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 bg-white/95 backdrop-blur-xl border-t border-indigo-50 p-6 transition-transform duration-300 z-10 flex flex-col h-2/3">
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
                       {course.enrolled ? 'Next Lesson' : 'Skills You\'ll Gain'}
                     </p>
                     
                     {course.enrolled ? (
                       <p className="text-sm font-bold text-slate-800 mb-3">{course.nextLesson}</p>
                     ) : (
                       <div className="flex flex-wrap gap-2 mb-3">
                         {course.skills?.map((skill, i) => (
                           <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100">
                             {skill}
                           </span>
                         ))}
                       </div>
                     )}
                     
                     <button 
                        onClick={(e) => { e.stopPropagation(); setActiveCourse(course); }}
                        className="mt-auto w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
                     >
                        {isAdmin ? 'Manage Content' : (course.enrolled ? 'Resume Learning' : 'View Course Details')}
                     </button>
                  </div>

                  <div className="mt-auto group-hover:opacity-0 transition-opacity">
                     {isAdmin ? (
                        <div className="flex gap-2">
                           <button onClick={() => setActiveCourse(course)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200">Manage</button>
                           <button className="flex-1 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-100">Analytics</button>
                        </div>
                     ) : course.enrolled ? (
                       <>
                         <div className="flex justify-between items-end mb-2">
                            <div className="text-xs">
                               <span className="font-bold text-slate-800">{course.completedModules}</span>
                               <span className="text-slate-400">/{course.totalModules} Modules</span>
                            </div>
                            <span className="text-xs font-bold text-indigo-600">{course.progress}%</span>
                         </div>
                         <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-indigo-500 transition-all duration-500" style={{width: `${course.progress}%`}}></div>
                         </div>
                         <button 
                           onClick={() => setActiveCourse(course)}
                           className="w-full py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-sm"
                         >
                            {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                         </button>
                       </>
                     ) : (
                       <button 
                         onClick={() => setActiveCourse(course)}
                         className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all text-sm ${
                           course.recommended 
                             ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-200 hover:shadow-indigo-300' 
                             : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
                         }`}
                       >
                          {course.recommended ? 'Start Recommended Path' : 'View & Enroll'}
                       </button>
                     )}
                  </div>
               </div>
            </div>
         )) : (
            <div className="col-span-3 text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <p className="text-slate-400 font-bold mb-4">No courses found matching your search.</p>
               <button onClick={() => setSearchQuery('')} className="text-indigo-600 font-bold underline">Clear Search</button>
            </div>
         )}
      </div>
    </div>
  );
};
