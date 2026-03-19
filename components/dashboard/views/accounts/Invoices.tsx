"use client";

import { useState, useEffect } from "react";
import { 
  SearchIcon, 
  FilterIcon, 
  DownloadIcon, 
  MailIcon, 
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  Loader2Icon,
  FileTextIcon,
  MoreVerticalIcon,
  EyeIcon,
  PrinterIcon,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { generateInvoicePdf, InvoiceData } from "@/lib/pdfGenerator";
import { InvoiceView } from "./InvoiceView";

export function AccountsInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token") || "";
      const data = await api.get<any[]>("/billing/invoices", token);
      setInvoices(data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();

    const handleRefresh = () => fetchInvoices();
    window.addEventListener("refresh-student-invoices", handleRefresh);
    return () => window.removeEventListener("refresh-student-invoices", handleRefresh);
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/billing/invoices/${id}/status`, { status }, localStorage.getItem("auth_token") || "");
      fetchInvoices();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const exportToPDF = async (invoice: any) => {
    const invoiceData = mapInvoiceToData(invoice);
    await generateInvoicePdf(invoiceData);
  };

  const mapInvoiceToData = (inv: any): InvoiceData => {
    const meta = inv.metadata || {};
    const inst = meta.institute || {};
    const stu = meta.student || {};
    
    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      issueDate: inv.createdAt,
      status: inv.status,
      paymentMethod: inv.paymentMethod,
      transactionRef: inv.transactionId,
      remarks: inv.remarks,
      institute: {
        name: inst.name || "Adhyayan",
        address: inst.address || "Education Hub, MG Road, Mumbai",
        logo: inst.logo || "/assets/images/brandlogo.png"
      },
      student: {
        name: inv.student.name,
        enrollmentId: inv.student.enrollmentId || stu.enrolId || "-",
        course: stu.course || "-",
        session: stu.session || "-",
        contact: inv.student.email || stu.contact || "-",
      },
      payment: {
        baseFee: inv.amount || inv.total || 0,
        gstPercent: meta.payment?.gstPct || 0,
        gstAmount: inv.tax || meta.payment?.gstAmt || 0,
        discountAmount: meta.payment?.discountAmt || 0,
        grandTotal: inv.total || inv.amount || 0,
      },
      items: inv.items && inv.items.length > 0 ? inv.items : [
        { description: "Fee Payment", amount: inv.amount || inv.total || 0 }
      ],
    };
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight italic">Invoice Registry</h1>
          <p className="text-gray-500 font-medium">Track and manage student financial obligations</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm" 
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm font-bold text-xs uppercase tracking-widest text-gray-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2Icon className="size-10 animate-spin text-blue-600" />
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Synchronizing Ledger...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Invoice ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Method</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50 group-hover:scale-110 transition-transform">
                          <FileTextIcon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-gray-900 font-urbanist">{inv.invoiceNumber}</span>
                            <span className="text-[10px] text-gray-400 font-bold">{new Date(inv.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-900">{inv.student.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{inv.student.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{inv.paymentMethod || "Unspecified"}</span>
                            <span className="text-[10px] text-indigo-500 font-bold truncate max-w-[100px]">{inv.transactionId || "-"}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="font-black text-gray-900 font-urbanist text-lg">₹{(inv.total || inv.amount || 0).toLocaleString()}</p>
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Final Amount</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                        inv.status === "PAID" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : inv.status === "PENDING"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                        {inv.status === "PAID" ? <CheckCircleIcon className="size-3" /> : inv.status === "PENDING" ? <ClockIcon className="size-3" /> : <AlertCircleIcon className="size-3" />}
                        {inv.status}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setSelectedInvoice(inv); }}
                          className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg rounded-2xl transition-all"
                        >
                          <EyeIcon className="size-4" />
                        </button>
                        <button 
                          onClick={async () => await exportToPDF(inv)}
                          className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg rounded-2xl transition-all"
                        >
                          <DownloadIcon className="size-4" />
                        </button>
                        {inv.status === "PENDING" && (
                          <button 
                            onClick={() => handleUpdateStatus(inv.id, "PAID")}
                            className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-lg rounded-2xl transition-all"
                          >
                            <CheckCircleIcon className="size-4" />
                          </button>
                        )}
                        <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200 rounded-2xl transition-all" title="More Options">
                          <MoreVerticalIcon className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      <InvoiceView 
         isOpen={!!selectedInvoice} 
         onClose={() => setSelectedInvoice(null)} 
         data={selectedInvoice ? mapInvoiceToData(selectedInvoice) : null} 
      />
    </div>
  );
}
