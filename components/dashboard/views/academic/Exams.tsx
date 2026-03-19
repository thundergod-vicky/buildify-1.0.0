"use client";

import { useState, useEffect, useRef } from "react";
import { 
  CalendarIcon, 
  ShieldCheckIcon, 
  AlertTriangleIcon, 
  SearchIcon, 
  PlusIcon, 
  Trash2Icon, 
  EditIcon, 
  ClockIcon, 
  UsersIcon,
  SaveIcon,
  XIcon,
  CheckCircle2Icon,
  ArrowLeftIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  ChevronRightIcon
} from "lucide-react";
import { showToast } from "@/lib/toast";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { motion, AnimatePresence } from "framer-motion";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  status: 'DRAFT' | 'PLANNED' | 'SCHEDULED';
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  questions: any[] | null;
  totalQuestions: number;
  batchId: string | null;
  batch?: { id: string, name: string };
  assignedStudents: any[];
  createdAt: string;
}

interface Batch {
  id: string;
  name: string;
  students: any[];
}

export function ExamSchedules() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State for Creation
  const [newExam, setNewExam] = useState({
    title: "",
    batchId: "",
    status: "PLANNED" as const
  });

  // Local state for editing questions/schedule
  const [editFormData, setEditFormData] = useState<{
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: 'DRAFT' | 'PLANNED' | 'SCHEDULED';
    questions: any[];
    assignedStudentIds: string[];
  } | null>(null);

  useEffect(() => {
    fetchExams();
    fetchBatches();
  }, []);

  const fetchExams = async () => {
    try {
      const token = auth.getToken();
      const data = await api.get<Exam[]>('/exams', token);
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const token = auth.getToken();
      const data = await api.get<Batch[]>('/batches', token);
      setBatches(data);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  }

  const handleCreateExam = async () => {
    if (!newExam.title) return showToast.error("Title is required");
    setIsSaving(true);
    try {
      const token = auth.getToken();
      await api.post('/exams', newExam, token);
      showToast.success("Exam entry created");
      setIsCreateModalOpen(false);
      setNewExam({ title: "", batchId: "", status: "PLANNED" });
      fetchExams();
    } catch (error) {
      showToast.error("Failed to create exam");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEditing = (exam: Exam) => {
    console.log("Edit button clicked for exam:", exam.id);
    try {
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 16);
      };

      setEditingExam(exam);
      setEditFormData({
        title: exam.title,
        description: exam.description || "",
        startTime: formatDate(exam.startTime),
        endTime: formatDate(exam.endTime),
        duration: exam.duration || 60,
        status: exam.status,
        questions: exam.questions || [],
        assignedStudentIds: exam.assignedStudents?.map((s) => s.id) || []
      });
    } catch (error) {
       console.error("Error starting exam edit:", error);
       showToast.error("Failed to open editor. Some data might be corrupt.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingExam || !editFormData) return;
    setIsSaving(true);
    try {
      const token = auth.getToken();
      const payload = {
        ...editFormData,
        startTime: editFormData.startTime ? new Date(editFormData.startTime).toISOString() : null,
        endTime: editFormData.endTime ? new Date(editFormData.endTime).toISOString() : null,
        totalQuestions: editFormData.questions.length
      };
      await api.patch(`/exams/${editingExam.id}`, payload, token);
      showToast.success("Exam updated successfully");
      setEditingExam(null);
      setEditFormData(null);
      fetchExams();
    } catch (error) {
      showToast.error("Failed to update exam");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      const token = auth.getToken();
      await api.delete(`/exams/${id}`, token);
      showToast.success("Exam deleted");
      fetchExams();
    } catch (error) {
      showToast.error("Failed to delete exam");
    }
  };

  const filteredExams = exams.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.batch?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'emerald';
      case 'DRAFT': return 'sky';
      case 'PLANNED': return 'orange';
      default: return 'gray';
    }
  };

  if (editingExam && editFormData) {
    return (
      <ExamEditor 
        formData={editFormData} 
        setFormData={setEditFormData} 
        onBack={() => { setEditingExam(null); setEditFormData(null); }}
        onSave={handleSaveEdit}
        isSaving={isSaving}
        batches={batches}
        examId={editingExam.id}
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Exam Schedules</h1>
          <p className="text-gray-500 font-medium">Manage and monitor institutional examination timelines and proctoring</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gray-900 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all hover:-translate-y-1 flex items-center gap-2"
        >
          <PlusIcon className="size-4" />
          Create New Slot
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm max-w-md">
        <SearchIcon className="size-5 text-gray-400 ml-2" />
        <input 
          type="text"
          placeholder="Search exams or batches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-[3rem]" />)}
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold uppercase tracking-widest">No exams found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className={`size-14 bg-${getStatusColor(exam.status)}-50 text-${getStatusColor(exam.status)}-600 rounded-2xl flex items-center justify-center shadow-inner border border-${getStatusColor(exam.status)}-100/50`}>
                  <CalendarIcon className="size-6" />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 bg-${getStatusColor(exam.status)}-50 text-${getStatusColor(exam.status)}-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em]`}>
                        {exam.status}
                    </span>
                    {exam.status === 'SCHEDULED' && exam.startTime && (
                         <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {new Date(exam.startTime) < new Date() ? 'LIVE / COMPLETED' : 'UPCOMING'}
                         </span>
                    )}
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{exam.title}</h3>
              <p className="text-sm text-gray-400 mb-6 font-medium">
                Target: <span className="text-gray-900 font-black italic">{exam.batch?.name || 'All Assigned'}</span>
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                    <ClockIcon className="size-3" />
                    {exam.duration || 0} Min
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                    <FileJsonIcon className="size-3" />
                    {exam.totalQuestions} Items
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-8 border-t border-gray-50 relative z-20">
                <div className="flex gap-4">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleStartEditing(exam); }}
                        className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 z-30"
                        title="Edit Exam"
                    >
                        <EditIcon className="size-5" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteExam(exam.id); }}
                        className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-500/5 active:scale-95 z-30"
                        title="Delete Exam"
                    >
                        <Trash2Icon className="size-5" />
                    </button>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Starts At</p>
                    <p className="text-sm font-black text-gray-900 font-mono tracking-tighter transition-colors group-hover:text-blue-600">
                        {exam.startTime ? new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                    </p>
                    {exam.startTime && (
                         <p className="text-[8px] font-bold text-gray-400 uppercase">{new Date(exam.startTime).toLocaleDateString()}</p>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
            >
                <div className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Exam Slot</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Assessment Registry</p>
                        </div>
                        <button onClick={() => setIsCreateModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-500 transition-all">
                            <XIcon className="size-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Exam Title</label>
                            <input 
                                value={newExam.title}
                                onChange={e => setNewExam({...newExam, title: e.target.value})}
                                placeholder="Final Term 2026..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Initial Status</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setNewExam({...newExam, status: 'PLANNED'})}
                                    className={`py-4 rounded-3xl border-2 transition-all font-black text-xs uppercase tracking-widest ${newExam.status === 'PLANNED' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}
                                >
                                    Planned
                                </button>
                                <button 
                                    onClick={() => setNewExam({...newExam, status: 'DRAFT'})}
                                    className={`py-4 rounded-3xl border-2 transition-all font-black text-xs uppercase tracking-widest ${newExam.status === 'DRAFT' ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-slate-100 text-slate-400'}`}
                                >
                                    Draft
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Assigned Batch</label>
                            <select 
                                value={newExam.batchId}
                                onChange={e => setNewExam({...newExam, batchId: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm appearance-none cursor-pointer"
                            >
                                <option value="">Select Batch (Optional)</option>
                                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleCreateExam}
                        disabled={isSaving || !newExam.title}
                        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-black transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Registering...' : 'Confirm Registration'}
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExamEditor({ formData, setFormData, onBack, onSave, isSaving, batches }: any) {
  const [activeTab, setActiveTab] = useState<'details' | 'questions' | 'students'>('details');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, {
        id: formData.questions.length + 1,
        category: "",
        difficulty: "Medium",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: ""
      }]
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    const newOptions = [...(newQuestions[qIndex].options || ["", "", "", ""])];
    newOptions[oIndex] = value;
    newQuestions[qIndex].options = newOptions;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    setFormData({ ...formData, questions: formData.questions.filter((_:any, i:any) => i !== index) });
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let parsedQuestions = [];

        if (file.name.endsWith('.json')) {
          const raw = JSON.parse(content);
          parsedQuestions = raw.map((q: any) => {
            let options = q.options;
            if (options && !Array.isArray(options)) {
              options = [options.A, options.B, options.C, options.D].filter(o => o !== undefined);
            }
            let correctAnswer = q.correctAnswer;
            if (q.answer && typeof q.answer === 'string') {
               correctAnswer = q.answer.charCodeAt(0) - 65;
            }
            return {
              category: q.category || "General",
              difficulty: q.difficulty || "Medium",
              question: q.question,
              options: options || ["", "", "", ""],
              correctAnswer: typeof correctAnswer === 'number' ? correctAnswer : 0,
              explanation: q.explanation || ""
            };
          });
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          parsedQuestions = lines.slice(1).filter(l => l.trim()).map(line => {
             const values = line.split(',');
             return {
                category: values[0] || "General",
                difficulty: values[1] || "Medium",
                question: values[2],
                options: [values[3], values[4], values[5], values[6]],
                correctAnswer: parseInt(values[7]) || 0,
                explanation: values[8] || ""
             };
          });
        }
        
        setFormData({
            ...formData,
            questions: [...formData.questions, ...parsedQuestions]
        });
        showToast.success(`Successfully added ${parsedQuestions.length} items to bank`);
      } catch (error) {
        showToast.error("Failed to parse file. Ensure format is compatible.");
      }
    };
    reader.readAsText(file);
  };

  const selectedBatch = batches.find((b:any) => b.id === formData.batchId);
  const studentsInBatch = selectedBatch?.students || [];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            accept=".json,.csv" 
            className="hidden" 
        />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button onClick={onBack} className="p-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:bg-gray-50 transition-all">
                    <ArrowLeftIcon className="size-6 text-gray-400" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{formData.title}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Assessment Configuration</span>
                        <ChevronRightIcon className="size-3 text-gray-300" />
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest">{formData.status}</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onSave}
                disabled={isSaving}
                className="bg-emerald-500 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center gap-2"
            >
                <SaveIcon className="size-4" />
                {isSaving ? 'Processing...' : 'Push Changes'}
            </button>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-[2.5rem] w-fit mx-auto shadow-inner">
            {[
                { id: 'details', label: 'Schedule & Info' },
                { id: 'questions', label: `Item Bank (${formData.questions.length})` },
                { id: 'students', label: 'Access Control' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="bg-white rounded-[4rem] border border-gray-100 p-12 shadow-2xl shadow-gray-100/50">
            {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Assigned Batch</label>
                            <select 
                                value={formData.batchId || ""}
                                onChange={e => setFormData({...formData, batchId: e.target.value})}
                                className="w-full px-8 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer"
                            >
                                <option value="">Select Batch (Default: All)</option>
                                {batches.map((b:any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Exam Description</label>
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                rows={4}
                                className="w-full px-8 py-6 bg-gray-50 rounded-[2.5rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium leading-relaxed"
                                placeholder="Instructions for students..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Duration (Mins)</label>
                                <div className="relative">
                                    <ClockIcon className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                                    <input 
                                        type="number"
                                        value={formData.duration}
                                        onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                                        className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Workflow State</label>
                                <select 
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                                    className="w-full px-8 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer"
                                >
                                    <option value="PLANNED">Planned (Name Only)</option>
                                    <option value="DRAFT">Draft (Readying Questions)</option>
                                    <option value="SCHEDULED">Scheduled (Live Selection)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 p-10 bg-indigo-50/30 rounded-[3rem] border border-indigo-100/50">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Timeline Range (Start)</label>
                            <input 
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={e => setFormData({...formData, startTime: e.target.value})}
                                className="w-full px-8 py-5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-bold text-gray-700"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Timeline Range (End)</label>
                            <input 
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={e => setFormData({...formData, endTime: e.target.value})}
                                className="w-full px-8 py-5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-bold text-gray-700"
                            />
                        </div>
                        <div className="p-6 bg-white/60 rounded-2xl border border-indigo-100">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.1em] mb-4">Scheduling Constraint Policy</p>
                            <ul className="space-y-2">
                                <li className="flex gap-3 text-xs font-semibold text-indigo-900/60">
                                    <div className="size-1.5 bg-indigo-500 rounded-full mt-1" />
                                    Access opens 5 minutes before Start Time.
                                </li>
                                <li className="flex gap-3 text-xs font-semibold text-indigo-900/60">
                                    <div className="size-1.5 bg-indigo-500 rounded-full mt-1" />
                                    Submissions lock precisely at End Time.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'questions' && (
                <div className="space-y-12">
                     <div className="flex bg-gray-50 p-2 rounded-2xl w-fit">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <PlusIcon className="size-4" /> Manual Setup
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-indigo-600 hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest rounded-xl"
                        >
                            <UploadIcon className="size-4" /> Bulk Upload (JSON/CSV)
                        </button>
                    </div>

                    <div className="space-y-8">
                        {formData.questions.map((q:any, qIndex:number) => (
                             <div key={qIndex} className="p-10 bg-gray-50/50 rounded-[3rem] space-y-8 relative border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50">
                                <button
                                    onClick={() => removeQuestion(qIndex)}
                                    className="absolute top-8 right-8 p-3 text-gray-300 hover:text-rose-500 bg-white rounded-2xl shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2Icon className="size-5" />
                                </button>

                                <div className="flex items-center gap-6">
                                    <div className="size-12 bg-gray-900 text-white rounded-[1.25rem] flex items-center justify-center font-black text-lg font-mono">
                                        {String(qIndex + 1).padStart(2, '0')}
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <select 
                                            value={q.difficulty}
                                            onChange={(e) => updateQuestion(qIndex, 'difficulty', e.target.value)}
                                            className="px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold text-xs uppercase tracking-widest"
                                        >
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Component / Subject"
                                            value={q.category}
                                            onChange={(e) => updateQuestion(qIndex, 'category', e.target.value)}
                                            className="px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold text-xs"
                                        />
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Enter your assessment question stem here..."
                                    value={q.question}
                                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                    rows={3}
                                    className="w-full px-8 py-6 bg-white border border-gray-100 rounded-[2rem] focus:outline-none focus:border-indigo-500 font-bold text-lg leading-relaxed shadow-inner"
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    {[0,1,2,3].map(oIndex => (
                                        <div key={oIndex} className="relative group/option">
                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 size-8 rounded-full border-2 flex items-center justify-center font-black text-xs transition-all ${q.correctAnswer === oIndex ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-400 group-hover/option:border-indigo-300'}`}>
                                                {String.fromCharCode(65 + oIndex)}
                                            </div>
                                            <input 
                                                type="text"
                                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                value={q.options?.[oIndex] || ""}
                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                className={`w-full pl-16 pr-12 py-5 rounded-2xl border-2 focus:outline-none transition-all font-bold ${q.correctAnswer === oIndex ? 'bg-indigo-50 border-indigo-500 text-indigo-900' : 'bg-gray-50 border-transparent focus:bg-white focus:border-indigo-200'}`}
                                            />
                                            <button 
                                                onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${q.correctAnswer === oIndex ? 'text-indigo-600' : 'text-gray-200 hover:text-indigo-300'}`}
                                            >
                                                <CheckCircle2Icon className="size-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        ))}
                    </div>

                    <button
                        onClick={addQuestion}
                        className="w-full py-10 border-4 border-dashed border-gray-100 rounded-[3rem] flex items-center justify-center gap-4 text-gray-300 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-black text-xs uppercase tracking-widest"
                    >
                        <PlusIcon className="size-6" />
                        Append New Question to Bank
                    </button>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="space-y-12">
                    <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 flex items-start gap-6">
                        <AlertTriangleIcon className="size-8 text-orange-500 shrink-0" />
                        <div>
                             <h4 className="text-lg font-black text-orange-900 italic">Partial Assignment Mode</h4>
                             <p className="text-sm text-orange-700 leading-relaxed font-medium mt-1">
                                By default, all students in the selected batch will have access. <br />
                                Select specific individuals below if this exam is restricted to a subset of the batch.
                             </p>
                        </div>
                    </div>

                    {!formData.batchId ? (
                        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                             <p className="text-gray-400 font-bold uppercase tracking-widest">Select a batch in 'Schedule & Info' first</p>
                        </div>
                    ) : studentsInBatch.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                             <p className="text-gray-400 font-bold uppercase tracking-widest">No students found in this batch</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {studentsInBatch.map((student:any) => (
                                <div 
                                    key={student.id} 
                                    onClick={() => {
                                        const ids = [...formData.assignedStudentIds];
                                        if (ids.includes(student.id)) {
                                            setFormData({...formData, assignedStudentIds: ids.filter((id:any) => id !== student.id)});
                                        } else {
                                            setFormData({...formData, assignedStudentIds: [...ids, student.id]});
                                        }
                                    }}
                                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center gap-4 ${formData.assignedStudentIds.includes(student.id) ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                                >
                                    <div className={`size-12 rounded-2xl flex items-center justify-center font-black ${formData.assignedStudentIds.includes(student.id) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        {student.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{student.name}</p>
                                        <p className="text-[10px] font-medium text-gray-400">{student.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  )
}

function UploadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
