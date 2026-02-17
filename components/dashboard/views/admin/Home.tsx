import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/stat-card";
import { 
    UsersIcon, 
    BookOpenIcon, 
    DollarSignIcon, 
    ActivityIcon,
    ShieldCheckIcon,
    ArrowRightIcon
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";
import Link from "next/link";

import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export function AdminHome() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = auth.getToken();
                if (!token) return;
                const response: any = await api.get("/admin/stats", token);
                setStats(response);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <AnimatedContent distance={20}>
                <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold font-urbanist drop-shadow-sm">System Control Center 🛡️</h1>
                        <p className="mt-2 text-indigo-100/80 text-lg">
                            Monitor and manage the entire Adhyayan ecosystem from one place.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </div>
            </AnimatedContent>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedContent delay={0.1} distance={20}>
                    <StatCard 
                        title="Total Users" 
                        value={stats?.users?.total?.toString() || "0"} 
                        trend={`${stats?.users?.students || 0} Students`}
                        trendType="positive"
                        icon={UsersIcon}
                        colorClass="bg-blue-50 text-blue-600"
                        loading={loading}
                    />
                </AnimatedContent>
                <AnimatedContent delay={0.2} distance={20}>
                    <StatCard 
                        title="Total Revenue" 
                        value={`₹${stats?.revenue?.total || 0}`} 
                        trend="Platform Earnings" 
                        trendType="positive"
                        icon={DollarSignIcon}
                        colorClass="bg-emerald-50 text-emerald-600"
                        loading={loading}
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.3} distance={20}>
                    <StatCard 
                        title="Global Courses" 
                        value={stats?.courses?.total?.toString() || "0"} 
                        trend="Across all teachers" 
                        trendType={undefined}
                        icon={BookOpenIcon}
                        colorClass="bg-purple-50 text-purple-600"
                        loading={loading}
                    />
                </AnimatedContent>
                 <AnimatedContent delay={0.4} distance={20}>
                    <StatCard 
                        title="System Health" 
                        value={stats?.uptime || "99.9%"} 
                        trend={stats?.systemStatus || "Stable"} 
                        trendType="positive"
                        icon={ActivityIcon}
                        colorClass="bg-orange-50 text-orange-600"
                        loading={loading}
                    />
                </AnimatedContent>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <AnimatedContent delay={0.5} className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheckIcon className="size-5 text-indigo-600" />
                                Administrative Quick Links
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { name: "User Directory", desc: "Manage roles & permissions", view: "users", color: "blue" },
                                { name: "Course Oversight", desc: "Audit and manage content", view: "manage-courses", color: "purple" },
                                { name: "Financial Audit", desc: "Track payments & revenue", view: "revenue", color: "emerald" },
                                { name: "System Settings", desc: "Global configuration", view: "settings", color: "indigo" }
                            ].map((link, i) => (
                                <Link 
                                    key={i}
                                    href={`/dashboard?view=${link.view}`}
                                    className="p-6 rounded-2xl border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
                                >
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{link.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
                                    <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                        Open Tool <ArrowRightIcon className="size-4 ml-1 group-hover:ml-2 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </AnimatedContent>

                <AnimatedContent delay={0.6}>
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">User Distribution</h2>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-600">Students</span>
                                        <span className="font-black text-blue-600">{stats?.users?.students || 0}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 transition-all duration-1000" 
                                            style={{ width: `${stats ? (stats.users.students / stats.users.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-600">Teachers</span>
                                        <span className="font-black text-purple-600">{stats?.users?.teachers || 0}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-purple-500 transition-all duration-1000" 
                                            style={{ width: `${stats ? (stats.users.teachers / stats.users.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                             <p className="text-xs text-indigo-600 font-bold uppercase mb-2">System Notice</p>
                             <p className="text-sm text-indigo-900">All systems operational. No pending maintenance windows.</p>
                        </div>
                    </div>
                </AnimatedContent>
            </div>
        </div>
    );
}
