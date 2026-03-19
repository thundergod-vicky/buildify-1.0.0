"use client";

import { useState, useEffect } from "react";
import { FileTextIcon, Loader2Icon } from "lucide-react";
import { api } from "@/lib/api";
import InvoicingForm from "../../InvoicingForm";
import { InvoiceView } from "./InvoiceView";
import { InvoiceData } from "@/lib/pdfGenerator";

export function BillingTemplate() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewInvoiceData, setPreviewInvoiceData] = useState<InvoiceData | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await api.get<any[]>("/billing/templates", localStorage.getItem("auth_token") || "");
      setTemplates(data);
      if (data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (!!previewInvoiceData) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [previewInvoiceData]);

  const handlePreviewInvoice = (formData: any) => {
    setPreviewInvoiceData({
        invoiceNumber: "TEST-INV-001",
        issueDate: new Date(),
        status: formData.status === "full" ? "PAID" : "PENDING",
        institute: formData.institute || { name: "Adhyayan", address: "Education Hub, MG Road, Mumbai", logo: "/assets/images/brandlogo.png" },
        student: { 
            name: formData.student.name || "Student Name", 
            enrollmentId: formData.student.enrolId || "ENR-000", 
            course: formData.student.course || "General Course", 
            session: formData.student.session || "2024-25", 
            contact: formData.student.contact || "-" 
        },
        payment: {
            baseFee: parseFloat(formData.payment.fee) || 0,
            gstPercent: parseFloat(formData.payment.gstPct) || 0,
            gstAmount: parseFloat(formData.payment.gstAmt) || 0,
            discountAmount: 0,
            grandTotal: parseFloat(formData.payment.grand) || 0
        },
        paymentMethod: formData.method || "Cash"
    });
  };

  const currentTemplateData = templates.length > 0 ? templates[0].metadata || templates[0] : null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Invoice Generator & Preview</h1>
          <p className="text-gray-500 font-medium">Test invoice data and preview the generated document visually</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <FileTextIcon className="size-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Invoice Configurator</h3>
                <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Standard Adhyayan Layout</p>
              </div>
            </div>
            <div className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-3">
              <div className="size-2 bg-indigo-500 rounded-full animate-pulse" />
              LIVE PREVIEW MODE
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2Icon className="size-8 animate-spin text-indigo-500" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading schema...</p>
                </div>
            ) : (
                <InvoicingForm 
                  initialData={currentTemplateData}
                  isTemplateMode={false}
                  onSave={handlePreviewInvoice}
                />
            )}
          </div>
      </div>

      {/* Invoice View Modal */}
      <InvoiceView 
        isOpen={!!previewInvoiceData} 
        onClose={() => setPreviewInvoiceData(null)} 
        data={previewInvoiceData} 
      />
    </div>
  );
}
