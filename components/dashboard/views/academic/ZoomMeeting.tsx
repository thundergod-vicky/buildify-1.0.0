"use client";

import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';

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
        <div className="fixed inset-0 z-[99999] bg-black overflow-hidden animate-in fade-in duration-700">
            {/* Minimalist Floating Header Bar */}
            <div className="absolute top-6 left-8 z-[100000] flex items-center pointer-events-none group">
                <button
                    onClick={() => router.back()}
                    className="pointer-events-auto p-3 bg-black/40 hover:bg-white/10 text-white rounded-2xl backdrop-blur-2xl transition-all border border-white/10 group-hover:border-white/30 shadow-2xl"
                    title="Exit Meeting"
                >
                    <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="ml-5 flex flex-col drop-shadow-lg scale-90 origin-left">
                    <span className="text-white text-xs font-black tracking-[0.3em] uppercase opacity-90 leading-none mb-1">Virtual Classroom</span>
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">In Session • Room {meetingNumber}</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full h-full relative">
                {/* Loading overlay - matched to Zoom black */}
                {status === 'loading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] z-20">
                        <div className="w-12 h-12 border-2 border-white/5 border-t-white/50 rounded-full animate-spin mb-6" />
                        <div className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black animate-pulse">
                            Establishing encrypted connection...
                        </div>
                        <div className="mt-4 text-[9px] text-white/20 uppercase tracking-widest font-bold">
                            {statusMsg}
                        </div>
                    </div>
                )}

                {/* Error view */}
                {status === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] p-12 text-center z-30">
                        <div className="w-24 h-24 bg-red-500/5 rounded-3xl flex items-center justify-center mb-10 border border-red-500/10 scale-110">
                            <span className="text-red-500 text-5xl font-black italic">!</span>
                        </div>
                        <h3 className="text-white text-3xl font-black mb-4 tracking-tighter">Connection Interrupted</h3>
                        <p className="text-gray-500 max-w-md mb-12 text-sm font-medium leading-relaxed opacity-70 italic">&quot;{error}&quot;</p>
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
