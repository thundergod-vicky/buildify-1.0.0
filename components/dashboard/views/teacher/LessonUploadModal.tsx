import { useState } from 'react';
import { XIcon, Loader2Icon, FileTextIcon, VideoIcon, UploadCloudIcon } from 'lucide-react';
import { coursesApi } from '@/lib/courses';
import { showToast } from '@/lib/toast';

interface LessonUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    chapterId: string;
    onSuccess: () => void;
}

export function LessonUploadModal({ isOpen, onClose, chapterId, onSuccess }: LessonUploadModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0); // Mock progress for now

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // Auto-set title from filename if empty
            if (!title) {
                setTitle(e.target.files[0].name.split('.')[0]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setIsLoading(true);
        try {
            // Step 1: Upload File
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await coursesApi.uploadMedia(formData); 
            
            const driveFileId = uploadResponse.id;
            const mimeType = uploadResponse.mimeType;

            // Step 2: Create Lesson Record
            await coursesApi.createLesson(chapterId, {
                title,
                driveFileId,
                mimeType,
                type: mimeType.includes('video') ? 'RECORDED' : 'RECORDED',
                order: 1 // TODO: Logic for order
            });

            onSuccess();
        } catch (error) {
            console.error('Failed to upload lesson:', error);
            showToast.error('Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Upload Content</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <XIcon className="size-5 text-gray-500" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Lesson Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="e.g., Chapter 1 Introduction"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">File (Video or PDF)</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer relative group">
                            <input
                                type="file"
                                accept="video/*,application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {file ? (
                                <div className="flex items-center justify-center gap-3 text-indigo-600">
                                    {file.type.includes('pdf') ? <FileTextIcon className="size-6" /> : <VideoIcon className="size-6" />}
                                    <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                        <UploadCloudIcon className="size-6" />
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
                                        <p className="text-xs text-gray-400 mt-1">MP4 or PDF (Max 500MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !file || !title}
                            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload & Save"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
