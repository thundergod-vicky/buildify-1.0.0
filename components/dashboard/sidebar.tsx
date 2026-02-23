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
  ShieldCheckIcon,
  UsersIcon,
  BarChart2Icon,
  BellIcon,
  UserPlusIcon,
  MessageSquareIcon,
  LayersIcon,
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

  const currentView = searchParams.get("view");

  const menuItems = [
    { name: "Home", icon: HomeIcon, view: "home" },
    { name: "My Courses", icon: BookOpenIcon, view: "courses" },
    { name: "Practice Tests", icon: FileTextIcon, view: "tests" },
    { name: "Performance", icon: BarChart2Icon, view: "performance" },
    { name: "Notifications", icon: BellIcon, view: "notifications" }, // New item
    { name: "Requests", icon: UserPlusIcon, view: "requests" }, // New for Admin
    { name: "Messages", icon: MessageSquareIcon, view: "messages" },
    { name: "Student Management", icon: GraduationCapIcon, view: "students" },
    { name: "User Management", icon: UsersIcon, view: "users" },
    { name: "Course Control", icon: ShieldCheckIcon, view: "manage-courses" },
    { name: "Revenue", icon: BarChart3Icon, view: "revenue" },
    { name: "Practice Test Control", icon: FileTextIcon, view: "practice-tests" },
    { name: "Schedule", icon: CalendarIcon, view: "schedule" },
    { name: "Batch Management", icon: LayersIcon, view: "manage-batches" },
    { name: "My Batches", icon: LayersIcon, view: "batches" },
    { name: "Settings", icon: SettingsIcon, view: "settings" },
  ];

  const filteredItems = menuItems.filter((item) => {
    const userRole = user?.role?.toUpperCase();

    // Student
    if (userRole === Role.STUDENT) {
        return ["Home", "My Courses", "Practice Tests", "Performance", "Schedule", "Messages", "Settings", "Notifications", "My Batches"].includes(item.name);
    }
    
    // Teacher
    if (userRole === Role.TEACHER) {
        return ["Home", "My Courses", "Practice Tests", "Student Management", "Messages", "Settings", "Notifications", "My Batches"].includes(item.name);
    }

    // Admin
    if (userRole === Role.ADMIN) {
        return ["Home", "User Management", "Course Control", "Practice Test Control", "Revenue", "Requests", "Messages", "Settings", "Notifications", "Batch Management"].includes(item.name);
    }

    // Parent
    if (userRole === Role.PARENT) {
        return ["Home", "Performance", "Messages", "Notifications", "Settings"].includes(item.name);
    }

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
          const isActive = item.view === "home" ? !currentView : currentView === item.view;
          const href = item.view === "home" ? "/dashboard" : `/dashboard?view=${item.view}`;
          
          return (
            <Link
              key={item.view}
              href={href}
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
        <div className="px-4 py-2 mb-2 bg-gray-50 rounded-lg text-[10px] font-mono text-gray-400">
          Role: <span className="text-orange-600 font-bold">{user?.role || 'null'}</span>
        </div>
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
