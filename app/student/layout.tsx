"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types"; // Assuming types.ts has Role enum

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'student') { 
                // Note: user.role might be uppercase STUDENT in DB/types, check AuthContext
                // But typically string comparison safe if normalized.
                // Assuming 'student' or Role.STUDENT
                 if (user?.role !== 'student' && user?.role !== 'STUDENT') {
                    router.push('/auth');
                 }
            }
        }
    }, [user, loading, router]);

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return null; // Will redirect

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
