"use client";

import { useState, useRef, useEffect } from "react";
import { 
    BellIcon, 
    UserIcon, 
    ChevronDownIcon, 
    ExternalLinkIcon, 
    CopyIcon,
    LogOutIcon,
    UserCircleIcon,
    TrophyIcon,
    StarIcon,
    Settings2Icon,
    XIcon,
    EyeIcon,
    EyeOffIcon,
    SaveIcon,
    GraduationCapIcon,
    BookOpenIcon,
    ClipboardCheckIcon,
    CheckCircleIcon,
    InfoIcon,
    AlertTriangleIcon,
    Loader2Icon,
    SparklesIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ProfileSettings } from "@/types";
import Link from "next/link";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { auth as authService } from "@/lib/auth";
import { resolveImageUrl, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MEDAL_COLORS: Record<string, string> = {
    WOOD: "text-[#8B4513] bg-[#8B4513]/10",
    STONE: "text-[#808080] bg-[#808080]/10",
    IRON: "text-[#A19D94] bg-[#A19D94]/10",
    SILVER: "text-[#C0C0C0] bg-[#C0C0C0]/10",
    GOLD: "text-[#FFD700] bg-[#FFD700]/10",
    DIAMOND: "text-[#B9F2FF] bg-[#B9F2FF]/10",
    PLATINUM: "text-[#E5E4E2] bg-[#E5E4E2]/10",
    VIBRANIUM: "text-[#50C878] bg-[#50C878]/10",
};

export default function Topbar() {
    const router = useRouter();
    const { user, logout, updateProfile } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tempSettings, setTempSettings] = useState<ProfileSettings>({
        showMedals: true,
        showGrades: true,
        showCourses: true,
        showTestResults: true,
    });
    const [currentTime, setCurrentTime] = useState(new Date());
    
    const menuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [isLoadingNotis, setIsLoadingNotis] = useState(false);
    
    const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "";

    useEffect(() => {
        if (user?.profileSettings) {
            setTempSettings(user.profileSettings);
        }
    }, [user?.profileSettings]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotiOpen(false);
            }
            if (modalRef.current && !modalRef.current.contains(event.target as Node) && isCustomizing) {
                setIsCustomizing(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isCustomizing]);

    const refreshProfile = async () => {
        setIsRefreshing(true);
        try {
            const token = authService.getToken();
            if (token) {
                const freshUser = await api.get<any>('/users/profile', token);
                if (freshUser) {
                    authService.setUser(freshUser);
                    toast.success("Profile synchronized!");
                    window.location.reload();
                }
            }
        } catch (error) {
            toast.error("Failed to sync profile");
        } finally {
            setIsRefreshing(false);
        }
    };

    const copyProfileLink = () => {
        if (user?.profileSlug) {
            const link = `${window.location.origin}/profile/${user.profileSlug}`;
            navigator.clipboard.writeText(link);
            toast.success("Profile link copied!");
        }
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            await updateProfile({ profileSettings: tempSettings });
            toast.success("Privacy settings saved!");
            setIsCustomizing(false);
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const publicProfileUrl = user?.profileSlug ? `${window.location.origin}/profile/${user.profileSlug}` : '';

    const getNotificationLink = (note: any) => {
        if (note.actionUrl) return note.actionUrl;
        const title = note.title.toLowerCase();
        const message = note.message.toLowerCase();
        if (title.includes("admission") || message.includes("admission")) {
            const emailMatch = note.message.match(/\(([^)]+@[^)]+)\)/);
            if (emailMatch) return `/dashboard?view=users&search=${emailMatch[1]}`;
            
            const nameMatch = note.message.match(/^(.+?)\s+has submitted/);
            if (nameMatch) return `/dashboard?view=users&search=${nameMatch[1]}`;

            const formIdMatch = note.message.match(/Form ID: (ADH-\d+)/);
            if (formIdMatch) return `/dashboard?view=users&search=${formIdMatch[1]}`;
            
            return "/dashboard?view=users";
        }
        if (title.includes("registered") || title.includes("joined")) return "/dashboard?view=users";
        if (title.includes("class") || title.includes("scheduled") || title.includes("session")) return "/dashboard?view=schedule";
        if (title.includes("welcome")) return "/dashboard?view=courses";
        return null;
    };

    const fetchNotifications = async () => {
        setIsLoadingNotis(true);
        try {
            const token = authService.getToken();
            if (!token) return;
            const res: any = await api.get("/notifications", token);
            setNotifications(res || []);
        } catch (error) {
            // Error logged elsewhere or handled silently
        } finally {
            setIsLoadingNotis(false);
        }
    };

    useEffect(() => {
        if (!authService.getToken()) return;
        
        console.log(`[Notification-Check] Polling for role: ${user?.role || 'Guest'}`);
        fetchNotifications();
        
        // Poll for notifications every 30 seconds
        const notiInterval = setInterval(fetchNotifications, 30000);
        
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        
        return () => {
            clearInterval(notiInterval);
            clearInterval(timer);
        };
    }, [user?.id, user?.role]);

    const markAsRead = async (id: string) => {
        try {
            const token = authService.getToken();
            if (!token) return;
            await api.patch(`/notifications/${id}/read`, {}, token);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch {
            toast.error("Failed to update status");
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = authService.getToken();
            if (!token) return;
            await api.patch(`/notifications/read-all`, {}, token);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All marked as read");
        } catch {
            toast.error("Failed to update status");
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    const timeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: "Good Morning", icon: "", color: "text-amber-500" };
        if (hour < 17) return { text: "Good Afternoon", icon: "", color: "text-blue-500" };
        if (hour < 21) return { text: "Good Evening", icon: "", color: "text-indigo-500" };
        return { text: "Late Night", color: "text-purple-500" };
    };

    const greeting = timeBasedGreeting();

    return (
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-3 md:px-8 sticky top-0 z-50">
            <div className="flex-1 max-w-xl flex items-center overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative px-3 py-1 group"
                >
                    <div className="absolute -inset-x-12 inset-y-0 bg-blue-50/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            <motion.span 
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="text-lg"
                            >
                                {greeting.icon}
                            </motion.span>
                            <h2 className="text-xs sm:text-sm md:text-lg font-black text-gray-900 tracking-tight leading-none whitespace-nowrap">
                                {greeting.text}, <span className="text-blue-600">{user?.name ? user.name.split(' ')[0] : 'Scholar'}</span>
                            </h2>
                        </div>
                        
                        <div className="flex items-center gap-1.5 mt-1 px-1">
                            <div className="size-1 bg-blue-400 rounded-full animate-pulse shadow-sm shadow-blue-200 shrink-0"></div>
                            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none truncate max-w-[120px] sm:max-w-none">
                                {user?.role.replace(/_/g, ' ')} Session <span className="text-blue-500 ml-1">• LIVE</span> • <span className="hidden sm:inline">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span><span className="sm:hidden">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </p>
                            <SparklesIcon className="size-2 text-yellow-400 animate-bounce" />
                        </div>
                    </div>
                </motion.div>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative" ref={notificationsRef}>
                    <button 
                        onClick={() => setIsNotiOpen(!isNotiOpen)}
                        className={cn(
                            "relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors group",
                            isNotiOpen && "bg-yellow-50 text-yellow-600 ring-2 ring-blue-100"
                        )}
                    >
                        <BellIcon className={cn("size-4 md:size-5 group-hover:text-blue-600", isNotiOpen && "text-blue-600")} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 size-1.5 md:size-2 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                    </button>

                    {isNotiOpen && (
                        <div className="fixed inset-x-3 top-[72px] sm:absolute sm:inset-x-auto sm:right-0 sm:mt-3 sm:w-96 bg-white border border-gray-100 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-gray-200/50 z-[60] overflow-hidden flex flex-col h-[400px] sm:h-[480px]">
                            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={markAllAsRead}
                                            className="text-[10px] text-blue-600 font-bold uppercase tracking-wider hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                        <span className="px-2 py-0.5 bg-yellow-100 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                                            {unreadCount} New
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-2 space-y-1 flex-1 overflow-y-auto minimal-scrollbar overscroll-behavior-auto" data-lenis-prevent>
                                {isLoadingNotis ? (
                                    <div className="flex flex-col items-center justify-center p-12 space-y-3">
                                        <Loader2Icon className="size-8 text-blue-600 animate-spin" />
                                        <p className="text-xs text-gray-400 font-medium">Loading notifications...</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 space-y-3 text-center">
                                        <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                            <BellIcon className="size-6 text-gray-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">All caught up!</p>
                                            <p className="text-xs text-gray-400 mt-1">No new notifications for you.</p>
                                        </div>
                                    </div>
                                ) : (
                                    notifications.map((note) => {
                                        const link = getNotificationLink(note);
                                        return (
                                            <div 
                                                key={note.id} 
                                                onClick={() => {
                                                    if (link) {
                                                        router.push(link);
                                                        setIsNotiOpen(false);
                                                    }
                                                }}
                                                className={cn(
                                                    "p-4 rounded-2xl transition-all border border-transparent group relative",
                                                    !note.isRead ? "bg-blue-50/30 border-blue-100/20 hover:bg-blue-50/50" : "hover:bg-gray-50",
                                                    link && "cursor-pointer active:scale-[0.98]"
                                                )}
                                            >
                                            <div className="flex gap-4">
                                                <div className={cn(
                                                    "p-2 rounded-xl h-fit shrink-0 transition-transform group-hover:scale-110",
                                                    note.type === 'ALERT' ? 'bg-red-50 text-red-600' :
                                                    note.type === 'WARNING' ? 'bg-yellow-50 text-yellow-600' :
                                                    'bg-blue-50 text-blue-600'
                                                )}>
                                                    {note.type === 'ALERT' ? <AlertTriangleIcon className="size-4" /> : <InfoIcon className="size-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h4 className={cn("text-xs sm:text-sm font-bold truncate", !note.isRead ? "text-gray-900" : "text-gray-600")}>
                                                            {note.title}
                                                        </h4>
                                                        <span className="text-[9px] font-medium text-gray-400 whitespace-nowrap pt-0.5">
                                                            {new Date(note.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                                                        {note.message}
                                                    </p>
                                                    
                                                    {!note.isRead && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(note.id);
                                                            }}
                                                            className="mt-2 flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                                                        >
                                                            <CheckCircleIcon className="size-3" />
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            
                            <div className="p-3 border-t border-gray-50 bg-white shrink-0">
                                <Link 
                                    href="/dashboard?view=notifications"
                                    onClick={() => setIsNotiOpen(false)}
                                    className="w-full py-3 bg-gray-50 border border-transparent text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center"
                                >
                                    View Archive
                                </Link>
                            </div>
                        </div>
                    )}
                    {isNotiOpen && <div className="fixed inset-0 z-[55] sm:hidden" onClick={() => setIsNotiOpen(false)} />}
                </div>
                
                <div className="h-8 w-px bg-gray-100 mx-2"></div>

                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all group ${isMenuOpen ? 'bg-yellow-50 ring-2 ring-blue-100' : 'hover:bg-gray-50'}`}
                    >
                        <div className={`size-8 md:size-9 rounded-lg flex items-center justify-center transition-colors overflow-hidden ${isMenuOpen ? 'bg-blue-600 text-white' : 'bg-yellow-100 text-blue-600'}`}>
                            {user?.profileImage ? (
                                <img 
                                    src={resolveImageUrl(user.profileImage)} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon className="size-4 md:size-5" />
                            )}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || "User"}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-500">{displayRole || "Student"}</p>
                                {user?.role === Role.STUDENT && user?.admission?.status !== 'APPROVED' && (
                                    <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                                        Free
                                    </span>
                                )}
                            </div>
                        </div>
                        <ChevronDownIcon className={`size-3 md:size-4 text-gray-400 group-hover:text-gray-900 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-gray-900' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-2xl shadow-gray-200/50 py-2 z-50 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[85vh] sm:max-h-none minimal-scrollbar" data-lenis-prevent>
                            {user?.role === Role.STUDENT && (
                                <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public Profile Preview</p>
                                        {user.profileSlug && (
                                            <button 
                                                onClick={() => {
                                                    setIsCustomizing(true);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <Settings2Icon className="size-3" />
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                    
                                    {!user.profileSlug ? (
                                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
                                            <p className="text-xs text-gray-500 mb-3">Your sharable profile link is being generated...</p>
                                            <button 
                                                onClick={refreshProfile}
                                                disabled={isRefreshing}
                                                className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {isRefreshing ? "Synchronizing..." : "Sync Now"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden group/card">
                                            <div className="flex items-start justify-between mb-3 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 bg-yellow-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden">
                                                        {user.profileImage ? (
                                                            <img 
                                                                src={resolveImageUrl(user.profileImage)} 
                                                                alt="Avatar" 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            user.name?.[0]
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">{user.name}</h4>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <StarIcon className="size-3 text-yellow-500 fill-current" />
                                                            <span className="text-[10px] font-bold text-blue-600">Verified Scholar</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {user.medal && (
                                                    <div className={`size-8 rounded-lg flex items-center justify-center ${MEDAL_COLORS[user.medal]}`}>
                                                        <TrophyIcon className="size-5" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2 relative z-10">
                                                <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
                                                    <span>Profile Link</span>
                                                    <button 
                                                        onClick={copyProfileLink}
                                                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                                                    >
                                                        <CopyIcon className="size-3" />
                                                        Copy
                                                    </button>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded-lg text-[10px] font-mono text-gray-500 truncate border border-gray-100">
                                                    {publicProfileUrl}
                                                </div>
                                            </div>

                                            <Link 
                                                href={`/profile/${user.profileSlug}`}
                                                target="_blank"
                                                className="mt-4 w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                                            >
                                                <ExternalLinkIcon className="size-3" />
                                                Visit Live Profile
                                            </Link>

                                            <div className="absolute -bottom-6 -right-6 size-20 bg-yellow-50 rounded-full blur-2xl group-hover/card:bg-yellow-100/50 transition-colors"></div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="py-1">
                                <Link 
                                    href="/dashboard?view=settings" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    <UserCircleIcon className="size-5 text-gray-400" />
                                    Account Settings
                                </Link>

                                <div className="h-px bg-gray-50 my-1"></div>
                                
                                <button 
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                                >
                                    <LogOutIcon className="size-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Customization Modal */}
            {isCustomizing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto minimal-scrollbar animate-in fade-in duration-200">
                    <div 
                        ref={modalRef}
                        className="bg-white w-full max-w-md max-h-[90vh] rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 relative flex flex-col"
                    >
                        <div className="p-8 pb-0 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Profile Privacy</h2>
                                <p className="text-sm text-gray-500 font-medium">Choose what to show on your public page</p>
                            </div>
                            <button 
                                onClick={() => setIsCustomizing(false)}
                                className="p-2 bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                            >
                                <XIcon className="size-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto minimal-scrollbar flex-1">
                            {[
                                { 
                                    id: 'showMedals', 
                                    label: 'Academic Medals', 
                                    desc: 'Show your earned rank and specialty medals',
                                    icon: TrophyIcon,
                                    color: 'bg-yellow-100 text-yellow-600',
                                    items: []
                                },
                                { 
                                    id: 'showGrades', 
                                    label: 'Academic Grade', 
                                    desc: 'Show your current grade level (e.g. A+, B)',
                                    icon: GraduationCapIcon,
                                    color: 'bg-blue-100 text-blue-600',
                                    items: []
                                },
                                { 
                                    id: 'showCourses', 
                                    label: 'Enrolled Courses', 
                                    desc: 'List the courses you are currently taking',
                                    icon: BookOpenIcon,
                                    color: 'bg-green-100 text-green-600',
                                    items: (user as any)?.enrollments?.map((e: any) => ({ id: e.courseId, title: e.course.title })) || [],
                                    hiddenIdsKey: 'hiddenCourseIds'
                                },
                                { 
                                    id: 'showTestResults', 
                                    label: 'Recent Test Results', 
                                    desc: 'Show scores from your last 10 practice tests',
                                    icon: ClipboardCheckIcon,
                                    color: 'bg-purple-100 text-purple-600',
                                    items: (user as any)?.practiceTestResults?.map((r: any) => ({ id: r.id, title: r.test.title, score: r.score, total: r.total })) || [],
                                    hiddenIdsKey: 'hiddenTestResultIds'
                                },
                            ].map((item) => {
                                const isEnabled = tempSettings[item.id as keyof ProfileSettings] as boolean;
                                const hiddenIds = (tempSettings[item.hiddenIdsKey as keyof ProfileSettings] as string[]) || [];

                                return (
                                    <div key={item.id} className="space-y-3">
                                        <button
                                            onClick={() => setTempSettings(prev => ({ ...prev, [item.id]: !isEnabled }))}
                                            className={`w-full group rounded-3xl p-4 border transition-all flex items-center gap-4 text-left ${
                                                isEnabled 
                                                ? 'bg-white border-gray-100 shadow-sm hover:border-gray-200' 
                                                : 'bg-gray-50/50 border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${item.color} ${isEnabled ? 'scale-100' : 'grayscale blur-[1px] scale-90'}`}>
                                                <item.icon className="size-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`font-bold text-sm ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</span>
                                                    {isEnabled ? (
                                                        <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">
                                                            <EyeIcon className="size-3" />
                                                            Visible
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-full">
                                                            <EyeOffIcon className="size-3" />
                                                            Hidden
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{item.desc}</p>
                                            </div>
                                        </button>

                                        {isEnabled && item.items && item.items.length > 0 && (
                                            <div className="pl-16 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select items to display:</p>
                                                {item.items.map((subItem: any) => {
                                                    const isHidden = hiddenIds.includes(subItem.id);
                                                    return (
                                                        <button
                                                            key={subItem.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newHiddenIds = isHidden 
                                                                    ? hiddenIds.filter(id => id !== subItem.id)
                                                                    : [...hiddenIds, subItem.id];
                                                                setTempSettings(prev => ({ ...prev, [item.hiddenIdsKey!]: newHiddenIds }));
                                                            }}
                                                            className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                                                                !isHidden 
                                                                ? 'bg-white border-blue-100 text-gray-900 shadow-sm' 
                                                                : 'bg-gray-50 border-transparent text-gray-400'
                                                            }`}
                                                        >
                                                            <div className="flex-1 min-w-0 pr-4">
                                                                <p className="text-xs font-bold truncate">{subItem.title}</p>
                                                                {subItem.score !== undefined && (
                                                                    <p className="text-[10px] font-medium opacity-60">Score: {subItem.score}/{subItem.total}</p>
                                                                )}
                                                            </div>
                                                            <div className={`size-5 rounded-lg flex items-center justify-center transition-all ${!isHidden ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                                {!isHidden && <EyeIcon className="size-3" />}
                                                                {isHidden && <EyeOffIcon className="size-3" />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-8 pt-4 flex gap-3 shrink-0 border-t border-gray-50 bg-white rounded-b-[2.5rem]">
                            <button 
                                onClick={() => setIsCustomizing(false)}
                                className="flex-1 py-4 bg-gray-50 text-gray-900 text-sm font-bold rounded-2xl hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className="flex-1 py-4 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? "Saving..." : (
                                    <>
                                        <SaveIcon className="size-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
