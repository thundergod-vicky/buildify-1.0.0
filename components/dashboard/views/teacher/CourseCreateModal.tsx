import { useState, useEffect } from "react";
import {
  XIcon,
  Loader2Icon,
  UserIcon,
  LayersIcon,
  BookOpenIcon,
} from "lucide-react";
import { coursesApi } from "@/lib/courses";
import { CourseType, Role } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

interface CourseCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CourseCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: CourseCreateModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseType: CourseType.PUBLIC as CourseType,
    teacherId: "",
    batchId: "",
    subjectId: "",
  });

  const isAdminOrOps =
    user?.role === Role.ADMIN || user?.role === Role.ACADEMIC_OPERATIONS;

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

  useEffect(() => {
    if (isOpen) {
      if (isAdminOrOps) fetchTeachers();
      fetchBatches();
    }
  }, [isOpen, isAdminOrOps]);

  useEffect(() => {
    if (formData.batchId) {
      fetchSubjects(formData.batchId);
    } else {
      setSubjects([]);
      setFormData((prev) => ({ ...prev, subjectId: "" }));
    }
  }, [formData.batchId]);

  const fetchBatches = async () => {
    try {
      const token = auth.getToken();
      const data = await api.get<any[]>("/batches", token || undefined);
      setBatches(data);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  };

  const fetchSubjects = async (batchId: string) => {
    try {
      const token = auth.getToken();
      const data = await api.get<any[]>(
        `/batches/${batchId}/subjects`,
        token || undefined,
      );
      setSubjects(data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = auth.getToken();
      const data = await api.get<any[]>("/users/teachers", token || undefined);
      setTeachers(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await coursesApi.create(formData);
      onSuccess();
    } catch (error) {
      console.error("Failed to create course:", error);
      // Handle error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Create New Course</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="size-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Course Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g., Advanced Mathematics"
            />
          </div>

          {isAdminOrOps && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Assigned Teacher
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <select
                  required={isAdminOrOps}
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all"
                >
                  <option value="">Select a teacher...</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Batch Code{" "}
                  {formData.courseType === CourseType.PREMIUM && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className="relative group">
                  <LayersIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <select
                    required={formData.courseType === CourseType.PREMIUM}
                    value={formData.batchId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        batchId: e.target.value,
                        subjectId: "",
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all"
                  >
                    <option value="">
                      {formData.courseType === CourseType.PREMIUM
                        ? "Select Batch (Required)"
                        : "Select Batch (Optional)"}
                    </option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Subject (Inside Batch)
                </label>
                <div className="relative group">
                  <BookOpenIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <select
                    value={formData.subjectId}
                    onChange={(e) =>
                      setFormData({ ...formData, subjectId: e.target.value })
                    }
                    disabled={!formData.batchId}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Select Subject...</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                placeholder="Describe what this course is about..."
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Course Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="courseType"
                  value={CourseType.PUBLIC}
                  checked={formData.courseType === CourseType.PUBLIC}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseType: e.target.value as CourseType,
                    })
                  }
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Public Course</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="courseType"
                  value={CourseType.PREMIUM}
                  checked={formData.courseType === CourseType.PREMIUM}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseType: e.target.value as CourseType,
                    })
                  }
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Premium Course</span>
              </label>
            </div>
            {formData.courseType === CourseType.PREMIUM && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 Premium courses are only visible to students you assign.
                  You can assign students after creating the course.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
