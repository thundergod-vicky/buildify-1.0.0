"use client";

import { useState } from "react";
import { PracticeTest, PracticeTestResult } from "@/types";
import { ArrowLeftIcon, CheckCircle2Icon, XCircleIcon, InfoIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Props {
  test: PracticeTest;
  result: PracticeTestResult;
  onBack: () => void;
}

export function PracticeTestReview({ test, result, onBack }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const studentAnswers = result.answers || {};
  const currentQuestion = test.questions[currentQuestionIndex];
  
  const isCorrect = studentAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;
  const studentAnswerIdx = studentAnswers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeftIcon className="size-5 text-gray-500" />
           </button>
           <div>
              <h2 className="text-xl font-bold text-gray-900 font-urbanist">Review: {test.title}</h2>
              <div className="flex items-center gap-4 text-sm mt-0.5">
                 <span className="text-gray-500">Score: <span className="text-orange-600 font-bold">{result.score}/{result.total}</span></span>
                 <span className="size-1 bg-gray-300 rounded-full" />
                 <span className="text-gray-500">Rating: <span className="text-yellow-600 font-bold">{result.rating}/5</span></span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-600">
             Question {currentQuestionIndex + 1} of {test.totalQuestions}
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-8 space-y-8">
         <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <span className={`size-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 mt-1 ${
                    isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                     {isCorrect ? <CheckCircle2Icon className="size-5" /> : <XCircleIcon className="size-5" />}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                     {currentQuestion.question}
                  </h3>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrectOption = idx === currentQuestion.correctAnswer;
                    const isStudentSelection = idx === studentAnswerIdx;
                    
                    let bgClass = "border-gray-100 bg-white";
                    let textClass = "text-gray-700";
                    let iconClass = "border-gray-300";

                    if (isCorrectOption) {
                      bgClass = "border-green-500 bg-green-50/50";
                      textClass = "text-green-900";
                      iconClass = "border-green-500 bg-green-500 text-white";
                    } else if (isStudentSelection && !isCorrectOption) {
                      bgClass = "border-red-500 bg-red-50/50";
                      textClass = "text-red-900";
                      iconClass = "border-red-500 bg-red-500 text-white";
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${bgClass}`}
                      >
                        <span className={`size-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold text-xs ${iconClass}`}>
                          {isCorrectOption ? <CheckCircle2Icon className="size-4" /> : 
                           isStudentSelection ? <XCircleIcon className="size-4" /> : 
                           String.fromCharCode(65 + idx)}
                        </span>
                        <span className={`text-lg font-medium ${textClass}`}>
                           {option}
                        </span>
                      </div>
                    );
                  })}
               </div>

               {currentQuestion.explanation && (
                 <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 font-bold">
                       <InfoIcon className="size-5" />
                       Explanation
                    </div>
                    <p className="text-blue-800 leading-relaxed">
                       {currentQuestion.explanation}
                    </p>
                 </div>
               )}
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
               <button
                 disabled={currentQuestionIndex === 0}
                 onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                 className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 disabled:opacity-0 transition-all font-urbanist"
               >
                 <ChevronLeftIcon className="size-5" />
                 Previous
               </button>

               <button
                 disabled={currentQuestionIndex === test.totalQuestions - 1}
                 onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                 className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-0 font-urbanist"
               >
                 Next Question
                 <ChevronRightIcon className="size-5" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
