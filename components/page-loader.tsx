"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

let initialLoadDone = false;

export default function PageLoader() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isInitial, setIsInitial] = useState(!initialLoadDone);

    const isDashboard = pathname?.startsWith('/dashboard') || 
                        pathname?.startsWith('/admin') || 
                        pathname?.startsWith('/player') ||
                        pathname?.startsWith('/teacher') ||
                        pathname?.startsWith('/student') ||
                        pathname?.startsWith('/parent');

    useEffect(() => {
        // Handle initial load
        if (!initialLoadDone) {
            const timer = setTimeout(() => {
                setIsLoading(false);
                initialLoadDone = true;
                setIsInitial(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        // Handle route transitions
        if (initialLoadDone && !isDashboard) {
            const timer = setTimeout(() => {
                setIsLoading(true);
                const hideTimer = setTimeout(() => {
                    setIsLoading(false);
                }, 800);
                return () => clearTimeout(hideTimer);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [pathname, isDashboard]);

    if (!isLoading || isDashboard) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-300 ${
            isInitial ? "z-[9999]" : "z-[40]"
        }`}>
            <div className="spinner"></div>
        </div>
    );
}
