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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Role } from "@/types";

export function BottomNav() {
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentView = searchParams.get("view");

  const menuItems = [
    { name: "Home", icon: HomeIcon, view: "home" },
    { name: "Courses", icon: BookOpenIcon, view: "courses" },
    { name: "Schedule", icon: CalendarIcon, view: "schedule" },
    { name: "Messages", icon: MessageSquareIcon, view: "messages" },
  ];

  const allItems = [
    { name: "Home", icon: HomeIcon, view: "home" },
    { name: "My Courses", icon: BookOpenIcon, view: "courses" },
    { name: "Practice Tests", icon: FileTextIcon, view: "tests" },
    { name: "Performance", icon: BarChart2Icon, view: "performance" },
    { name: "Schedule", icon: CalendarIcon, view: "schedule" },
    { name: "Messages", icon: MessageSquareIcon, view: "messages" },
    { name: "My Batches", icon: LayersIcon, view: "batches" },
    { name: "Settings", icon: SettingsIcon, view: "settings" },
  ];

  const filteredAllItems = allItems.filter((item) => {
    const userRole = user?.role?.toUpperCase();
    if (userRole === Role.STUDENT) {
        return ["Home", "My Courses", "Practice Tests", "Performance", "Schedule", "Messages", "Settings", "My Batches"].includes(item.name);
    }
    // Simplification for other roles for now
    return true;
  });

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {menuItems.map((item) => {
          const isActive = item.view === "home" ? !currentView : currentView === item.view;
          const href = item.view === "home" ? "/dashboard" : `/dashboard?view=${item.view}`;

          return (
            <Link
              key={item.view}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive ? "text-orange-600" : "text-gray-400"
              )}
            >
              <item.icon className={cn("size-6", isActive && "animate-in zoom-in-75 duration-300")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-200",
            isMenuOpen ? "text-orange-600" : "text-gray-400"
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
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
              <div className="grid grid-cols-2 gap-4">
                {filteredAllItems.map((item) => {
                  const isActive = item.view === "home" ? !currentView : currentView === item.view;
                  const href = item.view === "home" ? "/dashboard" : `/dashboard?view=${item.view}`;
                  
                  return (
                    <Link
                      key={item.view}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl transition-all border",
                        isActive 
                          ? "bg-orange-50 border-orange-100 text-orange-600 shadow-sm shadow-orange-100" 
                          : "bg-gray-50/50 border-transparent text-gray-600"
                      )}
                    >
                      <item.icon className="size-5" />
                      <span className="text-sm font-black">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              <button
                onClick={() => logout()}
                className="w-full mt-8 flex items-center gap-4 p-4 rounded-2xl bg-red-50 text-red-600 font-black transition-all border border-red-100/50"
              >
                <LogOutIcon className="size-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
