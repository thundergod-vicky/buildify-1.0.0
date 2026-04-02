"use client";

import { useState, useEffect } from "react";
import { SearchIcon, BookOpenIcon, UsersIcon, LayersIcon, Trash2Icon, ExternalLinkIcon, EyeIcon } from "lucide-react";
import { showToast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

import { CourseCreateModal } from "../teacher/CourseCreateModal";

export function AdminCourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    courseId: string;
    courseTitle: string;
  }>({ isOpen: false, courseId: "", courseTitle: "" });
  
  const [sortBy, setSortBy] = useState<"latest" | "title" | "students" | "chapters">("latest");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const allUsers = await api.get<any[]>('/admin/users', token);
      setTeachers(allUsers.filter(u => u.role === 'TEACHER'));
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      
      const data = await api.get<any[]>('/admin/courses', token);
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      showToast.error("Failed to load course library");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    setDeletingId(courseId);
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.delete(`/admin/courses/${courseId}`, token);
      showToast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      console.error("Delete failed:", error);
      showToast.error("Error connecting to server");
    } finally {
      setDeletingId(null);
    }
  };
  const assignTeacher = async (courseId: string, teacherId: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.patch(`/admin/courses/${courseId}`, { teacherId }, token);
      showToast.success("Teacher assigned successfully");
      setIsAssignModalOpen(false);
      fetchCourses();
    } catch (error) {
      console.error("Assignment failed:", error);
      showToast.error("Failed to assign teacher");
    }
  };

  const filteredCourses = courses
    .filter(
      (c) =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.teacher?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title": return (a.title || "").localeCompare(b.title || "");
        case "students": return (b._count?.enrollments || 0) - (a._count?.enrollments || 0);
        case "chapters": return (b._count?.chapters || 0) - (a._count?.chapters || 0);
        case "latest": default: return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-urbanist tracking-tight">Course Oversight</h1>
          <p className="text-[10px] sm:text-sm text-gray-500 font-medium">Audit, monitor, and manage all educational content on the platform</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 font-black text-[10px] sm:text-xs uppercase tracking-widest"
        >
          <BookOpenIcon className="size-3.5 sm:size-4" />
          Create New Course
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
            <SearchIcon className="size-4 text-gray-400 ml-2.5 transition-colors" />
            <input
            type="text"
            placeholder="Search by title or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm font-medium py-2 pr-4 shadow-none"
            />
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm shrink-0">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">Sort:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[10px] sm:text-xs font-black text-gray-700 outline-none cursor-pointer appearance-none uppercase tracking-widest pl-1 pr-6"
          >
            <option value="latest">Latest Added</option>
            <option value="title">Alphabetical</option>
            <option value="students">Most Students</option>
            <option value="chapters">Most Chapters</option>
          </select>
        </div>

        <div className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-purple-100 shrink-0 text-center">
            {courses.length} Active Courses
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 animate-pulse space-y-4">
                    <div className="aspect-video bg-gray-50 rounded-xl"></div>
                    <div className="h-5 bg-gray-50 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-gray-50 rounded-lg w-1/2"></div>
                </div>
            ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
             <div className="flex flex-col items-center gap-4 text-gray-400">
                <BookOpenIcon className="size-10 opacity-20" />
                <p className="text-sm font-medium">No courses found matching your search</p>
             </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-[1.5rem] border border-gray-100 p-4 group flex flex-col justify-between hover:shadow-xl transition-all">
                <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <BookOpenIcon className="size-10" />
                            </div>
                        )}
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 backdrop-blur shadow-sm rounded-md text-[8px] font-black uppercase tracking-widest text-purple-600">
                            ID: {course.id.slice(-6)}
                        </div>
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5 mb-3">
                        <div className="size-4 rounded-full bg-gray-100 flex items-center justify-center text-[6px] font-bold text-gray-500">
                            {course.teacher?.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium truncate">By {course.teacher?.name || 'Unknown Teacher'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 mb-4">
                        <div className="p-2 bg-blue-50/50 rounded-lg text-center">
                            <div className="text-xs font-black text-blue-600">{course._count?.enrollments || 0}</div>
                            <div className="text-[8px] text-gray-400 uppercase font-bold tracking-tighter">Students</div>
                        </div>
                        <div className="p-2 bg-purple-50/50 rounded-lg text-center">
                            <div className="text-xs font-black text-purple-600">{course._count?.chapters || 0}</div>
                            <div className="text-[8px] text-gray-400 uppercase font-bold tracking-tighter">Chapters</div>
                        </div>
                        <div className="p-2 bg-blue-50/50 rounded-lg text-center">
                            <div className="text-xs font-black text-blue-600">₹0</div>
                            <div className="text-[8px] text-gray-400 uppercase font-bold tracking-tighter">Revenue</div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <Link 
                            href={`/player/${course.id}`}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Preview as Student"
                        >
                            <EyeIcon className="size-4" />
                        </Link>
                        <button 
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsAssignModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                            title="Assign Teacher"
                        >
                            <UsersIcon className="size-4" />
                        </button>
                    </div>
                      <button 
                          onClick={() => setConfirmModal({
                            isOpen: true,
                            courseId: course.id,
                            courseTitle: course.title
                          })}
                          disabled={deletingId === course.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Course Permanently"
                      >
                          {deletingId === course.id ? (
                              <div className="size-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                              <Trash2Icon className="size-4" />
                          )}
                      </button>
                </div>
            </div>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CourseCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchCourses();
          }}
        />
      )}
        <ConfirmationModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            onConfirm={() => {
                setConfirmModal({ ...confirmModal, isOpen: false });
                deleteCourse(confirmModal.courseId);
            }}
            title="Delete Course"
            message={`Are you absolutely sure you want to delete "${confirmModal.courseTitle}"? This action cannot be undone and will affect all enrolled students.`}
            confirmText="Delete Permanently"
            variant="danger"
        />

        {/* Assign Teacher Modal */}
        <ConfirmationModal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            onConfirm={() => {}} // Not used as we have a select inside
            title="Update Course Teacher"
            message={`Select a teacher to assign to "${selectedCourse?.title}"`}
            confirmText="Close"
            variant="info"
        >
          <div className="mt-4 space-y-4">
            <select 
              className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
              onChange={(e) => assignTeacher(selectedCourse?.id, e.target.value)}
              defaultValue={selectedCourse?.teacherId}
            >
              <option value="">Select a Teacher</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
              ))}
            </select>
          </div>
        </ConfirmationModal>
    </div>
  );
}
