"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendType?: "positive" | "negative";
    icon: LucideIcon;
    colorClass: string;
    loading?: boolean;
}

export default function StatCard({ title, value, trend, trendType, icon: Icon, colorClass, loading }: StatCardProps) {
    return (
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">{title}</p>
                    {loading ? (
                        <div className="mt-2">
                            <div className="size-6 border-3 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-black text-gray-900 mt-0.5 truncate">{value}</h3>
                            {trend && (
                                <p className={cn(
                                    "text-[10px] font-bold mt-1.5 flex items-center gap-1",
                                    trendType === "positive" ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {trendType === "positive" ? "++" : "--"}{trend}
                                    <span className="text-gray-400 font-medium">from last month</span>
                                </p>
                            )}
                        </>
                    )}
                </div>
                <div className={cn("p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110 shrink-0", colorClass)}>
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}
