"use client";

import { useState, useEffect, useCallback } from "react";
import { PlusIcon, FileTextIcon, SearchIcon, EyeIcon, CameraIcon } from "lucide-react";
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

  if (renderError) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p>{renderError}</p>
        <button onClick={() => window.location.reload()} className="mt-4 underline">Reload page</button>
      </div>
    );
  }

  const handleScan = (template: OmrTemplate) => {
    setSelectedTemplate(template);
    setView("scan");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse h-48" />
          ))}
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
                <button 
                  onClick={() => handleScan(template)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <CameraIcon className="size-4" />
                  Scan OMRs
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Template"
                >
                  <EyeIcon className="size-5" />
                </button>
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
    </div>
  );
}
