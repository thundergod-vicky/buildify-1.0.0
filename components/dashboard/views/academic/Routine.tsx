/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  CalendarIcon,
  GraduationCapIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { auth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ClassSession, Batch, Subject } from "@/types";
import { CreateSessionModal } from "./CreateSessionModal"; // Added import for CreateSessionModal

export function ClassRoutine() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // For routine viewing, filter by the next 7 days in tabs
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const generateNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const weekDays = generateNext7Days();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = auth.getToken() || "";

      // Fetch sessions
      try {
        const sessRes = await api.get<ClassSession[]>(
          `/class-sessions?date=${selectedDateFilter}`,
          token,
        );
        setSessions(sessRes);
      } catch (e) {
        console.error("Failed to load sessions:", e);
      }

      // Fetch teachers
      try {
        const teachRes = await api.get<any[]>("/users/teachers", token);
        setTeachers(teachRes.map((t) => ({ id: t.id, name: t.name })));
      } catch (e) {
        console.error("Failed to load teachers:", e);
      }

      // Fetch batches
      try {
        const batchRes = await api.get<any[]>("/batches", token);
        setBatches(batchRes);
      } catch (e) {
        console.error("Failed to load batches:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this session?")) return;
    try {
      await api.delete(`/class-sessions/${id}`, auth.getToken() || "");
      toast.success("Session cancelled");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to cancel session");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">
            Classes Routine
          </h1>
          <p className="text-gray-500 font-medium">
            Synchronized institutional schedule and faculty assignments
          </p>
        </div>
        {(user?.role === Role.ADMIN ||
          user?.role === Role.ACADEMIC_OPERATIONS) && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingSession(null);
                setIsModalOpen(true);
              }}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black flex items-center gap-2 transition-all shadow-xl shadow-gray-200"
            >
              <PlusIcon className="size-4" /> Schedule New
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-gray-100 shadow-sm flex gap-1.5 overflow-x-auto w-full minimal-scrollbar">
        {weekDays.map((d) => {
          const dateStr = d.toISOString().split("T")[0];
          const isToday = new Date().toISOString().split("T")[0] === dateStr;
          const isSelected = selectedDateFilter === dateStr;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDateFilter(dateStr)}
              className={`px-6 py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap flex items-center gap-2 flex-1 justify-center min-w-[140px] ${isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-transparent text-gray-400 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              <CalendarIcon className="size-3.5 opacity-50 block md:hidden lg:block hidden" />
              {isToday
                ? "Today"
                : d.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-6">
            <div className="spinner scale-75 opacity-80"></div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
              Syncing Matrix...
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-[3rem] border border-gray-100 border-dashed">
            <div className="size-20 bg-gray-50 mx-auto rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="size-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 font-urbanist mb-2">
              No sessions scheduled
            </h3>
            <p className="text-gray-400 font-medium">
              There are no classes scheduled for this date.
            </p>
          </div>
        ) : (
          sessions.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-lg shadow-gray-100/50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <div className="flex items-center gap-8 relative z-10">
                <div className="size-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 text-blue-600 rounded-[1.75rem] flex items-center justify-center shadow-inner border border-blue-100 group-hover:rotate-6 transition-transform duration-500">
                  <ClockIcon className="size-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full">
                      {item.type}
                    </span>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      {item.startTime} - {item.endTime}
                    </p>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 font-urbanist">
                    {item.title}
                  </h3>
                  {item.subject && (
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                      {item.subject.name}
                    </p>
                  )}
                  {item.isOnline && (item.meetingId || item.meetingUrl) && (
                    <div className="mt-2 p-2 bg-blue-50/50 rounded-xl border border-blue-100/50 w-fit">
                      <div className="flex items-center gap-3 text-[9px] font-bold">
                        <div className="flex items-center gap-1 text-blue-600">
                          <span className="text-gray-400 font-black uppercase tracking-widest mr-1">ID:</span>
                          {item.meetingId || "See Link"}
                        </div>
                        {item.meetingPasscode && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <span className="text-gray-400 font-black uppercase tracking-widest mr-1">Passcode:</span>
                            {item.meetingPasscode}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-10 lg:gap-16 relative z-10">
                <div className="space-y-2">
                  <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">
                    Lead Faculty
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-blue-50 text-blue-600 rounded-full border border-white flex items-center justify-center">
                      <GraduationCapIcon className="size-4" />
                    </div>
                    <p className="font-black text-gray-700 text-sm italic">
                      {item.teacher?.name}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">
                    Target Batch
                  </p>
                  <p className="font-black text-indigo-600 text-sm px-4 py-1.5 bg-indigo-50/50 rounded-xl border border-indigo-100/30">
                    {item.batch?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">
                    Session Venue
                  </p>
                  <div className="flex items-center gap-2 font-black text-gray-700 text-sm">
                    <div className="size-6 bg-rose-50 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="size-3 text-rose-500" />
                    </div>
                    {item.venue || (item.isOnline ? "Zoom Classroom" : "TBA")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                {item.isOnline &&
                  (() => {
                    const sessionDate = new Date(item.date);
                    const [endHours, endMinutes] = item.endTime
                      .split(":")
                      .map(Number);
                    const sessionEnd = new Date(sessionDate);
                    sessionEnd.setHours(endHours, endMinutes, 0, 0);
                    const isPast = new Date() > sessionEnd;

                    if (isPast) {
                      return (
                        <div className="flex flex-col gap-2">
                          <button
                            disabled={
                              !item.meetingId &&
                              (!item.recordings || item.recordings.length === 0)
                            }
                            onClick={async () => {
                              if (
                                item.recordings &&
                                item.recordings.length > 0
                              ) {
                                // Fetch stream URL from CloudFront
                                const readyRec = item.recordings.find(
                                  (r) => r.status === "ready",
                                );
                                if (readyRec) {
                                  const loadId = toast.loading(
                                    "Loading recording...",
                                  );
                                  try {
                                    const streamRes = await api.get<{
                                      url: string;
                                      status: string;
                                    }>(
                                      `/recordings/${readyRec.id}/stream`,
                                      auth.getToken() || "",
                                    );
                                    if (streamRes.status === "processing") {
                                      toast.update(loadId, {
                                        render:
                                          "Recording is still processing...",
                                        type: "info",
                                        isLoading: false,
                                        autoClose: 3000,
                                      });
                                    } else if (streamRes.url) {
                                      window.open(streamRes.url, "_blank");
                                      toast.update(loadId, {
                                        render: "Opening recording",
                                        type: "success",
                                        isLoading: false,
                                        autoClose: 1000,
                                      });
                                    }
                                  } catch {
                                    toast.update(loadId, {
                                      render: "Failed to load recording",
                                      type: "error",
                                      isLoading: false,
                                      autoClose: 2000,
                                    });
                                  }
                                } else if (
                                  item.recordings.find(
                                    (r) => r.status === "processing",
                                  )
                                ) {
                                  toast.info(
                                    "Recording is still being processed. Check back shortly.",
                                  );
                                } else {
                                  // Legacy: open direct URL
                                  window.open(item.recordings[0].url, "_blank");
                                }
                              } else if (item.meetingId) {
                                // Try to sync recording if it's past
                                const loadId = toast.loading(
                                  "Syncing with Zoom...",
                                );
                                try {
                                  const res = await api.get<{
                                    url: string;
                                    passcode: string;
                                    recordings: any[];
                                    source: string;
                                  }>(
                                    `/class-sessions/${item.id}/recording`,
                                    auth.getToken() || "",
                                  );
                                  if (
                                    res &&
                                    res.recordings &&
                                    res.recordings.length > 0
                                  ) {
                                    if (res.source === "s3") {
                                      // Fetch signed stream URL
                                      const streamRes = await api.get<{
                                        url: string;
                                        status: string;
                                      }>(
                                        `/recordings/${res.recordings[0].id}/stream`,
                                        auth.getToken() || "",
                                      );
                                      if (streamRes.url) {
                                        window.open(streamRes.url, "_blank");
                                      }
                                    } else {
                                      window.open(
                                        res.recordings[0].url,
                                        "_blank",
                                      );
                                    }
                                    toast.update(loadId, {
                                      render: "Sync complete!",
                                      type: "success",
                                      isLoading: false,
                                      autoClose: 2000,
                                    });
                                    fetchData();
                                  } else {
                                    toast.update(loadId, {
                                      render:
                                        "Recording not ready. Check back later.",
                                      type: "info",
                                      isLoading: false,
                                      autoClose: 3000,
                                    });
                                  }
                                } catch {
                                  toast.update(loadId, {
                                    render: "Sync failed",
                                    type: "error",
                                    isLoading: false,
                                    autoClose: 2000,
                                  });
                                }
                              }
                            }}
                            className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap shadow-lg ${
                              (item.recordings?.length ?? 0) > 0
                                ? item.recordings?.some(
                                    (r) => r.status === "processing",
                                  )
                                  ? "bg-amber-500 text-white hover:bg-amber-600 border-amber-500 shadow-amber-100"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600 shadow-indigo-100"
                                : "bg-gray-100 text-gray-400 border-gray-200 shadow-none cursor-not-allowed"
                            }`}
                          >
                            {(() => {
                              if ((item.recordings?.length ?? 0) === 0)
                                return "Recording Unavailable";
                              if (
                                item.recordings?.some(
                                  (r) => r.status === "processing",
                                )
                              )
                                return "Processing...";
                              return `Watch Recording${item.recordings!.length > 1 ? ` (${item.recordings!.length})` : ""}`;
                            })()}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        onClick={() => {
                          if (item.meetingUrl) {
                            window.open(item.meetingUrl, "_blank");
                          } else if (item.meetingId) {
                            const cleanId = item.meetingId.replace(/[^0-9]/g, "");
                            const pwd = item.meetingPasscode || "";
                            const zoomUrl = `https://zoom.us/j/${cleanId}?pwd=${pwd}`;
                            window.open(zoomUrl, "_blank");
                          } else {
                            toast.error("No Zoom details provided for this session.");
                          }
                        }}
                        className="px-5 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all border border-blue-600 whitespace-nowrap shadow-lg shadow-blue-100"
                      >
                        Join Classroom
                      </button>
                    );
                  })()}
                {(user?.role === Role.ADMIN ||
                  user?.role === Role.ACADEMIC_OPERATIONS) && (
                  <>
                    <button
                      onClick={() => {
                        setEditingSession(item);
                        setIsModalOpen(true);
                      }}
                      className="px-5 py-3 bg-gray-50 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-5 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        onSuccess={fetchData}
        teachers={teachers}
        batches={batches}
        editingSession={editingSession}
      />
    </div>
  );
}

