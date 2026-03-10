"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth');
        }
    }, [isLoading, user, router]);

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/50">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full">
                <Topbar />
                <main className="flex-1 pb-20 lg:pb-0 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
