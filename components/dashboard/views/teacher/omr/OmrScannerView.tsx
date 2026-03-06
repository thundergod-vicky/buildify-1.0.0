"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeftIcon, UploadIcon, FileTextIcon, Loader2Icon, CheckCircleIcon, XCircleIcon, CameraIcon } from "lucide-react";
import { OmrTemplate, OmrResult } from "@/types";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { showToast } from "@/lib/toast";

interface OmrScannerViewProps {
  template: OmrTemplate;
  onBack: () => void;
}

export function OmrScannerView({ template, onBack }: OmrScannerViewProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<OmrResult[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      setIsLoadingResults(true);
      const token = auth.getToken();
      if (!token) return;

      const data = await api.get<OmrResult[]>(`/omr/results/${template.id}`, token);
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setIsLoadingResults(false);
    }
  }, [template.id]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleScan = async () => {
    if (files.length === 0) {
      showToast.error("Please select OMR images to scan");
      return;
    }

    try {
      setIsScanning(true);
      const token = auth.getToken();
      if (!token) return;

      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });

      const newResults = await api.post<OmrResult[]>(`/omr/scan/${template.id}`, formData, token);

      showToast.success(`Successfully scanned ${newResults.length} OMR(s)`);
      setResults(prev => [...newResults, ...prev]);
      setFiles([]);
    } catch (error) {
      console.error("Scan failed:", error);
      showToast.error("Failed to analyze OMR sheets");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="size-5" />
        Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-urbanist">{template.name}</h1>
          <p className="text-gray-500 mt-1">Upload student OMRs for scanning and analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900 font-urbanist flex items-center gap-2">
              <CameraIcon className="size-6 text-blue-600" />
              Upload Student OMRs
            </h2>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                files.length > 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 cursor-pointer'
              }`}
            >
              <input
                type="file"
                id="student-omr-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="student-omr-upload" className="cursor-pointer space-y-2 block">
                {files.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-blue-600 font-semibold">{files.length} files selected</p>
                    <p className="text-gray-400 text-sm">Click to change files</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadIcon className="size-8 text-gray-300 mx-auto" />
                    <p className="text-gray-600 font-medium">Add Images</p>
                    <p className="text-gray-400 text-xs">Supports single or multi-upload</p>
                  </div>
                )}
              </label>
            </div>

            <button
              onClick={handleScan}
              disabled={isScanning || files.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <Loader2Icon className="size-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze & Score"
              )}
            </button>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-700 space-y-2">
            <h3 className="font-bold">How it works</h3>
            <p className="text-sm">The AI compares student OMR images with the <strong>Mother OMR</strong> template to detect filled bubbles and calculate scores automatically.</p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 font-urbanist">Scan History</h2>
                <span className="text-sm text-gray-500">{results.length} total results</span>
             </div>

             <div className="divide-y divide-gray-50">
               {isLoadingResults ? (
                 [1, 2, 3].map(i => (
                   <div key={i} className="p-6 animate-pulse flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                      </div>
                      <div className="h-8 w-16 bg-gray-100 rounded" />
                   </div>
                 ))
               ) : results.length > 0 ? (
                 results.map((result) => (
                   <div key={result.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FileTextIcon className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{result.studentName || "Anonymous Student"}</p>
                          <p className="text-xs text-gray-400">Scanned at {new Date(result.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{result.score}<span className="text-sm text-gray-500">/{result.total}</span></p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Score</p>
                        </div>
                        <div className="size-10 flex items-center justify-center">
                          {result.score / result.total >= 0.4 ? (
                            <CheckCircleIcon className="size-6 text-green-500" />
                          ) : (
                            <XCircleIcon className="size-6 text-red-500" />
                          )}
                        </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="p-12 text-center text-gray-500">
                    <p>No scans yet for this template.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
