"use client";

import React, { useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface VideoPlayerProps {
    src: string;
    mimeType: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, mimeType }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user } = useAuth();

    // Prevent context menu
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div 
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group select-none"
            onContextMenu={handleContextMenu}
        >
            <video 
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                controlsList="nodownload" // Chrome attribute
                disablePictureInPicture
                src={src}
            >
                Your browser does not support the video tag.
            </video>

            {/* Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-10 select-none overflow-hidden">
                 <div className="grid grid-cols-2 gap-20 w-full h-full p-12 transform -rotate-12 scale-150">
                     {Array.from({ length: 12 }).map((_, i) => (
                         <div key={i} className="flex items-center justify-center text-white text-3xl font-bold whitespace-nowrap">
                             {user?.email || 'Adhyayan Secure'}
                         </div>
                     ))}
                 </div>
            </div>

            {/* Anti-Download Overlay (Transparent, captures clicks except controls) */}
            {/* Note: Standard browser controls are hard to overlay without blocking them. 
                Using native controls with 'nodownload' is usually sufficient for casual prevention.
                For strict prevention, custom controls + MSE/Encryption (DRM) is needed. 
                We use naive overlay + context menu block here.
            */}
        </div>
    );
};
