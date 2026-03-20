"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeftIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, SendIcon, AlertTriangleIcon } from "lucide-react";
import { showToast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

interface Props {
  examId: string;
  onBack: () => void;
}

export function ExamInterface({ examId, onBack }: Props) {
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [tabChanges, setTabChanges] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'QUIT' | 'SUBMIT' | null;
  }>({ isOpen: false, type: null });
  const hasSubmittedRef = useRef(false);

  const fetchExam = async () => {
    try {
      const token = auth.getToken();
      const response = await api.get<any>(`/exams/${examId}`, token || undefined);
      
      if (!response || !response.questions) {
        showToast.error("Exam questions not yet available. Please wait for the access window.");
        onBack();
        return;
      }

      const normalizedQuestions = response.questions.map((q: any) => {
        let options = q.options;
        if (options && !Array.isArray(options)) {
          // Convert {A: "...", B: "..."} to ["...", "..."]
          options = [options.A, options.B, options.C, options.D].filter((o: any) => o !== undefined);
        }

        let correctAnswer = q.correctAnswer;
        if (q.answer && typeof q.answer === 'string') {
          // Convert 'A' -> 0, 'B' -> 1, etc.
          correctAnswer = q.answer.charCodeAt(0) - 65;
        }

        return { ...q, options, correctAnswer };
      });

      setExam({ ...response, questions: normalizedQuestions });
      setTimeLeft(response.duration * 60);
    } catch (error) {
      showToast.error("Failed to load exam");
      onBack();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const submitTest = useCallback(async (status: 'COMPLETED' | 'CHEATED' = 'COMPLETED') => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setIsSubmitting(true);

    let score = 0;
    exam?.questions?.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    try {
      const token = auth.getToken();
      await api.post(`/exams/${examId}/submit`, {
        score,
        total: exam?.totalQuestions || exam?.questions?.length || 0,
        answers: selectedAnswers,
        status: status
      }, token || undefined);

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      showToast.success("Exam submitted successfully!");
      onBack();
    } catch (error) {
      console.error("Submission error:", error);
      showToast.error("Error connecting to server");
      hasSubmittedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  }, [exam, examId, selectedAnswers, onBack]);

  const handleCheatDetected = useCallback(async () => {
    showToast.error("EXAM CANCELLED: Multiple security violations detected. Marking as CHEATED.");
    await submitTest("CHEATED");
  }, [submitTest]);

  const handleAutoSubmit = useCallback(async () => {
    showToast.info("Time is up! Submitting your exam automatically.");
    await submitTest("COMPLETED");
  }, [submitTest]);

  const enterFullScreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullScreen(true);
        setTestStarted(true);
      }
    } catch (error) {
      console.error("Fullscreen request failed", error);
      showToast.error("Security violation: Fullscreen is required to start.");
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (testStarted) {
            e.preventDefault();
            if (e.key === 'Escape') {
                showToast.warning("Security Alert: Escape key disabled during session.");
            }
        }
    };
    const handleContextMenu = (e: MouseEvent) => {
        if (testStarted) e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
        if (testStarted) {
            // Disable PrintScreen, F12, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+U, Ctrl/Cmd+S
            const forbiddenKeys = ['F12', 'PrintScreen'];
            const isCopyPaste = (e.ctrlKey || e.metaKey) && ['c', 'v', 'u', 's'].includes(e.key.toLowerCase());
            if (forbiddenKeys.includes(e.key) || isCopyPaste) {
                e.preventDefault();
                showToast.error("Security alert: Unauthorized shortcut detected.");
            }
        }
    };
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement && testStarted && !hasSubmittedRef.current) {
            setIsFullScreen(false);
            setTabChanges(prev => {
                const newCount = prev + 1;
                if (newCount >= 2) handleCheatDetected();
                else showToast.warning("Security Warning: Fullscreen exit detected! Return to fullscreen immediately.");
                return newCount;
            });
        }
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
        window.removeEventListener("keydown", handleEsc);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [testStarted, handleCheatDetected]);

  useEffect(() => {
    if (exam && timeLeft > 0 && testStarted) {
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [exam, handleAutoSubmit, timeLeft, testStarted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && testStarted && !hasSubmittedRef.current) {
        setTabChanges(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) handleCheatDetected();
          else showToast.warning("Warning: Tab change detected! Your exam will be cancelled if you do it again.");
          return newCount;
        });
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleCheatDetected, testStarted]);

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.3em] bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center">Calibrating Neural Sync...</div>;
  if (!exam) return null;

  if (!testStarted) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8 font-urbanist">
            <div className="max-w-2xl w-full bg-slate-900 rounded-[3rem] border border-white/5 p-16 shadow-2xl space-y-10 text-center">
                <div className="size-24 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-indigo-500/20">
                    <AlertTriangleIcon className="size-10 text-indigo-500" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight">{exam.title}</h1>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        This assessment uses high-security proctoring. By starting the test, you agree to the following protocols:
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 text-left">
                    {[
                        "Fullscreen mode will be forced throughout the session.",
                        "Right-click and copy/paste shortcuts are disabled.",
                        "Switching tabs or minimizing the window will trigger a security violation.",
                        "Multiple violations will result in automatic disqualification."
                    ].map((step, idx) => (
                        <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="size-6 bg-indigo-600 text-white rounded flex items-center justify-center font-black text-[10px] shrink-0">{idx + 1}</div>
                            <p className="text-xs font-bold text-slate-300">{step}</p>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={enterFullScreen}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-500/20 active:scale-95"
                >
                    Initialize High-Security Protocol
                </button>
            </div>
        </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-urbanist">
      <div className="bg-slate-900 border-b border-white/5 px-10 py-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
           <button onClick={() => setConfirmModal({ isOpen: true, type: 'QUIT' })} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
              <ArrowLeftIcon className="size-5" />
           </button>
           <div>
              <h2 className="text-xl font-black tracking-tight">{exam.title}</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{exam.batch?.name || 'Academic Assessment'}</p>
           </div>
        </div>

        <div className="flex items-center gap-8">
           <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all ${timeLeft < 300 ? 'border-rose-500/30 bg-rose-500/10 text-rose-500 animate-pulse' : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'}`}>
              <ClockIcon className="size-5" />
              <span className="text-xl font-black font-mono">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
           </div>
           <div className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-4">
              <span>Item {currentQuestionIndex + 1} / {exam.totalQuestions || exam.questions.length}</span>
              {tabChanges > 0 && <span className="text-rose-500">Security Violations: {tabChanges}</span>}
           </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-12 space-y-12">
         <div className="bg-slate-900 rounded-[3rem] border border-white/5 p-16 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            <div className="space-y-10">
               <div className="flex items-start gap-8">
                  <span className="size-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 mt-1 shadow-lg shadow-indigo-500/20">
                     {currentQuestionIndex + 1}
                  </span>
                  <p className="text-2xl font-bold leading-relaxed text-slate-100 italic">
                     {currentQuestion.question}
                  </p>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: idx }))}
                      className={`group flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left ${
                        selectedAnswers[currentQuestionIndex] === idx
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-white/5 hover:border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <span className={`size-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all font-black text-xs ${
                        selectedAnswers[currentQuestionIndex] === idx
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-slate-700 text-slate-500 group-hover:border-slate-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-lg font-bold ${
                        selectedAnswers[currentQuestionIndex] === idx ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                         {option}
                      </span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex items-center justify-between">
               <button
                 disabled={currentQuestionIndex === 0}
                 onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                 className="flex items-center gap-3 px-8 py-4 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white/5 disabled:opacity-0 transition-all"
               >
                 <ChevronLeftIcon className="size-4" /> Previous
               </button>

               {currentQuestionIndex === (exam.totalQuestions || exam.questions.length) - 1 ? (
                 <button
                   onClick={() => setConfirmModal({ isOpen: true, type: 'SUBMIT' })}
                   disabled={isSubmitting}
                   className="flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/20"
                 >
                   <SendIcon className="size-4" /> Final Submission
                 </button>
               ) : (
                 <button
                   onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                   className="flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20"
                 >
                   Next Item <ChevronRightIcon className="size-4" />
                 </button>
               )}
            </div>
         </div>

         <div className="p-8 bg-amber-500/5 rounded-[2rem] border border-amber-500/10 flex items-center gap-6 text-amber-500/80 text-xs">
            <AlertTriangleIcon className="size-6 flex-shrink-0" />
            <div>
                <p className="font-black uppercase tracking-widest mb-1">Active Proctoring Protocol</p>
                <p className="font-medium opacity-60">Session recording is active. Switching tabs or window minimization will void your attempt.</p>
            </div>
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
        title={confirmModal.type === 'QUIT' ? "ABANDON SYNC?" : "INITIALIZE UPLOAD?"}
        message={confirmModal.type === 'QUIT'
          ? "Exiting now will terminate your session and results will not be archived."
          : "Are you ready to commit your neural responses to the central archive?"}
        confirmText={confirmModal.type === 'QUIT' ? "Terminate" : "Commit"}
        variant={confirmModal.type === 'QUIT' ? "danger" : "info"}
      />
    </div>
  );
}
