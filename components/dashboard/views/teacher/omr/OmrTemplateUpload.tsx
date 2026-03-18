"use client";

import { useState } from "react";
import { ArrowLeftIcon, UploadIcon, FileTextIcon, Loader2Icon, InfoIcon } from "lucide-react";
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
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      showToast.error("Please provide a name and a Mother OMR image");
      return;
    }
    if (totalQuestions < 1 || totalQuestions > 200) {
      showToast.error("Number of questions must be between 1 and 200");
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
      formData.append("totalQuestions", String(totalQuestions));

      await api.post("/omr/template", formData, token);

      showToast.success("OMR Template created successfully!");
      onSuccess();
    } catch (error) {
      console.error("Upload failed:", error);
      showToast.error("Failed to create OMR template");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Form fields */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
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
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Exam Format *
            </label>
            <select
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-lg appearance-none"
            >
              <option value={180}>NEET (180 Questions)</option>
              <option value={80}>Class 9 & 10 (80 Questions)</option>
              <option value={70}>Class 6 to 8 (70 Questions)</option>
            </select>
            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3 text-xs text-blue-700 mt-2">
              <InfoIcon className="size-4 mt-0.5 shrink-0" />
              <span>
                Please upload a clear, flat, well-lit image of the Mother OMR. 
                The system uses high-end local computer vision which requires the entire outer box to be visible.
              </span>
            </div>
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

          <button
            type="submit"
            disabled={isUploading || !file || !name}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2Icon className="size-6 animate-spin" />
                Analyzing Image ({totalQuestions} questions)...
              </>
            ) : (
              "Create & Save Template"
            )}
          </button>
        </div>

        {/* Right column: Image upload */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Mother OMR Image *</label>
            <div
              className={`border-2 border-dashed rounded-2xl text-center transition-all overflow-hidden ${
                file ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-blue-200"
              }`}
            >
              <input
                type="file"
                id="mother-omr-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="mother-omr-upload" className="cursor-pointer block">
                {preview ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="OMR Preview"
                      className="w-full h-64 object-contain bg-white"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-blue-600/90 text-white text-xs font-bold py-2 text-center">
                      Click to change image
                    </div>
                  </div>
                ) : (
                  <div className="p-10 space-y-2">
                    <div className="size-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UploadIcon className="size-7 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
            {file && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FileTextIcon className="size-3" />
                {file.name}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
