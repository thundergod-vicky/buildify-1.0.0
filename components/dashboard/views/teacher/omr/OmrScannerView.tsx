"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftIcon,
  UploadIcon,
  FileTextIcon,
  Loader2Icon,
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  EyeIcon,
  XIcon,
} from "lucide-react";
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
  const [selectedResult, setSelectedResult] = useState<OmrResult | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      setIsLoadingResults(true);
      const token = auth.getToken();
      if (!token) return;

      const data = await api.get<OmrResult[]>(
        `/omr/results/${template.id}`,
        token,
      );
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
      files.forEach((file) => {
        formData.append("files", file);
      });

      const newResults = await api.post<OmrResult[]>(
        `/omr/scan/${template.id}`,
        formData,
        token,
      );

      showToast.success(`Successfully scanned ${newResults.length} OMR(s)`);
      setResults((prev) => [...newResults, ...prev]);
      setFiles([]);
    } catch (error) {
      console.error("Scan failed:", error);
      showToast.error("Failed to analyze OMR sheets");
    } finally {
      setIsScanning(false);
    }
  };
  const getProxyUrl = (url: string) => {
    if (!url) return "";
    const parts = url.split(".amazonaws.com/");
    if (parts.length > 1) {
      const key = parts[1];
      return `${process.env.NEXT_PUBLIC_API_URL}/omr/image/${key}`;
    }
    return url;
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
          <h1 className="text-3xl font-bold text-gray-900 font-urbanist">
            {template.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Upload student OMRs for scanning and analysis
          </p>
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
                files.length > 0
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 hover:border-blue-200 cursor-pointer"
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
              <label
                htmlFor="student-omr-upload"
                className="cursor-pointer space-y-2 block"
              >
                {files.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-blue-600 font-semibold">
                      {files.length} files selected
                    </p>
                    <p className="text-gray-400 text-sm">
                      Click to change files
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadIcon className="size-8 text-gray-300 mx-auto" />
                    <p className="text-gray-600 font-medium">Add Images</p>
                    <p className="text-gray-400 text-xs">
                      Supports single or multi-upload
                    </p>
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
            <p className="text-sm">
              The AI compares student OMR images with the{" "}
              <strong>Mother OMR</strong> template to detect filled bubbles and
              calculate scores automatically.
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 font-urbanist">
                Scan History
              </h2>
              <span className="text-sm text-gray-500">
                {results.length} total results
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {isLoadingResults ? (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-6 animate-pulse flex items-center justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-100 rounded" />
                    </div>
                    <div className="h-8 w-16 bg-gray-100 rounded" />
                  </div>
                ))
              ) : results.length > 0 ? (
                results.map((result) => (
                  <div
                    key={result.id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileTextIcon className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {result.studentName || "Anonymous Student"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Scanned at{" "}
                          {new Date(result.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {result.score}
                          <span className="text-sm text-gray-500">
                            /{result.total}
                          </span>
                        </p>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          Score
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedResult(result)}
                        className="size-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="size-5" />
                      </button>
                      <div className="size-10 flex items-center justify-center">
                        {Math.max(0, result.score) / result.total >= 0.4 ? (
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

      {/* Result Details Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] min-h-0 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-urbanist">
                  {selectedResult.studentName || "Result"} Details
                </h2>
                <p className="text-gray-500 text-sm">
                  Comparison with {template.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="size-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Column */}
              <div className="space-y-4 min-h-0">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Student OMR Image
                </h3>
                <div className="rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 aspect-[3/4] relative">
                  <img
                    src={getProxyUrl(selectedResult.omrImageUrl)}
                    alt="Student OMR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <a
                  href={getProxyUrl(selectedResult.omrImageUrl)}
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
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Question Breakdown
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {(template as any).answers.map(
                    (correction: { number: number; answer: string }) => {
                      const studentAns = (selectedResult as any).answers.find(
                        (a: { number: number; answer: string }) =>
                          a.number === correction.number,
                      );
                      const isCorrect =
                        studentAns?.answer === correction.answer;

                      return (
                        <div
                          key={correction.number}
                          className={`relative overflow-hidden p-4 rounded-2xl border transition-all hover:shadow-md ${
                            isCorrect
                              ? "bg-green-50/50 border-green-100 hover:bg-green-50"
                              : "bg-red-50/50 border-red-100 hover:bg-red-50"
                          }`}
                        >
                          {/* Status Indicator Bar */}
                          <div
                            className={`absolute top-0 left-0 w-full h-1 ${isCorrect ? "bg-green-400" : "bg-red-400"}`}
                          />

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                              Question {correction.number}
                            </span>
                            {isCorrect ? (
                              <div className="bg-green-100 p-1 rounded-full">
                                <CheckCircleIcon className="size-3 text-green-600" />
                              </div>
                            ) : (
                              <div className="bg-red-100 p-1 rounded-full">
                                <XCircleIcon className="size-3 text-red-600" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-start justify-between gap-2 border-t border-gray-100/50 pt-2 mt-auto">
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[9px] font-bold uppercase tracking-tight truncate ${isCorrect ? "text-green-500" : "text-red-400"}`}
                              >
                                Student
                              </p>
                              <p
                                className={`text-2xl font-black font-urbanist leading-none ${isCorrect ? "text-green-600" : "text-red-600"}`}
                              >
                                {studentAns?.answer || "-"}
                              </p>
                            </div>

                            {!isCorrect && (
                              <div className="flex-1 min-w-0 border-l border-red-100 pl-3">
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight truncate">
                                  Correct
                                </p>
                                <p className="text-2xl font-black font-urbanist leading-none text-gray-900">
                                  {correction.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-right border-r pr-4 border-gray-200">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                    Final Score
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    {selectedResult.score}
                    <span className="text-lg text-gray-400">
                      /{selectedResult.total}
                    </span>
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                    Accuracy
                  </p>
                  <p className="text-2xl font-black text-blue-600">
                    {Math.max(
                      0,
                      Math.round(
                        (selectedResult.score / selectedResult.total) * 100,
                      ),
                    )}
                    %
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
