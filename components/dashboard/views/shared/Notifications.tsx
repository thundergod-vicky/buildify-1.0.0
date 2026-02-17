"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

export function NotificationsView() {
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

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-600" /></div>;

  return (
    <div className="p-8 space-y-6">
       <h1 className="text-2xl font-bold font-urbanist text-gray-900">Notifications</h1>
       
       <div className="space-y-4 max-w-3xl">
          {notifications.length === 0 ? (
              <div className="text-center p-8 text-gray-500">No notifications</div>
          ) : (
              notifications.map(note => (
                  <Card key={note.id} className={`transition-all ${!note.isRead ? 'border-orange-200 bg-orange-50/30' : 'bg-white'}`}>
                      <CardContent className="p-4 flex gap-4">
                          <div className={`p-2 rounded-full h-fit ${
                              note.type === 'ALERT' ? 'bg-red-100 text-red-600' :
                              note.type === 'WARNING' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-blue-100 text-blue-600'
                          }`}>
                              {note.type === 'ALERT' ? <AlertTriangle className="size-5" /> : <Info className="size-5" />}
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  <h3 className={`font-semibold ${!note.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {note.title}
                                  </h3>
                                  <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-600 mt-1">{note.message}</p>
                              
                              {!note.isRead && (
                                  <button 
                                    onClick={() => markAsRead(note.id)}
                                    className="text-xs text-orange-600 font-medium mt-2 hover:underline flex items-center gap-1"
                                  >
                                    <CheckCircle className="size-3" /> Mark as read
                                  </button>
                              )}
                          </div>
                      </CardContent>
                  </Card>
              ))
          )}
       </div>
    </div>
  );
}
