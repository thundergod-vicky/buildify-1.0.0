"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export function AdminRequests() {
  const [parentLinkRequests, setParentLinkRequests] = useState<any[]>([]);
  const [parentOnboardings, setParentOnboardings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const token = auth.getToken();
      if (!token) return;
      
      // Fetch link requests
      const linkRes: any = await api.get("/users/admin/parent-requests", token);
      setParentLinkRequests(linkRes || []);
      
      // Fetch onboarding forms
      const onboardingRes: any = await api.get("/admissions/parent-onboardings", token);
      setParentOnboardings(onboardingRes || []);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleLinkAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const token = auth.getToken();
      if (!token) return;
      await api.post(`/users/admin/parent-request/${id}/${action}`, {}, token);
      toast.success(`Request ${action}d successfully`);
      fetchRequests();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleOnboardingAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const token = auth.getToken();
      if (!token) return;
      await api.patch(`/admissions/parent-onboarding/${id}/${action}`, {}, token);
      toast.success(`Onboarding form ${action}d successfully`);
      fetchRequests();
    } catch (error) {
      toast.error(`Failed to ${action} onboarding form`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600 size-8" /></div>;
  }

  return (
    <div className="p-8 space-y-10 max-w-6xl mx-auto uppercase-none">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black font-urbanist text-gray-900 tracking-tight">System Requests</h1>
        <Button onClick={fetchRequests} variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">Refresh</Button>
      </div>

      {/* Parent Onboardings Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-bold text-gray-700">Parent Onboarding Forms</h2>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">{parentOnboardings.length}</span>
        </div>
        <Card className="border-none shadow-sm bg-gray-50/50">
          <CardContent className="pt-6">
            {parentOnboardings.length === 0 ? (
              <p className="text-gray-400 text-center py-8 font-medium">No pending onboarding forms</p>
            ) : (
              <div className="grid gap-4">
                {parentOnboardings.map((req) => (
                  <div key={req.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-100 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{req.parentName}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded">Parent</span>
                      </div>
                      <div className="text-sm text-gray-500">Linked to: <span className="text-blue-600 font-medium">{req.studentName}</span> ({req.studentEmail})</div>
                      <div className="text-xs text-gray-400">Address: {req.address}</div>
                      {req.willingToTakeResp && (
                         <div className="mt-2 text-[10px] font-bold text-green-600 flex items-center gap-1">
                           <CheckCircle className="size-3" /> Responsibility Accepted
                         </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-100 text-green-600 hover:bg-green-50 rounded-xl px-4"
                          onClick={() => handleOnboardingAction(req.id, 'approve')}
                          disabled={!!processingId}
                      >
                          {processingId === req.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4 mr-1.5" />}
                          Approve
                      </Button>
                      <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-100 text-red-500 hover:bg-red-50 rounded-xl px-4"
                          onClick={() => handleOnboardingAction(req.id, 'reject')}
                          disabled={!!processingId}
                      >
                          {processingId === req.id ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4 mr-1.5" />}
                          Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Parent Link Requests Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-bold text-gray-700">Account Link Requests</h2>
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full">{parentLinkRequests.length}</span>
        </div>
        <Card className="border-none shadow-sm bg-gray-50/50">
          <CardContent className="pt-6">
            {parentLinkRequests.length === 0 ? (
              <p className="text-gray-400 text-center py-8 font-medium">No pending link requests</p>
            ) : (
              <div className="grid gap-4">
                {parentLinkRequests.map((req) => (
                  <div key={req.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className="font-bold text-gray-900">{req.parent.name} <span className="text-xs text-gray-400 font-medium">({req.parent.email})</span></div>
                      <div className="text-sm text-gray-500">Requesting student: <span className="text-blue-600 font-medium">{req.studentEmail}</span></div>
                      <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{new Date(req.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-100 text-green-600 hover:bg-green-50 rounded-xl px-4"
                          onClick={() => handleLinkAction(req.id, 'approve')}
                          disabled={!!processingId}
                      >
                          {processingId === req.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4 mr-1.5" />}
                          Approve
                      </Button>
                      <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-100 text-red-500 hover:bg-red-50 rounded-xl px-4"
                          onClick={() => handleLinkAction(req.id, 'reject')}
                          disabled={!!processingId}
                      >
                          {processingId === req.id ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4 mr-1.5" />}
                          Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
