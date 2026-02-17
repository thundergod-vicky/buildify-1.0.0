"use client";

import { useState, useEffect } from "react";
import { FileTextIcon, SearchIcon, TrendingUpIcon, UsersIcon, AlertTriangleIcon, ClockIcon, Trash2Icon, EyeIcon, XIcon } from "lucide-react";
import { showToast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

interface PracticeTest {
  id: string;
  title: string;
  totalQuestions: number;
  timeLimit: number | null;
  createdAt: string;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    results: number;
  };
}

interface TestAnalytics {
  test: PracticeTest & {
    results: Array<{
      id: string;
      score: number;
      total: number;
      timeTaken: number | null;
      status: string;
      rating: number | null;
      createdAt: string;
      student: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  };
  analytics: {
    totalAttempts: number;
    uniqueStudents: number;
    completedAttempts: number;
    cheatedAttempts: number;
    averageScore: number;
    averagePercentage: number;
    averageRating: number;
    passRate: number;
    averageTimeTaken: number;
    cheatingRate: number;
  };
}

export function AdminPracticeTestManagement() {
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState<TestAnalytics | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    testId: string;
    testTitle: string;
  }>({ isOpen: false, testId: "", testTitle: "" });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      
      const data = await api.get<PracticeTest[]>('/admin/practice-tests', token);
      setTests(data);
    } catch (error) {
      console.error("Failed to fetch tests:", error);
      showToast.error("Failed to load practice tests");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestAnalytics = async (testId: string) => {
    setIsAnalyticsLoading(true);
    try {
      const token = auth.getToken();
      if (!token) return;

      const data = await api.get<TestAnalytics>(`/admin/practice-tests/${testId}/analytics`, token);
      setSelectedTest(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      showToast.error("Failed to load test analytics");
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  const handleDelete = async (testId: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.delete(`/admin/practice-tests/${testId}`, token);
      showToast.success("Practice test deleted successfully");
      fetchTests();
      if (selectedTest?.test.id === testId) {
        setSelectedTest(null);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      showToast.error("Error connecting to server");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredTests = tests.filter(
    (t) =>
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teacher?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate overview stats
  const totalTests = tests.length;
  const totalAttempts = tests.reduce((sum, t) => sum + t._count.results, 0);
  const testsWithAttempts = tests.filter(t => t._count.results > 0).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">Practice Test Management</h1>
        <p className="text-gray-500 mt-1">Monitor and manage all practice tests across the platform</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileTextIcon className="size-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalTests}</div>
              <div className="text-sm text-gray-500">Total Tests</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UsersIcon className="size-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalAttempts}</div>
              <div className="text-sm text-gray-500">Total Attempts</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUpIcon className="size-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{testsWithAttempts}</div>
              <div className="text-sm text-gray-500">Active Tests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md group">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
        <input
          type="text"
          placeholder="Search by test title or teacher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
        />
      </div>

      {/* Tests Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse space-y-4">
              <div className="h-40 bg-gray-50 rounded-2xl"></div>
              <div className="h-6 bg-gray-50 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-50 rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center">
          <div className="flex flex-col items-center gap-4 text-gray-400">
            <FileTextIcon className="size-12 opacity-20" />
            <p className="font-medium">No practice tests found</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
              <div className="size-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileTextIcon className="size-6 text-purple-600" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                {test.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <UsersIcon className="size-4" />
                  <span className="font-medium">By {test.teacher.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{test.totalQuestions} Questions</span>
                  {test.timeLimit && (
                    <>
                      <span className="size-1 bg-gray-300 rounded-full" />
                      <span>{test.timeLimit} min</span>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-purple-600">{test._count.results}</span> Attempts
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
                <button
                  onClick={() => fetchTestAnalytics(test.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <EyeIcon className="size-4" />
                  View Analytics
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, testId: test.id, testTitle: test.title })}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2Icon className="size-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTest.test.title}</h2>
                <p className="text-sm text-gray-500">Created by {selectedTest.test.teacher.name}</p>
              </div>
              <button onClick={() => setSelectedTest(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <XIcon className="size-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Analytics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{selectedTest.analytics.totalAttempts}</div>
                  <div className="text-sm text-blue-700">Total Attempts</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">{selectedTest.analytics.uniqueStudents}</div>
                  <div className="text-sm text-green-700">Unique Students</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">{selectedTest.analytics.averagePercentage}%</div>
                  <div className="text-sm text-purple-700">Avg Score</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-600">{selectedTest.analytics.passRate}%</div>
                  <div className="text-sm text-orange-700">Pass Rate</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <ClockIcon className="size-4" />
                    Average Time
                  </div>
                  <div className="text-lg font-bold text-gray-900">{formatTime(selectedTest.analytics.averageTimeTaken)}</div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <TrendingUpIcon className="size-4" />
                    Average Rating
                  </div>
                  <div className="text-lg font-bold text-gray-900">{selectedTest.analytics.averageRating.toFixed(1)} / 5.0</div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <AlertTriangleIcon className="size-4" />
                    Cheating Rate
                  </div>
                  <div className="text-lg font-bold text-red-600">{selectedTest.analytics.cheatingRate}%</div>
                </div>
              </div>

              {/* Student Results Table */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Student Results ({selectedTest.test.results.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Time Taken</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedTest.test.results.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{result.student.name}</div>
                            <div className="text-xs text-gray-500">{result.student.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900">{result.score}/{result.total}</span>
                            <span className="text-sm text-gray-500 ml-2">({((result.score / result.total) * 100).toFixed(1)}%)</span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{result.timeTaken ? formatTime(result.timeTaken) : 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className="text-orange-600 font-semibold">{result.rating?.toFixed(1) || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              result.status === 'COMPLETED' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-red-50 text-red-700'
                            }`}>
                              {result.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => {
          setDeleteModal({ ...deleteModal, isOpen: false });
          handleDelete(deleteModal.testId);
        }}
        title="Delete Practice Test"
        message={`Are you absolutely sure you want to delete "${deleteModal.testTitle}"? This will permanently delete all student results and cannot be undone.`}
        confirmText="Delete Permanently"
        variant="danger"
      />
    </div>
  );
}
