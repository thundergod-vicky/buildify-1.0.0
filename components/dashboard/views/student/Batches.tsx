"use client";

import { useState, useEffect } from "react";
import { 
  LayersIcon, 
  BookOpenIcon,
  UserIcon,
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { toast } from "react-toastify";

export function StudentBatches() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">My Batches</h1>
        <p className="text-gray-500 mt-1">View the class batches you are currently enrolled in</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
          ))
        ) : batches.length > 0 ? (
          batches.map((batch) => (
            <AnimatedContent key={batch.id}>
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="size-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                  <LayersIcon className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{batch.name}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2">{batch.description || "No description provided."}</p>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                    {batch.teacher?.name?.[0] || "T"}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Assigned Teacher</p>
                    <p className="text-sm font-bold text-gray-900">{batch.teacher?.name || "Unassigned"}</p>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <LayersIcon className="size-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Batches Yet</h3>
            <p className="text-gray-500">You haven&apos;t been assigned to any batches yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
