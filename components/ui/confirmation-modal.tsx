"use client";

import { AlertTriangleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
}: ConfirmationModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;
    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${
                            variant === 'danger' ? 'bg-red-100 text-red-600' : 
                            variant === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                            <AlertTriangleIcon className="size-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        </div>
                        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-900 transition-colors">
                            <XIcon className="size-6" />
                        </button>
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all ${
                                variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 
                                variant === 'warning' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
