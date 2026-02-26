"use client";

import { useState, useRef, useEffect } from "react";
import { 
    SearchIcon, 
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
    Loader2Icon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ProfileSettings } from "@/types";
import Link from "next/link";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { auth as authService } from "@/lib/auth";
import { resolveImageUrl, cn } from "@/lib/utils";

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
        fetchNotifications();
    }, []);

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

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
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
                <div className="relative" ref={notificationsRef}>
                    <button 
                        onClick={() => setIsNotiOpen(!isNotiOpen)}
                        className={cn(
                            "relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors group",
                            isNotiOpen && "bg-orange-50 text-orange-600 ring-2 ring-orange-100"
                        )}
                    >
                        <BellIcon className={cn("size-5 group-hover:text-orange-600", isNotiOpen && "text-orange-600")} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                    </button>

                    {isNotiOpen && (
                        <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 z-50 overflow-hidden flex flex-col h-[480px]">
                            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>

                            <div className="p-2 space-y-1 flex-1 overflow-y-auto min-h-0 overscroll-behavior-contain">
                                {isLoadingNotis ? (
                                    <div className="flex flex-col items-center justify-center p-12 space-y-3">
                                        <Loader2Icon className="size-8 text-orange-600 animate-spin" />
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
                                    notifications.map((note) => (
                                        <div 
                                            key={note.id} 
                                            className={cn(
                                                "p-4 rounded-2xl transition-all border border-transparent",
                                                !note.isRead ? "bg-orange-50/50 border-orange-100/50 hover:bg-orange-50" : "hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex gap-4">
                                                <div className={cn(
                                                    "p-2 rounded-xl h-fit shrink-0",
                                                    note.type === 'ALERT' ? 'bg-red-100 text-red-600' :
                                                    note.type === 'WARNING' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                                )}>
                                                    {note.type === 'ALERT' ? <AlertTriangleIcon className="size-4" /> : <InfoIcon className="size-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h4 className={cn("text-sm font-bold truncate", !note.isRead ? "text-gray-900" : "text-gray-600")}>
                                                            {note.title}
                                                        </h4>
                                                        <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap pt-0.5">
                                                            {new Date(note.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                                        {note.message}
                                                    </p>
                                                    
                                                    {!note.isRead && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(note.id);
                                                            }}
                                                            className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors"
                                                        >
                                                            <CheckCircleIcon className="size-3" />
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <div className="p-3 border-t border-gray-50 bg-white shrink-0">
                                <Link 
                                    href="/dashboard?view=notifications"
                                    onClick={() => setIsNotiOpen(false)}
                                    className="w-full py-3 bg-gray-50 border border-transparent text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all flex items-center justify-center"
                                >
                                    View Archive
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="h-8 w-px bg-gray-100 mx-2"></div>

                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all group ${isMenuOpen ? 'bg-orange-50 ring-2 ring-orange-100' : 'hover:bg-gray-50'}`}
                    >
                        <div className={`size-9 rounded-lg flex items-center justify-center transition-colors overflow-hidden ${isMenuOpen ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600'}`}>
                            {user?.profileImage ? (
                                <img 
                                    src={resolveImageUrl(user.profileImage)} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon className="size-5" />
                            )}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || "User"}</p>
                            <p className="text-xs text-gray-500 mt-1">{displayRole || "Student"}</p>
                        </div>
                        <ChevronDownIcon className={`size-4 text-gray-400 group-hover:text-gray-900 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-gray-900' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-gray-200/50 py-2 z-50 animate-in fade-in zoom-in duration-200 overflow-hidden">
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
                                                className="flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:text-orange-700 transition-colors"
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
                                                className="w-full py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                                            >
                                                {isRefreshing ? "Synchronizing..." : "Sync Now"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden group/card">
                                            <div className="flex items-start justify-between mb-3 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold text-lg overflow-hidden">
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
                                                            <StarIcon className="size-3 text-orange-500 fill-current" />
                                                            <span className="text-[10px] font-bold text-orange-600">Verified Scholar</span>
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
                                                        className="text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
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

                                            <div className="absolute -bottom-6 -right-6 size-20 bg-orange-50 rounded-full blur-2xl group-hover/card:bg-orange-100/50 transition-colors"></div>
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
                                                                ? 'bg-white border-orange-100 text-gray-900 shadow-sm' 
                                                                : 'bg-gray-50 border-transparent text-gray-400'
                                                            }`}
                                                        >
                                                            <div className="flex-1 min-w-0 pr-4">
                                                                <p className="text-xs font-bold truncate">{subItem.title}</p>
                                                                {subItem.score !== undefined && (
                                                                    <p className="text-[10px] font-medium opacity-60">Score: {subItem.score}/{subItem.total}</p>
                                                                )}
                                                            </div>
                                                            <div className={`size-5 rounded-lg flex items-center justify-center transition-all ${!isHidden ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
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
                                className="flex-1 py-4 bg-orange-600 text-white text-sm font-bold rounded-2xl hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
