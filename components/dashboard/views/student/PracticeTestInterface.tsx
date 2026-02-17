"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PracticeTest } from "@/types";
import { ArrowLeftIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, SendIcon, AlertTriangleIcon } from "lucide-react";
import { showToast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

interface Props {
  test: PracticeTest;
  onBack: () => void;
}

export function PracticeTestInterface({ test, onBack }: Props) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(test.timeLimit ? test.timeLimit * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabChanges, setTabChanges] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'QUIT' | 'SUBMIT' | null;
  }>({ isOpen: false, type: null });
  const hasSubmittedRef = useRef(false);

  const submitTest = useCallback(async (status: 'COMPLETED' | 'CHEATED' = 'COMPLETED') => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setIsSubmitting(true);

    let score = 0;
    test.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    try {
      const token = auth.getToken();
      if (!token) return;

      await api.post(`/practice-tests/results`, {
        testId: test.id,
        score,
        total: test.totalQuestions,
        timeTaken: test.timeLimit ? (test.timeLimit * 60) - timeLeft : 0,
        status,
        answers: selectedAnswers
      }, token);

      showToast.success("Test submitted successfully!");
      onBack();
    } catch (error) {
      console.error("Submission error:", error);
      showToast.error("Error connecting to server");
    } finally {
      setIsSubmitting(false);
      // We don't reset hasSubmittedRef.current here as the test is done
    }
  }, [test, selectedAnswers, timeLeft, onBack]);

  const handleCheatDetected = useCallback(async () => {
    showToast.error("EXAM CANCELLED: Multiple tab changes detected. Marking as CHEATED.");
    await submitTest("CHEATED");
  }, [submitTest]);

  const handleAutoSubmit = useCallback(async () => {
    showToast.info("Time is up! Submitting your test automatically.");
    await submitTest("COMPLETED");
  }, [submitTest]);

  // Full screen request
  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullScreen(true);
        }
      } catch (error) {
        console.error("Fullscreen request failed", error);
      }
    };
    enterFullScreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (test.timeLimit && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [test.timeLimit, handleAutoSubmit, timeLeft]); // Added timeLeft to dependencies to ensure interval re-runs if timeLeft changes externally

  // Tab change Detection (Cheat Prevention)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabChanges(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
             handleCheatDetected();
          } else {
             showToast.warning("Warning: Tab change detected! Your exam will be cancelled if you do it again.");
          }
          return newCount;
        });
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleCheatDetected]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
           <button onClick={() => setConfirmModal({ isOpen: true, type: 'QUIT' })} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeftIcon className="size-5 text-gray-500" />
           </button>
           <h2 className="text-xl font-bold text-gray-900 font-urbanist">{test.title}</h2>
        </div>

        <div className="flex items-center gap-6">
           {test.timeLimit && (
             <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${timeLeft < 60 ? 'border-red-100 bg-red-50 text-red-600 animate-pulse' : 'border-orange-100 bg-orange-50 text-orange-600'}`}>
                <ClockIcon className="size-5" />
                <span className="text-lg font-bold tabular-nums">{formatTime(timeLeft)}</span>
             </div>
           )}
           <div className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-600 flex items-center gap-2">
             {tabChanges > 0 && <span className="text-red-500 flex items-center gap-1"><AlertTriangleIcon className="size-3" /> Tab Switches: {tabChanges}</span>}
             {isFullScreen && <span className="text-green-600">FullScreen</span>}
             Question {currentQuestionIndex + 1} of {test.totalQuestions}
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-8 space-y-8">
         {/* Question Card */}
         <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8 min-h-[400px] flex flex-col justify-between">
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <span className="size-8 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0 mt-1">
                     {currentQuestionIndex + 1}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                     {currentQuestion.question}
                  </h3>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: idx }))}
                      className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                        selectedAnswers[currentQuestionIndex] === idx
                          ? 'border-orange-500 bg-orange-50/50'
                          : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/20'
                      }`}
                    >
                      <span className={`size-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedAnswers[currentQuestionIndex] === idx
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-300 group-hover:border-orange-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-lg font-medium ${
                        selectedAnswers[currentQuestionIndex] === idx ? 'text-orange-900' : 'text-gray-700'
                      }`}>
                         {option}
                      </span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Navigation buttons inside question card */}
            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
               <button
                 disabled={currentQuestionIndex === 0}
                 onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                 className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 disabled:opacity-0 transition-all"
               >
                 <ChevronLeftIcon className="size-5" />
                 Previous
               </button>

               {currentQuestionIndex === test.totalQuestions - 1 ? (
                 <button
                   onClick={() => setConfirmModal({ isOpen: true, type: 'SUBMIT' })}
                   disabled={isSubmitting}
                   className="flex items-center gap-2 px-8 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                 >
                   <SendIcon className="size-5" />
                   Submit Test
                 </button>
               ) : (
                 <button
                   onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                   className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                 >
                   Next Question
                   <ChevronRightIcon className="size-5" />
                 </button>
               )}
            </div>
         </div>

         {/* Warning about cheat detection */}
         <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-center gap-3 text-yellow-700 text-sm">
            <AlertTriangleIcon className="size-5 flex-shrink-0" />
            <p><strong>Anti-Cheat Active:</strong> Please do not switch tabs or minimize the browser. Multiple violations will result in automatic exam cancellation.</p>
          </div>
       </div>

       <ConfirmationModal
         isOpen={confirmModal.isOpen}
         onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
         onConfirm={() => {
           setConfirmModal({ ...confirmModal, isOpen: false });
           if (confirmModal.type === 'QUIT') onBack();
           if (confirmModal.type === 'SUBMIT') submitTest("COMPLETED");
         }}
         title={confirmModal.type === 'QUIT' ? "Quit Test?" : "Submit Test?"}
         message={confirmModal.type === 'QUIT'
           ? "Are you sure you want to quit? Your progress will be lost."
           : "Are you sure you want to submit your test answers now?"}
         confirmText={confirmModal.type === 'QUIT' ? "Quit" : "Submit"}
         variant={confirmModal.type === 'QUIT' ? "danger" : "info"}
       />
     </div>
  );
}
