import { useState, useEffect } from 'react';
import { PlusIcon, BookOpenIcon, VideoIcon, FileTextIcon, MoreVerticalIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { coursesApi } from '@/lib/courses';
import { Course } from '@/types';
import { CourseCreateModal } from './CourseCreateModal';
import { CourseDetail } from './CourseDetail';
import { StudentAssignmentModal } from './StudentAssignmentModal';

export function TeacherCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [assignmentModalCourse, setAssignmentModalCourse] = useState<Course | null>(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await coursesApi.getByTeacher();
            setCourses(data);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedCourse) {
        return (
            <CourseDetail
                course={selectedCourse}
                onBack={() => {
                    setSelectedCourse(null);
                    loadCourses(); // Refresh in case of changes
                }}
            />
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                    <p className="text-gray-500 mt-1">Manage your courses and content</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    <PlusIcon className="size-5" />
                    Create Course
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <BookOpenIcon className="size-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
                    <p className="text-gray-500 mt-1">Create your first course to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer"
                        >
                            <div className="aspect-video rounded-xl bg-gray-100 mb-4 overflow-hidden relative">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                                        <BookOpenIcon className="size-10 text-indigo-300" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                {course.description || 'No description'}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FileTextIcon className="size-4" />
                                        {course.chapters?.length || 0} Chapters
                                    </span>
                                </div>
                                <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 rounded-full">
                                    Published
                                </span>
                            </div>
                            
                            {/* Course Type Badge and Actions */}
                            <div className="flex items-center justify-between gap-2 mt-3">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                    course.courseType === 'PREMIUM' 
                                        ? 'bg-purple-100 text-purple-700' 
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {course.courseType === 'PREMIUM' ? '⭐ Premium' : '🌐 Public'}
                                </span>
                                
                                {course.courseType === 'PREMIUM' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAssignmentModalCourse(course);
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                    >
                                        <UsersIcon className="size-3" />
                                        Assign Students
                                    </button>
                                )}
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
                        loadCourses();
                    }}
                />
            )}

            {assignmentModalCourse && (
                <StudentAssignmentModal
                    isOpen={!!assignmentModalCourse}
                    onClose={() => setAssignmentModalCourse(null)}
                    courseId={assignmentModalCourse.id}
                    courseTitle={assignmentModalCourse.title}
                />
            )}
        </div>
    );
}
