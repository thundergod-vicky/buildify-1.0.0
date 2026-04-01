import { UsersIcon, BookOpenIcon, CalendarIcon, MessageSquareIcon, AlertCircleIcon } from "lucide-react";
import StatCard from "../../stat-card";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export function AcademicHome() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = auth.getToken();
        if (!token) return;
        const data = await api.get("/admin/academic/stats", token);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch academic stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="spinner scale-75"></div>
        <p className="text-gray-400 font-medium animate-pulse mt-4">Synchronizing hub data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 rounded-3xl md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-16 -mb-16 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-black uppercase tracking-[0.2em]">
              <div className="size-2 bg-green-400 rounded-full animate-ping" />
              Live Operations
            </div>
            <h1 className="text-2xl md:text-5xl font-black font-urbanist leading-tight">
              Academic <br />
              <span className="text-blue-100">Operations Hub</span>
            </h1>
            <p className="text-blue-50/80 text-sm md:text-lg max-w-md font-medium leading-relaxed">
              Real-time synchronization of institutional schedules, faculty assignments, and student doubt resolution.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="p-4 md:p-8 bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] border border-white/20 shadow-xl flex flex-col items-center justify-center min-w-[100px] md:min-w-[140px] hover:scale-105 transition-transform duration-500 group">
              <span className="text-2xl md:text-4xl font-black mb-1 group-hover:text-blue-200 transition-colors">
                {stats?.todayClasses || 0}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Today&apos;s Classes</span>
            </div>
            <div className="p-4 md:p-8 bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] border border-white/20 shadow-xl flex flex-col items-center justify-center min-w-[100px] md:min-w-[140px] hover:scale-105 transition-transform duration-500 group">
              <span className="text-2xl md:text-4xl font-black mb-1 group-hover:text-amber-200 transition-colors">
                {stats?.pendingDoubts || 0}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pending Doubts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Active Teachers"
          value={stats?.activeTeachers?.toString() || "0"}
          icon={UsersIcon}
          trend="+8 currently live"
          trendType="positive"
          colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100/50"
        />
        <StatCard
          title="Avg. Resolve Time"
          value={stats?.avgResolveTime || "14m"}
          icon={MessageSquareIcon}
          trend="-2m since yesterday"
          trendType="positive"
          colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100/50"
        />
        <StatCard
          title="Student Engagement"
          value={stats?.studentEngagement || "94%"}
          icon={BookOpenIcon}
          trend="+5% peak today"
          trendType="positive"
          colorClass="bg-amber-50 text-amber-600 border border-amber-100/50"
        />
        <StatCard
          title="System Health"
          value={stats?.systemHealth || "Optimum"}
          icon={AlertCircleIcon}
          trend="All services up"
          trendType="positive"
          colorClass="bg-sky-50 text-sky-600 border border-sky-100/50"
        />
      </div>

      <div className="grid grid-cols-1 gap-10">
          <div className="space-y-6 md:space-y-8">
              <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors" />
                  <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6 md:mb-8">
                          <h3 className="text-xl md:text-2xl font-black text-gray-900 font-urbanist tracking-tight">Upcoming Academic Milestones</h3>
                          <button className="p-2 md:p-3 bg-gray-50 rounded-xl md:rounded-2xl hover:bg-gray-100 transition-colors text-gray-400">
                              <CalendarIcon className="size-4 md:size-5" />
                          </button>
                      </div>
                      <div className="space-y-4">
                          {(stats?.milestones?.length > 0 ? stats.milestones : [
                              { title: "No upcoming milestones", date: "-", type: "None", color: "gray" }
                          ]).map((item: any, i: number) => (
                              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 bg-gray-50/50 rounded-2xl md:rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all duration-300 group/item gap-4">
                                  <div className="flex items-center gap-3 md:gap-5">
                                      <div className={`size-12 md:size-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-500 shrink-0`}>
                                          <div className={`size-2.5 md:size-3 rounded-full bg-${item.color}-500 shadow-lg shadow-${item.color}-200`} />
                                      </div>
                                      <div>
                                          <p className="font-black text-sm md:text-base text-gray-900">{item.title}</p>
                                          <div className="flex items-center gap-2 md:gap-3 mt-1">
                                              <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">{item.date}</span>
                                              <span className={`px-2 md:px-3 py-0.5 md:py-1 bg-${item.color}-50 text-${item.color}-600 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest`}>{item.type}</span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="hidden sm:flex size-10 bg-white rounded-xl items-center justify-center border border-gray-100 text-gray-300 group-hover/item:text-blue-600 group-hover/item:border-blue-100 transition-colors">
                                      <CalendarIcon className="size-4" />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
