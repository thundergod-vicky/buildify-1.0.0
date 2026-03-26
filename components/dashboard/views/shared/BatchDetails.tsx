/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  VideoIcon,
  FileTextIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ClockIcon,
  MapPinIcon,
  PlusCircleIcon,
  Trash2Icon,
  ExternalLinkIcon,
  GraduationCapIcon,
  UsersIcon,
  BookOpenIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { Role, Batch, ClassSession } from "@/types";
import { cn } from "@/lib/utils";

export function BatchDetailsView({ batchId }: { batchId: string }) {
  const { user } = useAuth();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "subjects" | "schedule" | "settings"
  >("subjects");
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const fetchBatch = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const data = await api.get<Batch>(`/batches/${batchId}`, token);
      setBatch(data);
      // Auto-expand all subjects by default
      if (data.subjects) {
        setExpandedSubjects(data.subjects.map((s) => s.id));
      }
    } catch (err) {
      toast.error("Failed to load batch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, [batchId]);

  const toggleSubject = (id: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const isManagementRole =
    user?.role === Role.ADMIN || user?.role === Role.ACADEMIC_OPERATIONS;
  const isTeacher = user?.role === Role.TEACHER;

  if (loading)
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="spinner scale-75 opacity-80"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-4 animate-pulse">
          Syncing Batch Data...
        </p>
      </div>
    );

  if (!batch)
    return <div className="p-8 text-center text-red-500">Batch not found</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
              Batch Profile
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">
            {batch.name}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {batch.description || "Comprehensive academic batch management"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {batch.teachers?.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="size-10 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-blue-600 font-bold text-sm"
                title={t.name}
              >
                {t.name?.[0]}
              </div>
            ))}
            {(batch.teachers?.length || 0) > 3 && (
              <div className="size-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-500 font-bold text-xs">
                +{batch.teachers!.length - 3}
              </div>
            )}
          </div>
          <div className="h-10 w-px bg-gray-100 mx-2" />
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Enrollment
            </p>
            <p className="text-sm font-black text-gray-900">
              {batch._count?.students || batch.students?.length || 0} Students
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("subjects")}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            activeTab === "subjects"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-400 hover:text-gray-600",
          )}
        >
          Subjects
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            activeTab === "schedule"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-400 hover:text-gray-600",
          )}
        >
          Schedule
        </button>
        {isManagementRole && (
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "settings"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            Settings
          </button>
        )}
      </div>

      <div className="space-y-6">
        {activeTab === "subjects" && (
          <div className="space-y-6">
            {batch.subjects?.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-[3rem] border border-gray-100 border-dashed">
                <BookOpenIcon className="size-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900">
                  No Subjects Linked
                </h3>
                <p className="text-gray-400">
                  Add subjects to this batch to organize your curriculum.
                </p>
                {isManagementRole && (
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                  >
                    Configure Subjects
                  </button>
                )}
              </div>
            ) : (
              batch.subjects?.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group"
                >
                  <button
                    onClick={() => toggleSubject(subject.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                        {subject.name[0]}
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-black text-gray-900">
                          {subject.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                          Click to view classes and resources
                        </p>
                      </div>
                    </div>
                    {expandedSubjects.includes(subject.id) ? (
                      <ChevronDownIcon className="size-5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="size-5 text-gray-400" />
                    )}
                  </button>

                  {expandedSubjects.includes(subject.id) && (
                    <div className="px-6 pb-6 pt-2 space-y-4">
                      <div className="h-px bg-gray-50 w-full mb-6" />
                      {/* Classes for this subject */}
                      <div className="space-y-4">
                        {/* Placeholder for fetching classes by subject - for now we'll filter from batch.sessions if available */}
                        {batch.sessions?.filter(
                          (s) => s.subjectId === subject.id,
                        ).length === 0 ? (
                          <p className="text-sm text-gray-400 italic py-4">
                            No classes scheduled for this subject yet.
                          </p>
                        ) : (
                          batch.sessions
                            ?.filter((s) => s.subjectId === subject.id)
                            .map((session) => (
                              <ClassItem
                                key={session.id}
                                session={session}
                                isManagementRole={isManagementRole}
                                isTeacher={
                                  isTeacher && session.teacherId === user?.id
                                }
                                onRefresh={fetchBatch}
                              />
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-6">
            {batch.sessions?.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-[3rem] border border-gray-100 border-dashed">
                <ClockIcon className="size-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900">
                  No Classes Scheduled
                </h3>
                <p className="text-gray-400">
                  Synchronize your routine from the class manager.
                </p>
              </div>
            ) : (
              batch.sessions?.map((session) => (
                <ClassItem
                  key={session.id}
                  session={session}
                  isManagementRole={isManagementRole}
                  isTeacher={isTeacher && session.teacherId === user?.id}
                  onRefresh={fetchBatch}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "settings" && isManagementRole && (
          <BatchSettings batch={batch} onUpdate={fetchBatch} />
        )}
      </div>
    </div>
  );
}

function ClassItem({
  session,
  isManagementRole,
  isTeacher,
  onRefresh,
}: {
  session: ClassSession;
  isManagementRole: boolean;
  isTeacher: boolean;
  onRefresh: () => void;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [showArtifacts, setShowArtifacts] = useState(false);

  const sessionDate = new Date(session.date);
  const [endHours, endMinutes] = session.endTime.split(":").map(Number);
  const sessionEnd = new Date(sessionDate);
  sessionEnd.setHours(endHours, endMinutes, 0, 0);
  const isPast = new Date() > sessionEnd;

  return (
    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="size-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm">
            <span className="text-[10px] font-black uppercase text-blue-600">
              {sessionDate.toLocaleDateString("en-US", { month: "short" })}
            </span>
            <span className="text-xl font-black text-gray-900">
              {sessionDate.getDate()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {session.type}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                {session.startTime} - {session.endTime}
              </span>
            </div>
            <h4 className="text-lg font-black text-gray-900">
              {session.title}
            </h4>
            {session.subject && (
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                {session.subject.name}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <GraduationCapIcon className="size-3.5 text-gray-400" />
                {session.teacher?.name}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <MapPinIcon className="size-3.5 text-gray-400" />
                {session.venue || (session.isOnline ? "Zoom Classroom" : "TBA")}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {session.isOnline && !isPast && (
            <button
              onClick={() => {
                const role = user?.role === Role.TEACHER ? 1 : 0;
                const cleanId = session.meetingId?.replace(/[^0-9]/g, "");
                let pwd = "";
                if (session.meetingUrl) {
                  try {
                    const url = new URL(session.meetingUrl);
                    pwd = url.searchParams.get("pwd") || "";
                  } catch (e) {
                    console.error(
                      "Could not parse meeting URL for password",
                      e,
                    );
                  }
                }
                router.push(
                  `/dashboard?view=zoom-meeting&meetingId=${cleanId}&role=${role}&from=batch-details&batchId=${session.batchId}&password=${pwd}`,
                );
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Join Live Class
            </button>
          )}

          <button
            onClick={() => setShowArtifacts(!showArtifacts)}
            className="px-6 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            {showArtifacts ? "Hide Resources" : "Class Artifacts"}
          </button>
        </div>
      </div>

      {showArtifacts && (
        <div className="mt-8 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recordings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                  <VideoIcon className="size-4" /> Zoom Recordings
                </div>
                {(isManagementRole || isTeacher) && (
                  <div className="flex items-center gap-2">
                    {session.meetingId && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const loadId = toast.loading("Syncing with Zoom...");
                          try {
                            await api.get(
                              `/class-sessions/${session.id}/recording`,
                              auth.getToken()!,
                            );
                            toast.update(loadId, {
                              render:
                                "Sync complete! Please refresh if recordings do not appear.",
                              type: "success",
                              isLoading: false,
                              autoClose: 3000,
                            });
                            onRefresh();
                          } catch (err: any) {
                            toast.update(loadId, {
                              render: err.message || "Failed to sync",
                              type: "error",
                              isLoading: false,
                              autoClose: 3000,
                            });
                          }
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1"
                        title="Sync with Zoom"
                      >
                        <ClockIcon className="size-3" /> Sync
                      </button>
                    )}
                    <button
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Add manually"
                    >
                      <PlusCircleIcon className="size-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {session.recordings?.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">
                    No recordings uploaded for this session.
                  </p>
                ) : (
                  session.recordings?.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                          <VideoIcon className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-700">
                            {rec.title}
                          </p>
                          {rec.passcode && (
                            <p className="text-[10px] text-gray-400">
                              Passcode: {rec.passcode}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={rec.url}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLinkIcon className="size-4" />
                        </a>
                        {(isManagementRole || isTeacher) && (
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2Icon className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                  <FileTextIcon className="size-4" /> Study Materials
                </div>
                {(isManagementRole || isTeacher) && (
                  <label className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx,.doc,.docx"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const loadId = toast.loading(
                          "Uploading study material...",
                        );
                        try {
                          // Upload to S3 via backend
                          const uploadRes = await api.upload<{
                            id: string;
                            url: string;
                          }>("/content/upload", file, auth.getToken()!);

                          let type = "OTHER";
                          const nameLower = file.name.toLowerCase();
                          if (nameLower.endsWith(".pdf")) type = "PDF";
                          else if (
                            nameLower.endsWith(".ppt") ||
                            nameLower.endsWith(".pptx")
                          )
                            type = "PRESENTATION";

                          // Link to session
                          await api.post(
                            `/class-sessions/${session.id}/attachments`,
                            {
                              title: file.name,
                              url: uploadRes.url,
                              type,
                            },
                            auth.getToken()!,
                          );

                          toast.update(loadId, {
                            render: "Upload complete!",
                            type: "success",
                            isLoading: false,
                            autoClose: 2000,
                          });
                          e.target.value = ""; // Reset input
                          onRefresh();
                        } catch (err: any) {
                          toast.update(loadId, {
                            render: err.message || "Failed to upload",
                            type: "error",
                            isLoading: false,
                            autoClose: 3000,
                          });
                        }
                      }}
                    />
                    <PlusCircleIcon className="size-4" />
                  </label>
                )}
              </div>
              <div className="space-y-2">
                {session.attachments?.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">
                    No notes or presentations available.
                  </p>
                ) : (
                  session.attachments?.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-black text-[10px]">
                          {att.type.slice(0, 3)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-700">
                            {att.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={att.url}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLinkIcon className="size-4" />
                        </a>
                        {(isManagementRole || isTeacher) && (
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2Icon className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BatchSettings({
  batch,
  onUpdate,
}: {
  batch: Batch;
  onUpdate: () => void;
}) {
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    setLoading(true);
    try {
      await api.post(
        `/batches/${batch.id}/subjects`,
        { name: newSubject },
        auth.getToken()!,
      );
      toast.success("Subject added successfully");
      setNewSubject("");
      onUpdate();
    } catch (err) {
      toast.error("Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubject = async (id: string) => {
    if (!confirm("Are you sure? Removing a subject will un-link classes."))
      return;
    try {
      await api.delete(`/batches/${batch.id}/subjects/${id}`, auth.getToken()!);
      toast.success("Subject removed");
      onUpdate();
    } catch (err) {
      toast.error("Failed to remove subject");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-black text-gray-900">Manage Subjects</h3>
          <p className="text-gray-400 text-sm">
            Add or remove subjects for this batch
          </p>
        </div>

        <form onSubmit={handleAddSubject} className="flex gap-2">
          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="e.g. Physics"
            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-xl outline-none transition-all text-sm font-bold"
          />
          <button
            disabled={loading}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
          >
            <PlusIcon className="size-5" />
          </button>
        </form>

        <div className="space-y-2">
          {batch.subjects?.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl group"
            >
              <span className="font-bold text-gray-700">{subject.name}</span>
              <button
                onClick={() => handleRemoveSubject(subject.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-black text-gray-900">Batch Members</h3>
          <p className="text-gray-400 text-sm">
            Overview of students and teachers
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <UsersIcon className="size-5 text-blue-600" />
              <span className="font-black text-gray-900 text-sm">
                Total Students
              </span>
            </div>
            <span className="font-black text-blue-600">
              {batch._count?.students || batch.students?.length || 0}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Assigned Teachers
            </p>
            {batch.teachers?.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center gap-3 p-3 border border-gray-100 rounded-2xl"
              >
                <div className="size-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs text-gray-500">
                  {teacher.name?.[0]}
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {teacher.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
