import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/stat-card";
import { 
    UsersIcon, 
    BookOpenIcon, 
    CalendarIcon, 
    FileTextIcon
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";

import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

export function TeacherHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        classes: 0,
        tests: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = auth.getToken();
                if (!token) return;

                const [studentsData, coursesData, testsData] = await Promise.all([
                    api.get<any[]>('/users/students', token),
                    api.get<any[]>('/courses/teacher', token),
                    api.get<any[]>('/practice-tests/teacher', token)
                ]);

                // Count LIVE lessons from courses
                let liveCount = 0;
                coursesData.forEach((course: any) => {
                    course.chapters?.forEach((chapter: any) => {
                        liveCount += chapter.lessons?.filter((l: any) => l.type === 'LIVE').length || 0;
                    });
                });

                setStats({
                    students: studentsData.length,
                    courses: coursesData.length,
                    classes: liveCount,
                    tests: testsData.length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <AnimatedContent distance={20}>
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold font-urbanist">Welcome back, {user?.name || 'Teacher'}! 👨‍🏫</h1>
                            {user?.enrollmentId && (
                                <span className="bg-white/20 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                                    ID: {user.enrollmentId}
                                </span>
                            )}
                        </div>
                        <p className="mt-2 text-blue-50/80 text-lg">
                            {loading ? "Checking your schedule..." : `You have ${stats.classes} live sessions available.`}
                        </p>
                    </div>
                </div>
            </AnimatedContent>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedContent delay={0.1} distance={20}>
                    <StatCard 
                        title="Total Students" 
                        value={stats.students.toString()} 
                        icon={UsersIcon}
                        colorClass="bg-yellow-50 text-yellow-600"
                        loading={loading}
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.2} distance={20}>
                    <StatCard 
                        title="Active Courses" 
                        value={stats.courses.toString()} 
                        icon={BookOpenIcon}
                        colorClass="bg-blue-50 text-blue-600"
                        loading={loading}
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.3} distance={20}>
                    <StatCard 
                        title="Upcoming Classes" 
                        value={stats.classes.toString()} 
                        icon={CalendarIcon}
                        colorClass="bg-sky-50 text-sky-600"
                        loading={loading}
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.4} distance={20}>
                    <StatCard 
                        title="Practice Tests" 
                        value={stats.tests.toString()} 
                        icon={FileTextIcon}
                        colorClass="bg-gray-100 text-gray-600"
                        loading={loading}
                    />
                </AnimatedContent>
            </div>
        </div>
    );
}
