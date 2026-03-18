"use client";

import { useState, useEffect, useCallback } from "react";
import { PlusIcon, FileTextIcon, SearchIcon, EyeIcon, CameraIcon, Trash2Icon, AlertTriangleIcon } from "lucide-react";
import { OmrTemplate } from "@/types";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import { OmrTemplateUpload } from "./OmrTemplateUpload";
import { OmrScannerView } from "./OmrScannerView";

export function OmrDashboard() {
  const [templates, setTemplates] = useState<OmrTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "scan">("list");
  const [selectedTemplate, setSelectedTemplate] = useState<OmrTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<OmrTemplate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.log("OmrDashboard mounted");
    return () => console.log("OmrDashboard unmounted");
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = auth.getToken();
      console.log("Fetching templates with token:", !!token);
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const data = await api.get<OmrTemplate[]>('/omr/templates', token);
      console.log("Received templates data:", data);
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred while fetching templates";
      console.error("Failed to fetch templates:", error);
      showToast.error("Failed to load OMR templates: " + message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      console.log("OmrDashboard view changed:", view);
      if (view === "list") {
        fetchTemplates();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred in effects";
      console.error("Effect error:", err);
      setRenderError(message);
    }
  }, [view, fetchTemplates]);

  // Body scroll lock for preview modal
  useEffect(() => {
    if (previewTemplate) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [previewTemplate]);

  if (renderError) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p>{renderError}</p>
        <button onClick={() => window.location.reload()} className="mt-4 underline">Reload page</button>
      </div>
    );
  }

  const handleDelete = async (templateId: string) => {
    try {
      setIsDeleting(true);
      const token = auth.getToken();
      if (!token) return;
      await api.delete(`/omr/template/${templateId}`, token);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      setDeleteConfirmId(null);
      showToast.success("Template deleted");
    } catch (err) {
      showToast.error("Failed to delete template");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleScan = (template: OmrTemplate) => {
    setSelectedTemplate(template);
    setView("scan");
  };

  const getProxyUrl = (url: string) => {
    if (!url) return "";
    // If it's already a full URL to S3, extract the key
    const parts = url.split('.amazonaws.com/');
    if (parts.length > 1) {
      const key = parts[1];
      return `${process.env.NEXT_PUBLIC_API_URL}/omr/image/${key}`;
    }
    return url;
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === "create") {
    return <OmrTemplateUpload onBack={() => setView("list")} onSuccess={() => setView("list")} />;
  }

  if (view === "scan" && selectedTemplate) {
    return <OmrScannerView template={selectedTemplate} onBack={() => setView("list")} />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-urbanist">OMR Scanner</h1>
          <p className="text-gray-500 mt-1">Upload and analyze OMR sheets using AI</p>
        </div>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-semibold w-fit"
        >
          <PlusIcon className="size-5" />
          Create OMR Template
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 min-h-[400px]">
          <div className="spinner scale-75"></div>
          <p className="text-gray-400 font-medium animate-pulse mt-4">Loading templates...</p>
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden flex flex-col"
            >
              <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileTextIcon className="size-6 text-blue-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 font-urbanist group-hover:text-blue-600 transition-colors line-clamp-1">
                {template.name}
              </h3>
              
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                {template.description || "No description provided"}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                {deleteConfirmId === template.id ? (
                  <div className="flex-1 flex items-center gap-2 bg-red-50 rounded-lg p-2">
                    <AlertTriangleIcon className="size-4 text-red-500 shrink-0" />
                    <span className="text-xs text-red-600 font-semibold flex-1">Delete permanently?</span>
                    <button
                      onClick={() => handleDelete(template.id)}
                      disabled={isDeleting}
                      className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? "..." : "Yes"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleScan(template)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <CameraIcon className="size-4" />
                      Scan OMRs
                    </button>
                    <button 
                      onClick={() => setPreviewTemplate(template)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Template"
                    >
                      <EyeIcon className="size-5" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Template"
                    >
                      <Trash2Icon className="size-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CameraIcon className="size-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-urbanist">No templates found</h3>
          <p className="text-gray-500 mt-2">Create your first OMR template to start scanning</p>
        </div>
      )}
      {/* Preview Template Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] min-h-0 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-urbanist">{previewTemplate.name}</h2>
                <p className="text-gray-500 text-sm">Reference &quot;Mother OMR&quot; and Correct Answers</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <PlusIcon className="size-6 text-gray-500 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[calc(90vh-200px)] p-8 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Column */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mother OMR Image</h3>
                  <div className="rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 aspect-[3/4] relative">
                    <img 
                      src={getProxyUrl(previewTemplate.motherOmrUrl)} 
                      alt="Mother OMR" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <a 
                    href={getProxyUrl(previewTemplate.motherOmrUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm"
                  >
                    <EyeIcon className="size-4" />
                    View Original Image
                  </a>
                </div>

                {/* Answers Column */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Correct Answer Key</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Array.isArray(previewTemplate.answers) && previewTemplate.answers.map((ans: { number: number; answer: string }) => (
                      <div 
                        key={ans.number} 
                        className="group p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-between"
                      >
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Q{ans.number}</span>
                        <span className="text-xl font-black text-blue-600 font-urbanist">{ans.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
