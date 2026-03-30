"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Loader2Icon } from "lucide-react";

export function OnlineMeeting() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const joinLock = React.useRef(false);
  const lastSessionId = React.useRef<string | null>(null);

  useEffect(() => {
    // Prevent double-joining for the same sessionId
    if (joinLock.current && lastSessionId.current === sessionId) {
      return;
    }

    const joinWebinar = async () => {
      if (!sessionId) {
        setError("Session ID is missing.");
        setStatus("error");
        return;
      }

      joinLock.current = true;
      lastSessionId.current = sessionId;

      try {
        const token = auth.getToken() || "";
        const user = auth.getUser();
        
        const response = await api.post<{ token: string; iframeUrl: string }>(
          `/webinars/join/${sessionId}`,
          {},
          token
        );

        // Redirect Hosts (Teachers, Admins, Operations) to the full app
        const isHost = ["TEACHER", "ADMIN", "ACADEMIC_OPERATIONS"].includes(user?.role || "");
        
        if (isHost) {
          window.location.href = response.iframeUrl;
          return;
        }

        setIframeUrl(response.iframeUrl);
        setStatus("ready");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to join the virtual classroom.";
        setError(message);
        setStatus("error");
        joinLock.current = false; // Allow retry on error
      }
    };

    joinWebinar();
  }, [sessionId]);

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950 overflow-hidden flex flex-col animate-in fade-in duration-700 font-urbanist">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-white/5 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 text-white/70 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white/90">
              Virtual Classroom
            </h1>
            <p className="text-[10px] text-indigo-400 uppercase tracking-widest mt-0.5 font-black">
              Webinar.gg Integration • Secure Session
            </p>
          </div>
        </div>

        {status === "ready" && (
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-lg shadow-emerald-500/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              Live Connection
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 relative bg-slate-900">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950">
            <div className="relative">
                <div className="size-20 border-b-4 border-indigo-500 rounded-full animate-spin" />
                <Loader2Icon className="size-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="text-center mt-8">
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                Authenticating...
              </h2>
              <p className="text-sm text-slate-400 font-medium">Establishing secure Handshake with Webinar.gg</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 p-12 text-center">
            <div className="size-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
              Connection Failed
            </h2>
            <p className="text-slate-400 max-w-md mx-auto mb-10 text-base font-medium leading-relaxed">
              {error}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-white/5"
              >
                Retry
              </button>
              <button
                onClick={() => router.back()}
                className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-rose-900/20 transition-all border border-rose-500/50"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {status === "ready" && iframeUrl && (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-none block m-0 p-0"
            allow="camera; microphone; display-capture; fullscreen; autoplay"
            title="WebinarGG Classroom"
            allowFullScreen
            {...({ "credentialless": "" } as React.IframeHTMLAttributes<HTMLIFrameElement>)}
          />
        )}
      </div>
    </div>
  );
}
