"use client";

import { useState, useEffect } from "react";
import { FileTextIcon, PlayIcon, ClockIcon, TrophyIcon, StarIcon, EyeIcon } from "lucide-react";
import { PracticeTest, PracticeTestResult } from "@/types";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { PracticeTestInterface } from "./PracticeTestInterface";
import { PracticeTestReview } from "./PracticeTestReview";

export function StudentTests() {
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [results, setResults] = useState<Record<string, PracticeTestResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<PracticeTest | null>(null);
  const [reviewTest, setReviewTest] = useState<{ test: PracticeTest, result: PracticeTestResult } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "available">("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;

      const [testsData, resultsData]: [PracticeTest[], PracticeTestResult[]] = await Promise.all([
        api.get<PracticeTest[]>('/practice-tests', token),
        api.get<PracticeTestResult[]>('/practice-tests/results/student', token)
      ]);

      setTests(testsData);
      const resultsMap: Record<string, PracticeTestResult> = {};
      resultsData.forEach((r: PracticeTestResult) => {
        resultsMap[r.testId] = r;
      });
      setResults(resultsMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
    const result = results[test.id];
    const isCompleted = !!result;
    
    if (filterStatus === "completed") return matchesSearch && isCompleted;
    if (filterStatus === "available") return matchesSearch && !isCompleted;
    return matchesSearch;
  });

  if (activeTest) {
    return <PracticeTestInterface test={activeTest} onBack={() => { setActiveTest(null); fetchData(); }} />;
  }

  if (reviewTest) {
    return <PracticeTestReview test={reviewTest.test} result={reviewTest.result} onBack={() => setReviewTest(null)} />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">Practice Tests</h1>
        <p className="text-gray-500 mt-1">Take mock exams and track your progress</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-fit">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "all" ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All Tests
          </button>
          <button
            onClick={() => setFilterStatus("available")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "available" ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Available
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "completed" ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Completed
          </button>
        </div>

        <div className="relative w-full md:w-80 group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse h-64" />
          ))}
        </div>
      ) : filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const result = results[test.id];
            return (
              <div
                key={test.id}
                className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all flex flex-col"
              >
                <div className="size-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileTextIcon className="size-6 text-orange-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 font-urbanist group-hover:text-orange-600 transition-colors line-clamp-1">
                  {test.title}
                </h3>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                       <span className="font-semibold text-gray-900">{test.totalQuestions}</span> Questions
                    </span>
                    <span className="size-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1">
                       <ClockIcon className="size-3.5" />
                       {test.timeLimit ? `${test.timeLimit}m` : 'No limit'}
                    </span>
                  </div>
                  
                  {result && (
                    <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 flex items-center gap-1.5">
                             <TrophyIcon className="size-3.5 text-orange-500" />
                             Score: <span className="font-bold text-gray-900">{result.score}/{result.total}</span>
                          </span>
                          <span className="text-gray-500 flex items-center gap-1.5">
                             <StarIcon className="size-3.5 text-yellow-500 fill-yellow-500" />
                             <span className="font-bold text-gray-900">{result.rating}</span>
                          </span>
                       </div>
                       {result.status === 'CHEATED' && (
                         <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider">CHEATED</div>
                       )}
                    </div>
                  )}
                </div>

                {result ? (
                  <button 
                    onClick={() => setReviewTest({ test, result })}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                  >
                    <EyeIcon className="size-4" />
                    Review Result
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveTest(test)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all shadow-lg shadow-orange-100"
                  >
                    <PlayIcon className="size-4" />
                    Start Test
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileTextIcon className="size-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-urbanist">No tests available</h3>
          <p className="text-gray-500 mt-2">Check back later for new practice materials</p>
        </div>
      )}
    </div>
  );
}
