"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function NotificationsView() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const res: any = await api.get("/notifications", token);
      setNotifications(res || []);
    } catch (error) {
      console.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
        const token = auth.getToken();
        if (!token) return;
        await api.patch(`/notifications/${id}/read`, {}, token);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
        toast.error("Failed to update status");
    }
  };

  const markAllAsRead = async () => {
    try {
        const token = auth.getToken();
        if (!token) return;
        await api.patch(`/notifications/read-all`, {}, token);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All marked as read");
    } catch {
        toast.error("Failed to update status");
    }
  };

  const getNotificationLink = (note: any) => {
    if (note.actionUrl) return note.actionUrl;
    
    // Fallback for old notifications based on title/message
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

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-3xl gap-4">
           <h1 className="text-2xl font-bold font-urbanist text-gray-900">Notifications</h1>
           {notifications.some(n => !n.isRead) && (
               <button 
                   onClick={markAllAsRead}
                   className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
               >
                   <CheckCircle className="size-4" /> Mark all read
               </button>
           )}
       </div>
       
       <div className="space-y-4 max-w-3xl">
          {notifications.length === 0 ? (
              <div className="text-center p-8 text-gray-500">No notifications</div>
          ) : (
              notifications.map(note => {
                  const link = getNotificationLink(note);
                  return (
                      <Card 
                          key={note.id} 
                          onClick={() => {
                              console.log("Notification clicked:", note.title, "Link:", link);
                              if (link) {
                                  router.push(link);
                              }
                          }}
                          className={`transition-all ${!note.isRead ? 'border-blue-200 bg-blue-50/30' : 'bg-white'} ${link ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''}`}
                       >
                          <CardContent className="p-4 flex gap-4">
                              <div className={`p-2 rounded-full h-fit shrink-0 ${
                                  note.type === 'ALERT' ? 'bg-red-100 text-red-600' :
                                  note.type === 'WARNING' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-blue-100 text-blue-600'
                              }`}>
                                  {note.type === 'ALERT' ? <AlertTriangle className="size-5" /> : <Info className="size-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-4">
                                      <h3 className={`font-semibold truncate ${!note.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                          {note.title}
                                      </h3>
                                      <span className="text-xs text-gray-400 whitespace-nowrap pt-0.5">
                                          {new Date(note.createdAt).toLocaleDateString()}
                                      </span>
                                  </div>
                                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                                      {note.message}
                                  </p>
                                  
                                  {!note.isRead && (
                                      <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(note.id);
                                        }}
                                        className="text-xs text-blue-600 font-bold mt-3 hover:underline flex items-center gap-1 uppercase tracking-wider"
                                      >
                                        <CheckCircle className="size-3" /> Mark read
                                      </button>
                                  )}
                              </div>
                          </CardContent>
                      </Card>
                  );
              })
          )}
       </div>
    </div>
  );
}
