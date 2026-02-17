"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PracticeTestResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy, BookOpen, Clock, AlertCircle } from "lucide-react";
import { TestResultModal } from "./TestResultModal";

export function ParentPerformance() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null); // Still any for student data as it's a mix
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] =
    useState<PracticeTestResult | null>(null);

  const linkedStudents = user?.parentOf?.map((p) => p.student) || [];
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    linkedStudents[0]?.id || "",
  );

  useEffect(() => {
    if (selectedStudentId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const token = auth.getToken();
          if (!token) return;
          const res: any = await api.get(
            `/users/parent/student-data/${selectedStudentId}`,
            token,
          );
          setData(res);
        } catch (error) {
          console.error("Failed to fetch student data", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedStudentId]);

  if (!linkedStudents.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        No student data available. Please link a student first.
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-urbanist text-gray-900">
          Performance Report
        </h1>

        {linkedStudents.length > 1 && (
          <div className="flex items-center gap-3 bg-white p-2 border border-gray-100 rounded-xl shadow-sm">
            <span className="text-sm font-medium text-gray-500 ml-2">
              Viewing:
            </span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-transparent font-semibold text-orange-600 focus:outline-none cursor-pointer pr-4"
            >
              {linkedStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-orange-600 size-10" />
        </div>
      ) : data ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-gradient-to-br from-yellow-50 to-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                  <Trophy className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Academic Grade
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {data.grade || "N/A"}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <BookOpen className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Assigned Courses
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {data.enrollments?.length || 0}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                  <Clock className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Last Login
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {data.loginHistory?.[0]?.loginTime
                      ? new Date(
                          data.loginHistory[0].loginTime,
                        ).toLocaleDateString()
                      : "Never"}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Results */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Recent Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.practiceTestResults?.length > 0 ? (
                  <div className="space-y-4">
                    {data.practiceTestResults.map((res: PracticeTestResult) => {
                      const percentage = Math.round(
                        (res.score / res.total) * 100,
                      );
                      return (
                        <div
                          key={res.id}
                          className="group p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 hover:bg-orange-50/30 transition-all flex justify-between items-center"
                        >
                          <div className="flex items-center gap-4">
                            <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600 font-bold border border-orange-50">
                              {percentage}%
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-orange-900 transition-colors">
                                {res.test?.title || "Unknown Test"}
                              </p>
                              <p className="text-xs text-gray-500 font-medium">
                                Completed on{" "}
                                {new Date(res.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <p
                                className={`text-[10px] font-bold uppercase tracking-wider ${percentage >= 40 ? "text-green-600" : "text-orange-600"}`}
                              >
                                {percentage >= 40 ? "Passed" : "Needs Review"}
                              </p>
                              {res.status === "CHEATED" && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter animate-pulse">
                                  Cheated
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 font-bold"
                              onClick={() => setSelectedResult(res)}
                            >
                              See More
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tests taken yet.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Login History */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                {data.loginHistory?.length > 0 ? (
                  <div className="space-y-3">
                    {data.loginHistory.map((log: any) => (
                      <div
                        key={log.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <p className="font-medium text-gray-900">LoggedIn</p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.loginTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            {log.logoutTime ? "Logged Out" : "Active"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {log.logoutTime
                              ? new Date(log.logoutTime).toLocaleTimeString()
                              : "---"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No login history available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="p-12 text-center text-gray-500">
          Failed to load student data.
        </div>
      )}

      <TestResultModal
        isOpen={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        result={selectedResult}
      />
    </div>
  );
}
