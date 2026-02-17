"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const response: any = await api.get("/users/admin/parent-requests", token);
      setRequests(response || []);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const token = auth.getToken();
      if (!token) return;
      await api.post(`/users/admin/parent-request/${id}/${action}`, {}, token);
      toast.success(`Request ${action}d successfully`);
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-600" /></div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold font-urbanist text-gray-900">Parent Requests</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <div className="font-semibold text-gray-900">Parent: {req.parent.name} ({req.parent.email})</div>
                    <div className="text-gray-600">Requesting Student: {req.studentEmail}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(req.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                        onClick={() => handleAction(req.id, 'approve')}
                        disabled={!!processingId}
                    >
                        {processingId === req.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4 mr-1" />}
                        Approve
                    </Button>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                        onClick={() => handleAction(req.id, 'reject')}
                        disabled={!!processingId}
                    >
                        {processingId === req.id ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4 mr-1" />}
                        Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Could also add Manual Assignment Card here */}
    </div>
  );
}
