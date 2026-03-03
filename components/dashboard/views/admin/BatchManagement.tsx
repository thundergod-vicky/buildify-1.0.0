"use client";

import { useState, useEffect } from "react";
import { 
  LayersIcon, 
  PlusIcon, 
  UserPlusIcon, 
  UsersIcon,
  Trash2Icon,
  SearchIcon,
  SettingsIcon,
  GraduationCapIcon
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
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [newBatch, setNewBatch] = useState({ name: "", description: "", teacherId: "" });
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
      setNewBatch({ name: "", description: "", teacherId: "" });
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
    b.teacher?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl" />
          ))
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
                      onClick={() => {
                        setSelectedBatch(batch);
                        setIsAssignModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Assign Students"
                    >
                      <UserPlusIcon className="size-5" />
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
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                      {batch.teacher?.name?.[0] || "T"}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Teacher</p>
                      <p className="text-sm font-bold text-gray-900">{batch.teacher?.name || "Unassigned"}</p>
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
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Assign Teacher</label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newBatch.teacherId}
                    onChange={(e) => setNewBatch({...newBatch, teacherId: e.target.value})}
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                    ))}
                  </select>
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
    </div>
  );
}
