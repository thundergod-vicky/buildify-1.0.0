"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Hide navbar and footer in dashboard and player routes
    const isDashboard = pathname?.startsWith('/dashboard') || 
                        pathname?.startsWith('/admin') || 
                        pathname?.startsWith('/player') ||
                        pathname?.startsWith('/teacher') ||
                        pathname?.startsWith('/student') ||
                        pathname?.startsWith('/parent');

    return (
        <>
            {!isDashboard && <Navbar />}
            {children}
            {!isDashboard && <Footer />}
        </>
    );
}
