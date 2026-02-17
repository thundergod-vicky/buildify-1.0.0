"use client";

import { useState, useRef } from "react";
import { ArrowLeftIcon, UploadIcon, PlusIcon, Trash2Icon, FileJsonIcon, FileSpreadsheetIcon, SaveIcon, CheckCircle2Icon } from "lucide-react";
import { PracticeQuestion, PracticeTest } from "@/types";
import { showToast } from "@/lib/toast";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

interface Props {
  onBack: () => void;
  initialData?: PracticeTest;
}

export function TeacherPracticeTestCreate({ onBack, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit || 0);
  const [questions, setQuestions] = useState<Partial<PracticeQuestion>[]>(initialData?.questions || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>(initialData ? 'manual' : 'manual');

  const addQuestion = () => {
    setQuestions([...questions, {
      id: questions.length + 1,
      category: "",
      difficulty: "Medium",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index: number, field: keyof Partial<PracticeQuestion>, value: string | number | string[]) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    const newOptions = [...(newQuestions[qIndex].options || ["", "", "", ""])];
    newOptions[oIndex] = value;
    newQuestions[qIndex].options = newOptions;
    setQuestions(newQuestions);
  };

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.testTitle) setTitle(json.testTitle);
        if (json.questions) {
            setQuestions(json.questions);
            showToast.success(`Successfully loaded ${json.questions.length} questions`);
        }
      } catch (_error) {
        showToast.error("Invalid JSON file format");
      }
    };
    reader.readAsText(file);
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        const parsedQuestions = rows.slice(1).map((row, index) => {
          const cells = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          // Simple mapping based on expected order or headers
          // id, category, difficulty, question, option1, option2, option3, option4, correctAnswer, explanation
          return {
            id: index + 1,
            category: cells[headers.indexOf('category')] || cells[1],
            difficulty: cells[headers.indexOf('difficulty')] || cells[2],
            question: cells[headers.indexOf('question')] || cells[3],
            options: [
                cells[headers.indexOf('option1')] || cells[4],
                cells[headers.indexOf('option2')] || cells[5],
                cells[headers.indexOf('option3')] || cells[6],
                cells[headers.indexOf('option4')] || cells[7]
            ],
            correctAnswer: parseInt(cells[headers.indexOf('correctanswer')] || cells[8]),
            explanation: cells[headers.indexOf('explanation')] || cells[9]
          };
        });
        setQuestions(parsedQuestions);
        showToast.success(`Successfully loaded ${parsedQuestions.length} questions from CSV`);
      } catch (_error) {
        showToast.error("Error parsing CSV file");
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (!title) return showToast.error("Please enter a test title");
    if (questions.length === 0) return showToast.error("Please add at least one question");

    setIsUploading(true);
    try {
      const token = auth.getToken();
      if (!token) return;

      const payload = {
        title,
        totalQuestions: questions.length,
        questions,
        timeLimit: timeLimit > 0 ? timeLimit : null
      };

      if (initialData) {
        await api.patch(`/practice-tests/${initialData.id}`, payload, token);
        showToast.success("Practice test updated successfully!");
      } else {
        await api.post(`/practice-tests`, payload, token);
        showToast.success("Practice test created successfully!");
      }
      onBack();
    } catch (_error) {
      console.error("Save failed:", _error);
      showToast.error("Error connecting to server");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="size-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-urbanist">
              {initialData ? "Edit Practice Test" : "Create Practice Test"}
            </h1>
            <p className="text-gray-500">
              {initialData ? "Update test details and questions" : "Manual entry or file upload"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isUploading}
          className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 font-semibold disabled:opacity-50"
        >
          {isUploading ? "Saving..." : <><SaveIcon className="size-5" /> {initialData ? "Update Test" : "Save Test"}</>}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Title and Duration Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Test Title</label>
              <input
                type="text"
                placeholder="e.g. Aptitude Practice Test"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Duration (Minutes)</label>
              <input
                type="number"
                placeholder="0 for no limit"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-lg font-semibold"
              />
            </div>
          </div>

          {/* Creation Mode Tabs */}
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'manual' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <PlusIcon className="size-4" />
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'upload' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <UploadIcon className="size-4" />
              Upload Files
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer p-8 border-2 border-dashed border-gray-100 rounded-2xl hover:border-orange-600 hover:bg-orange-50/50 transition-all text-center space-y-4"
              >
                <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-100 transition-colors">
                  <FileJsonIcon className="size-8 text-gray-400 group-hover:text-orange-600" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">JSON Upload</h4>
                    <p className="text-sm text-gray-500 mt-1">Select your formatted JSON file</p>
                </div>
                <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleJsonUpload} />
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer p-8 border-2 border-dashed border-gray-100 rounded-2xl hover:border-blue-600 hover:bg-blue-50/50 transition-all text-center space-y-4"
              >
                <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-100 transition-colors">
                  <FileSpreadsheetIcon className="size-8 text-gray-400 group-hover:text-blue-600" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">CSV Upload</h4>
                    <p className="text-sm text-gray-500 mt-1">Select your CSV question bank</p>
                </div>
                <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
              </div>
            </div>
          ) : (
            <div className="space-y-8 py-4">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-6 bg-gray-50 rounded-2xl space-y-4 relative border border-gray-100">
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2Icon className="size-5" />
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="size-8 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {qIndex + 1}
                    </span>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <select 
                            value={q.difficulty}
                            onChange={(e) => updateQuestion(qIndex, 'difficulty', e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Category (e.g. Maths)"
                            value={q.category}
                            onChange={(e) => updateQuestion(qIndex, 'category', e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                        />
                    </div>
                  </div>

                  <textarea
                    placeholder="Enter your question here..."
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all h-24"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options?.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                          className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${q.correctAnswer === oIndex ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                          {q.correctAnswer === oIndex && <CheckCircle2Icon className="size-4" />}
                        </button>
                        <input
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <textarea
                    placeholder="Explanation (Optional)"
                    value={q.explanation}
                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all h-20 text-sm"
                  />
                </div>
              ))}

              <button
                onClick={addQuestion}
                className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50/50 transition-all font-semibold"
              >
                <PlusIcon className="size-5" />
                Add Question Manually
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
