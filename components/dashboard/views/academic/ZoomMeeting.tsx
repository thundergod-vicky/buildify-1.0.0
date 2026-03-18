"use client";

import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export function ZoomMeeting() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const meetingNumber = searchParams.get('meetingId');
    const role = parseInt(searchParams.get('role') || '0');
    const password = searchParams.get('password') || '';

    const initialError = !meetingNumber ? 'Meeting ID is missing from the URL.' : null;

    const [status, setStatus] = useState<'loading' | 'joined' | 'error'>(initialError ? 'error' : 'loading');
    const [statusMsg, setStatusMsg] = useState('Preparing classroom...');
    const [error, setError] = useState<string | null>(initialError);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const user = auth.getUser();

    useEffect(() => {
        if (initialError) return;

        const handleMessage = async (event: MessageEvent) => {
            const { type, message } = event.data || {};

            if (type === 'ZOOM_FRAME_READY') {
                // To avoid "Duplicated join" (5012), only start if not already joined
                if (status === 'joined') {
                    console.log('[Zoom SDK] Frame ready but already joined. Skipping start.');
                    return;
                }

                try {
                    setStatusMsg('Fetching meeting credentials...');
                    const token = auth.getToken() || '';
                    const cleanMeetingNumber = (meetingNumber || '').replace(/[^0-9]/g, '');

                    const response = await api.post<{ signature: string, sdkKey: string }>('/zoom/signature', {
                        meetingNumber: cleanMeetingNumber,
                        role
                    }, token);

                    setStatusMsg('Launching virtual classroom...');
                    iframeRef.current?.contentWindow?.postMessage({
                        type: 'ZOOM_START',
                        config: {
                            sdkKey: response.sdkKey,
                            signature: response.signature,
                            meetingNumber: cleanMeetingNumber,
                            userName: user?.name || 'Class Participant',
                            userEmail: user?.email || '',
                            password: (password && password !== 'undefined') ? password : undefined
                        }
                    }, '*');
                } catch (err: unknown) {
                    const e = err as { message?: string; reason?: string };
                    setError(e.reason || e.message || 'Failed to fetch meeting credentials.');
                    setStatus('error');
                }
            }

            if (type === 'ZOOM_LOG') {
                console.log('[Zoom Frame]', message);
                setStatusMsg(message || '');
            }

            if (type === 'ZOOM_JOINED') {
                setStatus('joined');
            }

            if (type === 'ZOOM_ERROR') {
                setError(message || 'An unknown error occurred in the meeting.');
                setStatus('error');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [initialError, meetingNumber, role, password, user?.name, user?.email, status]);

    return (
        <div className="fixed inset-0 z-[99999] bg-black overflow-hidden flex flex-col animate-in fade-in duration-700">
            {/* Header (Stable top bar) */}
            <div className="p-6 pb-2 flex items-center justify-between bg-gradient-to-b from-black/90 to-black/40 z-50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => window.history.back()}
                        className="bg-zinc-900/50 hover:bg-zinc-800 p-3 rounded-xl border border-zinc-800/50 transition-all pointer-events-auto group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-sm font-black tracking-[0.2em] uppercase opacity-90">Virtual Classroom</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5 font-medium">
                            In Session • Room {meetingNumber}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 pointer-events-auto">
                    {status === 'joined' && (
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area (Perfectly fitted below the header) */}
            <div className="flex-1 relative bg-black overflow-hidden">
                {(status === 'loading' || !status) && (
                    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl">
                        <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin mb-6" />
                        <div className="text-center">
                            <h2 className="text-lg font-bold mb-2 tracking-tight">Joining Virtual Classroom</h2>
                            <p className="text-sm text-zinc-400 animate-pulse">{statusMsg}</p>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-zinc-950 p-12 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Classroom Connection Failed</h2>
                        <p className="text-zinc-400 max-w-md mx-auto mb-10 text-sm leading-relaxed">{error}</p>
                        
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all font-black uppercase text-xs tracking-widest"
                            >
                                Reconnect
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="px-10 py-4 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all"
                            >
                                Terminate
                            </button>
                        </div>
                    </div>
                )}

                {/* The isolated Zoom iframe */}
                <iframe
                    ref={iframeRef}
                    src="/zoom-frame.html"
                    className="w-full h-full border-none block m-0 p-0"
                    allow="camera; microphone; display-capture; fullscreen; autoplay"
                    style={{ visibility: status === 'error' ? 'hidden' : 'visible' }}
                    title="Virtual Classroom"
                />
            </div>
        </div>
    );
}
