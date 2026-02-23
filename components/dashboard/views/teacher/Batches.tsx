"use client";

import { useState, useEffect } from "react";
import { 
  LayersIcon, 
  UsersIcon,
  SearchIcon,
  GraduationCapIcon,
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { toast } from "react-toastify";

export function TeacherBatches() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [batchDetails, setBatchDetails] = useState<any>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = auth.getToken();
        if (!token) return;

        const data = await api.get<any[]>("/batches/my-batches", token);
        setBatches(data);
      } catch (err) {
        console.error("Failed to fetch batches:", err);
        toast.error("Failed to load your batches");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const fetchBatchDetails = async (id: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;

      const data = await api.get<any>(`/batches/${id}`, token);
      setBatchDetails(data);
    } catch (err) {
      toast.error("Failed to load batch details");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">My Teaching Batches</h1>
        <p className="text-gray-500 mt-1">Manage and view students in your assigned batches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Batches List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Your Batches</h2>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            ))
          ) : batches.length > 0 ? (
            batches.map((batch) => (
              <button
                key={batch.id}
                onClick={() => {
                  setSelectedBatch(batch);
                  fetchBatchDetails(batch.id);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedBatch?.id === batch.id 
                    ? "border-orange-500 bg-orange-50" 
                    : "border-gray-100 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center ${
                    selectedBatch?.id === batch.id ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-600"
                  }`}>
                    <LayersIcon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 truncate">{batch.name}</h3>
                    <p className="text-xs text-gray-500">{batch._count?.students || 0} Students</p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No batches assigned</p>
            </div>
          )}
        </div>

        {/* Batch Details / Student List */}
        <div className="lg:col-span-2">
          {selectedBatch ? (
            <AnimatedContent key={selectedBatch.id}>
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedBatch.name}</h2>
                    <p className="text-gray-500">{selectedBatch.description || "Class Batch"}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold">
                    <UsersIcon className="size-4" />
                    {batchDetails?.students?.length || 0} Students
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Enrolled Students</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {batchDetails?.students?.map((student: any) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 font-bold">
                            {student.name?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                            <p className="text-[10px] text-gray-400">{student.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!batchDetails?.students || batchDetails.students.length === 0) && (
                      <p className="col-span-full py-10 text-center text-gray-400 italic">No students in this batch yet</p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-100 text-gray-400">
              <LayersIcon className="size-16 mb-4 opacity-20" />
              <h3 className="text-xl font-bold">Select a Batch</h3>
              <p className="text-sm">Click on a batch from the sidebar to view detailed student list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
