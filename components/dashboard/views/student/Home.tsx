"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/stat-card";
import { 
    BookOpenIcon, 
    FileTextIcon, 
    ClockIcon, 
    TrophyIcon,
    PlayCircleIcon,
    ArrowRightIcon
} from "lucide-react";
import Link from "next/link";
import AnimatedContent from "@/components/animated-content";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import enrollmentsApi, { Enrollment } from "@/lib/enrollments";
import { useAuth } from "@/contexts/AuthContext";

export function StudentHome() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = auth.getToken();
                if (!token) return;

                const [enrollData, resultsData]: [Enrollment[], any] = await Promise.all([
                    enrollmentsApi.getMyCourses(),
                    api.get<any[]>('/practice-tests/results/student', token)
                ]);
                
                setEnrollments(enrollData);
                setTestResults(resultsData);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const averageScore = testResults.length > 0 
        ? Math.round(testResults.reduce((acc, curr) => acc + (curr.score / curr.total * 100), 0) / testResults.length)
        : 0;
    
    const averageRating = testResults.length > 0
        ? (testResults.reduce((acc, curr) => acc + (curr.rating || 0), 0) / testResults.length).toFixed(1)
        : "0.0";

    return (
        <div className="p-8 space-y-8">
            {user?.role === 'STUDENT' && user?.admission?.status !== 'APPROVED' && (
                <AnimatedContent>
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-2xl flex items-center justify-between">
                        <p className="text-sm font-medium">
                            Your account is waiting for approval. Please call @ +91 9475 974 315 or email adhyayan.durgapur@gmail.com to complete the admission process and approve your account.
                        </p>
                    </div>
                </AnimatedContent>
            )}

            {/* Welcome Banner */}
            <AnimatedContent distance={20}>
                <div className="bg-gradient-to-r from-blue-600 to-sky-400 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold font-urbanist">Welcome back, {user?.name || 'Student'}! 👋</h1>
                            {user?.enrollmentId && (
                                <span className="bg-white/20 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                                    ID: {user.enrollmentId}
                                </span>
                            )}
                        </div>
                        <p className="mt-2 text-blue-50/80 text-lg">
                            Welcome to the dashboard! Here you can track your progress and manage your courses.
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <Link href="/dashboard?view=courses" className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                                Resume Learning
                            </Link>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="size-8 rounded-full border-2 border-blue-500 bg-sky-300 flex items-center justify-center text-[10px] font-bold">
                                        JD
                                    </div>
                                ))}
                                <div className="size-8 rounded-full border-2 border-blue-500 bg-sky-200 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                    +12
                                </div>
                            </div>
                            {/* <span className="text-sm text-blue-100">Joining you in the live session</span> */}
                        </div>
                    </div>
                    {/* Decorative abstract shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-sky-300/20 rounded-full blur-2xl"></div>
                </div>
            </AnimatedContent>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedContent delay={0.1} distance={20}>
                    <StatCard 
                        title="Enrolled Courses" 
                        value={enrollments.length.toString()} 
                        icon={BookOpenIcon}
                        colorClass="bg-blue-50 text-blue-600"
                        loading={loading}
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.2} distance={20}>
                    <StatCard 
                        title="Completed Tests" 
                        value={testResults.length.toString()} 
                        icon={FileTextIcon}
                        colorClass="bg-sky-50 text-sky-600"
                        loading={loading}
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.3} distance={20}>
                    <StatCard 
                        title="Study Hours" 
                        value="0h" 
                        icon={ClockIcon}
                        colorClass="bg-yellow-50 text-yellow-600"
                        loading={true}
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.4} distance={20}>
                    <StatCard 
                        title="Average Score" 
                        value={`${averageScore}%`} 
                        icon={TrophyIcon}
                        colorClass="bg-gray-100 text-gray-600"
                        loading={loading}
                    />
                </AnimatedContent>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ongoing & Upcoming Section */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatedContent delay={0.5} distance={20}>
                        <div className="bg-white rounded-3xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Ongoing Session</h2>
                                <Link href="/dashboard/live" className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                                    Join Now <ArrowRightIcon className="size-4" />
                                </Link>
                            </div>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200" 
                                    alt="Live Class" 
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <button className="size-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 transition-transform">
                                        <PlayCircleIcon className="size-8 fill-current" />
                                    </button>
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2">
                                        <div className="size-1.5 bg-white rounded-full animate-pulse"></div>
                                        LIVE
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="text-sm font-medium opacity-80">Advanced Physics</p>
                                        <h3 className="text-xl font-bold">Quantum Mechanics - Session 04</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent delay={0.6} distance={20}>
                        <div className="bg-white rounded-3xl border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Path</h2>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="size-12 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
                                    </div>
                                ) : enrollments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No enrolled courses yet</p>
                                        <Link href="/dashboard/courses" className="text-blue-600 hover:text-blue-700 font-semibold mt-2 inline-block">
                                            Browse Courses
                                        </Link>
                                    </div>
                                ) : (
                                    enrollments.map((enrollment, i) => (
                                        <Link 
                                            key={enrollment.id} 
                                            href={`/player/${enrollment.courseId}`}
                                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                                                    <BookOpenIcon className="size-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{enrollment.course.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">{enrollment.course._count.chapters} chapters</p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                                                <ArrowRightIcon className="size-5" />
                                            </button>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </AnimatedContent>
                </div>

                {/* Performance & Quizzes */}
                <div className="space-y-8">
                    <AnimatedContent delay={0.7} distance={20}>
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 h-full">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Trend</h2>
                            <div className="flex items-center justify-center py-12">
                                <div className="size-12 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent delay={0.8} distance={20}>
                        <div className="bg-white rounded-3xl border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tests</h2>
                            <div className="flex items-center justify-center py-12">
                                <div className="size-12 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </AnimatedContent>
                </div>
            </div>
        </div>
    );
}
