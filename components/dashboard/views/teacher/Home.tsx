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

export function TeacherHome() {
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
                        <h1 className="text-3xl font-bold font-urbanist">Welcome back, Teacher! 👨‍🏫</h1>
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
                        colorClass="bg-orange-50 text-orange-600"
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
                        colorClass="bg-purple-50 text-purple-600"
                        loading={loading}
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.4} distance={20}>
                    <StatCard 
                        title="Practice Tests" 
                        value={stats.tests.toString()} 
                        icon={FileTextIcon}
                        colorClass="bg-emerald-50 text-emerald-600"
                        loading={loading}
                    />
                </AnimatedContent>
            </div>
        </div>
    );
}
