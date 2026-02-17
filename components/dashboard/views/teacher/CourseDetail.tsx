import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PlusIcon, ChevronDownIcon, FileTextIcon, VideoIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { Course, Chapter, Lesson } from '@/types';
import { coursesApi } from '@/lib/courses';
import { LessonUploadModal } from './LessonUploadModal';

interface CourseDetailProps {
    course: Course;
    onBack: () => void;
}

export function CourseDetail({ course, onBack }: CourseDetailProps) {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddChapter, setShowAddChapter] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    
    // For Lesson Upload
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

    useEffect(() => {
        loadCourseDetails();
    }, [course.id]);

    const loadCourseDetails = async () => {
        setIsLoading(true);
        try {
            const data = await coursesApi.getById(course.id);
            if (data.chapters) {
                setChapters(data.chapters);
            }
        } catch (error) {
            console.error('Failed to load course details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddChapter = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await coursesApi.createChapter(course.id, {
                title: newChapterTitle,
                order: chapters.length + 1
            });
            setShowAddChapter(false);
            setNewChapterTitle('');
            loadCourseDetails();
        } catch (error) {
            console.error('Failed to add chapter:', error);
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                >
                    <ArrowLeftIcon className="size-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                    <p className="text-gray-500 text-sm">Course Management</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chapters List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Curriculum</h2>
                        <button
                            onClick={() => setShowAddChapter(true)}
                            className="text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            + Add Chapter
                        </button>
                    </div>

                    {showAddChapter && (
                        <form onSubmit={handleAddChapter} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-4 animate-in fade-in slide-in-from-top-2">
                            <input
                                autoFocus
                                type="text"
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
                                placeholder="Chapter Title (e.g., Introduction)"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={!newChapterTitle.trim()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddChapter(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </form>
                    )}

                    <div className="space-y-4">
                        {chapters.map((chapter) => (
                            <div key={chapter.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">Chapter {chapter.order}:</span>
                                        {chapter.title}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setSelectedChapterId(chapter.id);
                                            setIsUploadModalOpen(true);
                                        }}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                        <UploadIcon className="size-4" />
                                        Add Content
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {chapter.lessons && chapter.lessons.length > 0 ? (
                                        chapter.lessons.map((lesson) => (
                                            <div key={lesson.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    {lesson.mimeType?.includes('pdf') ? (
                                                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                                            <FileTextIcon className="size-4" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                            <VideoIcon className="size-4" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{lesson.title}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {lesson.mimeType?.includes('pdf') ? 'PDF Document' : 'Video Lesson'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* <div className="flex items-center gap-2">
                                                    <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                                        <TrashIcon className="size-4" />
                                                    </button>
                                                </div> */}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-6 py-8 text-center text-gray-400 text-sm">
                                            No lessons yet. Add content to this chapter.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isUploadModalOpen && selectedChapterId && (
                <LessonUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    chapterId={selectedChapterId}
                    onSuccess={() => {
                        setIsUploadModalOpen(false);
                        loadCourseDetails();
                    }}
                />
            )}
        </div>
    );
}
