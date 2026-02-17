"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PDFViewerProps {
    src: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ src }) => {
    const { user } = useAuth();

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div 
            className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden select-none"
            onContextMenu={handleContextMenu}
        >
            {/* Using object/embed for PDF. iframe might allow download easier via toolbar */}
            <object
                data={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
                type="application/pdf"
                className="w-full h-full"
            >
                <p>PDF cannot be displayed. <a href={src}>Download</a> to view.</p> {/* Fallback */}
            </object>

            {/* Watermark Overlay - Critical for PDF since browser viewer is hard to control */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 opacity-[0.02] z-20 select-none overflow-hidden">
                 {Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="flex justify-around">
                         <span className="text-4xl text-gray-900 font-bold transform -rotate-12 whitespace-nowrap">
                             {user?.email || 'Adhyayan Secure'}
                         </span>
                         <span className="text-4xl text-gray-900 font-bold transform -rotate-12 whitespace-nowrap">
                             {user?.email || 'Adhyayan Secure'}
                         </span>
                     </div>
                 ))}
            </div>
            
            {/* Block interaction except scroll? Not easy with object tag. 
                Ideally use react-pdf for canvas rendering to block text selection fully.
            */}
        </div>
    );
};
