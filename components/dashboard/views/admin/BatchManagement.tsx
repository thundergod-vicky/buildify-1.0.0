/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  LayersIcon,
  PlusIcon,
  UserPlusIcon,
  UsersIcon,
  Trash2Icon,
  SearchIcon,
  GraduationCapIcon,
  UserCheckIcon,
  ExternalLinkIcon,
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { toast } from "react-toastify";

export function AdminBatchManagement() {
  const [batches, setBatches] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssignTeacherModalOpen, setIsAssignTeacherModalOpen] =
    useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [newBatch, setNewBatch] = useState({
    name: "",
    description: "",
    teacherIds: [] as string[],
  });
  const [assignStudentIds, setAssignStudentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");
  
  // Delete Protection states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [batchToDelete, setBatchToDelete] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;

      const [batchesData, teachersData, studentsData] = await Promise.all([
        api.get<any[]>("/batches", token),
        api.get<any[]>("/users/teachers", token),
        api.get<any[]>("/users/students", token),
      ]);

      setBatches(batchesData);
      setTeachers(teachersData);
      setStudents(studentsData);
    } catch {
      console.error("Failed to fetch data");
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const isAnyModalOpen =
      isCreateModalOpen || isAssignModalOpen || isAssignTeacherModalOpen;
    if (isAnyModalOpen) {
      document.body.classList.add("lock-scroll");
      document.documentElement.classList.add("lock-scroll");
    } else {
      document.body.classList.remove("lock-scroll");
      document.documentElement.classList.remove("lock-scroll");
    }
    return () => {
      document.body.classList.remove("lock-scroll");
      document.documentElement.classList.remove("lock-scroll");
    };
  }, [isCreateModalOpen, isAssignModalOpen, isAssignTeacherModalOpen]);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.post("/batches", newBatch, token);
      toast.success("Batch created successfully");
      setIsCreateModalOpen(false);
      setNewBatch({ name: "", description: "", teacherIds: [] });
      fetchData();
    } catch {
      toast.error("Failed to create batch");
    }
  };

  const handleDeleteBatch = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete") return;
    if (!batchToDelete) return;

    try {
      const token = auth.getToken();
      if (!token) return;

      await api.delete(`/batches/${batchToDelete}`, token);
      toast.success("Batch deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeleteConfirmText("");
      setBatchToDelete(null);
      fetchData();
    } catch {
      toast.error("Failed to delete batch");
    }
  };

  const handleAssignStudents = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.patch(
        `/batches/${selectedBatch.id}/students`,
        { studentIds: assignStudentIds },
        token,
      );
      toast.success("Students assigned successfully");
      setIsAssignModalOpen(false);
      setAssignStudentIds([]);
      setStudentSearchQuery(""); // Reset search when closing
      fetchData();
    } catch {
      toast.error("Failed to assign students");
    }
  };

  const filteredBatches = batches.filter(
    (b) =>
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.teachers?.some((t: any) =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-urbanist">
            Batch Management
          </h1>
          <p className="text-[10px] sm:text-sm text-gray-500 mt-1">
            Organize students and teachers into class batches
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-[10px] sm:text-xs"
        >
          <PlusIcon className="size-4" />
          Create New Batch
        </button>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search batches or teachers..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-xs sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 min-h-[400px]">
            <div className="spinner scale-75"></div>
            <p className="text-gray-400 font-medium animate-pulse mt-4">
              Loading batches...
            </p>
          </div>
        ) : filteredBatches.length > 0 ? (
          filteredBatches.map((batch) => (
            <AnimatedContent key={batch.id}>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <LayersIcon className="size-5" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        (window.location.href = `/dashboard?view=batch-details&batchId=${batch.id}`)
                      }
                      className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View Detailed Profile"
                    >
                      <ExternalLinkIcon className="size-4" />
                    </button>
                    <button
                      onClick={async () => {
                        const token = auth.getToken();
                        if (!token) return;
                        // Fetch the full batch details to get current students
                        const fullBatch = await api.get<any>(
                          `/batches/${batch.id}`,
                          token,
                        );
                        setSelectedBatch(fullBatch);
                        setAssignStudentIds(
                          fullBatch.students?.map((s: any) => s.id) || [],
                        );
                        setStudentSearchQuery(""); // Reset search when opening
                        setIsAssignModalOpen(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Assign Students"
                    >
                      <UserPlusIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBatch(batch);
                        setTeacherSearchQuery(""); // Reset search when opening
                        setIsAssignTeacherModalOpen(true);
                      }}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Assign Teachers"
                    >
                      <UserCheckIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => {
                        setBatchToDelete(batch.id);
                        setDeleteConfirmText("");
                        setIsDeleteDialogOpen(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Batch"
                    >
                      <Trash2Icon className="size-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                  {batch.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">
                  {batch.description || "No description provided."}
                </p>

                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase ml-1">
                      Teachers
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {batch.teachers && batch.teachers.length > 0 ? (
                        batch.teachers.map((teacher: any) => (
                          <div
                            key={teacher.id}
                            className="flex items-center gap-1.5 p-1.5 bg-blue-50 rounded-lg border border-blue-100/50"
                          >
                            <div className="size-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold">
                              {teacher.name?.[0] || "T"}
                            </div>
                            <span className="text-[10px] font-bold text-gray-700">
                              {teacher.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-400 italic">
                            Unassigned
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 bg-gray-50 rounded-xl">
                    <div className="size-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <UsersIcon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-400 font-bold uppercase leading-none">
                        Students
                      </p>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">
                        {batch._count?.students || 0} Enrolled
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <LayersIcon className="size-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              No Batches Found
            </h3>
            <p className="text-gray-500">
              Create your first batch to start organizing students.
            </p>
          </div>
        )}
      </div>

      {/* Create Batch Modal */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 sm:p-8 border-b border-gray-100 shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Create New Batch
              </h2>
              <p className="text-gray-500 text-sm">
                Enter batch details and assign a teacher
              </p>
            </div>
            <form onSubmit={handleCreateBatch} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 minimal-scrollbar">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Batch Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Morning Batch - Math 10"
                    value={newBatch.name}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Brief details about the batch..."
                    value={newBatch.description}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Assign Teachers (Select Multiple)
                  </label>
                  <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 minimal-scrollbar" style={{ overscrollBehavior: 'contain' }}>
                    {teachers.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          if (newBatch.teacherIds.includes(t.id)) {
                            setNewBatch({
                              ...newBatch,
                              teacherIds: newBatch.teacherIds.filter(
                                (id) => id !== t.id,
                              ),
                            });
                          } else {
                            setNewBatch({
                              ...newBatch,
                              teacherIds: [...newBatch.teacherIds, t.id],
                            });
                          }
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          newBatch.teacherIds.includes(t.id)
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500">
                             <UsersIcon className="size-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{t.name}</p>
                            <p className="text-xs text-gray-500">{t.email}</p>
                          </div>
                        </div>
                        {newBatch.teacherIds.includes(t.id) && (
                          <div className="size-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <PlusIcon className="size-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Students Modal */}
      {isAssignModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Students: {selectedBatch?.name}
              </h2>
              <p className="text-gray-500">
                Select multiple students to add to this batch
              </p>
              <div className="mt-6 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="p-8 flex-1 overflow-y-auto space-y-4 minimal-scrollbar" style={{ overscrollBehavior: 'contain' }}>
              {students
                .filter(
                  (s) =>
                    s.name
                      ?.toLowerCase()
                      .includes(studentSearchQuery.toLowerCase()) ||
                    s.email
                      ?.toLowerCase()
                      .includes(studentSearchQuery.toLowerCase()),
                )
                .map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      if (assignStudentIds.includes(s.id)) {
                        setAssignStudentIds(
                          assignStudentIds.filter((id) => id !== s.id),
                        );
                      } else {
                        setAssignStudentIds([...assignStudentIds, s.id]);
                      }
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      assignStudentIds.includes(s.id)
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500">
                        <GraduationCapIcon className="size-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </div>
                    </div>
                    {assignStudentIds.includes(s.id) && (
                      <div className="size-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <PlusIcon className="size-4" />
                      </div>
                    )}
                  </div>
                ))}
              {students.filter(
                (s) =>
                  s.name
                    ?.toLowerCase()
                    .includes(studentSearchQuery.toLowerCase()) ||
                  s.email
                    ?.toLowerCase()
                    .includes(studentSearchQuery.toLowerCase()),
              ).length === 0 && (
                <div className="py-10 text-center text-gray-400 font-medium">
                  No students found matching your search.
                </div>
              )}
            </div>
            <div className="p-8 border-t border-gray-100 flex gap-4 bg-gray-50">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setStudentSearchQuery("");
                }}
                className="flex-1 px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignStudents}
                disabled={assignStudentIds.length === 0}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign {assignStudentIds.length} Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Teachers Modal */}
      {isAssignTeacherModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 sm:p-8 border-b border-gray-100 shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Manage Teachers: {selectedBatch?.name}
              </h2>
              <p className="text-gray-500 text-sm">
                Assign or remove teachers for this batch
              </p>
              <div className="mt-6 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers by name or email..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={teacherSearchQuery}
                  onChange={(e) => setTeacherSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 sm:p-8 overflow-y-auto space-y-4 minimal-scrollbar flex-1" style={{ overscrollBehavior: 'contain' }}>
              {teachers
                .filter(
                  (t) =>
                    t.name
                      ?.toLowerCase()
                      .includes(teacherSearchQuery.toLowerCase()) ||
                    t.email
                      ?.toLowerCase()
                      .includes(teacherSearchQuery.toLowerCase()),
                )
                .map((t) => {
                const isAssigned = selectedBatch?.teachers?.some(
                  (bt: any) => bt.id === t.id,
                );
                return (
                  <div
                    key={t.id}
                    onClick={async () => {
                      const token = auth.getToken();
                      if (!token) return;

                      const currentTeacherIds =
                        selectedBatch?.teachers?.map((bt: any) => bt.id) || [];
                      let newTeacherIds;
                      if (isAssigned) {
                        newTeacherIds = currentTeacherIds.filter(
                          (id: string) => id !== t.id,
                        );
                      } else {
                        newTeacherIds = [...currentTeacherIds, t.id];
                      }

                      try {
                        await api.patch(
                          `/batches/${selectedBatch.id}/teachers`,
                          { teacherIds: newTeacherIds },
                          token,
                        );
                        toast.success(
                          isAssigned ? "Teacher removed" : "Teacher assigned",
                        );
                        const updatedBatch = await api.get<any>(
                          `/batches/${selectedBatch.id}`,
                          token,
                        );
                        setSelectedBatch(updatedBatch);
                        fetchData();
                      } catch {
                        toast.error("Failed to update teachers");
                      }
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      isAssigned
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`size-10 rounded-full flex items-center justify-center border border-gray-100 bg-white text-gray-500 transition-colors ${isAssigned ? "border-blue-200" : ""}`}
                      >
                        <UsersIcon className="size-5" />
                      </div>
                      <div>
                        <p
                          className={`font-bold ${isAssigned ? "text-blue-900" : "text-gray-900"}`}
                        >
                          {t.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t.email}
                        </p>
                      </div>
                    </div>
                    {isAssigned && (
                      <div className="size-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <PlusIcon className="size-4 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
              {teachers.filter(
                (t) =>
                  t.name
                    ?.toLowerCase()
                    .includes(teacherSearchQuery.toLowerCase()) ||
                  t.email
                    ?.toLowerCase()
                    .includes(teacherSearchQuery.toLowerCase()),
              ).length === 0 && (
                <div className="py-10 text-center text-gray-400 font-medium">
                  No teachers found matching your search.
                </div>
              )}
            </div>
    <div className="p-8 border-t border-gray-100 bg-gray-50">
      <button
        onClick={() => {
          setIsAssignTeacherModalOpen(false);
          setTeacherSearchQuery("");
        }}
        className="w-full px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
</div>
)}

{/* Delete Confirmation Modal */}
{isDeleteDialogOpen && (
<div 
  className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in"
  onWheel={(e) => e.stopPropagation()}
>
  <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-red-100 flex flex-col p-8 space-y-6">
    <div className="text-center space-y-4">
      <div className="size-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
        <Trash2Icon className="size-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-900 font-urbanist">
          Are you sure?
        </h2>
        <p className="text-gray-500 font-medium leading-relaxed">
          This action is permanent and cannot be undone. All batch data and student/teacher associations will be deleted.
        </p>
      </div>
    </div>

    <div className="space-y-3">
      <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        Type <span className="text-red-600">delete</span> below to confirm
      </p>
      <input
        type="text"
        autoFocus
        value={deleteConfirmText}
        onChange={(e) => setDeleteConfirmText(e.target.value)}
        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-center text-gray-900 placeholder:text-gray-300"
        placeholder="Type 'delete' here..."
      />
    </div>

    <div className="flex gap-4 pt-2">
      <button
        onClick={() => {
          setIsDeleteDialogOpen(false);
          setDeleteConfirmText("");
          setBatchToDelete(null);
        }}
        className="flex-1 px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all border border-transparent"
      >
        Cancel
      </button>
      <button
        onClick={handleDeleteBatch}
        disabled={deleteConfirmText.toLowerCase() !== "delete"}
        className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
      >
        Okay
      </button>
    </div>
  </div>
</div>
)}
</div>
  );
}
