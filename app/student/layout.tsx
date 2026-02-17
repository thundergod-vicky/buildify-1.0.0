"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
             if (user?.role !== Role.STUDENT) {
                router.push('/auth');
             }
        }
    }, [user, isLoading, router]);

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
