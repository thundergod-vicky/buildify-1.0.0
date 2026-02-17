"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, ChangeEvent, FormEvent } from "react";
import { ParentRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export function ParentHome() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const students = user?.parentOf?.map((p) => p.student) || [];
  const requests = user?.parentRequests?.filter(req => req.status === 'PENDING') || [];

  const handleLinkRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const token = auth.getToken();
      if (!token) throw new Error("Not authenticated");
      
      await api.post("/users/parent-request", { studentEmail: email }, token);
      toast.success("Request sent successfully! Waiting for admin approval.");
      setEmail("");
      setShowLinkForm(false);
      window.location.reload(); 
    } catch (error: any) {
      toast.error(error.message || "Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-urbanist text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-500">Manage and monitor your children&apos;s progress.</p>
        </div>
        {!showLinkForm && (
          <Button onClick={() => setShowLinkForm(true)} className="bg-orange-600 hover:bg-orange-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Link Another Student
          </Button>
        )}
      </div>

      {showLinkForm && (
        <Card className="border-orange-100 bg-orange-50/30">
          <CardHeader>
            <CardTitle>Link New Student</CardTitle>
            <CardDescription>Enter your child&apos;s registered email address to send a link request.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLinkRequest} className="flex flex-col md:flex-row gap-4">
              <Input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white"
              />
              <div className="flex gap-2">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Send Request
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowLinkForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{student.name}</CardTitle>
                <CardDescription>{student.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm text-gray-500 uppercase font-semibold">Current Grade</div>
                    <div className="text-2xl font-bold text-orange-600">{student.grade || 'N/A'}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={() => toast.info(`Navigate to Performance tab to see full data for ${student.name}`)}
                  >
                    View Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showLinkForm && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No students linked</h3>
          <p className="text-gray-500 mb-6">Link your account to your child&apos;s profile to monitor their progress.</p>
          <Button onClick={() => setShowLinkForm(true)} className="bg-orange-600">Link Student Now</Button>
        </div>
      )}

      {requests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-urbanist text-gray-900 flex items-center gap-2">
            <AlertCircle className="size-5 text-orange-500" />
            Pending Link Requests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req: ParentRequest) => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                        <Loader2 className="size-5 animate-spin" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{req.studentEmail}</p>
                        <p className="text-xs text-gray-500">Status: <span className="text-yellow-600 font-semibold">{req.status}</span> • Sent on {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
