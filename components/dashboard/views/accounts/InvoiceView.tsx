import React, { useState, useEffect } from 'react';
import { DownloadIcon, XIcon, Trash2Icon, Loader2Icon, Edit2Icon, SaveIcon, } from 'lucide-react';
import { generateInvoicePdf, InvoiceData } from '@/lib/pdfGenerator';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface InvoiceViewProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData | null;
}

export function InvoiceView({ isOpen, onClose, data }: InvoiceViewProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editableData, setEditableData] = useState<InvoiceData | null>(null);

  useEffect(() => {
    if (data) {
      setEditableData(JSON.parse(JSON.stringify(data)));
    }
  }, [data]);

  if (!isOpen || !data || !editableData) return null;

  const handleInputChange = (path: string, value: string | number) => {
    const newData = { ...editableData } as any;
    const parts = path.split('.');
    let current = newData;
    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    
    // Recalculate GST and totals
    if (path === 'payment.gstPercent') {
        const base = parseFloat(newData.payment.baseFee.toString()) || 0;
        newData.payment.gstAmount = Math.round((base * (parseFloat(value.toString()) || 0) / 100) * 100) / 100;
    }
    if (path === 'payment.baseFee' && !newData.items) {
        const percent = parseFloat(newData.payment.gstPercent || 0);
        newData.payment.gstAmount = Math.round(((parseFloat(value.toString()) || 0) * percent / 100) * 100) / 100;
    }

    if (path.startsWith('payment') || path.startsWith('items')) {
        let grandTotal = 0;
        if (newData.items && newData.items.length > 0) {
            grandTotal = newData.items.reduce((sum: number, item: { amount: number }) => sum + (parseFloat(item.amount.toString()) || 0), 0);
        } else {
            grandTotal = (parseFloat(newData.payment.baseFee.toString()) || 0) + (parseFloat(newData.payment.gstAmount.toString()) || 0) - (parseFloat(newData.payment.discountAmount.toString()) || 0);
        }
        newData.payment.grandTotal = Math.round(grandTotal * 100) / 100;
    }

    setEditableData(newData);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    if (!editableData.items) return;
    const newItems = [...editableData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    const grandTotal = newItems.reduce((sum: number, item: { amount: number }) => sum + (parseFloat(item.amount.toString()) || 0), 0);
    
    setEditableData({
        ...editableData,
        items: newItems,
        payment: {
            ...editableData.payment,
            grandTotal
        }
    });
  };

  const handleSave = async () => {
    if (!data.id) return alert("Cannot save changes: No invoice ID.");
    setIsSaving(true);
    try {
      const token = localStorage.getItem("auth_token") || "";
      
      // Map back to backend structure if needed
      const payload = {
        amount: editableData.payment.baseFee,
        total: editableData.payment.grandTotal,
        tax: editableData.payment.gstAmount,
        paymentMethod: editableData.paymentMethod,
        transactionId: editableData.transactionRef,
        remarks: editableData.remarks,
        status: editableData.status,
        items: editableData.items,
        metadata: {
            ...data.metadata, // preserve original metadata if any
            student: editableData.student,
            institute: editableData.institute,
            payment: editableData.payment,
            remarks: editableData.remarks
        }
      };

      await api.patch(`/billing/invoices/${data.id}`, payload, token);
      
      setIsEditing(false);
      window.dispatchEvent(new CustomEvent("refresh-student-invoices"));
      alert("Changes saved successfully.");
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!data.id) return alert("This invoice has no ID and cannot be deleted from the server.");
    if (!confirm("Are you sure you want to delete this invoice? This will NOT delete the associated payment record.")) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("auth_token") || "";
      await api.delete(`/billing/invoices/${data.id}`, token);
      
      // Notify parent/table to refresh
      window.dispatchEvent(new CustomEvent("refresh-student-invoices"));
      alert("Invoice deleted successfully.");
      onClose();
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      alert("Failed to delete invoice.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-gray-100 w-full max-w-4xl h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/20"
        >
          {/* Action Header */}
          <div className="bg-white px-8 py-5 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">
                {data.invoiceNumber} • {data.status}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={isSaving}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50",
                  isEditing 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100" 
                    : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
                )}
              >
                {isSaving ? <Loader2Icon className="size-4 animate-spin" /> : isEditing ? <SaveIcon className="size-4" /> : <Edit2Icon className="size-4" />}
                {isEditing ? "Save Changes" : "Edit Invoice"}
              </button>
              {data.id && !isEditing && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {isDeleting ? <Loader2Icon className="size-4 animate-spin" /> : <Trash2Icon className="size-4" />}
                  Delete Invoice
                </button>
              )}
              {!isEditing && (
                <button
                  onClick={async () => await generateInvoicePdf(editableData)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all"
                >
                  <DownloadIcon className="size-4" />
                  Download Official PDF
                </button>
              )}
              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditableData(JSON.parse(JSON.stringify(data)));
                  }}
                  className="px-6 py-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-xl text-sm font-bold transition-all"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-3 text-gray-400 hover:bg-gray-50 hover:text-rose-600 rounded-xl transition-all"
              >
                <XIcon className="size-5" />
              </button>
            </div>
          </div>

          {/* Document Container */}
          <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar">
            
            {/* The Actual A4 Paper UI */}
            <div className="bg-white w-full max-w-[794px] shadow-sm ring-1 ring-gray-900/5 min-h-[1123px] relative overflow-hidden">
                {/* Header Strip */}
                <div className="h-48 bg-slate-900 flex items-center justify-between px-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="flex items-center gap-6 relative z-10">
                        {data.institute.logo && (
                            <div className="bg-white p-2 rounded-2xl shadow-xl">
                                <img 
                                    src={data.institute.logo} 
                                    alt="Logo" 
                                    className="h-16 w-auto object-contain"
                                />
                            </div>
                        )}
                        <div className="text-white">
                            <h1 className="text-3xl font-black tracking-tight leading-tight">Adhyayan</h1>
                            <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest text-wrap max-w-[300px]">City Center, Durgapur, West Bengal</p>
                        </div>
                    </div>
                    <div className="text-right relative z-10">
                        <h2 className="text-4xl font-black text-white uppercase tracking-widest opacity-90 drop-shadow-sm">Invoice</h2>
                        <div className="mt-3 flex justify-end">
                            {isEditing ? (
                                <select 
                                    value={editableData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-full px-4 py-1.5 border border-white/20 outline-none"
                                >
                                    <option value="PAID">FULL PAID</option>
                                    <option value="EMI">EMI</option>
                                    <option value="PARTIAL">PARTIAL</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            ) : (
                                <span className={`inline-block px-4 py-1.5 text-white uppercase tracking-widest text-[10px] font-black rounded-full border border-white/20 ${editableData.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {editableData.status}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="px-12 py-10 grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Billed To</h3>
                        <div>
                            {isEditing ? (
                                <input 
                                    value={editableData.student.name}
                                    onChange={(e) => handleInputChange('student.name', e.target.value)}
                                    className="text-lg font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded px-2 py-1 w-full"
                                />
                            ) : (
                                <p className="text-lg font-bold text-gray-900">{editableData.student.name}</p>
                            )}
                            <div className="mt-2 text-sm text-gray-500 space-y-1">
                                <p><span className="font-semibold text-gray-400 w-20 inline-block">Enroll ID:</span> 
                                    {isEditing ? (
                                        <input value={editableData.student.enrollmentId} onChange={(e) => handleInputChange('student.enrollmentId', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 inline-block text-xs" />
                                    ) : editableData.student.enrollmentId}
                                </p>
                                <p><span className="font-semibold text-gray-400 w-20 inline-block">Course:</span> 
                                    {isEditing ? (
                                        <input value={editableData.student.course} onChange={(e) => handleInputChange('student.course', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 inline-block text-xs" />
                                    ) : editableData.student.course}
                                </p>
                                <p><span className="font-semibold text-gray-400 w-20 inline-block">Session:</span> 
                                    {isEditing ? (
                                        <input value={editableData.student.session} onChange={(e) => handleInputChange('student.session', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 inline-block text-xs" />
                                    ) : editableData.student.session}
                                </p>
                                {(editableData.student.contact !== "-" || isEditing) && <p><span className="font-semibold text-gray-400 w-20 inline-block">Contact:</span> 
                                    {isEditing ? (
                                        <input value={editableData.student.contact} onChange={(e) => handleInputChange('student.contact', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 inline-block text-xs" />
                                    ) : editableData.student.contact}
                                </p>}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 text-right">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Invoice Details</h3>
                        <div className="space-y-2 text-sm text-gray-900">
                            <p className="flex justify-end gap-6"><span className="text-gray-500 font-medium">Invoice No:</span> <span className="font-bold w-32 text-left">{editableData.invoiceNumber || 'N/A'}</span></p>
                            <p className="flex justify-end gap-6"><span className="text-gray-500 font-medium">Date:</span> <span className="font-bold w-32 text-left">{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(editableData.issueDate))}</span></p>
                            <p className="flex justify-end gap-6"><span className="text-gray-500 font-medium">Mode:</span> 
                                <span className="font-bold w-32 text-left">
                                    {isEditing ? (
                                        <select value={editableData.paymentMethod} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 w-full">
                                            <option value="Cash">Cash</option>
                                            <option value="UPI">UPI Sync (Trans ID)</option>
                                            <option value="Card">Credit/Debit Card</option>
                                            <option value="Cheque">Bank Cheque</option>
                                            <option value="NEFT">NEFT Transfer</option>
                                            <option value="RTGS">RTGS Transfer</option>
                                        </select>
                                    ) : editableData.paymentMethod || 'N/A'}
                                </span>
                            </p>
                            <p className="flex justify-end gap-6"><span className="text-gray-500 font-medium">Transaction:</span> 
                                <span className="font-bold w-32 text-left">
                                    {isEditing ? (
                                        <input value={editableData.transactionRef} onChange={(e) => handleInputChange('transactionRef', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 w-full" />
                                    ) : editableData.transactionRef || 'N/A'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="px-12 mt-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-900">Description</th>
                                <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-900 text-right">Amount (INR)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {editableData.items ? (
                                editableData.items.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        <td className="py-5 font-semibold text-gray-700">
                                            {isEditing ? (
                                                <input value={item.description} onChange={(e) => handleItemChange(i, 'description', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 w-full" />
                                            ) : item.description}
                                        </td>
                                        <td className="py-5 text-right font-bold text-gray-900">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end">
                                                    <span>₹</span>
                                                    <input type="number" value={item.amount} onChange={(e) => handleItemChange(i, 'amount', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 w-24 text-right" />
                                                </div>
                                            ) : `₹${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-5 font-semibold text-gray-700">Course Base Fee</td>
                                        <td className="py-5 text-right font-bold text-gray-900">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end">
                                                    <span>₹</span>
                                                    <input type="number" value={editableData.payment.baseFee} onChange={(e) => handleInputChange('payment.baseFee', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 w-24 text-right" />
                                                </div>
                                            ) : `₹${editableData.payment.baseFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-5 font-semibold text-gray-700">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <span>Tax Label:</span>
                                                    <input value="GST" disabled className="bg-gray-100 border border-gray-200 rounded px-2 py-0.5 w-12 text-xs" />
                                                    <input type="number" value={editableData.payment.gstPercent || 0} onChange={(e) => handleInputChange('payment.gstPercent', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 w-12 text-xs" />
                                                    <span>%</span>
                                                </div>
                                            ) : (
                                                `GST (${editableData.payment.gstPercent}%)`
                                            )}
                                        </td>
                                        <td className="py-5 text-right font-bold text-gray-900">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end">
                                                    <span>₹</span>
                                                    <input type="number" value={editableData.payment.gstAmount} onChange={(e) => handleInputChange('payment.gstAmount', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 w-24 text-right" />
                                                </div>
                                            ) : `₹${editableData.payment.gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="px-12 mt-8 flex justify-end">
                    <div className="w-72 space-y-4">
                        {(editableData.payment.discountAmount > 0 || isEditing) && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-gray-500">Discount Added</span>
                                {isEditing ? (
                                    <div className="flex items-center justify-end">
                                        <span>-₹</span>
                                        <input type="number" value={editableData.payment.discountAmount} onChange={(e) => handleInputChange('payment.discountAmount', e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 w-24 text-right" />
                                    </div>
                                ) : (
                                    <span className="font-bold text-emerald-600">-₹{editableData.payment.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                )}
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t-2 border-gray-900 pt-4">
                            <span className="font-black text-gray-900 uppercase tracking-widest text-sm">Grand Total</span>
                            <span className="text-2xl font-black text-indigo-600">₹{editableData.payment.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="px-12 py-12">
                    {(editableData.remarks || isEditing) && (
                        <div className="mb-12">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Remarks</h4>
                            {isEditing ? (
                                <textarea 
                                    value={editableData.remarks} 
                                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 min-h-[100px] resize-none outline-none focus:border-indigo-300"
                                />
                            ) : (
                                <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-xl">{editableData.remarks}</p>
                            )}
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-8 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Thank you for your business</p>
                        <p className="text-[9px] font-semibold text-gray-300 mt-2 uppercase">This is a system generated document and requires no physical signature.</p>
                    </div>
                </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
