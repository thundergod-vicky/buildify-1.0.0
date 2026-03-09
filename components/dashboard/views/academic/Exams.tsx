"use client";

import { CalendarIcon, ShieldCheckIcon, AlertTriangleIcon, SearchIcon } from "lucide-react";

export function ExamSchedules() {
  const exams = [
    { title: "Mid-Term Assessment 2026", batch: "Batch Alpha", date: "Oct 20, 2026", status: "scheduled", color: "indigo" },
    { title: "Quarterly Evaluation", batch: "Batch Beta", date: "Oct 25, 2026", status: "planned", color: "purple" },
    { title: "Mock JEE - Full Length", batch: "All Advanced", date: "Nov 02, 2026", status: "draft", color: "sky" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Exam Schedules</h1>
          <p className="text-gray-500 font-medium">Manage and monitor institutional examination timelines and proctoring</p>
        </div>
        <button className="bg-gray-900 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all hover:-translate-y-1">Create New Slot</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {exams.map((exam, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group hover:scale-[1.03] transition-all duration-500">
                  <div className={`absolute top-0 right-0 w-48 h-48 -mr-24 -mt-24 bg-${exam.color}-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className={`size-14 bg-${exam.color}-50 text-${exam.color}-600 rounded-2xl flex items-center justify-center shadow-inner border border-${exam.color}-100/50 group-hover:rotate-12 transition-transform duration-500`}>
                          <CalendarIcon className="size-6" />
                      </div>
                      <span className={`px-4 py-1.5 bg-${exam.color}-50 text-${exam.color}-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em]`}>{exam.status}</span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-2 relative z-10 leading-tight">{exam.title}</h3>
                  <p className="text-sm text-gray-400 mb-10 relative z-10 font-medium">Targeted for <span className="text-gray-900 font-black italic">{exam.batch}</span></p>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-gray-50 relative z-10">
                      <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center">
                            <ShieldCheckIcon className="size-3.5 text-emerald-500" />
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registry Locked</span>
                      </div>
                      <span className="text-xs font-black text-gray-900 font-mono tracking-tight">{exam.date}</span>
                  </div>
              </div>
          ))}
      </div>

      <div className="bg-gray-900 text-white p-12 rounded-[4rem] shadow-2xl shadow-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-64 -mt-64" />
          
          <div className="relative z-10 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                <div className="space-y-1">
                    <h3 className="text-3xl font-black font-urbanist tracking-tight italic uppercase">Proctoring Control</h3>
                    <p className="text-blue-100/40 text-xs font-black uppercase tracking-[0.4em]">Integrated Intelligence</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                        <div className="size-2 bg-emerald-400 rounded-full animate-ping" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Systems Nominal</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] group hover:bg-white/10 transition-colors duration-500">
                    <div className="flex items-start gap-8">
                        <div className="size-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-2xl shadow-rose-500/10">
                            <AlertTriangleIcon className="size-8" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-rose-100">Anomaly Detected</p>
                            <p className="text-sm text-blue-100/40 leading-relaxed font-medium">Session <span className="text-white italic">#PRO-442</span> requires manual audit due to persistent sync fragmentation. <br /> Grade: Critial Review</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] group hover:bg-white/10 transition-colors duration-500">
                    <div className="flex items-start gap-8">
                        <div className="size-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                            <SearchIcon className="size-8" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-blue-100">Personnel Status</p>
                            <p className="text-sm text-blue-100/40 leading-relaxed font-medium">Invigilator assignment at <span className="text-white italic">66%</span> capacity. 4 slots remain unassigned for the upcoming JEE Mock cycle.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic mx-auto block w-fit shadow-xl shadow-gray-100">
          Note: Mock examination registry for demonstration
        </div>
      </div>
    </div>
  );
}
