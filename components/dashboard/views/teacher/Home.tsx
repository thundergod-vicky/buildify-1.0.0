"use client";

import StatCard from "@/components/dashboard/stat-card";
import { 
    UsersIcon, 
    BookOpenIcon, 
    CalendarIcon, 
    MessageSquareIcon
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";

export function TeacherHome() {
    return (
        <div className="p-8 space-y-8">
            <AnimatedContent distance={20}>
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl p-8 text-white">
                    <h1 className="text-3xl font-bold font-urbanist">Welcome back, Teacher! 👨‍🏫</h1>
                    <p className="mt-2 text-blue-50/80 text-lg">
                        You have 3 classes scheduled for today.
                    </p>
                </div>
            </AnimatedContent>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedContent delay={0.1} distance={20}>
                    <StatCard 
                        title="Total Students" 
                        value="120" 
                        trend="5" 
                        trendType="positive"
                        icon={UsersIcon}
                        colorClass="bg-orange-50 text-orange-600"
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.2} distance={20}>
                    <StatCard 
                        title="Active Courses" 
                        value="4" 
                        trend="0" 
                        trendType="positive"
                        icon={BookOpenIcon}
                        colorClass="bg-blue-50 text-blue-600"
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.3} distance={20}>
                    <StatCard 
                        title="Upcoming Classes" 
                        value="3" 
                        trend="1" 
                        trendType="positive"
                        icon={CalendarIcon}
                        colorClass="bg-purple-50 text-purple-600"
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.4} distance={20}>
                    <StatCard 
                        title="Messages" 
                        value="12" 
                        trend="4" 
                        trendType="positive"
                        icon={MessageSquareIcon}
                        colorClass="bg-emerald-50 text-emerald-600"
                    />
                </AnimatedContent>
            </div>
        </div>
    );
}
