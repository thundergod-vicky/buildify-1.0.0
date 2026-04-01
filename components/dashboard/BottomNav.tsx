"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  HomeIcon,
  BookOpenIcon,
  CalendarIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  LogOutIcon,
  SettingsIcon,
  FileTextIcon,
  BarChart2Icon,
  LayersIcon,
  CameraIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  UsersIcon,
  UserPlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Role } from "@/types";

export function BottomNav() {
  return (
    <Suspense fallback={<div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]" />}>
      <BottomNavContent />
    </Suspense>
  );
}

function BottomNavContent() {
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      revenue:           { name: "Revenue",              icon: BarChart2Icon,    view: "revenue" },
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

  const roleMenus: Record<string, any[]> = {
      [Role.STUDENT]:             [allItems.home, allItems.courses, allItems.tests, allItems.performance, allItems.schedule, allItems.exams, allItems.messages, allItems.batches, allItems.settings],
      [Role.TEACHER]:             [allItems.home, allItems.courses, allItems.tests, allItems.students, allItems.batches, allItems.schedule, allItems.exams, allItems.messages, allItems.settings],
      [Role.ADMIN]:               [allItems.home, allItems.users, allItems.manageCourses, allItems.practiceTests, allItems.manageBatches, allItems.exams, allItems.revenue, allItems.requests, allItems.messages, allItems.settings],
      [Role.PARENT]:              [allItems.home, allItems.performance, allItems.messages, allItems.settings],
      [Role.ACADEMIC_OPERATIONS]: [allItems.home, allItems.users, allItems.manageCourses, allItems.students, allItems.manageBatches, allItems.requests, allItems.schedule, allItems.routine, allItems.exams, allItems.settings],
      [Role.ACCOUNTS]:            [allItems.home, allItems.revenue, allItems.studentDetails, allItems.invoices, allItems.settings],
  };

  const filteredItems = roleMenus[user?.role?.toUpperCase() as Role] ?? [allItems.home, allItems.settings];
  
  // Display first 4 items in the bottom bar, rest in "More"
  const mainBarItems = filteredItems.slice(0, 4);
  const moreItems = filteredItems;

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 flex items-center justify-around px-2 pt-5 pb-10 sm:pb-6 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {mainBarItems.map((item) => {
          const isActive = item.view === "home" ? !currentView : currentView === item.view;
          const href = item.view === "home" ? "/dashboard" : `/dashboard?view=${item.view}`;

          return (
            <Link
              key={item.view}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive ? "text-blue-600" : "text-gray-400"
              )}
            >
              <item.icon className={cn("size-6", isActive && "animate-in zoom-in-75 duration-300")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-200",
            isMenuOpen ? "text-blue-600" : "text-gray-400"
          )}
        >
          <MoreHorizontalIcon className="size-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">More</span>
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[2.5rem] shadow-2xl p-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-6" />
              <div className="grid grid-cols-2 gap-3 pb-8">
                {moreItems.map((item) => {
                  const isActive = item.view === "home" ? !currentView : currentView === item.view;
                  const href = item.view === "home" ? "/dashboard" : `/dashboard?view=${item.view}`;
                  
                  return (
                    <Link
                      key={item.view}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-xl transition-all border",
                        isActive 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                          : "bg-gray-50/80 border-transparent text-gray-600 active:bg-gray-100"
                      )}
                    >
                      <item.icon className="size-3.5" />
                      <span className="text-[9px] font-black uppercase tracking-tight truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              <div className="pb-20">
                <button
                  onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-50 text-gray-500 font-extrabold text-[9px] uppercase tracking-widest transition-all border border-gray-100 active:bg-gray-100 shadow-sm"
                >
                  <LogOutIcon className="size-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
