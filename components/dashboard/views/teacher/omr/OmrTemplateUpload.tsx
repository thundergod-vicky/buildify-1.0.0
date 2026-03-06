"use client";

import { useState } from "react";
import { ArrowLeftIcon, UploadIcon, FileTextIcon, Loader2Icon } from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { showToast } from "@/lib/toast";

interface OmrTemplateUploadProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function OmrTemplateUpload({ onBack, onSuccess }: OmrTemplateUploadProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      showToast.error("Please provide a name and a Mother OMR image");
      return;
    }

    try {
      setIsUploading(true);
      const token = auth.getToken();
      if (!token) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("description", description);

      await api.post("/omr/template", formData, token);

      showToast.success("OMR Template created successfully");
      onSuccess();
    } catch (error) {
      console.error("Upload failed:", error);
      showToast.error("Failed to create OMR template");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="size-5" />
        Back to Templates
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">Create Mother OMR</h1>
        <p className="text-gray-500 mt-1">Upload the reference OMR with correct answers marked</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Template Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Midterm Physics 2024"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context for this test..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Mother OMR Image *</label>
          <div 
            className={`mt-1 border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              file ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <input
              type="file"
              id="mother-omr-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor="mother-omr-upload" className="cursor-pointer">
              {file ? (
                <div className="space-y-2">
                  <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileTextIcon className="size-6 text-blue-600" />
                  </div>
                  <p className="text-blue-600 font-semibold">{file.name}</p>
                  <p className="text-gray-400 text-sm">Click to change file</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="size-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <UploadIcon className="size-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading || !file || !name}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2Icon className="size-6 animate-spin" />
              Processing Image...
            </>
          ) : (
            "Create & Save Template"
          )}
        </button>
      </form>
    </div>
  );
}
