"use client";

import { MessageSquareIcon, SearchIcon, FilterIcon, ClockIcon } from "lucide-react";

export function DoubtAccess() {
  const unresolved = [
    { student: "Rahul Jain", subject: "Organic Chemistry", query: "Mechanism of Aldol Condensation explaining the step-by-step formation of enolate ion...", time: "2h ago", priority: "high", color: "amber" },
    { student: "Sanjana Roy", subject: "Physics", query: "Why is the work done by internal forces zero in a perfectly rigid body system?", time: "5h ago", priority: "medium", color: "indigo" },
    { student: "Amit Singh", subject: "Mathematics", query: "Steps to solve differential equations using variable separable method in a complex plane.", time: "1d ago", priority: "low", color: "emerald" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Doubt Governance</h1>
          <p className="text-gray-500 font-medium">Oversee student inquiries and faculty resolution latency</p>
        </div>
        <div className="flex gap-4">
            <div className="relative group">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                <input type="text" placeholder="Subject filter..." className="pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-100 transition-all font-black text-xs uppercase tracking-widest shadow-sm w-64" />
            </div>
            <button className="p-5 bg-white border border-gray-100 rounded-[1.5rem] text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                <FilterIcon className="size-5" />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-100/50">
          <div className="p-10 border-b border-gray-50 bg-gray-50/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                    <MessageSquareIcon className="size-5" />
                </div>
                <h3 className="text-xl font-black text-gray-900 font-urbanist">Unresolved Backlog</h3>
              </div>
              <span className="px-6 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 shadow-sm">{unresolved.length} Active Queries</span>
          </div>

          <div className="divide-y divide-gray-50">
              {unresolved.map((d, i) => (
                  <div key={i} className="p-10 hover:bg-gray-50/50 transition-all duration-500 group">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                          <div className="flex items-center gap-6">
                              <div className="size-16 bg-gray-100 rounded-[1.5rem] border-4 border-white overflow-hidden shadow-inner group-hover:rotate-6 transition-transform">
                                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-200" />
                              </div>
                              <div className="space-y-1">
                                  <h4 className="text-lg font-black text-gray-900 font-urbanist">{d.student}</h4>
                                  <div className="flex items-center gap-3">
                                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{d.subject}</span>
                                      <div className="size-1 bg-gray-200 rounded-full" />
                                      <div className="flex items-center gap-1.5 opacity-60">
                                          <ClockIcon className="size-3 text-gray-400" />
                                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.time}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                             <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.25em] shadow-sm ${
                                 d.priority === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                 d.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                             }`}>{d.priority} Priority</span>
                          </div>
                      </div>
                      
                      <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-indigo-100/50 transition-all duration-700 relative overflow-hidden ring-8 ring-transparent group-hover:ring-gray-50/50 mb-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-gray-700 text-lg leading-relaxed font-medium relative z-10 italic">
                            &quot;{d.query}&quot;
                        </p>
                      </div>

                      <div className="flex items-center justify-end">
                          <button className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-gray-200 flex items-center gap-3">
                             Allocate Specialist
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic mx-auto block w-fit shadow-xl shadow-gray-100">
          Note: Operational doubt registry for supervision
        </div>
      </div>
    </div>
  );
}
