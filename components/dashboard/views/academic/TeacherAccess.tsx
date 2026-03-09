import { useState, useEffect } from "react";
import { ShieldCheckIcon, StarIcon, SearchIcon, MoreHorizontalIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";

export function TeacherAccess() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await api.get<any[]>("/users/teachers", localStorage.getItem("token") || "");
        setTeachers(data);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const calculateTenure = (createdAt: string) => {
    const years = new Date().getFullYear() - new Date(createdAt).getFullYear();
    return years <= 0 ? "New Faculty" : `${years} Yrs`;
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2Icon className="size-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Faculty Intelligence</h1>
          <p className="text-gray-500 font-medium">Real-time faculty deployment, expertise mapping, and departmental audits</p>
        </div>
        <div className="flex gap-4">
             <div className="relative group">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <input type="text" placeholder="Search faculty..." className="pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-100 focus:w-80 transition-all font-black text-xs uppercase tracking-widest shadow-sm" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((t, i) => {
              const subject = t.coursesOwned?.[0]?.title || "General Faculty";
              const tenure = calculateTenure(t.createdAt);
              const status = t.batchesTaught?.length > 0 ? "In Session" : "Available";
              const color = status === "Available" ? "emerald" : "blue";
              
              return (
              <div key={t.id} className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-${color}-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                  
                  <div className="size-28 rounded-[2.5rem] overflow-hidden border-8 border-gray-50 mb-8 group-hover:border-white group-hover:rotate-6 transition-all duration-500 shadow-inner relative z-10 p-2 bg-white">
                      <Image 
                        src={t.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.id}`} 
                        alt="teacher" 
                        fill 
                        className="object-cover p-2" 
                      />
                  </div>
                  
                  <div className="mb-8 relative z-10">
                      <h3 className="text-xl font-black text-gray-900 mb-2 font-urbanist leading-tight">{t.name}</h3>
                      <p className={`text-[10px] text-${color}-600 font-black uppercase tracking-[0.2em] bg-${color}-50 px-4 py-1.5 rounded-full inline-block`}>{subject}</p>
                  </div>

                  <div className="flex items-center gap-8 w-full py-8 border-y border-gray-50 mb-8 relative z-10">
                      <div className="flex-1">
                          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] mb-1">Tenure</p>
                          <p className="font-black text-gray-900 text-sm italic">{tenure}</p>
                      </div>
                      <div className="flex-1 border-l border-gray-100">
                          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] mb-1">Index</p>
                          <div className="flex items-center justify-center gap-1.5">
                              <span className="font-black text-gray-900 text-sm tracking-tighter">{(4.5 + Math.random() * 0.5).toFixed(1)}</span>
                              <StarIcon className="size-3 text-amber-400 fill-amber-400" />
                          </div>
                      </div>
                  </div>

                  <div className="w-full flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-2">
                           <div className={`size-2 rounded-full animate-pulse bg-${color}-500`} />
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{status}</span>
                       </div>
                       <button className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-sm rounded-[1.25rem] transition-all">
                           <MoreHorizontalIcon className="size-5" />
                       </button>
                  </div>
              </div>
          )})}
      </div>

      <div className="bg-gray-900 text-white p-12 rounded-[4rem] shadow-2xl shadow-blue-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-64 -mt-64" />
          
          <div className="size-36 bg-white/5 backdrop-blur-3xl rounded-[3rem] flex items-center justify-center shrink-0 shadow-2xl shadow-black/20 border border-white/10 group-hover:rotate-12 transition-transform duration-700">
              <ShieldCheckIcon className="size-16 text-blue-400" />
          </div>
          <div className="flex-1 space-y-4 relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20">
                <div className="size-1.5 bg-blue-400 rounded-full animate-ping" />
                Auth Registry #224
              </div>
              <h3 className="text-3xl font-black font-urbanist tracking-tight italic uppercase">Access Audit & Governance</h3>
              <p className="text-blue-100/40 leading-relaxed max-w-2xl font-medium">Faculty assigned to the <span className="text-white italic">Core Mathematics</span> division have Been granted elevated clearance for OMR template serialization. Periodic registry audits Recommended.</p>
          </div>
          <button className="bg-white text-gray-900 px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-400 hover:text-white transition-all shadow-2xl shadow-black relative z-10 active:scale-95">Commit Audit</button>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic mx-auto block w-fit shadow-xl shadow-gray-100">
          Note: Strategic faculty mapping for institutional control
        </div>
      </div>
    </div>
  );
}
