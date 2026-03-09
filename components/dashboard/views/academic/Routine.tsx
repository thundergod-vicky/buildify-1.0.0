"use client";

import { ClockIcon, MapPinIcon, MoreVerticalIcon } from "lucide-react";

export function ClassRoutine() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const routine = [
    { time: "09:00 AM - 10:30 AM", subject: "Advanced Mathematics", teacher: "Dr. Sharma", batch: "Alpha-1", room: "302", type: "Lecture" },
    { time: "11:00 AM - 12:30 PM", subject: "Quantum Physics", teacher: "Mrs. Verma", batch: "Alpha-2", room: "Labs", type: "Practical" },
    { time: "02:00 PM - 03:30 PM", subject: "Artificial Intelligence", teacher: "Mr. Basu", batch: "Beta-1", room: "IT-01", type: "Workshop" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Classes Routine</h1>
          <p className="text-gray-500 font-medium">Synchronized institutional schedule and faculty assignments</p>
        </div>
        <div className="flex gap-3">
            <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">Export PDF</button>
            <button className="px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">Config</button>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] border border-gray-100 shadow-sm inline-flex gap-2 overflow-x-auto max-w-full minimal-scrollbar">
          {days.map((day) => (
              <button 
                key={day} 
                className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${day === "Monday" ? "bg-gray-900 text-white shadow-xl shadow-gray-300" : "bg-transparent text-gray-400 hover:text-gray-900"}`}
              >
                  {day}
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {routine.map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-lg shadow-gray-100/50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="size-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 text-blue-600 rounded-[1.75rem] flex items-center justify-center shadow-inner border border-blue-100 group-hover:rotate-6 transition-transform duration-500">
                <ClockIcon className="size-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full">{item.type}</span>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.time}</p>
                </div>
                <h3 className="text-2xl font-black text-gray-900 font-urbanist">{item.subject}</h3>
              </div>
            </div>

            <div className="flex flex-wrap gap-10 lg:gap-16 relative z-10">
                <div className="space-y-2">
                    <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">Lead Faculty</p>
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-gray-100 rounded-full border border-white" />
                        <p className="font-black text-gray-700 text-sm italic">{item.teacher}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">Target Batch</p>
                    <p className="font-black text-indigo-600 text-sm px-4 py-1.5 bg-indigo-50/50 rounded-xl border border-indigo-100/30">{item.batch}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">Session Venue</p>
                    <div className="flex items-center gap-2 font-black text-gray-700 text-sm">
                        <div className="size-6 bg-rose-50 rounded-lg flex items-center justify-center">
                            <MapPinIcon className="size-3 text-rose-500" />
                        </div>
                        Room {item.room}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <button className="px-6 py-3 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">Details</button>
                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreVerticalIcon className="size-5" />
                </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic mx-auto block w-fit shadow-sm">
          Note: Mock routine for session planning demonstration
        </div>
      </div>
    </div>
  );
}
