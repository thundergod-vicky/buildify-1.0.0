import { UsersIcon, BookOpenIcon, CalendarIcon, MessageSquareIcon, AlertCircleIcon } from "lucide-react";
import StatCard from "../../stat-card";

export function AcademicHome() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-16 -mb-16 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-black uppercase tracking-[0.2em]">
              <div className="size-2 bg-green-400 rounded-full animate-ping" />
              Live Operations
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-urbanist leading-tight">
              Academic <br />
              <span className="text-blue-100">Operations Hub</span>
            </h1>
            <p className="text-blue-50/80 text-lg max-w-md font-medium leading-relaxed">
              Real-time synchronization of institutional schedules, faculty assignments, and student doubt resolution.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-xl flex flex-col items-center justify-center min-w-[140px] hover:scale-105 transition-transform duration-500 group">
              <span className="text-4xl font-black mb-1 group-hover:text-blue-200 transition-colors">24</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Today&apos;s Classes</span>
            </div>
            <div className="p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-xl flex flex-col items-center justify-center min-w-[140px] hover:scale-105 transition-transform duration-500 group">
              <span className="text-4xl font-black mb-1 group-hover:text-amber-200 transition-colors">156</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pending Doubts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Teachers"
          value="42"
          icon={UsersIcon}
          trend="8 currently live"
          trendType="positive"
          colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100/50"
        />
        <StatCard
          title="Avg. Resolve Time"
          value="14m"
          icon={MessageSquareIcon}
          trend="-2m since yesterday"
          trendType="positive"
          colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100/50"
        />
        <StatCard
          title="Student Engagement"
          value="94%"
          icon={BookOpenIcon}
          trend="+5% peak today"
          trendType="positive"
          colorClass="bg-amber-50 text-amber-600 border border-amber-100/50"
        />
        <StatCard
          title="System Health"
          value="Optimum"
          icon={AlertCircleIcon}
          trend="All services up"
          trendType="positive"
          colorClass="bg-sky-50 text-sky-600 border border-sky-100/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors" />
                  <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight">Upcoming Academic Milestones</h3>
                          <button className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-gray-400">
                              <CalendarIcon className="size-5" />
                          </button>
                      </div>
                      <div className="space-y-4">
                          {[
                              { title: "Term Assessment - Batch Alpha", date: "12th Oct 2026", type: "Examination", color: "blue" },
                              { title: "Parent Teacher Meeting - Grade 12", date: "15th Oct 2026", type: "Event", color: "purple" },
                              { title: "New Material Release - Organic Chemistry", date: "18th Oct 2026", type: "Release", color: "emerald" }
                          ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all duration-300 group/item">
                                  <div className="flex items-center gap-5">
                                      <div className={`size-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-500`}>
                                          <div className={`size-3 rounded-full bg-${item.color}-500 shadow-lg shadow-${item.color}-200`} />
                                      </div>
                                      <div>
                                          <p className="font-black text-gray-900">{item.title}</p>
                                          <div className="flex items-center gap-3 mt-1">
                                              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.date}</span>
                                              <span className={`px-3 py-1 bg-${item.color}-50 text-${item.color}-600 rounded-full text-[9px] font-black uppercase tracking-widest`}>{item.type}</span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="size-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-gray-300 group-hover/item:text-blue-600 group-hover/item:border-blue-100 transition-colors">
                                      <CalendarIcon className="size-4" />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
              <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight mb-4">Batch Health Status</h3>
                  <p className="text-sm text-gray-500 mb-8 font-medium">Real-time attendance and interaction tracking across all active batches.</p>
                  
                  <div className="space-y-8 flex-1">
                      {[
                        { name: "Batch Alpha (Medical)", percentage: 94, color: "blue" },
                        { name: "Batch Beta (Engineering)", percentage: 88, color: "indigo" },
                        { name: "Batch Delta (Foundation)", percentage: 76, color: "amber" }
                      ].map((batch, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-gray-900">{batch.name}</span>
                            <span className={`text-xs font-black text-${batch.color}-600`}>{batch.percentage}%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                            <div 
                              className={`h-full bg-gradient-to-r from-${batch.color}-400 to-${batch.color}-600 rounded-full transition-all duration-1000`} 
                              style={{ width: `${batch.percentage}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-10 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2rem] border border-blue-100/50">
                      <div className="flex items-center gap-3 mb-2">
                          <AlertCircleIcon className="size-4 text-blue-600" />
                          <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Operational Tip</p>
                      </div>
                      <p className="text-xs text-blue-800 leading-relaxed font-medium">Consider re-assigning <span className="font-black italic">Mrs. Sneha</span> to evening doubts for optimized resolution.</p>
                  </div>
              </div>
          </div>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic mx-auto block w-fit shadow-xl shadow-gray-200">
          Note: This is mock data for operational demonstration purposes
        </div>
      </div>
    </div>
  );
}
