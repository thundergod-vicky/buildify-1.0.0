"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HomeIcon,
  BookOpenIcon,
  FileTextIcon,
  BarChart3Icon,
  CalendarIcon,
  SettingsIcon,
  LogOutIcon,
  GraduationCapIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function Sidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout, user } = useAuth();

  // Unified base path
  const basePath = "/dashboard";
  const currentView = searchParams.get("view");

  const menuItems = [
    { name: "Home", icon: HomeIcon, href: basePath }, // No param = Home
    { name: "My Courses", icon: BookOpenIcon, href: `${basePath}?view=courses` },
    { name: "Practice Tests", icon: FileTextIcon, href: `${basePath}?view=tests` },
    { name: "Performance", icon: BarChart3Icon, href: `${basePath}?view=performance` },
    { name: "Schedule", icon: CalendarIcon, href: `${basePath}?view=schedule` },
    { name: "Settings", icon: SettingsIcon, href: `${basePath}?view=settings` },
  ];

  const filteredItems = menuItems.filter((item) => {
    // Student gets everything
    if (user?.role === Role.STUDENT) return true;
    
    // Others only get Home and Settings
    return item.name === "Home" || item.name === "Settings";
  });

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
      setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
      logout();
      router.push('/auth');
      setIsLogoutModalOpen(false);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
          <GraduationCapIcon className="size-6" />
        </div>
        <span className="text-xl font-bold font-urbanist text-gray-900 tracking-tight">
          Adhyayan
        </span>
      </div>

       <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredItems.map((item) => {
          let isActive = false;
          if (item.name === "Home") {
             isActive = !currentView;
          } else {
             const viewParam = item.href.split("view=")[1];
             isActive = currentView === viewParam;
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "size-5 transition-transform duration-200 group-hover:scale-110",
                  isActive
                    ? "text-orange-600"
                    : "text-gray-400 group-hover:text-gray-900",
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button 
            onClick={handleLogoutClick}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
        >
          <LogOutIcon className="size-5 text-gray-400 group-hover:text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>

      <ConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out? You will need to login again to access your dashboard."
        confirmText="Yes, Sign Out"
        variant="danger"
      />
    </aside>
  );
}
