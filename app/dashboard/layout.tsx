"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

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
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </Suspense>
    );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");
    const isZoomMeeting = currentView === 'zoom-meeting';

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {!isZoomMeeting && <Sidebar />}
            <div className={`flex-1 flex flex-col ${isZoomMeeting ? 'h-screen overflow-hidden' : ''}`}>
                {!isZoomMeeting && <Topbar />}
                <main className={`flex-1 ${!isZoomMeeting ? 'pb-20 lg:pb-0' : ''}`}>
                    {children}
                </main>
                {!isZoomMeeting && <BottomNav />}
            </div>
        </div>
    );
}
