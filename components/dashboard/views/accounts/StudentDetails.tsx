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
    WalletIcon,
    PrinterIcon,
    FileTextIcon,
    Trash2Icon,
    DownloadIcon,
    Settings2Icon,
    HistoryIcon,
    AlertCircleIcon,
    GraduationCapIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { InvoicePreviewModal } from "./InvoicePreviewModal";
import { generateInvoicePdf, InvoiceData } from "@/lib/pdfGenerator";
import { InvoiceView } from "./InvoiceView";
import { AdmissionApprovalModal } from "@/components/dashboard/views/shared/AdmissionApprovalModal";

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
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [admissionModal, setAdmissionModal] = useState<{ isOpen: boolean; studentId: string; studentName: string }>({ isOpen: false, studentId: "", studentName: "" });

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
    const [gstPercent, setGstPercent] = useState("0");
    const [discountAmount, setDiscountAmount] = useState("0");
    const [upiId, setUpiId] = useState("");
    const [cardNo, setCardNo] = useState("");
    const [chequeNo, setChequeNo] = useState("");
    const [bankName, setBankName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [allStudents, setAllStudents] = useState<StudentBasicInfo[]>([]);
    
    // Billing Templates for PDF Reciept Generation
    const [templates, setTemplates] = useState<any[]>([]);
    const [receiptTemplateId, setReceiptTemplateId] = useState("");
    const [previewInvoiceData, setPreviewInvoiceData] = useState<InvoiceData | null>(null);
    // Map of studentId -> latest invoice
    const [studentInvoices, setStudentInvoices] = useState<Record<string, any>>({});

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem("auth_token") || "";
            const data = await api.get<any[]>("/billing/templates", token);
            if (data && Array.isArray(data)) {
                setTemplates(data);
                if (data.length > 0 && !receiptTemplateId) setReceiptTemplateId(data[0].id);
            }
        } catch (e) {
            console.error("Failed to load templates", e);
        }
    };

    const fetchStudentInvoices = async () => {
        try {
            const token = localStorage.getItem("auth_token") || "";
            const data = await api.get<any[]>("/billing/invoices", token);
            if (data && Array.isArray(data)) {
                const map: Record<string, any> = {};
                data.forEach((inv: any) => {
                    // Keep most recent invoice per student
                    if (!map[inv.studentId] || new Date(inv.createdAt) > new Date(map[inv.studentId].createdAt)) {
                        map[inv.studentId] = inv;
                    }
                });
                setStudentInvoices(map);
            }
        } catch (e) {
            console.error("Failed to load invoices", e);
        }
    };

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
        fetchTemplates();
        fetchStudentInvoices();

        const handleInvoiceRefresh = () => {
            fetchStudentInvoices();
            fetchSummaries();
        };
        window.addEventListener("refresh-student-invoices", handleInvoiceRefresh);
        return () => window.removeEventListener("refresh-student-invoices", handleInvoiceRefresh);
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
            
            // Generate REAL Invoice if registered student and template is selected
            if (receiptTemplateId && !isManualEntry && selectedStudentId) {
                try {
                    const token = auth.getToken() || "";
                    const baseAmt = parseFloat(amount) || 0;
                    const gstPct = parseFloat(gstPercent) || 0;
                    const discountAmt = parseFloat(discountAmount) || 0;
                    const gstAmt = (baseAmt * gstPct) / 100;
                    const totalAmt = baseAmt + gstAmt - discountAmt;

                    const invoicePayload = {
                        studentId: selectedStudentId,
                        templateId: receiptTemplateId,
                        amount: baseAmt,
                        tax: gstAmt,
                        total: totalAmt,
                        paymentMethod: paymentMode,
                        transactionId: payload.txRef,
                        status: paymentStatus === 'SUCCESS' ? 'PAID' : 'PENDING',
                        metadata: {
                            description: description,
                            paymentMode: paymentMode,
                            refId: payload.txRef,
                            payment: {
                                baseFee: baseAmt,
                                gstPercent: gstPct,
                                gstAmount: gstAmt,
                                discountAmount: discountAmt,
                                grandTotal: totalAmt,
                                upiId: upiId,
                                cardNo: cardNo,
                                chequeNo: chequeNo,
                                bankName: bankName
                            }
                        }
                    };

                    const inv = await api.post<any>("/billing/invoices", invoicePayload, token);
                    
                    // Refresh student invoices map
                    fetchStudentInvoices();
                    
                    // Show the REAL invoice in preview (so delete works etc)
                    setPreviewInvoiceData({
                        id: inv.id,
                        invoiceNumber: inv.invoiceNumber,
                        issueDate: new Date(inv.createdAt),
                        status: inv.status,
                        institute: { 
                            name: "Adhyayan", 
                            address: "City Center, Durgapur, West Bengal", 
                            logo: "/assets/images/brandlogo.png" 
                        },
                        student: { 
                            name: inv.student?.name || "Unknown", 
                            enrollmentId: inv.student?.enrollmentId || "UNKNOWN", 
                            course: inv.template?.name || "Fee Payment", 
                            session: "Current", 
                            contact: "-" 
                        },
                        payment: {
                            baseFee: inv.amount,
                            gstPercent: inv.metadata?.payment?.gstPercent || inv.metadata?.payment?.gstPct || inv.template?.taxRate || 0,
                            gstAmount: inv.tax || inv.metadata?.payment?.gstAmount || 0,
                            discountAmount: inv.metadata?.payment?.discountAmount || 0,
                            grandTotal: inv.total || inv.amount
                        },
                        paymentMethod: inv.paymentMethod || "Cash"
                    });
                } catch (err) {
                    console.error("Failed to auto-generate invoice:", err);
                    alert("Payment recorded, but invoice generation failed. You can generate it manually from the table.");
                }
            } else if (receiptTemplateId && isManualEntry) {
                // For manual entries, we still show a visual mock invoice (since no DB record can be created)
                const tpl = templates.find(t => t.id === receiptTemplateId);
                setPreviewInvoiceData({
                    invoiceNumber: `REC-${Date.now()}`,
                    issueDate: new Date(),
                    status: "PAID",
                    institute: { 
                        name: "Adhyayan", 
                        address: "City Center, Durgapur, West Bengal", 
                        logo: "/assets/images/brandlogo.png" 
                    },
                    student: { 
                        name: manualName, 
                        enrollmentId: "MANUAL", 
                        course: "External Payment", 
                        session: "N/A", 
                        contact: manualPhone 
                    },
                    payment: {
                        baseFee: parseFloat(amount) || 0,
                        gstPercent: parseFloat(gstPercent) || 0,
                        gstAmount: (parseFloat(amount) || 0) * (parseFloat(gstPercent) || 0) / 100,
                        discountAmount: parseFloat(discountAmount) || 0,
                        grandTotal: (parseFloat(amount) || 0) + ((parseFloat(amount) || 0) * (parseFloat(gstPercent) || 0) / 100) - (parseFloat(discountAmount) || 0)
                    },
                    paymentMethod: paymentMode
                });
            }

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
        setGstPercent("0");
        setDiscountAmount("0");
        setUpiId("");
        setCardNo("");
        setChequeNo("");
        setBankName("");
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
                    {selectedStudentIds.size > 0 && (
                        <motion.button 
                            initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            onClick={() => setIsInvoiceModalOpen(true)}
                            className="group flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-100 hover:bg-black transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <FileTextIcon className="size-4" />
                            Generate Invoices ({selectedStudentIds.size})
                        </motion.button>
                    )}
                    {selectedStudentIds.size > 0 && (
                        <motion.button 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={async () => {
                                if (confirm(`Are you sure you want to delete all invoices and payment history for the ${selectedStudentIds.size} selected students? This cannot be undone.`)) {
                                    try {
                                        await api.post("/billing/invoices/bulk-delete", { studentIds: Array.from(selectedStudentIds) }, localStorage.getItem("auth_token") || "");
                                        setSelectedStudentIds(new Set());
                                        window.dispatchEvent(new CustomEvent("refresh-student-invoices"));
                                        window.dispatchEvent(new CustomEvent("refresh-accounts-home"));
                                        fetchSummaries();
                                        alert("Records deleted successfully.");
                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to delete records.");
                                    }
                                }
                            }}
                            className="group flex items-center gap-3 px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 shadow-xl shadow-rose-100/20 hover:bg-rose-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <Trash2Icon className="size-4" />
                            Delete Records ({selectedStudentIds.size})
                        </motion.button>
                    )}
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
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                        <input 
                                            type="checkbox" 
                                            className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={filteredSummaries.length > 0 && selectedStudentIds.size === filteredSummaries.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedStudentIds(new Set(filteredSummaries.map(s => s.id)));
                                                } else {
                                                    setSelectedStudentIds(new Set());
                                                }
                                            }}
                                        />
                                    </th>
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
                                    <tr key={s.id} className={cn(
                                        "hover:bg-indigo-50/[0.15] transition-colors duration-200 group",
                                        selectedStudentIds.has(s.id) && "bg-indigo-50/30"
                                    )}>
                                        <td className="px-6 py-6">
                                            <input 
                                                type="checkbox" 
                                                className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={selectedStudentIds.has(s.id)}
                                                onChange={() => {
                                                    const next = new Set(selectedStudentIds);
                                                    if (next.has(s.id)) next.delete(s.id);
                                                    else next.add(s.id);
                                                    setSelectedStudentIds(next);
                                                }}
                                            />
                                        </td>
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
                                            <div className="flex items-center justify-end gap-1">
                                                {studentInvoices[s.id] ? (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                const inv = studentInvoices[s.id];
                                                                setPreviewInvoiceData({
                                                                    id: inv.id,
                                                                    invoiceNumber: inv.invoiceNumber,
                                                                    issueDate: new Date(inv.createdAt),
                                                                    status: inv.status,
                                                                    institute: templates[0]?.metadata?.institute || { name: "Adhyayan", address: "Education Hub, MG Road, Mumbai", logo: "/assets/images/brandlogo.png" },
                                                                    student: { name: s.name, enrollmentId: s.enrollmentId || "N/A", course: s.batches[0]?.name || "N/A", session: "Current", contact: "-" },
                                                                    payment: { 
                                                                        baseFee: inv.amount, 
                                                                        gstPercent: inv.metadata?.payment?.gstPercent || inv.metadata?.payment?.gstPct || 0, 
                                                                        gstAmount: inv.tax || inv.metadata?.payment?.gstAmount || 0, 
                                                                        discountAmount: inv.metadata?.payment?.discountAmount || 0, 
                                                                        grandTotal: inv.total || inv.amount 
                                                                    },
                                                                    paymentMethod: inv.paymentMethod || "Cash",
                                                                    transactionRef: inv.transactionId || null,
                                                                    remarks: inv.remarks || inv.metadata?.remarks || ""
                                                                });
                                                            }}
                                                            title="View Invoice"
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                                                        >
                                                            <FileTextIcon className="size-3" />
                                                            Invoiced
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudentId(s.id);
                                                            setIsManualEntry(false);
                                                            setIsPaymentModalOpen(true);
                                                        }}
                                                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                                                    >
                                                        <PlusIcon className="size-3" />
                                                        Record Fee
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => fetchStudentHistory(s)}
                                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
                                                >
                                                    <ArrowRightIcon className="size-5" />
                                                </button>
                                                <button
                                                    onClick={() => setAdmissionModal({ isOpen: true, studentId: s.id, studentName: s.name })}
                                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="View Admission"
                                                >
                                                    <GraduationCapIcon className="size-5" />
                                                </button>
                                            </div>
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
                                                        <option>Card</option>
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

                                        {/* Conditional Mode Details */}
                                        <AnimatePresence mode="wait">
                                            {paymentMode === 'UPI' && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }} 
                                                    animate={{ opacity: 1, height: 'auto' }} 
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-2 overflow-hidden"
                                                >
                                                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider ml-1">UPI ID</label>
                                                    <input value={upiId} onChange={e => setUpiId(e.target.value)} type="text" placeholder="username@bank..." className="w-full px-5 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-xs text-indigo-900" />
                                                </motion.div>
                                            )}
                                            {paymentMode === 'Card' && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }} 
                                                    animate={{ opacity: 1, height: 'auto' }} 
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-2 overflow-hidden"
                                                >
                                                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider ml-1">Card Number (Last 4 digits or Full)</label>
                                                    <input value={cardNo} onChange={e => setCardNo(e.target.value)} type="text" placeholder="**** **** **** 1234" className="w-full px-5 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-xs text-indigo-900" />
                                                </motion.div>
                                            )}
                                            {paymentMode === 'Cheque' && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }} 
                                                    animate={{ opacity: 1, height: 'auto' }} 
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="grid grid-cols-2 gap-4 overflow-hidden"
                                                >
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider ml-1">Cheque No</label>
                                                        <input value={chequeNo} onChange={e => setChequeNo(e.target.value)} type="text" placeholder="123456" className="w-full px-5 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-xs text-indigo-900" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider ml-1">Bank Name</label>
                                                        <input value={bankName} onChange={e => setBankName(e.target.value)} type="text" placeholder="SBI, HDFC, etc" className="w-full px-5 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-xs text-indigo-900" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Tax & Discounts (Optional Override) */}
                                        <div className="grid grid-cols-2 gap-4 pb-6 pt-2 border-t border-slate-50">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">GST / Tax %</label>
                                                <div className="relative group">
                                                    <input 
                                                        value={gstPercent} 
                                                        onChange={e => setGstPercent(e.target.value)} 
                                                        type="number" 
                                                        placeholder="18" 
                                                        className="w-full pl-5 pr-10 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-semibold text-xs text-slate-600 shadow-sm" 
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300 group-focus-within:text-indigo-400 Transition-colors">%</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Discount Amt</label>
                                                <div className="relative group">
                                                    <input 
                                                        value={discountAmount} 
                                                        onChange={e => setDiscountAmount(e.target.value)} 
                                                        type="number" 
                                                        placeholder="0.00" 
                                                        className="w-full pl-8 pr-5 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-semibold text-xs text-slate-600 shadow-sm" 
                                                    />
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300 group-focus-within:text-indigo-400 Transition-colors">₹</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Auto-Receipt Generator Setting */}
                                        <div className="space-y-3 pt-6 border-t border-slate-100 bg-indigo-50/30 -mx-10 px-10 pb-8 mt-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-5 bg-indigo-600 rounded-lg flex items-center justify-center text-white scale-90">
                                                        <FileTextIcon className="size-3" />
                                                    </div>
                                                    <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none">Smart Invoice Generation</label>
                                                </div>
                                                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">Live Preview follows</span>
                                            </div>
                                            <div className="relative">
                                                <select 
                                                    value={receiptTemplateId}
                                                    onChange={e => setReceiptTemplateId(e.target.value)}
                                                    className="w-full pl-5 pr-10 py-3.5 bg-white border-2 border-indigo-100 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-xs text-slate-700 appearance-none cursor-pointer shadow-sm shadow-indigo-100/50"
                                                >
                                                    <option value="">Do not generate receipt</option>
                                                    {templates.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name} (Official Layout)</option>
                                                    ))}
                                                </select>
                                                <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-indigo-400 pointer-events-none" />
                                            </div>
                                            <p className="text-[10px] text-indigo-400/80 font-medium italic mt-1 leading-relaxed px-1">&ldquo;Recording this transaction will automatically commit a new numbered invoice to the system.&rdquo;</p>
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

                        {/* Grand Total Preview */}
                        <div className="mt-4 p-4 bg-slate-900 rounded-2xl flex items-center justify-between shadow-lg shadow-slate-200/50">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grand Total</p>
                                <p className="text-[8px] text-slate-500 font-medium italic">Base + Tax - Disc.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white tabular-nums">
                                    ₹{((parseFloat(amount) || 0) + ((parseFloat(amount) || 0) * (parseFloat(gstPercent) || 0) / 100) - (parseFloat(discountAmount) || 0)).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50">
                                    <button 
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:from-black hover:to-indigo-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-indigo-100 ring-4 ring-white"
                                    >
                                        {isSubmitting ? (
                                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <div className="size-6 bg-white/10 rounded-lg flex items-center justify-center">
                                                    <FileTextIcon className="size-3.5" />
                                                </div>
                                                Record & Generate Invoice
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
                                                        <button
                                                            onClick={() => {
                                                                const tpl = templates.length > 0 ? templates[0] : null;
                                                                setPreviewInvoiceData({
                                                                    invoiceNumber: `REC-${p.id.slice(-6).toUpperCase()}`,
                                                                    issueDate: new Date(p.createdAt),
                                                                    status: p.status === "SUCCESS" ? "PAID" : p.status,
                                                                    institute: tpl?.metadata?.institute || { name: "Adhyayan Institute", address: "" },
                                                                    student: { name: selectedStudent?.name || "Unknown", enrollmentId: selectedStudent?.enrollmentId || "Unknown", course: "Fee Payment", session: "Current", contact: "-" },
                                                                    payment: {
                                                                        baseFee: p.amount,
                                                                        gstPercent: 0,
                                                                        gstAmount: 0,
                                                                        discountAmount: 0,
                                                                        grandTotal: p.amount
                                                                    },
                                                                    paymentMethod: p.mode || "Cash",
                                                                    remarks: p.description || ""
                                                                });
                                                            }}
                                                            title="View Receipt"
                                                            className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                        >
                                                            <PrinterIcon className="size-5" />
                                                        </button>
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
                                                            title="Delete Record"
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

            {/* Invoice Generation Modal */}
            <InvoicePreviewModal 
                isOpen={isInvoiceModalOpen}
                onClose={() => {
                    setIsInvoiceModalOpen(false);
                    setSelectedStudentIds(new Set());
                    fetchSummaries();
                }}
                selectedStudents={summaries.filter(s => selectedStudentIds.has(s.id))}
            />

            {/* Individual Invoice View Modal for Receipts */}
            <InvoiceView 
                isOpen={!!previewInvoiceData}
                data={previewInvoiceData}
                onClose={() => setPreviewInvoiceData(null)}
            />

            <AdmissionApprovalModal
                isOpen={admissionModal.isOpen}
                studentId={admissionModal.studentId}
                studentName={admissionModal.studentName}
                onClose={() => setAdmissionModal({ isOpen: false, studentId: "", studentName: "" })}
                onAction={fetchSummaries}
            />
        </div>
    );
}
