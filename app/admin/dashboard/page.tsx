"use client";

import StatCard from "@/components/dashboard/stat-card";
import { 
    UsersIcon, 
    BookOpenIcon, 
    DollarSignIcon, 
    ActivityIcon
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";

export default function AdminDashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <AnimatedContent distance={20}>
                <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-3xl p-8 text-white">
                    <h1 className="text-3xl font-bold font-urbanist">Admin Dashboard 🛡️</h1>
                    <p className="mt-2 text-gray-200/80 text-lg">
                        System Overview & Management
                    </p>
                </div>
            </AnimatedContent>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedContent delay={0.1} distance={20}>
                    <StatCard 
                        title="Total Users" 
                        value="1,240" 
                        trend="12%" 
                        trendType="positive"
                        icon={UsersIcon}
                        colorClass="bg-blue-50 text-blue-600"
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.2} distance={20}>
                    <StatCard 
                        title="Total Revenue" 
                        value="$45,200" 
                        trend="8%" 
                        trendType="positive"
                        icon={DollarSignIcon}
                        colorClass="bg-emerald-50 text-emerald-600"
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.3} distance={20}>
                    <StatCard 
                        title="Active Courses" 
                        value="24" 
                        trend="2" 
                        trendType="positive"
                        icon={BookOpenIcon}
                        colorClass="bg-purple-50 text-purple-600"
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.4} distance={20}>
                    <StatCard 
                        title="System Health" 
                        value="99.9%" 
                        trend="Stable" 
                        trendType="neutral"
                        icon={ActivityIcon}
                        colorClass="bg-orange-50 text-orange-600"
                    />
                </AnimatedContent>
            </div>
        </div>
    );
}
