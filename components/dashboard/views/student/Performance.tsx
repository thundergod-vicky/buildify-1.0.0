"use client";

import { useState, useEffect } from "react";
import { 
  TrophyIcon, 
  BarChart3Icon, 
  CheckCircle2Icon, 
  BookOpenIcon, 
  TrendingUpIcon,
  MedalIcon,
  AwardIcon,
  FileTextIcon
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";
import StatCard from "@/components/dashboard/stat-card";
import enrollmentsApi from "@/lib/enrollments";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

interface TestResult {
  id: string;
  score: number;
  total: number;
  timeTaken?: number;
}

interface UserProfile {
  id: string;
  name: string;
  medal?: string;
  grade?: string;
  assignedByTeacher?: {
    name: string;
  };
}

const MEDAL_COLORS: Record<string, string> = {
  WOOD: "text-[#8B4513] bg-[#8B4513]/10",
  STONE: "text-[#808080] bg-[#808080]/10",
  IRON: "text-[#A19D94] bg-[#A19D94]/10",
  SILVER: "text-[#C0C0C0] bg-[#C0C0C0]/10",
  GOLD: "text-[#FFD700] bg-[#FFD700]/10",
  DIAMOND: "text-[#B9F2FF] bg-[#B9F2FF]/10",
  PLATINUM: "text-[#E5E4E2] bg-[#E5E4E2]/10",
  VIBRANIUM: "text-[#50C878] bg-[#50C878]/10",
};

const GRADE_COLORS: Record<string, string> = {
  E: "text-emerald-600 bg-emerald-50",
  A_PLUS: "text-emerald-500 bg-emerald-50",
  A: "text-emerald-500 bg-emerald-50",
  B_PLUS: "text-blue-600 bg-blue-50",
  B: "text-blue-500 bg-blue-50",
  C_PLUS: "text-purple-600 bg-purple-50",
  C: "text-purple-500 bg-purple-50",
  D_PLUS: "text-orange-600 bg-orange-50",
  D: "text-orange-500 bg-orange-50",
  F: "text-red-600 bg-red-50",
};

export function StudentPerformance() {
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    accuracy: 0,
    courseCompletions: 0,
    enrolledCourses: 0,
  });
  const [profile, setProfile] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const token = auth.getToken();
        if (!token) return;

        const [results, userProfile, enrollData]: [any[], any, any[]] = await Promise.all([
          api.get<any[]>('/practice-tests/results/student', token),
          api.get<any>('/users/profile', token),
          enrollmentsApi.getMyCourses(),
        ]);

        setTestResults(results);
        setProfile(userProfile);

        const totalScore = results.reduce((acc: number, curr: any) => acc + (curr.score / curr.total * 100), 0);
        const avgScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;
        
        setStats({
          totalTests: results.length,
          averageScore: avgScore,
          accuracy: avgScore, // Using avgScore as accuracy for now
          courseCompletions: enrollData.filter((e: any) => e.progress?.every((p: any) => p.completed)).length || 0,
          enrolledCourses: enrollData.length,
        });
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">Performance Analytics</h1>
        <p className="text-gray-500 mt-1">Detailed breakdown of your academic progress and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedContent delay={0.1}>
          <StatCard
            title="Total Tests Taken"
            value={stats.totalTests.toString()}
            icon={FileTextIcon}
            colorClass="bg-blue-50 text-blue-600"
            loading={loading}
          />
        </AnimatedContent>
        <AnimatedContent delay={0.2}>
          <StatCard
            title="Success Accuracy"
            value={`${stats.accuracy}%`}
            icon={TrendingUpIcon}
            colorClass="bg-emerald-50 text-emerald-600"
            loading={loading}
          />
        </AnimatedContent>
        <AnimatedContent delay={0.3}>
          <StatCard
            title="Courses Completed"
            value={stats.courseCompletions.toString()}
            icon={CheckCircle2Icon}
            colorClass="bg-purple-50 text-purple-600"
            loading={loading}
          />
        </AnimatedContent>
        <AnimatedContent delay={0.4}>
          <StatCard
            title="Enrolled Courses"
            value={stats.enrolledCourses.toString()}
            icon={BookOpenIcon}
            colorClass="bg-orange-50 text-orange-600"
            loading={loading}
          />
        </AnimatedContent>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scholar Status Card */}
        <AnimatedContent delay={0.5} className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 h-full flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MedalIcon className="size-5 text-orange-600" />
                Scholar Status
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-bold">Assigned Medal</p>
                  {profile?.medal ? (
                    <div className={`flex items-center gap-3 p-4 rounded-2xl ${MEDAL_COLORS[profile.medal]}`}>
                      <TrophyIcon className="size-8" />
                      <div>
                        <div className="font-black text-xl font-urbanist">{profile.medal}</div>
                        <div className="text-xs font-semibold opacity-80">Achievement Rank</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl text-center border border-dashed border-gray-200">
                      No medal assigned yet
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-bold">Latest Grade</p>
                  {profile?.grade ? (
                    <div className={`flex items-center gap-3 p-4 rounded-2xl ${GRADE_COLORS[profile.grade]}`}>
                      <AwardIcon className="size-8" />
                      <div>
                        <div className="font-black text-3xl font-urbanist">{profile.grade.replace("_PLUS", "+")}</div>
                        <div className="text-xs font-semibold opacity-80">Academic Quality</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl text-center border border-dashed border-gray-200">
                      No grade assigned yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {profile?.assignedByTeacher && (
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3">
                <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                  {profile.assignedByTeacher.name[0]}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Evaluated By</p>
                  <p className="font-bold text-gray-900">{profile.assignedByTeacher.name}</p>
                </div>
              </div>
            )}

            {/* Background design */}
            <div className="absolute -bottom-8 -right-8 size-40 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
          </div>
        </AnimatedContent>

        {/* Performance Trend Chart */}
        <AnimatedContent delay={0.6} className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 h-full shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3Icon className="size-5 text-orange-600" />
                Accuracy Trend
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                <span className="size-2 bg-orange-500 rounded-full"></span>
                Last {testResults.length} Tests
              </div>
            </div>

            {testResults.length > 0 ? (
              <div className="h-64 flex items-end gap-3 px-4">
                {testResults.slice(0, 10).reverse().map((res, i) => {
                  const percentage = res.total > 0 ? (res.score / res.total) * 100 : 0;
                  const height = `${Math.max(percentage, 5)}%`; // Minimum 5% height for visibility
                  return (
                    <div key={res.id} className="flex-1 flex flex-col items-center group gap-2 h-full">
                      <div className="relative w-full flex-1 flex items-end pb-1">
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                           {Math.round(percentage)}%
                         </div>
                         <div 
                          className="w-full bg-orange-200 rounded-t-lg group-hover:bg-orange-500 transition-all cursor-pointer relative min-h-[4px]"
                          style={{ height }}
                         >
                           {/* Decorative bar effect */}
                           <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         </div>
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold truncate w-full text-center mt-auto">
                        T-{testResults.length - i}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-100 rounded-2xl">
                Take more tests to see your performance trend
              </div>
            )}
            
            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 bg-blue-50/50 rounded-2xl">
                  <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Highest Accuracy</p>
                  <p className="text-xl font-black text-blue-900">
                    {testResults.length > 0 ? Math.max(...testResults.map(r => Math.round(r.score/r.total * 100))) : 0}%
                  </p>
               </div>
               <div className="p-4 bg-orange-50/50 rounded-2xl">
                  <p className="text-[10px] text-orange-600 font-bold uppercase mb-1">Average Time</p>
                  <p className="text-xl font-black text-orange-900">
                    {testResults.length > 0 ? Math.round(testResults.reduce((acc, r) => acc + (r.timeTaken || 0), 0) / testResults.length / 60) : 0}m
                  </p>
               </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}

