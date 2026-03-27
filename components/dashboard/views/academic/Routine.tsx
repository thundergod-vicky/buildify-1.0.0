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
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ClassSession, Subject, Batch } from "@/types";

function CreateSessionModal({
  isOpen,
  onClose,
  onSuccess,
  teachers,
  batches,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teachers: { id: string; name: string }[];
  batches: (Batch & { subjects?: Subject[] })[];
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "LECTURE" as any,
    teacherId: "",
    batchId: "",
    subjectId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:30",
    venue: "",
    isOnline: false,
  });

  const [availableSubjects, setAvailableSubjects] = useState<{ id: string; name: string }[]>([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);

  useEffect(() => {
    async function updateSubjects() {
      if (formData.batchId) {
        setFetchingSubjects(true);
        try {
          // First check if we already have subjects in the batches list
          let selectedBatch = batches.find((b) => b.id === formData.batchId);

          // If subjects are missing, fetch the full batch details
          if (!selectedBatch?.subjects || selectedBatch.subjects.length === 0) {
            const token = auth.getToken() || "";
            selectedBatch = await api.get<any>(
              `/batches/${formData.batchId}`,
              token,
            );
          }

          setAvailableSubjects(selectedBatch?.subjects || []);
          setFormData((prev) => ({ ...prev, subjectId: "" }));
        } catch (e) {
          console.error("Failed to fetch batch subjects:", e);
          setAvailableSubjects([]);
        } finally {
          // Small delay for smoother UX
          setTimeout(() => setFetchingSubjects(false), 300);
        }
      } else {
        setAvailableSubjects([]);
        setFetchingSubjects(false);
      }
    }

    updateSubjects();
  }, [formData.batchId, batches]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/class-sessions", formData, auth.getToken() || "");
      toast.success("Session created and notifications sent!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-gray-900 font-urbanist">
              Schedule Class
            </h3>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Assignments will trigger alerts to faculty and batch students
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 overflow-y-auto minimal-scrollbar space-y-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Session Title
            </label>
            <input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
              placeholder="e.g. Advanced Mathematics Part 3"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Session Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                  type: e.target.value as any,
                  })
                }
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
              >
                <option value="LECTURE">Lecture</option>
                <option value="PRACTICAL">Practical</option>
                <option value="WORKSHOP">Workshop</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Venue / Platform
              </label>
              <input
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                placeholder="e.g. Room 302 or Zoom Link"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Target Batch
              </label>
              <select
                required
                value={formData.batchId}
                onChange={(e) =>
                  setFormData({ ...formData, batchId: e.target.value })
                }
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
              >
                <option value="">Select a batch...</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                Subject (Optional)
                {fetchingSubjects && (
                  <div className="size-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) =>
                  setFormData({ ...formData, subjectId: e.target.value })
                }
                disabled={!formData.batchId || fetchingSubjects}
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 disabled:opacity-50"
              >
                <option value="">
                  {fetchingSubjects ? "Fetching subjects..." : "Select a subject..."}
                </option>
                {!fetchingSubjects && availableSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Lead Faculty
              </label>
              <select
                required
                value={formData.teacherId}
                onChange={(e) =>
                  setFormData({ ...formData, teacherId: e.target.value })
                }
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
              >
                <option value="">Select a teacher...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <input
              type="checkbox"
              id="isOnline"
              checked={formData.isOnline}
              onChange={(e) =>
                setFormData({ ...formData, isOnline: e.target.checked })
              }
              className="size-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="isOnline"
              className="text-sm font-black text-gray-900 cursor-pointer"
            >
              Generate Zoom Meeting Link automatically
            </label>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Date
              </label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Start Time
              </label>
              <input
                required
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                End Time
              </label>
              <input
                required
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-colors shadow-xl shadow-blue-200 disabled:opacity-50"
            >
              {loading ? "Committing..." : "Commit & Notify Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ClassRoutine() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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
              onClick={() => setIsModalOpen(true)}
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
                    {item.venue || "TBA"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                {item.meetingId && (
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
                            disabled={!item.meetingId && (!item.recordings || item.recordings.length === 0)}
                            onClick={async () => {
                              if (item.recordings && item.recordings.length > 0) {
                                // Fetch stream URL from CloudFront
                                const readyRec = item.recordings.find(r => r.status === 'ready');
                                if (readyRec) {
                                  const loadId = toast.loading("Loading recording...");
                                  try {
                                    const streamRes = await api.get<{ url: string; status: string }>(
                                      `/recordings/${readyRec.id}/stream`,
                                      auth.getToken() || "",
                                    );
                                    if (streamRes.status === 'processing') {
                                      toast.update(loadId, { render: "Recording is still processing...", type: "info", isLoading: false, autoClose: 3000 });
                                    } else if (streamRes.url) {
                                      window.open(streamRes.url, "_blank");
                                      toast.update(loadId, { render: "Opening recording", type: "success", isLoading: false, autoClose: 1000 });
                                    }
                                  } catch {
                                    toast.update(loadId, { render: "Failed to load recording", type: "error", isLoading: false, autoClose: 2000 });
                                  }
                                } else if (item.recordings.find(r => r.status === 'processing')) {
                                  toast.info("Recording is still being processed. Check back shortly.");
                                } else {
                                  // Legacy: open direct URL
                                  window.open(item.recordings[0].url, "_blank");
                                }
                              } else if (item.meetingId) {
                                // Try to sync recording if it's past
                                const loadId = toast.loading("Syncing with Zoom...");
                                try {
                                  const res = await api.get<{ url: string; passcode: string; recordings: any[]; source: string }>(
                                    `/class-sessions/${item.id}/recording`,
                                    auth.getToken() || "",
                                  );
                                  if (res && res.recordings && res.recordings.length > 0) {
                                    if (res.source === 's3') {
                                      // Fetch signed stream URL
                                      const streamRes = await api.get<{ url: string; status: string }>(
                                        `/recordings/${res.recordings[0].id}/stream`,
                                        auth.getToken() || "",
                                      );
                                      if (streamRes.url) {
                                        window.open(streamRes.url, "_blank");
                                      }
                                    } else {
                                      window.open(res.recordings[0].url, "_blank");
                                    }
                                    toast.update(loadId, { render: "Sync complete!", type: "success", isLoading: false, autoClose: 2000 });
                                    fetchData();
                                  } else {
                                    toast.update(loadId, { render: "Recording not ready. Check back later.", type: "info", isLoading: false, autoClose: 3000 });
                                  }
                                } catch {
                                  toast.update(loadId, { render: "Sync failed", type: "error", isLoading: false, autoClose: 2000 });
                                }
                              }
                            }}
                            className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap shadow-lg ${
                              (item.recordings?.length ?? 0) > 0
                                ? (item.recordings?.some(r => r.status === 'processing')
                                    ? "bg-amber-500 text-white hover:bg-amber-600 border-amber-500 shadow-amber-100"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600 shadow-indigo-100")
                                : "bg-gray-100 text-gray-400 border-gray-200 shadow-none cursor-not-allowed"
                            }`}
                          >
                            {(() => {
                              if ((item.recordings?.length ?? 0) === 0) return "Recording Unavailable";
                              if (item.recordings?.some(r => r.status === 'processing')) return "Processing...";
                              return `Watch Recording${item.recordings!.length > 1 ? ` (${item.recordings!.length})` : ""}`;
                            })()}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        onClick={() => {
                          const role = user?.role === Role.TEACHER ? 1 : 0;
                          const cleanId = item.meetingId?.replace(
                            /[^0-9]/g,
                            "",
                          );
                          let pwd = "";
                          if (item.meetingUrl) {
                            try {
                              const url = new URL(item.meetingUrl);
                              pwd = url.searchParams.get("pwd") || "";
                            } catch (e) {
                              console.error(
                                "Could not parse meeting URL for password",
                                e,
                              );
                            }
                          }
                          router.push(
                            `/dashboard?view=zoom-meeting&meetingId=${cleanId}&role=${role}&from=routine&password=${pwd}`,
                          );
                        }}
                        className="px-5 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all border border-blue-600 whitespace-nowrap shadow-lg shadow-blue-100"
                      >
                        Join Zoom Classroom
                      </button>
                    );
                  })()
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-5 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        teachers={teachers}
        batches={batches}
      />
    </div>
  );
}
