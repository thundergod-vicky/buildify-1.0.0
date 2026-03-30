/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { auth } from "@/lib/auth";
import { motion } from "motion/react";
import { ClassSession, Subject, Batch } from "@/types";

export function CreateSessionModal({
  isOpen,
  onClose,
  onSuccess,
  teachers,
  batches,
  editingSession,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teachers: { id: string; name: string }[];
  batches: (Batch & { subjects?: Subject[] })[];
  editingSession?: ClassSession | null;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "LECTURE" as any,
    teacherId: "",
    batchId: "",
    subjectId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    venue: "",
    isOnline: false,
  });

  useEffect(() => {
    if (editingSession) {
      setFormData({
        title: editingSession.title,
        type: editingSession.type as any,
        teacherId: editingSession.teacherId,
        batchId: editingSession.batchId,
        subjectId: editingSession.subjectId || "",
        date: editingSession.date.split("T")[0],
        startTime: editingSession.startTime,
        endTime: editingSession.endTime,
        venue: editingSession.venue || "",
        isOnline: editingSession.isOnline,
      });
    } else {
      const now = new Date();
      const start = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      const end = new Date(now.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      
      setFormData({
        title: "",
        type: "LECTURE" as any,
        teacherId: "",
        batchId: "",
        subjectId: "",
        date: now.toISOString().split("T")[0],
        startTime: start,
        endTime: end,
        venue: "",
        isOnline: false,
      });
    }
  }, [editingSession, isOpen]);

  const [availableSubjects, setAvailableSubjects] = useState<
    { id: string; name: string }[]
  >([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);

  useEffect(() => {
    async function updateSubjects() {
      if (formData.batchId) {
        setFetchingSubjects(true);
        try {
          let selectedBatch = batches.find((b) => b.id === formData.batchId);
          if (!selectedBatch?.subjects || selectedBatch.subjects.length === 0) {
            const token = auth.getToken() || "";
            selectedBatch = await api.get<any>(
              `/batches/${formData.batchId}`,
              token,
            );
          }
          setAvailableSubjects(selectedBatch?.subjects || []);
        } catch (e) {
          console.error("Failed to fetch batch subjects:", e);
          setAvailableSubjects([]);
        } finally {
          setTimeout(() => setFetchingSubjects(false), 300);
        }
      } else {
        setAvailableSubjects([]);
        setFetchingSubjects(false);
      }
    }
    updateSubjects();
  }, [formData.batchId, batches]);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("lock-scroll");
      document.body.classList.add("lock-scroll");
    } else {
      document.documentElement.classList.remove("lock-scroll");
      document.body.classList.remove("lock-scroll");
    }
    return () => {
      document.documentElement.classList.remove("lock-scroll");
      document.body.classList.remove("lock-scroll");
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Prevent scheduling in the past
    const selectedDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const now = new Date();
    
    if (selectedDateTime < now && !editingSession) {
      toast.error("Cannot schedule a class in the past. Please select a future time.");
      return;
    }

    setLoading(true);
    try {
      if (editingSession) {
        await api.patch(`/class-sessions/${editingSession.id}`, formData, auth.getToken() || "");
        toast.success("Session updated!");
      } else {
        await api.post("/class-sessions", formData, auth.getToken() || "");
        toast.success("Session created and notifications sent!");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in"
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h3 className="text-2xl font-black text-gray-900 font-urbanist">
                {editingSession ? "Edit Session" : "Schedule Class"}
              </h3>
              <p className="text-gray-500 font-medium text-sm mt-1">
                Assignments will trigger alerts to faculty and batch students
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-8 overflow-y-auto flex-1 min-h-0 minimal-scrollbar space-y-6 overscroll-contain">
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
                  Session Venue
                </label>
                <input
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                  placeholder="e.g. Room 302"
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
                    {fetchingSubjects
                      ? "Fetching subjects..."
                      : "Select a subject..."}
                  </option>
                  {!fetchingSubjects &&
                    availableSubjects.map((s) => (
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
                Generate meeting link
              </label>
            </div>

            {formData.isOnline && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-blue-50/20 p-6 rounded-2xl border border-blue-100/50"
              >
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="size-2 bg-blue-600 rounded-full animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Webinar.gg Auto-Scheduling Enabled
                  </p>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 font-medium">
                  The system will automatically allocate an available account and generate a secure join link for this session.
                </p>
              </motion.div>
            )}

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
          </div>

          <div className="p-8 border-t border-gray-100 bg-gray-50/30 shrink-0">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-colors shadow-xl shadow-blue-200 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingSession
                  ? "Update Session"
                  : "Commit & Notify Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
