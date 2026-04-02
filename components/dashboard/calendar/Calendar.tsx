"use client";

import { useState, useEffect } from "react";
import { 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    GraduationCapIcon,
    LayoutGridIcon,
    ListIcon,
    Edit3Icon
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { Batch } from "@/types";
import { CreateSessionModal } from "../views/academic/CreateSessionModal";

interface Event {
    id: string;
    title: string;
    type: 'CLASS' | 'TEST';
    date: Date;
    time: string;
    location?: string;
    teacher?: string;
    description?: string;
    batch?: string;
    batchId?: string;
    subjectId?: string;
    teacherId?: string;
    startTime?: string;
    endTime?: string;
    isOnline?: boolean;
    meetingUrl?: string;
    meetingId?: string;
    meetingPasscode?: string;
    webinarId?: string;
  recordingUrl?: string;
  recordingPasscode?: string;
  recordings?: any[];
}

export function Calendar({ mode = 'student' }: { mode?: 'student' | 'teacher' | 'operations' }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [view, setView] = useState<'month' | 'year' | 'day' | 'decade'>('month');
    const [decadeStart, setDecadeStart] = useState(new Date().getFullYear() - 4);
    
    // States for editing
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<any>(null);
    const [batches, setBatches] = useState<Batch[]>([]);


    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const fetchEvents = () => {
        let endpoint: string;
        if (mode === 'teacher') {
            endpoint = '/class-sessions/my-sessions';
        } else if (mode === 'operations') {
            endpoint = '/class-sessions';
        } else {
            endpoint = '/class-sessions/student-sessions';
        }
        api.get<any[]>(endpoint, auth.getToken() || '').then(res => {
            const mappedEvents = res.map(r => ({
                id: r.id as string,
                title: r.title as string,
                type: 'CLASS' as const,
                date: new Date(r.date as string),
                time: `${r.startTime} - ${r.endTime}`,
                startTime: r.startTime,
                endTime: r.endTime,
                location: (r.venue as string) ?? undefined,
                teacher: (r.teacher as { name?: string })?.name,
                teacherId: r.teacherId,
                batch: (r.batch as { name?: string })?.name,
                batchId: r.batchId,
                subjectId: r.subjectId,
                description: r.type as string,
                isOnline: r.isOnline as boolean,
                meetingUrl: r.meetingUrl as string,
                meetingId: r.meetingId as string,
                meetingPasscode: r.meetingPasscode as string,
                webinarId: r.webinarId as string,
                recordingUrl: r.recordingUrl as string,
                recordingPasscode: r.recordingPasscode as string,
                recordings: r.recordings as any[],
                venue: r.venue,
            }));
            setEvents(mappedEvents);
        }).catch(console.error);
    };

    useEffect(() => {
        fetchEvents();

        if (mode === 'teacher' || mode === 'operations') {
            const token = auth.getToken() || "";
            api.get<Batch[]>("/batches", token).then(res => {
                setBatches(res);
            }).catch(console.error);
        }
    }, [mode, fetchEvents]);

    const renderHeader = () => {
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-white border-b border-gray-100 rounded-t-[2.5rem] gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="size-10 sm:size-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                        <CalendarIcon className="size-5 sm:size-6 text-blue-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setView('year')}
                                className="text-xl sm:text-2xl font-black text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                {monthName}
                            </button>
                            <button 
                                onClick={() => {
                                    setDecadeStart(currentDate.getFullYear() - 4);
                                    setView('decade');
                                }}
                                className="text-xl sm:text-2xl font-black text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {year}
                            </button>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Your learning journey</p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="flex bg-gray-50 p-1 rounded-xl sm:rounded-2xl gap-1">
                        <button 
                            onClick={() => setView('month')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                view === 'month' ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <LayoutGridIcon className="size-4" />
                        </button>
                        <button 
                            onClick={() => setView('day')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                view === 'day' ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <ListIcon className="size-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => {
                                if (view === 'month') prevMonth();
                                else if (view === 'year') setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
                                else if (view === 'decade') setDecadeStart(decadeStart - 12);
                            }} 
                            className="p-2.5 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all border border-transparent hover:border-gray-100"
                        >
                            <ChevronLeftIcon className="size-5" />
                        </button>
                        <button 
                            onClick={() => {
                                setCurrentDate(new Date());
                                if (view === 'decade') setDecadeStart(new Date().getFullYear() - 4);
                            }}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                            Today
                        </button>
                        <button 
                            onClick={() => {
                                if (view === 'month') nextMonth();
                                else if (view === 'year') setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
                                else if (view === 'decade') setDecadeStart(decadeStart + 12);
                            }} 
                            className="p-2.5 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all border border-transparent hover:border-gray-100"
                        >
                            <ChevronRightIcon className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                {days.map((day) => (
                    <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = firstDayOfMonth(year, month);
        const days = daysInMonth(year, month);
        const cells = [];

        // Previous month filler
        const prevMonthDays = daysInMonth(year, month - 1);
        for (let i = 0; i < firstDay; i++) {
            const dayNum = prevMonthDays - firstDay + i + 1;
            cells.push(
                <div key={`prev-${i}`} className="p-4 h-32 border-r border-b border-gray-100 bg-gray-50/30 text-gray-300 pointer-events-none transition-all">
                    <span className="text-xs font-urbanist font-medium">{dayNum}</span>
                </div>
            );
        }

        // Current month days
        for (let day = 1; day <= days; day++) {
            const date = new Date(year, month, day);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const dayEvents = events.filter(e => e.date.toDateString() === date.toDateString());

            cells.push(
                <motion.div 
                    key={day}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => {
                        setSelectedDate(date);
                        setView('day');
                    }}
                    className={cn(
                        "p-2 sm:p-4 h-24 sm:h-32 border-r border-b border-gray-100 relative cursor-pointer group transition-all",
                        isSelected ? "bg-blue-50/20" : "hover:bg-gray-50/50",
                        isToday && "bg-blue-50/10"
                    )}
                >
                    <div className="flex justify-between items-start">
                        <span className={cn(
                            "size-6 sm:size-8 flex items-center justify-center text-xs sm:text-sm font-urbanist transition-all rounded-full",
                            isToday ? "bg-blue-600 text-white font-black shadow-lg shadow-blue-200" : 
                            isSelected ? "text-blue-600 font-black" : "text-gray-500 font-medium group-hover:text-gray-900"
                        )}>
                            {day}
                        </span>
                        {dayEvents.length > 0 && (
                            <span className="size-1.5 sm:size-2 bg-blue-400 rounded-full animate-pulse"></span>
                        )}
                    </div>

                    <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                            <div 
                                key={event.id}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-bold rounded-lg truncate border",
                                    event.type === 'CLASS' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-red-50 text-red-600 border-red-100"
                                )}
                            >
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 2 && (
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider pl-1">
                                + {dayEvents.length - 2} more
                            </div>
                        )}
                    </div>
                </motion.div>
            );
        }

        // Next month filler
        const remaining = 42 - cells.length;
        for (let i = 1; i <= remaining; i++) {
            cells.push(
                <div key={`next-${i}`} className="p-4 h-32 border-r border-b border-gray-100 bg-gray-50/30 text-gray-300 pointer-events-none">
                    <span className="text-xs font-urbanist font-medium">{i}</span>
                </div>
            );
        }

        return <div className="grid grid-cols-7 overflow-hidden rounded-b-[2.5rem] border-l border-gray-100">{cells}</div>;
    };

    const renderEventsList = () => {
        const dateString = selectedDate?.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' });
        const dayEvents = events.filter(e => e.date.toDateString() === selectedDate?.toDateString());

        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full lg:w-96 flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-gray-100 min-h-[300px] lg:min-h-[600px]"
            >
                <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/30">
                    <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Schedule for</h3>
                    <h2 className="text-lg sm:text-xl font-black text-gray-900">{dateString}</h2>
                </div>

                <div className="flex-1 p-6 space-y-4 overflow-y-auto minimal-scrollbar">
                    {dayEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                            <div className="size-16 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-4">
                                <CalendarIcon className="size-8 text-gray-300" />
                            </div>
                            <p className="text-sm font-bold text-gray-900">No events today!</p>
                            <p className="text-xs text-gray-400 mt-2">Take some time to relax or catch up on your self-paced courses.</p>
                        </div>
                    ) : (
                        dayEvents.map((event) => (
                            <motion.div 
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "p-5 rounded-3xl border transition-all hover:shadow-xl hover:shadow-gray-100 group relative",
                                    event.type === 'CLASS' ? "bg-blue-50/30 border-blue-100/50" : "bg-red-50/30 border-red-100/50"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={cn(
                                        "px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg",
                                        event.type === 'CLASS' ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                                    )}>
                                        {event.type}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {(mode === 'teacher' || mode === 'operations') && event.type === 'CLASS' && (
                                            <button
                                                onClick={() => {
                                                    setEditingSession({
                                                        ...event,
                                                        type: event.description, // original type like LECTURE
                                                        date: event.date.toISOString().split('T')[0],
                                                        venue: event.location,
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                                            >
                                                <Edit3Icon className="size-3.5" />
                                            </button>
                                        )}
                                        <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                                            <ClockIcon className="size-3" />
                                            {event.time}
                                        </span>
                                    </div>
                                </div>
                                
                                <h4 className="font-black text-gray-900 leading-tight mb-3">
                                    {event.title}
                                </h4>

                                <div className="space-y-2">
                                    {event.batch && (
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                            <LayoutGridIcon className="size-3.5" />
                                            {event.batch}
                                        </div>
                                    )}
                                    {event.teacher && (
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                            <GraduationCapIcon className="size-3.5" />
                                            {event.teacher}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                        <MapPinIcon className="size-3.5" />
                                        {event.location || (event.isOnline ? "Online Class (Zoom)" : "Location TBA")}
                                    </div>
                                </div>

                                {event.isOnline && (event.meetingId || event.meetingUrl) && (
                                    <div className="mt-3 p-2 bg-blue-50/50 rounded-xl border border-blue-100/50 w-fit">
                                        <div className="flex items-center gap-3 text-[9px] font-bold">
                                            <div className="flex items-center gap-1 text-blue-600">
                                                <span className="text-gray-400 font-black uppercase tracking-widest mr-1">ID:</span>
                                                {event.meetingId || "See Link"}
                                            </div>
                                            {event.meetingPasscode && (
                                                <div className="flex items-center gap-1 text-blue-600">
                                                    <span className="text-gray-400 font-black uppercase tracking-widest mr-1">Passcode:</span>
                                                    {event.meetingPasscode}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={async () => {
                                        const sessionDate = new Date(event.date);
                                        const [endHours, endMinutes] = (event.time.split(' - ')[1] || '00:00').split(':').map(Number);
                                        const sessionEnd = new Date(sessionDate);
                                        sessionEnd.setHours(endHours, endMinutes, 0, 0);
                                        const isPast = new Date() > sessionEnd;

              if (isPast && event.type === 'CLASS') {
                // Try to fetch stream URL through the sync endpoint
                try {
                  const res = await api.get<{ recordings: any[]; source: string }>(`/class-sessions/${event.id}/recording`, auth.getToken() || "");
                  if (res && res.recordings && res.recordings.length > 0) {
                    // Get CloudFront stream URL
                    const recordingId = res.recordings[0].id;
                    if (!recordingId) {
                      toast.warn("Recording ID not found.");
                      return;
                    }
                    const streamRes = await api.get<{ url?: string; status?: string; error?: string }>(
                      `/recordings/${recordingId}/stream`,
                      auth.getToken() || "",
                    );
                    if (streamRes.error) {
                      toast.error(streamRes.error);
                    } else if (streamRes.status === 'processing') {
                      toast.info("Recording is still being processed. Please check back in a few minutes.");
                    } else if (streamRes.url) {
                      window.open(streamRes.url, '_blank');
                    } else {
                      toast.warn("Recording is not yet available.");
                    }
                  } else {
                    toast.info("Recording is not yet available. Please check again in a few minutes.");
                  }
                } catch (e) {
                  console.error("Failed to fetch recording", e);
                  const errorMessage = e instanceof Error ? e.message : "Failed to load recording. Please try again later.";
                  toast.error(errorMessage);
                }
                return;
              }

                                         if (event.isOnline) {
                                            // Hosts (Teacher, Operations) go directly to webinar.gg
                                            if (mode === 'teacher' || mode === 'operations') {
                                                if (event.webinarId) {
                                                    window.open(`https://webinar.gg/webinar-page/${event.webinarId}`, "_blank");
                                                } else {
                                                    toast.error("Webinar ID missing. Cannot join session.");
                                                }
                                            } else {
                                                // Students go through the internal transition page for tokens
                                                window.open(`/dashboard?view=online-meeting&sessionId=${event.id}`, "_self");
                                            }
                                        }
                                    }} 
                                    className={cn(
                                        "w-full mt-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg",
                                        event.type === 'CLASS' ? 
                                            ((() => {
                                                const sessionDate = new Date(event.date);
                                                const [endHours, endMinutes] = (event.time.split(' - ')[1] || '00:00').split(':').map(Number);
                                                const sessionEnd = new Date(sessionDate);
                                                sessionEnd.setHours(endHours, endMinutes, 0, 0);
                                                const isPast = new Date() > sessionEnd;
                                                return isPast ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200";
                                            })())
                                            : "bg-red-600 text-white hover:bg-red-700 shadow-red-200"
                                    )}
                                >
                                    {(() => {
                                        const sessionDate = new Date(event.date);
                                        const [endHours, endMinutes] = (event.time.split(' - ')[1] || '00:00').split(':').map(Number);
                                        const sessionEnd = new Date(sessionDate);
                                        sessionEnd.setHours(endHours, endMinutes, 0, 0);
                                        const isPast = new Date() > sessionEnd;

                                        if (isPast && event.type === 'CLASS') {
                                            return "Watch Recording";
                                        }

                                         return event.type === 'CLASS' ? (event.isOnline ? "Join Classroom" : mode === 'teacher' ? "Start Class" : mode === 'operations' ? "View Class" : "Join Class") : "Start Test";
                                    })()}
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden min-h-[500px] lg:min-h-[700px]">
            <div className="flex-1 flex flex-col">
                {renderHeader()}
                {view === 'month' ? (
                    <>
                        {renderDays()}
                        {renderCells()}
                    </>
                ) : view === 'year' ? (
                    <div className="p-8 grid grid-cols-4 gap-4 flex-1 items-center">
                        {Array.from({ length: 12 }).map((_, i) => {
                            const date = new Date(currentDate.getFullYear(), i, 1);
                            const isCurrent = date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
                            return (
                                <button 
                                    key={i}
                                    onClick={() => {
                                        setCurrentDate(date);
                                        setView('month');
                                    }}
                                    className={cn(
                                        "p-10 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-2",
                                        isCurrent ? "bg-blue-600 text-white border-transparent shadow-xl shadow-blue-200" : "bg-gray-50/50 border-transparent hover:bg-white hover:border-blue-100 hover:shadow-lg"
                                    )}
                                >
                                    <span className="text-sm font-black uppercase tracking-widest">
                                        {date.toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className={cn(
                                        "text-xs font-medium",
                                        isCurrent ? "text-blue-100" : "text-gray-400"
                                    )}>
                                        {events.filter(e => e.date.getMonth() === i && e.date.getFullYear() === currentDate.getFullYear()).length} Events
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : view === 'decade' ? (
                    <div className="p-8 grid grid-cols-4 gap-4 flex-1 items-center">
                        {Array.from({ length: 12 }).map((_, i) => {
                            const yearNum = decadeStart + i;
                            const isCurrent = yearNum === new Date().getFullYear();
                            const isSelected = yearNum === currentDate.getFullYear();
                            return (
                                <button 
                                    key={i}
                                    onClick={() => {
                                        setCurrentDate(new Date(yearNum, currentDate.getMonth(), 1));
                                        setView('year');
                                    }}
                                    className={cn(
                                        "p-10 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-2",
                                        isSelected ? "bg-blue-600 text-white border-transparent shadow-xl shadow-blue-200" : 
                                        isCurrent ? "bg-yellow-50 text-yellow-600 border-blue-100" :
                                        "bg-gray-50/50 border-transparent hover:bg-white hover:border-blue-100 hover:shadow-lg"
                                    )}
                                >
                                    <span className="text-sm font-black uppercase tracking-widest">
                                        {yearNum}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-20 text-center">
                        <div className="max-w-md">
                            <div className="size-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                                <LayoutGridIcon className="size-10 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Detailed View</h2>
                            <p className="text-gray-400 font-medium">Select a date from the calendar to see detailed schedule and join classes.</p>
                            <button 
                                onClick={() => setView('month')}
                                className="mt-8 px-8 py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
                            >
                                Back to Calendar
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {renderEventsList()}

            <CreateSessionModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingSession(null);
                }}
                onSuccess={fetchEvents}
                batches={batches}
                editingSession={editingSession}
            />
        </div>
    );
}
