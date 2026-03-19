"use client";

import Link from "next/link";
import Image from "next/image";
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
  UserPlusIcon,
  MessageSquareIcon,
  LayersIcon,
  CameraIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState, Suspense } from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function Sidebar() {
  return (
    <Suspense fallback={<aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0" />}>
      <SidebarContent />
    </Suspense>
  );
}

function SidebarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout, user } = useAuth();

  const currentView = searchParams.get("view");

  const allItems = {
    home:              { name: "Home",                 icon: HomeIcon,         view: "home" },
    courses:           { name: "My Courses",           icon: BookOpenIcon,     view: "courses" },
    tests:             { name: "Practice Tests",       icon: FileTextIcon,     view: "tests" },
    performance:       { name: "Performance",          icon: BarChart2Icon,    view: "performance" },
    schedule:          { name: "Calendar View",        icon: CalendarIcon,     view: "schedule" },
    messages:          { name: "Messages",             icon: MessageSquareIcon,view: "messages" },
    batches:           { name: "My Batches",           icon: LayersIcon,       view: "batches" },
    students:          { name: "Student Management",   icon: GraduationCapIcon,view: "students" },
    users:             { name: "User Management",      icon: UsersIcon,        view: "users" },
    manageCourses:     { name: "Course Control",       icon: ShieldCheckIcon,  view: "manage-courses" },
    revenue:           { name: "Revenue",              icon: BarChart3Icon,    view: "revenue" },
    practiceTests:     { name: "Practice Test Control",icon: FileTextIcon,     view: "practice-tests" },
    manageBatches:     { name: "Batch Management",     icon: LayersIcon,       view: "manage-batches" },
    requests:          { name: "Requests",             icon: UserPlusIcon,     view: "requests" },
    omr:               { name: "OMR Scanner",          icon: CameraIcon,       view: "omr" },
    routine:           { name: "Class Routine",        icon: CalendarIcon,     view: "routine" },
    exams:             { name: "Exam Schedules",       icon: CalendarIcon,     view: "exams" },
    doubts:            { name: "Doubts",               icon: MessageSquareIcon,view: "doubts" },
    teachers:          { name: "Teacher Access",       icon: UsersIcon,        view: "teachers" },
    studentDetails:    { name: "Student Details",      icon: GraduationCapIcon,view: "student-details" },
    billing:           { name: "Billing Template",     icon: FileTextIcon,     view: "billing" },
    invoices:          { name: "Invoices",             icon: FileTextIcon,     view: "invoices" },
    settings:          { name: "Settings",             icon: SettingsIcon,     view: "settings" },
  };

  const roleMenus: Record<string, typeof allItems[keyof typeof allItems][]> = {
    [Role.STUDENT]:             [allItems.home, allItems.courses, allItems.tests, allItems.performance, allItems.schedule, allItems.exams, allItems.messages, allItems.batches, allItems.settings],
    [Role.TEACHER]:             [allItems.home, allItems.courses, allItems.tests, allItems.students, allItems.batches, allItems.omr, allItems.schedule, allItems.exams, allItems.messages, allItems.settings],
    [Role.ADMIN]:               [allItems.home, allItems.users, allItems.manageCourses, allItems.practiceTests, allItems.manageBatches, allItems.exams, allItems.revenue, allItems.requests, allItems.messages, allItems.settings],
    [Role.PARENT]:              [allItems.home, allItems.performance, allItems.messages, allItems.settings],
    [Role.ACADEMIC_OPERATIONS]: [allItems.home, allItems.users, allItems.manageCourses, allItems.students, allItems.manageBatches, allItems.requests, allItems.schedule, allItems.routine, allItems.exams, allItems.omr, allItems.settings],
    [Role.ACCOUNTS]:            [allItems.home, allItems.revenue, allItems.studentDetails, allItems.invoices, allItems.settings],
  };

  const filteredItems = roleMenus[user?.role?.toUpperCase() as Role] ?? [allItems.home, allItems.settings];

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
    <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
      <div className="flex justify-center items-center overflow-hidden h-24">
        <Link href="/dashboard" className="block">
          <Image 
            src="/assets/images/brandlogo.png" 
            alt="Adhyayan Logo" 
            width={450} 
            height={150} 
            className="w-full px-4 h-44 object-cover -my-8"
            priority
          />
        </Link>
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
                  ? "bg-yellow-50 text-yellow-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "size-5 transition-transform duration-200 group-hover:scale-110",
                  isActive
                    ? "text-blue-600"
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
          Role: <span className="text-blue-600 font-bold">{user?.role || 'null'}</span>
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
