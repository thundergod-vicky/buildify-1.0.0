"use client";

import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';

const SDK_KEY = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY || 'n9S9NJJSSie0SGI_Ixgdwg';

export function ZoomMeeting() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const meetingNumber = searchParams.get('meetingId');
    const role = parseInt(searchParams.get('role') || '0');
    const password = searchParams.get('password') || '';

    const [status, setStatus] = useState<'loading' | 'joined' | 'error'>('loading');
    const [statusMsg, setStatusMsg] = useState('Preparing classroom...');
    const [error, setError] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const startedRef = useRef(false);
    const user = auth.getUser();

    useEffect(() => {
        if (!meetingNumber) {
            setError('Meeting ID is missing from the URL.');
            setStatus('error');
            return;
        }

        const handleMessage = async (event: MessageEvent) => {
            const { type, message } = event.data || {};

            if (type === 'ZOOM_FRAME_READY') {
                if (startedRef.current) return;
                startedRef.current = true;

                try {
                    setStatusMsg('Fetching meeting credentials...');
                    const token = auth.getToken() || '';
                    const cleanMeetingNumber = meetingNumber.replace(/[^0-9]/g, '');

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
    }, [meetingNumber, role, password, user?.name, user?.email]);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-[#1a1a1a] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#242424] border-b border-white/10 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all group"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                    <div>
                        <h2 className="text-white font-semibold">Virtual Classroom</h2>
                        <p className="text-xs text-gray-500">ID: {meetingNumber}</p>
                    </div>
                </div>

                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="text-xs font-medium text-green-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        {status === 'joined' ? 'In Meeting' : 'Connecting...'}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-black min-h-0 overflow-hidden">
                {/* Loading overlay */}
                {status === 'loading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] z-50 pointer-events-none">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                        <div className="text-white font-medium">Entering Classroom...</div>
                        <div className="text-sm text-gray-400 mt-2 italic px-8 text-center">
                            {statusMsg}
                        </div>
                    </div>
                )}

                {/* Error view */}
                {status === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/5 p-8 text-center z-50">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                            <span className="text-red-500 text-3xl font-bold">!</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Classroom Error</h3>
                        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">{error}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
                            >
                                Retry Connection
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {/* The isolated Zoom iframe — always present so it can fire ZOOM_FRAME_READY */}
                <div className="absolute inset-0">
                    <iframe
                        ref={iframeRef}
                        src="/zoom-frame.html"
                        className="w-full h-full border-none block m-0 p-0"
                        allow="camera; microphone; display-capture; fullscreen; autoplay"
                        style={{ display: status === 'error' ? 'none' : 'block' }}
                        title="Virtual Classroom"
                    />
                </div>
            </div>
        </div>
    );
}
