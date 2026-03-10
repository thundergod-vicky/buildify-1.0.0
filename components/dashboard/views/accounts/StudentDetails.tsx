"use client";

import { useState, useEffect } from "react";
import { 
    SearchIcon, 
    FilterIcon, 
    PlusIcon, 
    XIcon,
    CheckIcon,
    IndianRupeeIcon,
    CalendarIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    WalletIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface StudentSummary {
    id: string;
    name: string;
    email: string;
    phone: string;
    enrollmentId: string | null;
    batches: { id: string, name: string }[];
    totalFee: number;
    totalPaid: number;
    due: number;
    status: 'PAID' | 'PARTIAL' | 'OVERDUE' | 'NONE';
    manualStatus?: 'PAID' | 'PARTIAL' | 'OVERDUE' | 'NONE';
}

interface StudentBasicInfo {
    id: string;
    name: string;
    enrollmentId: string | null;
}

interface PaymentRecord {
    id: string;
    amount: number;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    mode: string;
    description: string;
    txRef: string;
    createdAt: string;
}

export function StudentDetails() {
    const [summaries, setSummaries] = useState<StudentSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    // History Modal State
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
    const [studentPayments, setStudentPayments] = useState<PaymentRecord[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Payment Form State
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [manualName, setManualName] = useState("");
    const [manualPhone, setManualPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentStatus, setPaymentStatus] = useState<'SUCCESS' | 'PENDING' | 'FAILED'>('SUCCESS');
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [refId, setRefId] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [allStudents, setAllStudents] = useState<StudentBasicInfo[]>([]);

    const fetchSummaries = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<StudentSummary[]>("/payments/summaries", auth.getToken() || "");
            setSummaries(data);
        } catch (error) {
            console.error("Failed to fetch payment summaries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllStudents = async () => {
        try {
            const data = await api.get<StudentBasicInfo[]>("/users/students", auth.getToken() || "");
            setAllStudents(data);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    };

    const handleUpdateStatus = async (id: string, status: 'SUCCESS' | 'FAILED') => {
        try {
            await api.patch(`/payments/${id}/status`, { status }, auth.getToken() || "");
            if (selectedStudent) fetchStudentHistory(selectedStudent);
            fetchSummaries();
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status.");
        }
    };

    const handleManualStatusChange = async (studentId: string, status: string) => {
        try {
            await api.patch(`/payments/student/${studentId}/status`, { status }, auth.getToken() || "");
            fetchSummaries();
        } catch (error) {
            console.error("Failed to update manual status:", error);
            alert("Failed to update student protocol.");
        }
    };

    const fetchStudentHistory = async (student: StudentSummary) => {
        setSelectedStudent(student);
        setIsHistoryModalOpen(true);
        setIsLoadingHistory(true);
        try {
            const data = await api.get<PaymentRecord[]>(`/payments/student/${student.id}`, auth.getToken() || "");
            setStudentPayments(data);
        } catch (error) {
            console.error("Failed to fetch student history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleDeletePayment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this transaction record? This cannot be undone.")) return;
        try {
            await api.delete(`/payments/${id}`, auth.getToken() || "");
            if (selectedStudent) fetchStudentHistory(selectedStudent);
            fetchSummaries();
        } catch (error) {
            console.error("Failed to delete record:", error);
            alert("Failed to delete record.");
        }
    };

    useEffect(() => {
        fetchSummaries();
        fetchAllStudents();
    }, []);

    // Body scroll lock
    useEffect(() => {
        if (isPaymentModalOpen || isHistoryModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isPaymentModalOpen, isHistoryModalOpen]);

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                studentId: isManualEntry ? undefined : selectedStudentId,
                role: 'STUDENT',
                manualName: isManualEntry ? manualName : undefined,
                manualPhone: isManualEntry ? manualPhone : undefined,
                amount: parseFloat(amount),
                status: paymentStatus,
                txRef: refId || `TXN-${Date.now()}`,
                mode: paymentMode,
                description: description
            };

            await api.post("/payments", payload, auth.getToken() || "");
            setIsPaymentModalOpen(false);
            resetForm();
            fetchSummaries();
        } catch (error) {
            alert("Failed to record payment. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSelectedStudentId("");
        setManualName("");
        setManualPhone("");
        setAmount("");
        setPaymentStatus('SUCCESS');
        setPaymentMode("Cash");
        setRefId("");
        setDescription("");
        setIsManualEntry(false);
    };

    const filteredSummaries = summaries.filter(s => 
        (s.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
        (s.enrollmentId?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full max-h-[100vh] flex flex-col p-8 max-w-[1400px] mx-auto font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
            {/* Header Section - Sticky at top */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Registry</h1>
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                        <span>Accounts & Receivables</span>
                        <div className="size-1.5 bg-slate-300 rounded-full" />
                        <span className="text-indigo-600">Manual Entry Active</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-8 mr-4">
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Receivables</p>
                            <p className="text-xl font-black text-slate-900 tabular-nums">₹{summaries.reduce((a,b) => a + b.due, 0).toLocaleString()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="group flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <PlusIcon className="size-5 group-hover:rotate-90 transition-transform duration-500" />
                        Record Transaction
                    </button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
                {/* Controls Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-9 relative group">
                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search student identity, enrollment ID or mobile..." 
                            className="w-full pl-14 pr-8 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-300 transition-all text-slate-600 font-medium placeholder:text-slate-300 shadow-sm"
                        />
                    </div>
                    <div className="lg:col-span-3 flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all font-bold text-sm shadow-sm group">
                            <FilterIcon className="size-4 group-hover:scale-110 transition-transform" />
                            Filters
                        </button>
                        <button className="flex items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                            <CalendarIcon className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Student Identity</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Ledger Balance</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Amount Paid</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Outstanding</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Protocol</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32">
                                            <div className="flex flex-col items-center justify-center gap-6">
                                                <div className="spinner scale-75 opacity-80"></div>
                                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse font-urbanist">Syncing Matrix...</div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSummaries.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <WalletIcon className="size-10 text-slate-400" />
                                                </div>
                                                <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">No Financial Matches Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSummaries.map((s) => (
                                    <tr key={s.id} className="hover:bg-indigo-50/[0.15] transition-colors duration-200 group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "size-12 rounded-xl flex items-center justify-center font-black text-sm shadow-sm border",
                                                    s.status === 'PAID' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    s.status === 'PARTIAL' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    s.status === 'OVERDUE' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-500 border-slate-100"
                                                )}>
                                                    {s.name[0]}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{s.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            {s.enrollmentId || "MANUAL ENTRY"}
                                                        </span>
                                                        <div className="size-1 bg-slate-200 rounded-full" />
                                                        <span className="text-[10px] font-bold text-indigo-500/80 uppercase">
                                                            {s.batches[0]?.name || "Unverified"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-slate-600 tabular-nums">₹{s.totalFee.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-emerald-600 tabular-nums">₹{s.totalPaid.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "font-bold tabular-nums",
                                                s.due > 0 ? "text-rose-500" : "text-slate-400"
                                            )}>₹{s.due.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="relative inline-block">
                                                <select 
                                                    value={s.status}
                                                    onChange={(e) => handleManualStatusChange(s.id, e.target.value)}
                                                    className={cn(
                                                        "appearance-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all outline-none border-none",
                                                        s.status === 'PAID' ? "bg-emerald-100/50 text-emerald-700 hover:bg-emerald-200/50" :
                                                        s.status === 'PARTIAL' ? "bg-amber-100/50 text-amber-700 hover:bg-amber-200/50" :
                                                        s.status === 'OVERDUE' ? "bg-rose-100/50 text-rose-700 hover:bg-rose-200/50" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                    )}
                                                >
                                                    <option value="NONE">NONE (Auto)</option>
                                                    <option value="PAID">PAID</option>
                                                    <option value="PARTIAL">PARTIAL</option>
                                                    <option value="OVERDUE">OVERDUE</option>
                                                </select>
                                                <div className="absolute -right-1.5 -top-1.5 size-2 rounded-full bg-indigo-500 border border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => fetchStudentHistory(s)}
                                                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
                                            >
                                                <ArrowRightIcon className="size-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 pt-8 flex items-center justify-center gap-10">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Adhyayan Ledger Core v3.0</p>
                <div className="h-px bg-slate-100 flex-1" />
                <p className="text-[10px] font-black text-indigo-400 uppercase italic">Secured Manual Mode</p>
            </div>

            {/* Payment Record Modal */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ translateY: 20, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            exit={{ translateY: 20, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100"
                        >
                            {/* Modal Header */}
                            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Record Payment</h2>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Accounts override</p>
                                </div>
                                <button 
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all active:scale-95"
                                >
                                    <XIcon className="size-5" />
                                </button>
                            </div>

                            <form onSubmit={handleRecordPayment} className="max-h-[75vh] overflow-y-auto custom-scrollbar">
                                <div className="p-10 space-y-10">
                                    {/* Tab Control */}
                                    <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                        {(['Registry Student', 'Manual Add'] as const).map((label, idx) => {
                                            const active = idx === 0 ? !isManualEntry : isManualEntry;
                                            return (
                                                <button 
                                                    key={label}
                                                    type="button"
                                                    onClick={() => setIsManualEntry(idx === 1)}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-[0.9rem] text-[10px] font-bold uppercase tracking-wider transition-all",
                                                        active ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-500"
                                                    )}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-8">
                                        {/* Identify Section */}
                                        {isManualEntry ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                                    <input required value={manualName} onChange={e => setManualName(e.target.value)} type="text" placeholder="Entry name..." className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-300" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
                                                    <input required value={manualPhone} onChange={e => setManualPhone(e.target.value)} type="tel" placeholder="Contact number..." className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-300" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Student Registry</label>
                                                <div className="relative">
                                                    <select 
                                                        required
                                                        value={selectedStudentId}
                                                        onChange={e => setSelectedStudentId(e.target.value)}
                                                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Choose student...</option>
                                                        {allStudents.map(s => (
                                                            <option key={s.id} value={s.id}>{s.name} ({s.enrollmentId})</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Financials */}
                                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Amount to commit</label>
                                                <div className="relative group">
                                                    <input 
                                                        required 
                                                        value={amount} 
                                                        onChange={e => setAmount(e.target.value)} 
                                                        type="number" 
                                                        placeholder="0.00" 
                                                        className="w-full pl-10 pr-6 py-4 bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-xl tabular-nums text-slate-900 placeholder:text-slate-200 shadow-sm" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300 group-focus-within:text-indigo-500 transition-colors">₹</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                                                <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100 h-[60px] gap-1">
                                                    {(['SUCCESS', 'PENDING', 'FAILED'] as const).map(s => (
                                                        <button 
                                                            key={s}
                                                            type="button"
                                                            onClick={() => setPaymentStatus(s)}
                                                            className={cn(
                                                                "flex-1 rounded-[0.5rem] text-[8px] font-bold uppercase tracking-tighter transition-all flex flex-col items-center justify-center",
                                                                paymentStatus === s 
                                                                    ? s === 'SUCCESS' ? "bg-emerald-500 text-white shadow-sm" 
                                                                      : s === 'PENDING' ? "bg-amber-500 text-white shadow-sm" 
                                                                      : "bg-rose-500 text-white shadow-sm"
                                                                    : "text-slate-400 hover:text-slate-600"
                                                            )}
                                                        >
                                                            {s === 'SUCCESS' ? 'PAID' : s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mode</label>
                                                <div className="relative">
                                                    <select 
                                                        value={paymentMode}
                                                        onChange={e => setPaymentMode(e.target.value)}
                                                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-semibold text-xs appearance-none cursor-pointer"
                                                    >
                                                        <option>Cash</option>
                                                        <option>UPI</option>
                                                        <option>NEFT</option>
                                                        <option>RTGS</option>
                                                        <option>Cheque</option>
                                                        <option>Other</option>
                                                    </select>
                                                    <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 size-3 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Identifier / ID</label>
                                                <input value={refId} onChange={e => setRefId(e.target.value)} type="text" placeholder="Ref no..." className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-xs text-slate-600" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Notes</label>
                                            <textarea 
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Additional context for this record..."
                                                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-xs min-h-[100px] text-slate-600 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50">
                                    <button 
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[0.1em] text-xs hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        {isSubmitting ? (
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <PlusIcon className="size-4" />
                                                Add Transaction
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* History Modal */}
            <AnimatePresence>
                {isHistoryModalOpen && selectedStudent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="px-10 py-8 bg-slate-900 text-white flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-lg">
                                        {selectedStudent.name[0]}
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">{selectedStudent.enrollmentId} • Transaction History</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsHistoryModalOpen(false)}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all"
                                >
                                    <XIcon className="size-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                {isLoadingHistory ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <div className="size-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hydrating Ledger...</p>
                                    </div>
                                ) : studentPayments.length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No transactions found for this identity.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {studentPayments.map((p) => (
                                            <div key={p.id} className="group p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
                                                <div className="flex items-center gap-8">
                                                    <div className={cn(
                                                        "size-12 rounded-xl flex items-center justify-center shadow-sm",
                                                        p.status === 'SUCCESS' ? "bg-emerald-500 text-white" : 
                                                        p.status === 'PENDING' ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                                                    )}>
                                                        <IndianRupeeIcon className="size-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-extrabold text-slate-900 text-lg tabular-nums">₹{p.amount.toLocaleString()}</p>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                            <div className="size-1 bg-slate-200 rounded-full" />
                                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{p.mode || 'Cash'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">REF# {p.txRef || 'NONE'}</p>
                                                        <p className="text-xs font-bold text-slate-500 line-clamp-1 max-w-[150px]">{p.description || 'No description'}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {p.status === 'PENDING' && (
                                                            <button 
                                                                onClick={() => handleUpdateStatus(p.id, 'SUCCESS')}
                                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                                            >
                                                                <CheckIcon className="size-3" />
                                                                Mark Paid
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleDeletePayment(p.id)}
                                                            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                        >
                                                            <XIcon className="size-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
