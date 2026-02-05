
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, Plus } from 'lucide-react';
import { mockEvents } from '../store/mockStore';
import { CalendarEvent } from '../types';
import { useUser } from '../context/UserContext';
import { serviceNow } from '../services/serviceNowService';

export const Calendar: React.FC = () => {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);

  const isAdmin = user.role === 'admin' || user.role === 'teacher';

  useEffect(() => {
    if (serviceNow.isConnected()) {
      setLoading(true);
      serviceNow.getEvents(user.email)
        .then(data => setEvents(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user.email]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const daysArray = [...Array(daysInMonth + firstDayOfMonth).keys()];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
      return e.date.getDate() === day && 
             e.date.getMonth() === month && 
             e.date.getFullYear() === year;
    });
  };

  const addEvent = async () => {
     const newEvent: Partial<CalendarEvent> = {
        title: 'New Class Session',
        date: selectedDate,
        type: 'study',
        duration: '1h',
        description: 'Added by instructor'
     };

     if (serviceNow.isConnected()) {
       try {
         await serviceNow.createEvent(newEvent, user.email);
         // Refresh
         const updated = await serviceNow.getEvents(user.email);
         setEvents(updated);
       } catch (e) {
         console.error(e);
       }
     } else {
       setEvents([...events, { ...newEvent, id: Math.random().toString() } as CalendarEvent]);
     }
  };

  const getTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return 'bg-rose-500 text-white';
      case 'deadline': return 'bg-amber-500 text-white';
      case 'study': return 'bg-indigo-500 text-white';
      case 'social': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getTypeStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return 'border-l-rose-500 bg-rose-50';
      case 'deadline': return 'border-l-amber-500 bg-amber-50';
      case 'study': return 'border-l-indigo-500 bg-indigo-50';
      case 'social': return 'border-l-emerald-500 bg-emerald-50';
      default: return 'border-l-slate-500 bg-slate-50';
    }
  };

  const selectedDayEvents = events.filter(e => 
    e.date.getDate() === selectedDate.getDate() && 
    e.date.getMonth() === selectedDate.getMonth() &&
    e.date.getFullYear() === selectedDate.getFullYear()
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] animate-in fade-in duration-500">
      
      {/* Main Calendar Section */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <CalIcon className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800">{monthNames[month]} {year}</h2>
               <div className="flex items-center gap-2">
                 <p className="text-xs text-slate-500 font-medium">Academic Schedule</p>
                 {loading && <span className="text-[10px] text-indigo-500 animate-pulse">Syncing...</span>}
               </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
               <ChevronRight className="w-5 h-5" />
             </button>
             <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg ml-2 hover:bg-slate-800">Today</button>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-slate-100 gap-px border-b border-slate-200">
           {daysArray.map((i) => {
             const dayNumber = i - firstDayOfMonth + 1;
             if (dayNumber <= 0) return <div key={i} className="bg-white/50"></div>;
             
             const isToday = new Date().toDateString() === new Date(year, month, dayNumber).toDateString();
             const isSelected = selectedDate.getDate() === dayNumber && selectedDate.getMonth() === month;
             const dayEvents = getEventsForDay(dayNumber);

             return (
               <div 
                 key={i} 
                 onClick={() => setSelectedDate(new Date(year, month, dayNumber))}
                 className={`bg-white p-2 min-h-[100px] relative group cursor-pointer transition-all hover:bg-slate-50 ${isSelected ? 'bg-indigo-50/30' : ''}`}
               >
                 <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700'}`}>
                   {dayNumber}
                 </span>
                 
                 <div className="space-y-1">
                   {dayEvents.map(event => (
                     <div key={event.id} className={`text-[10px] px-2 py-1 rounded-md font-bold truncate ${getTypeColor(event.type)}`}>
                        {event.title}
                     </div>
                   ))}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* Side Panel: Selected Day & Upcoming */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        
        {/* Selected Day Detail */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col">
           <div className="flex items-center justify-between mb-6">
             <div>
                <h3 className="text-3xl font-bold text-slate-900">{selectedDate.getDate()}</h3>
                <p className="text-slate-500 font-medium uppercase tracking-wider text-xs">{monthNames[selectedDate.getMonth()]}, {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
             </div>
             {isAdmin && (
               <button 
                 onClick={addEvent}
                 className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 hover:shadow-lg transition-all"
               >
                 <Plus className="w-5 h-5"/>
               </button>
             )}
           </div>

           <div className="flex-1 space-y-3 overflow-y-auto">
             {selectedDayEvents.length > 0 ? selectedDayEvents.map(event => (
               <div key={event.id} className={`p-4 rounded-2xl border-l-4 ${getTypeStyle(event.type)} transition-transform hover:scale-[1.02] cursor-default`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{event.type}</span>
                    {event.duration && (
                      <div className="flex items-center gap-1 text-xs font-bold opacity-60">
                        <Clock className="w-3 h-3" />
                        {event.duration}
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{event.title}</h4>
                  {event.description && <p className="text-xs text-slate-500 line-clamp-2">{event.description}</p>}
               </div>
             )) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <div className="text-4xl mb-2">☕</div>
                  <p className="text-sm font-bold">No events scheduled.</p>
                  <p className="text-xs">Enjoy your free time!</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
