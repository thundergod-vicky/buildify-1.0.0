"use client";

import { SearchIcon, BellIcon, UserIcon, ChevronDownIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Topbar() {
    const { user } = useAuth();
    
    // Capitalize first letter of role for display
    const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "";

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search for courses, tests, or resources..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors group">
                    <BellIcon className="size-5 group-hover:text-orange-600" />
                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                
                <div className="h-8 w-px bg-gray-100 mx-2"></div>

                <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-50 rounded-xl transition-colors group">
                    <div className="size-9 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                        <UserIcon className="size-5" />
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500 mt-1">{displayRole || "Student"}</p>
                    </div>
                    <ChevronDownIcon className="size-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </button>
            </div>
        </header>
    );
}
