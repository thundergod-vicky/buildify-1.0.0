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
}

export default function StatCard({ title, value, trend, trendType, icon: Icon, colorClass }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                    {trend && (
                        <p className={cn(
                            "text-xs font-semibold mt-2 flex items-center gap-1",
                            trendType === "positive" ? "text-emerald-600" : "text-rose-600"
                        )}>
                            {trendType === "positive" ? "+" : "-"}{trend}
                            <span className="text-gray-400 font-normal">from last month</span>
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-xl transition-transform duration-300 group-hover:scale-110", colorClass)}>
                    <Icon className="size-6" />
                </div>
            </div>
        </div>
    );
}
