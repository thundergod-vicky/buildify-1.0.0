"use client";

import { useState, useEffect } from "react";
import { SearchIcon, BookOpenIcon, UsersIcon, LayersIcon, Trash2Icon, ExternalLinkIcon, EyeIcon } from "lucide-react";
import { showToast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import Link from "next/link";

export function AdminCourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    courseId: string;
    courseTitle: string;
  }>({ isOpen: false, courseId: "", courseTitle: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const filteredCourses = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">Course Oversight</h1>
        <p className="text-gray-500 mt-1">Audit, monitor, and manage all educational content on the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-md group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input
            type="text"
            placeholder="Search by title or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
            />
        </div>
        <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-bold border border-purple-100">
            {courses.length} Active Courses
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse space-y-4">
                    <div className="h-40 bg-gray-50 rounded-2xl"></div>
                    <div className="h-6 bg-gray-50 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-50 rounded-lg w-1/2"></div>
                </div>
            ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center">
             <div className="flex flex-col items-center gap-4 text-gray-400">
                <BookOpenIcon className="size-12 opacity-20" />
                <p className="font-medium">No courses found matching your search</p>
             </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-purple-500/5 transition-all group flex flex-col justify-between">
                <div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-6">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <BookOpenIcon className="size-12" />
                            </div>
                        )}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-purple-600">
                            ID: {course.id.slice(-6)}
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-1 mb-4">
                        <div className="size-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">
                            {course.teacher?.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">By {course.teacher?.name || 'Unknown Teacher'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="p-3 bg-blue-50/50 rounded-xl text-center">
                            <div className="text-sm font-black text-blue-600">{course._count?.enrollments || 0}</div>
                            <div className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Students</div>
                        </div>
                        <div className="p-3 bg-purple-50/50 rounded-xl text-center">
                            <div className="text-sm font-black text-purple-600">{course._count?.chapters || 0}</div>
                            <div className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Chapters</div>
                        </div>
                        <div className="p-3 bg-orange-50/50 rounded-xl text-center">
                            <div className="text-sm font-black text-orange-600">₹0</div>
                            <div className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Revenue</div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Link 
                            href={`/player/${course.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Preview as Student"
                        >
                            <EyeIcon className="size-5" />
                        </Link>
                        <button 
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                            title="Manage Content"
                        >
                            <LayersIcon className="size-5" />
                        </button>
                    </div>
                    <button 
                        onClick={() => setConfirmModal({
                          isOpen: true,
                          courseId: course.id,
                          courseTitle: course.title
                        })}
                        disabled={deletingId === course.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Course Permanently"
                    >
                        {deletingId === course.id ? (
                            <div className="size-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Trash2Icon className="size-5" />
                        )}
                    </button>
                </div>
            </div>
          ))}
        </div>
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
    </div>
  );
}
