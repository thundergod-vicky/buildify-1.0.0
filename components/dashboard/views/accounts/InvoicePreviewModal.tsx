"use client";

import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import InvoicingForm from "../../InvoicingForm";
import { api } from "@/lib/api";

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents: any[];
}

export function InvoicePreviewModal({ isOpen, onClose, selectedStudents }: InvoicePreviewModalProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await api.get<any[]>("/billing/templates", localStorage.getItem("auth_token") || "");
        setTemplates(data || []);
        if (data && data.length > 0) setSelectedTemplate(data[0]);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    if (isOpen) fetchTemplates();
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('auth_token') || "";
      for (const student of selectedStudents) {
        const payload = {
          studentId: student.id,
          templateId: selectedTemplate?.id,
          amount: formData.payment.grand,
          paymentMethod: formData.method,
          transactionId: formData.method === 'upi' ? formData.txn.upiTxn : 
                         formData.method === 'card' ? formData.txn.cardApproval :
                         formData.method === 'cheque' ? formData.txn.chequeNo : null,
          status: formData.status === 'full' ? 'PAID' : 'PENDING',
          metadata: formData,
          customItems: formData.payment.fee ? [
            { description: "Course Fee", amount: parseFloat(formData.payment.fee) },
            { description: `GST (${formData.payment.gstPct}%)`, amount: formData.payment.gstAmt }
          ] : undefined
        };

        await api.post("/billing/invoices", payload, token);
      }
      onClose();
      // Force refresh data
      window.dispatchEvent(new CustomEvent("refresh-accounts-home"));
      window.dispatchEvent(new CustomEvent("refresh-student-invoices"));
    } catch (error) {
      console.error("Error generating invoices:", error);
      alert("Failed to generate invoices. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Plus className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Generate Invoices</h2>
              <p className="text-sm text-gray-500">Creating invoices for {selectedStudents.length} selected student(s)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Base Template</span>
              <select 
                className="bg-transparent text-sm font-bold text-indigo-600 outline-none cursor-pointer"
                value={selectedTemplate?.id || ''}
                onChange={(e) => setSelectedTemplate(templates.find(t => t.id === e.target.value))}
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={onClose}
              className="size-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-gray-50/30">
          {isGenerating && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="size-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-bold text-gray-900 uppercase tracking-widest">Generating Invoices...</p>
            </div>
          )}
          
          <InvoicingForm 
            studentData={selectedStudents[0]} 
            initialData={selectedTemplate}
            onSave={handleGenerate}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
