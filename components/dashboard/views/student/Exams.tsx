"use client";

import { useState, useEffect } from "react";
import { 
  CalendarIcon, 
  PlayIcon, 
  ClockIcon, 
  TrophyIcon, 
  AlertCircleIcon,
  TimerIcon,
  ChevronRightIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { showToast } from "@/lib/toast";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  status: 'PLANNED' | 'SCHEDULED';
  startTime: string;
  endTime: string;
  duration: number;
  batch: { name: string };
  results: any[];
}

export function StudentExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchExams();
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchExams = async () => {
    try {
      const token = auth.getToken();
      const data = await api.get<Exam[]>('/exams/student', token || undefined);
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExamStatus = (exam: Exam) => {
    if (exam.results?.length > 0) return 'COMPLETED';
    
    if (exam.status === 'PLANNED' && (!exam.startTime || !exam.endTime)) {
        return 'UPCOMING';
    }

    const start = exam.startTime ? new Date(exam.startTime) : null;
    const end = exam.endTime ? new Date(exam.endTime) : null;

    if (!start || !end) return 'UPCOMING';

    const accessStart = new Date(start.getTime() - 5 * 60000);

    if (now > end) return 'EXPIRED';
    if (now >= accessStart && now <= end) return 'AVAILABLE';
    return 'UPCOMING';
  };

  const getTimeLeft = (exam: Exam) => {
    if (!exam.startTime) return null;
    const start = new Date(exam.startTime);
    const diff = start.getTime() - now.getTime();
    if (diff <= 0) return null;

    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  if (isLoading) return <div className="p-8">Loading Exams...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight italic uppercase">My Exams</h1>
        <p className="text-gray-500 font-medium">Access your scheduled assessments and view results</p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-gray-100">
           <CalendarIcon className="size-16 text-gray-200 mx-auto mb-6" />
           <p className="text-xl font-black text-gray-400 uppercase tracking-widest">No scheduled exams</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {exams.map(exam => {
             const status = getExamStatus(exam);
             const timeLeft = getTimeLeft(exam);
             
             return (
               <div key={exam.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`size-14 rounded-2xl flex items-center justify-center shadow-inner border ${status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                       <PlayIcon className="size-6" />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
                        status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' :
                        status === 'UPCOMING' ? 'bg-blue-50 text-blue-600' :
                        status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-rose-50 text-rose-600'
                    }`}>
                        {status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{exam.title}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 italic">{exam.batch.name}</p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="size-4" /> 
                            <span>Duration</span>
                        </div>
                        <span className="text-gray-900">{exam.duration} Minutes</span>
                    </div>

                    {status === 'UPCOMING' && timeLeft && (
                        <div className="flex items-center justify-between text-xs font-bold text-blue-600 bg-blue-50 p-4 rounded-2xl animate-pulse">
                            <div className="flex items-center gap-2">
                                <TimerIcon className="size-4" /> 
                                <span>Starts In</span>
                            </div>
                            <span>{timeLeft}</span>
                        </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                     <div className="text-left">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Schedule</p>
                        <p className="text-xs font-black text-gray-900 font-mono tracking-tighter">
                            {new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(exam.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </div>
                     <button 
                        disabled={status !== 'AVAILABLE'}
                        onClick={() => window.location.href = `/dashboard?view=take-exam&id=${exam.id}`}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            status === 'AVAILABLE' 
                            ? 'bg-gray-900 text-white shadow-xl hover:bg-black hover:scale-105' 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                     >
                        {status === 'COMPLETED' ? 'View Result' : 'Enter Exam'}
                        <ChevronRightIcon className="size-3" />
                     </button>
                  </div>
               </div>
             )
           })}
        </div>
      )}
    </div>
  );
}
