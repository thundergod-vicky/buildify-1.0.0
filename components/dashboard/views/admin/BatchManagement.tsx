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
  UserCheckIcon
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
  const [isAssignTeacherModalOpen, setIsAssignTeacherModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [newBatch, setNewBatch] = useState({ name: "", description: "", teacherIds: [] as string[] });
  const [assignStudentIds, setAssignStudentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (err) {
      toast.error("Failed to create batch");
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.delete(`/batches/${id}`, token);
      toast.success("Batch deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete batch");
    }
  };

  const handleAssignStudents = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.patch(`/batches/${selectedBatch.id}/students`, { studentIds: assignStudentIds }, token);
      toast.success("Students assigned successfully");
      setIsAssignModalOpen(false);
      setAssignStudentIds([]);
      fetchData();
    } catch (err) {
      toast.error("Failed to assign students");
    }
  };

  const filteredBatches = batches.filter(b => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.teachers?.some((t: any) => t.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-urbanist">Batch Management</h1>
          <p className="text-gray-500 mt-1">Organize students and teachers into class batches</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <PlusIcon className="size-5" />
          Create New Batch
        </button>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search batches or teachers..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 min-h-[400px]">
            <div className="spinner scale-75"></div>
            <p className="text-gray-400 font-medium animate-pulse mt-4">Loading batches...</p>
          </div>
        ) : filteredBatches.length > 0 ? (
          filteredBatches.map((batch) => (
            <AnimatedContent key={batch.id}>
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <LayersIcon className="size-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={async () => {
                        const token = auth.getToken();
                        if (!token) return;
                        // Fetch the full batch details to get current students
                        const fullBatch = await api.get<any>(`/batches/${batch.id}`, token);
                        setSelectedBatch(fullBatch);
                        setAssignStudentIds(fullBatch.students?.map((s: any) => s.id) || []);
                        setIsAssignModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Assign Students"
                    >
                      <UserPlusIcon className="size-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedBatch(batch);
                        setIsAssignTeacherModalOpen(true);
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Assign Teachers"
                    >
                      <UserCheckIcon className="size-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Batch"
                    >
                      <Trash2Icon className="size-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{batch.name}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[40px]">{batch.description || "No description provided."}</p>

                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase ml-1">Teachers</p>
                    <div className="flex flex-wrap gap-2">
                      {batch.teachers && batch.teachers.length > 0 ? (
                        batch.teachers.map((teacher: any) => (
                          <div key={teacher.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl border border-blue-100/50">
                            <div className="size-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                              {teacher.name?.[0] || "T"}
                            </div>
                            <span className="text-xs font-bold text-gray-700">{teacher.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-400 italic">Unassigned</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <UsersIcon className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Students</p>
                      <p className="text-sm font-bold text-gray-900">{batch._count?.students || 0} Enrolled</p>
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
            <h3 className="text-xl font-bold text-gray-900">No Batches Found</h3>
            <p className="text-gray-500">Create your first batch to start organizing students.</p>
          </div>
        )}
      </div>

      {/* Create Batch Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Create New Batch</h2>
              <p className="text-gray-500">Enter batch details and assign a teacher</p>
            </div>
            <form onSubmit={handleCreateBatch} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Batch Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Morning Batch - Math 10"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Description</label>
                  <textarea
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Brief details about the batch..."
                    value={newBatch.description}
                    onChange={(e) => setNewBatch({...newBatch, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Assign Teachers (Select Multiple)</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {teachers.map(t => (
                      <div 
                        key={t.id}
                        onClick={() => {
                          if (newBatch.teacherIds.includes(t.id)) {
                            setNewBatch({...newBatch, teacherIds: newBatch.teacherIds.filter(id => id !== t.id)});
                          } else {
                            setNewBatch({...newBatch, teacherIds: [...newBatch.teacherIds, t.id]});
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          newBatch.teacherIds.includes(t.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold group-hover:text-blue-600">
                            {t.name?.[0] || "T"}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{t.name}</span>
                        </div>
                        {newBatch.teacherIds.includes(t.id) && (
                          <div className="size-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <PlusIcon className="size-3" />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Assign Students: {selectedBatch?.name}</h2>
              <p className="text-gray-500">Select multiple students to add to this batch</p>
            </div>
            <div className="p-8 flex-1 overflow-y-auto space-y-4">
              {students.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => {
                    if (assignStudentIds.includes(s.id)) {
                      setAssignStudentIds(assignStudentIds.filter(id => id !== s.id));
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
            </div>
            <div className="p-8 border-t border-gray-100 flex gap-4 bg-gray-50">
              <button 
                onClick={() => setIsAssignModalOpen(false)}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Manage Teachers: {selectedBatch?.name}</h2>
              <p className="text-gray-500">Assign or remove teachers for this batch</p>
            </div>
            <div className="p-8 max-h-[400px] overflow-y-auto space-y-2">
              {teachers.map(t => {
                const isAssigned = selectedBatch?.teachers?.some((bt: any) => bt.id === t.id);
                return (
                  <div 
                    key={t.id}
                    onClick={async () => {
                      const token = auth.getToken();
                      if (!token) return;
                      
                      const currentTeacherIds = selectedBatch?.teachers?.map((bt: any) => bt.id) || [];
                      let newTeacherIds;
                      if (isAssigned) {
                        newTeacherIds = currentTeacherIds.filter((id: string) => id !== t.id);
                      } else {
                        newTeacherIds = [...currentTeacherIds, t.id];
                      }

                      try {
                        await api.patch(`/batches/${selectedBatch.id}/teachers`, { teacherIds: newTeacherIds }, token);
                        toast.success(isAssigned ? "Teacher removed" : "Teacher assigned");
                        // Update local selectedBatch state to reflect changes immediately in modal if needed, 
                        // but fetchData will handle it for the main UI.
                        const updatedBatch = await api.get<any>(`/batches/${selectedBatch.id}`, token);
                        setSelectedBatch(updatedBatch);
                        fetchData();
                      } catch (err) {
                        toast.error("Failed to update teachers");
                      }
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      isAssigned 
                        ? "border-indigo-500 bg-indigo-50 shadow-sm" 
                        : "border-gray-100 hover:bg-gray-50 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${isAssigned ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {t.name?.[0] || "T"}
                      </div>
                      <div>
                        <p className={`font-bold ${isAssigned ? 'text-indigo-900' : 'text-gray-500'}`}>{t.name}</p>
                        <p className="text-xs opacity-60">{t.email}</p>
                      </div>
                    </div>
                    {isAssigned && (
                      <div className="size-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                        <PlusIcon className="size-4 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="p-8 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setIsAssignTeacherModalOpen(false)}
                className="w-full px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
