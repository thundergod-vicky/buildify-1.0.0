"use client";

import StatCard from "@/components/dashboard/stat-card";
import { 
    BookOpenIcon, 
    FileTextIcon, 
    ClockIcon, 
    TrophyIcon,
    PlayCircleIcon,
    ArrowRightIcon,
    CheckCircle2Icon
} from "lucide-react";
import Link from "next/link";
import AnimatedContent from "@/components/animated-content";
import { cn } from "@/lib/utils";

export default function StudentDashboardPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Welcome Banner */}
            <AnimatedContent distance={20}>
                <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl font-bold font-urbanist">Welcome back, Student! 👋</h1>
                        <p className="mt-2 text-orange-50/80 text-lg">
                            You&apos;ve completed 85% of your weekly goal. Keep it up and you&apos;ll reach your target by tomorrow!
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <Link href="/student/dashboard/courses" className="px-6 py-2.5 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
                                Resume Learning
                            </Link>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="size-8 rounded-full border-2 border-orange-500 bg-orange-300 flex items-center justify-center text-[10px] font-bold">
                                        JD
                                    </div>
                                ))}
                                <div className="size-8 rounded-full border-2 border-orange-500 bg-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-700">
                                    +12
                                </div>
                            </div>
                            {/* <span className="text-sm text-orange-100">Joining you in the live session</span> */}
                        </div>
                    </div>
                    {/* Decorative abstract shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl"></div>
                </div>
            </AnimatedContent>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedContent delay={0.1} distance={20}>
                    <StatCard 
                        title="Enrolled Courses" 
                        value="12" 
                        trend="2" 
                        trendType="positive"
                        icon={BookOpenIcon}
                        colorClass="bg-blue-50 text-blue-600"
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.2} distance={20}>
                    <StatCard 
                        title="Completed Tests" 
                        value="48" 
                        trend="12" 
                        trendType="positive"
                        icon={FileTextIcon}
                        colorClass="bg-purple-50 text-purple-600"
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.3} distance={20}>
                    <StatCard 
                        title="Study Hours" 
                        value="124h" 
                        trend="8" 
                        trendType="positive"
                        icon={ClockIcon}
                        colorClass="bg-orange-50 text-orange-600"
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.4} distance={20}>
                    <StatCard 
                        title="Average Score" 
                        value="92%" 
                        trend="3" 
                        trendType="positive"
                        icon={TrophyIcon}
                        colorClass="bg-emerald-50 text-emerald-600"
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
                                <Link href="/student/dashboard/live" className="text-sm font-semibold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
                                    Join Now <ArrowRightIcon className="size-4" />
                                </Link>
                            </div>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200" 
                                    alt="Live Class" 
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <button className="size-16 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-600/40 hover:scale-110 transition-transform">
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
                                {[
                                    { name: "Thermodynamics - Laws of Motion", status: "completed", date: "Yesterday" },
                                    { name: "Organic Chemistry - Benzene Ring", status: "in-progress", date: "Today, 4:00 PM" },
                                    { name: "Calculus - Integrations", status: "upcoming", date: "Tomorrow, 10:00 AM" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "size-10 rounded-full flex items-center justify-center",
                                                item.status === "completed" ? "bg-emerald-50 text-emerald-600" : 
                                                item.status === "in-progress" ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-400"
                                            )}>
                                                {item.status === "completed" ? <CheckCircle2Icon className="size-5" /> : <div className="size-2 bg-current rounded-full" />}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{item.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                                            <ArrowRightIcon className="size-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedContent>
                </div>

                {/* Performance & Quizzes */}
                <div className="space-y-8">
                    <AnimatedContent delay={0.7} distance={20}>
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 h-full">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Trend</h2>
                            <div className="space-y-6">
                                {[
                                    { subject: "Mathematics", progress: 85, color: "bg-blue-500" },
                                    { subject: "Physics", progress: 72, color: "bg-orange-500" },
                                    { subject: "Chemistry", progress: 94, color: "bg-emerald-500" },
                                    { subject: "Biology", progress: 68, color: "bg-purple-500" }
                                ].map((subject, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-700">{subject.subject}</span>
                                            <span className="text-gray-500">{subject.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={cn("h-full rounded-full transition-all duration-1000 delay-500", subject.color)} 
                                                style={{ width: `${subject.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-10 p-4 bg-orange-50 rounded-2xl">
                                <h3 className="font-bold text-orange-900">Pro Tip! 💡</h3>
                                <p className="text-sm text-orange-700 mt-1">
                                    Solving 5 more chemistry problems today will put you in the top 5% of students.
                                </p>
                            </div>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent delay={0.8} distance={20}>
                        <div className="bg-white rounded-3xl border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tests</h2>
                            <div className="space-y-4">
                                {[
                                    { name: "JEE Mock #14", color: "bg-orange-100" },
                                    { name: "Weekly Quiz", color: "bg-blue-100" }
                                ].map((test, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
                                        <div className={cn("size-3 rounded-full", test.color.replace('100', '500'))}></div>
                                        <span className="font-semibold text-gray-800">{test.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedContent>
                </div>
            </div>
        </div>
    );
}
