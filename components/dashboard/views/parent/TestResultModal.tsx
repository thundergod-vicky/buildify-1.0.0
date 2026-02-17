"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Clock, AlertTriangle, CheckCircle2, XCircle, Calendar, LogIn, X } from "lucide-react";
import { PracticeTestResult } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: PracticeTestResult | null;
}

export function TestResultModal({ isOpen, onClose, result }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !result || !result.test) return null;

  const { test, score, total, timeTaken, status, createdAt, answers } = result;
  
  const completionDate = new Date(createdAt);
  const joinTime = new Date(completionDate.getTime() - (timeTaken! * 1000));
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  const percentage = Math.round((score / total) * 100);

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-orange-600 to-orange-700 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/10"
          >
            <X className="size-5" />
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-black font-urbanist mb-3 tracking-tight">{test.title}</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-sm font-semibold">
                  <Calendar className="size-4" />
                  {completionDate.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-sm font-semibold">
                  <Clock className="size-4" />
                  {formatTime(timeTaken || 0)}
                </span>
                {status === 'CHEATED' && (
                  <span className="flex items-center gap-2 bg-red-500/90 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-pulse border border-red-400">
                    <AlertTriangle className="size-3" />
                    CHEAT DETECTED
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-black leading-none mb-1 tracking-tighter">{percentage}%</div>
              <div className="text-orange-200 text-xs font-black uppercase tracking-[0.2em]">{percentage >= 40 ? 'PASSED' : 'NEEDS REVIEW'}</div>
            </div>
          </div>
        </div>

        {/* Content Body - Ensuring scrollability with defined container */}
        <div className="flex-1 min-h-0 overflow-hidden bg-gray-50/50">
          <div className="h-full overflow-y-auto custom-scrollbar p-8" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Timeline Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                  <LogIn className="size-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Joined Test</p>
                  <p className="text-xl font-bold text-gray-900">{joinTime.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Submitted At</p>
                  <p className="text-xl font-bold text-gray-900">{completionDate.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>

            {/* Question Breakdown */}
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight italic uppercase">
                Question <span className="text-orange-600">Breakdown</span>
              </h3>
              <span className="px-4 py-1.5 bg-gray-200/50 text-gray-500 rounded-full text-xs font-black uppercase tracking-widest">
                {total} Total
              </span>
            </div>

            <div className="space-y-6">
              {test.questions.map((q, idx: number) => {
                const studentAnswerIdx = answers ? (answers as Record<number, number>)[idx] : undefined;
                const isCorrect = studentAnswerIdx === q.correctAnswer;
                const studentAnswerText = studentAnswerIdx !== undefined ? q.options[studentAnswerIdx] : "Not Answered";
                const correctAnswerText = q.options[q.correctAnswer];

                return (
                  <div key={idx} className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-300 hover:shadow-xl ${isCorrect ? 'bg-white border-green-100 hover:border-green-200' : 'bg-white border-red-100 hover:border-red-200'}`}>
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-transform group-hover:rotate-12 ${isCorrect ? 'bg-green-600 text-white rotate-3 shadow-green-200' : 'bg-red-600 text-white -rotate-3 shadow-red-200'}`}>
                        {idx + 1}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 leading-snug pt-1">{q.question}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2 md:ml-16">
                      <div className={`p-5 rounded-3xl border-2 transition-colors ${isCorrect ? 'bg-green-50/20 border-green-100' : 'bg-red-50/20 border-red-100'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>Student Choice</p>
                          {isCorrect ? <CheckCircle2 className="size-4 text-green-600" /> : <XCircle className="size-4 text-red-600" />}
                        </div>
                        <p className={`text-lg font-bold ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>{studentAnswerText}</p>
                      </div>
                      {!isCorrect && (
                        <div className="p-5 rounded-3xl bg-green-50/50 border-2 border-green-100">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-2">Correct Answer</p>
                          <p className="text-lg font-bold text-green-900">{correctAnswerText}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
