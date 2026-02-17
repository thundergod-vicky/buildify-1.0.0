"use client";

import { useState, useEffect } from "react";
import { PlusIcon, FileTextIcon, SearchIcon, Trash2Icon, Edit2Icon } from "lucide-react";
import { PracticeTest } from "@/types";
import { TeacherPracticeTestCreate } from "./PracticeTestCreate";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { showToast } from "@/lib/toast";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export function TeacherTests() {
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTest, setEditingTest] = useState<PracticeTest | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    testId: string;
  }>({ isOpen: false, testId: "" });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      
      const data = await api.get<PracticeTest[]>('/practice-tests/teacher', token);
      setTests(data);
    } catch (error) {
      console.error("Failed to fetch tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.delete(`/practice-tests/${id}`, token);
      showToast.success("Test deleted successfully");
      setTests(tests.filter(t => t.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      showToast.error("Failed to delete test");
    }
  };

  const handleEdit = (test: PracticeTest) => {
    setEditingTest(test);
    setIsCreating(true);
  };

  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCreating) {
    return (
      <TeacherPracticeTestCreate 
        initialData={editingTest || undefined} 
        onBack={() => { 
          setIsCreating(false); 
          setEditingTest(null); 
          fetchTests(); 
        }} 
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-urbanist">Practice Tests</h1>
          <p className="text-gray-500 mt-1">Manage and create tests for your students</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 font-semibold w-fit"
        >
          <PlusIcon className="size-5" />
          Create New Test
        </button>
      </div>

      {/* Stats/Filters Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse h-48" />
          ))}
        </div>
      ) : filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all relative overflow-hidden"
            >
              
              
              <div className="size-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileTextIcon className="size-6 text-orange-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 font-urbanist group-hover:text-orange-600 transition-colors line-clamp-1">
                {test.title}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                   <span className="font-semibold text-gray-900">{test.totalQuestions}</span> Questions
                </span>
                <span className="size-1 bg-gray-300 rounded-full" />
                <span>Created {new Date(test.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => handleEdit(test)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Edit2Icon className="size-4" />
                  Edit
                </button>
                <button 
                  onClick={() => setDeleteModal({ isOpen: true, testId: test.id })}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2Icon className="size-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileTextIcon className="size-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-urbanist">No tests found</h3>
          <p className="text-gray-500 mt-2">Create your first practice test to get started</p>
          <button
             onClick={() => setIsCreating(true)}
             className="mt-6 text-orange-600 font-semibold hover:underline"
          >
            Create Test Now
          </button>
        </div>
      )}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => {
          setDeleteModal({ ...deleteModal, isOpen: false });
          handleDelete(deleteModal.testId);
        }}
        title="Delete Practice Test"
        message="Are you sure you want to delete this test? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}