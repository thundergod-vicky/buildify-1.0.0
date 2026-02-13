"use client";

import StatCard from "@/components/dashboard/stat-card";
import { 
    TrendingUpIcon, 
    ClockIcon, 
    CheckCircleIcon
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";

export default function ParentDashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <AnimatedContent distance={20}>
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-3xl p-8 text-white">
                    <h1 className="text-3xl font-bold font-urbanist">Welcome, Parent! 👨‍👩‍👧</h1>
                    <p className="mt-2 text-emerald-50/80 text-lg">
                        Here is an overview of your child's progress.
                    </p>
                </div>
            </AnimatedContent>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatedContent delay={0.1} distance={20}>
                    <StatCard 
                        title="Attendance" 
                        value="95%" 
                        trend="2" 
                        trendType="positive"
                        icon={ClockIcon}
                        colorClass="bg-blue-50 text-blue-600"
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.2} distance={20}>
                    <StatCard 
                        title="Assignments Completed" 
                        value="24/28" 
                        trend="4" 
                        trendType="positive"
                        icon={CheckCircleIcon}
                        colorClass="bg-emerald-50 text-emerald-600"
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.3} distance={20}>
                    <StatCard 
                        title="Average Grade" 
                        value="A-" 
                        trend="Improved" 
                        trendType="positive"
                        icon={TrendingUpIcon}
                        colorClass="bg-orange-50 text-orange-600"
                    />
                </AnimatedContent>
            </div>
        </div>
    );
}
