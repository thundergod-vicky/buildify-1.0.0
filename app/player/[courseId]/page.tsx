"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Course, Lesson } from '@/types';
import { coursesApi } from '@/lib/courses';
import { Loader2, ArrowLeft, ChevronRight, CheckCircle, Circle, Menu } from 'lucide-react';
import { VideoPlayer } from '@/components/dashboard/views/student/VideoPlayer';
import { PDFViewer } from '@/components/dashboard/views/student/PDFViewer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import progressApi from '@/lib/progress';
import { showToast } from '@/lib/toast';

export default function PlayerPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string; // Assume route is /dashboard/player/[courseId]

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
    const [markingComplete, setMarkingComplete] = useState(false);

    // Initial Fetch
    useEffect(() => {
        if (!courseId) return;
        const loadData = async () => {
            try {
                const [courseData, progressData] = await Promise.all([
                    coursesApi.getById(courseId),
                    progressApi.getCourseProgress(courseId)
                ]);
                
                setCourse(courseData);
                setCompletedLessonIds(new Set(progressData.map(p => p.lessonId)));

                // Auto-select first lesson if available
                if (courseData.chapters?.[0]?.lessons?.[0]) {
                    setActiveLesson(courseData.chapters[0].lessons[0]);
                }
            } catch (error) {
                console.error("Failed to load course data", error);
                showToast.error("Failed to load course progress");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [courseId]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!course) return <div className="h-screen flex items-center justify-center">Course not found</div>;

    // Helper to flatten lessons for navigation (prev/next)
    const allLessons = course.chapters?.flatMap(ch => ch.lessons || []) || [];
    const activeIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
    
    const handleNext = () => {
        if (activeIndex < allLessons.length - 1) {
            setActiveLesson(allLessons[activeIndex + 1]);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveLesson(allLessons[activeIndex - 1]);
        }
    };

    const handleMarkComplete = async () => {
        if (!activeLesson || markingComplete) return;
        
        setMarkingComplete(true);
        try {
            await progressApi.markAsComplete(activeLesson.id);
            setCompletedLessonIds(prev => new Set([...Array.from(prev), activeLesson.id]));
            showToast.success("Lesson marked as complete!");
        } catch (error) {
            console.error("Failed to mark lesson complete", error);
            showToast.error("Failed to update progress");
        } finally {
            setMarkingComplete(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 flex items-center px-4 bg-gray-800 border-b border-gray-700 z-10 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4 text-gray-300 hover:text-white">
                        <ArrowLeft className="size-5" />
                    </Button>
                    <h1 className="text-lg font-semibold truncate flex-1">{course.title}</h1>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                        <Menu className="size-5" />
                    </Button>
                </header>

                {/* Player Container */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-black">
                    <div className="w-full max-w-5xl">
                         {activeLesson ? (
                             <div className="space-y-4">
                                 {/* Title above player */}
                                 <h2 className="text-xl font-medium">{activeLesson.title}</h2>
                                 
                                 {/* Player */}
                                 <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
                                     {activeLesson.driveFileId ? (
                                         <>
                                            {/* Logic to determine type based on mimeType or type field */}
                                            {activeLesson.mimeType?.includes('video') ? (
                                                <VideoPlayer 
                                                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/content/stream/${activeLesson.driveFileId}`} 
                                                    mimeType={activeLesson.mimeType} 
                                                />
                                            ) : activeLesson.mimeType?.includes('pdf') ? (
                                                <PDFViewer 
                                                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/content/stream/${activeLesson.driveFileId}`} 
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-500">
                                                    Unsupported content type
                                                </div>
                                            )}
                                         </>
                                     ) : (
                                          <div className="flex items-center justify-center h-full text-gray-500">
                                              No content available for this lesson
                                          </div>
                                     )}
                                 </div>

                                 {/* Navigation & Actions */}
                                 <div className="flex justify-between items-center pt-4">
                                     <div className="flex gap-2">
                                         <Button 
                                            variant="outline" 
                                            onClick={handlePrev} 
                                            disabled={activeIndex === 0}
                                            className="text-black border-gray-600 hover:bg-gray-100"
                                         >
                                             Previous
                                         </Button>
                                         <Button 
                                            variant="outline"
                                            onClick={handleMarkComplete}
                                            disabled={markingComplete || completedLessonIds.has(activeLesson.id)}
                                            className={cn(
                                                "border-indigo-500",
                                                completedLessonIds.has(activeLesson.id) ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/50" : "text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
                                            )}
                                         >
                                             {completedLessonIds.has(activeLesson.id) ? (
                                                 <><CheckCircle className="mr-2 size-4" /> Completed</>
                                             ) : markingComplete ? (
                                                 <><Loader2 className="mr-2 size-4 animate-spin" /> Updating...</>
                                             ) : (
                                                 activeLesson.mimeType?.includes('pdf') ? 'Mark as Read' : 'Mark as Complete'
                                             )}
                                         </Button>
                                     </div>
                                     <Button 
                                        onClick={handleNext} 
                                        disabled={activeIndex === allLessons.length - 1}
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                     >
                                         Next Lesson <ChevronRight className="ml-2 size-4" />
                                     </Button>
                                 </div>
                             </div>
                         ) : (
                             <div className="text-center text-gray-500">Select a lesson to start learning</div>
                         )}
                    </div>
                </main>
            </div>

            {/* Sidebar (Curriculum) */}
            <aside className={cn(
                "w-80 bg-gray-800 border-l border-gray-700 flex flex-col transition-all duration-300 absolute md:relative right-0 h-full z-20",
                sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0 md:w-0 md:border-none overflow-hidden" 
                // Note: on mobile, translate-x handles it. On desktop, let's keep it always visible for now or toggle width.
                // Simplified: Mobile overlay, Desktop collapsible.
            )}>
                  <div className="p-4 border-b border-gray-700 font-semibold text-lg flex justify-between items-center">
                      Course Content
                      <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="md:hidden">
                          <ChevronRight />
                      </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                      {course.chapters?.map((chapter, idx) => (
                          <div key={chapter.id} className="border-b border-gray-700/50">
                               <div className="px-4 py-3 bg-gray-800/50 font-medium text-sm text-gray-400">
                                   Section {idx + 1}: {chapter.title}
                               </div>
                               <div>
                                   {chapter.lessons?.map(lesson => (
                                       <button
                                            key={lesson.id}
                                            onClick={() => {
                                                setActiveLesson(lesson);
                                                if (window.innerWidth < 768) setSidebarOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-3 text-sm flex items-start gap-3 hover:bg-gray-700/50 transition-colors",
                                                activeLesson?.id === lesson.id ? "bg-indigo-600/10 text-indigo-400 border-r-2 border-indigo-500" : "text-gray-300"
                                            )}
                                       >
                                            <div className="mt-0.5">
                                               {completedLessonIds.has(lesson.id) ? (
                                                   <CheckCircle className="size-4 text-indigo-500" />
                                               ) : (
                                                   <Circle className="size-4 text-gray-500" />
                                               )}
                                            </div>
                                           <span className="line-clamp-2">{lesson.title}</span>
                                           <div className="ml-auto text-xs text-gray-500 whitespace-nowrap">
                                               {lesson.duration ? `${Math.round(lesson.duration / 60)} min` : 
                                                lesson.mimeType?.includes('pdf') ? 'Read' : ''}
                                           </div>
                                       </button>
                                   ))}
                               </div>
                          </div>
                      ))}
                  </div>
            </aside>
        </div>
    );
}
