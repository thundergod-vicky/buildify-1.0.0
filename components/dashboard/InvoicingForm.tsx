"use client";

import React, { useState, useCallback, useEffect } from "react";
import { 
  Building2,
  User, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Printer, 
  Share2,
  X,
  ArrowRight
} from "lucide-react";

// --- Helpers ---
const fmtDate = (s: string) => {
  if (!s) return "";
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

const todayISO = () => new Date().toISOString().split("T")[0];

const receiptDate = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

const genReceiptNo = () => "RCP" + Date.now().toString().slice(-6);

// --- Sub-components ---
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const SectionCard = ({ title, children, icon: Icon }: { title?: string; children: React.ReactNode; icon?: any }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
    {title && (
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        {Icon && <Icon className="size-4 text-indigo-500" />}
        <div className="text-xs font-bold tracking-[0.1em] uppercase text-gray-400">{title}</div>
      </div>
    )}
    {children}
  </div>
);

const Badge = ({ type }: { type: string }) => {
  const map: any = { 
    full: ["bg-emerald-50 text-emerald-600 border-emerald-100", "Full paid"], 
    emi: ["bg-amber-50 text-amber-600 border-amber-100", "Instalments"], 
    pending: ["bg-rose-50 text-rose-600 border-rose-100", "Pending"], 
    readmission: ["bg-indigo-50 text-indigo-600 border-indigo-100", "Re-admission"] 
  };
  const [cls, label] = map[type] || ["bg-gray-50 text-gray-600 border-gray-100", type];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
      {label}
    </span>
  );
};

interface InvoicingFormProps {
  initialData?: any;
  studentData?: any;
  onSave: (data: any) => void;
  onCancel?: () => void;
  isTemplateMode?: boolean;
}

export default function InvoicingForm({ initialData, studentData, onSave, onCancel, isTemplateMode = false }: InvoicingFormProps) {
  const [tab, setTab] = useState("form");
  const [form, setForm] = useState(() => ({
    institute: { 
      name: initialData?.institute?.name || "Adhyayan", 
      address: initialData?.institute?.address || "Education Hub, MG Road, Mumbai", 
      logo: initialData?.institute?.logo || "/assets/images/brandlogo.png" 
    },
    student: { 
      name: studentData?.name || "", 
      enrolId: studentData?.enrollmentId || "", 
      course: studentData?.course || batchToCourse(studentData?.batchesEnrolled) || "", 
      session: "2024-25", 
      contact: studentData?.phone || studentData?.email || "", 
      readmission: false 
    },
    payment: { 
      fee: initialData?.baseAmount || "", 
      gstPct: initialData?.taxRate || "18", 
      gstAmt: 0, 
      discount: initialData?.discount || "0", 
      grand: 0 
    },
    plan: initialData?.tenure ? tenureToPlan(initialData.tenure) : 1,
    customN: "",
    emiData: [] as any[],
    method: "upi",
    txn: { 
      upiDate: todayISO(), 
      cardDate: todayISO(), 
      cashDate: todayISO(), 
      chequeDate: todayISO() 
    } as any,
    status: "full",
    remarks: "",
  }));

  function batchToCourse(batches: any[]) {
    if (!batches || batches.length === 0) return "";
    return batches[0].name;
  }

  function tenureToPlan(tenure: string) {
    if (tenure.includes("03")) return 3;
    if (tenure.includes("06")) return 6;
    if (tenure.includes("12")) return 12;
    return 1;
  }

  const updInst = (k: string, v: any) => setForm((p) => ({ ...p, institute: { ...p.institute, [k]: v } }));
  const updStu = (k: string, v: any) => setForm((p) => ({ ...p, student: { ...p.student, [k]: v } }));
  
  const calculateTotals = useCallback((pay: any) => {
    const fee = parseFloat(pay.fee) || 0;
    const gstPct = parseFloat(pay.gstPct) || 0;
    const disc = parseFloat(pay.discount) || 0;
    const gstAmt = Math.round(fee * (gstPct / 100) * 100) / 100;
    const grand = Math.round((fee + gstAmt - disc) * 100) / 100;
    return { ...pay, gstAmt, grand };
  }, []);

  useEffect(() => {
    setForm(p => {
      const updatedPay = calculateTotals(p.payment);
      return { ...p, payment: updatedPay };
    });
  }, [calculateTotals]);

  const buildEMI = useCallback((grand: number, plan: any, customN: string) => {
    const parts = plan === "custom" ? Math.max(1, parseInt(customN) || 1) : plan;
    const today = new Date();
    return Array.from({ length: parts }, (_, i) => {
      const d = new Date(today); 
      d.setMonth(d.getMonth() + i);
      return { 
        inst: i + 1, 
        amt: Math.round((grand / parts) * 100) / 100, 
        due: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) 
      };
    });
  }, []);

  useEffect(() => {
    setForm(p => ({
      ...p,
      emiData: buildEMI(p.payment.grand, p.plan, p.customN)
    }));
  }, [form.payment.grand, form.plan, form.customN, buildEMI]);

  const onPayChange = (k: string, v: string) => {
    setForm(p => {
      const updatedPay = calculateTotals({ ...p.payment, [k]: v });
      return { ...p, payment: updatedPay };
    });
  };


  const TxnFields = ({ method, txn, setTxn }: any) => {
    const upd = (k: string, v: string) => setTxn((p: any) => ({ ...p, [k]: v }));
    if (method === "upi")
      return (
        <div className="space-y-4 pt-2">
          <Field label="UPI transaction ID">
            <input 
              className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
              placeholder="e.g. 320240001234567" 
              value={txn.upiTxn || ""} 
              onChange={(e) => upd("upiTxn", e.target.value)} 
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="UPI app">
              <select 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                value={txn.upiApp || "Google Pay"} 
                onChange={(e) => upd("upiApp", e.target.value)}
              >
                {["Google Pay", "PhonePe", "Paytm", "BHIM", "Other"].map((a) => <option key={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Payment date">
              <input 
                type="date" 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                value={txn.upiDate || todayISO()} 
                onChange={(e) => upd("upiDate", e.target.value)} 
              />
            </Field>
          </div>
        </div>
      );
    if (method === "card")
      return (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Card type">
              <select 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                value={txn.cardType || "Debit card"} 
                onChange={(e) => upd("cardType", e.target.value)}
              >
                <option>Debit card</option><option>Credit card</option>
              </select>
            </Field>
            <Field label="Last 4 digits">
              <input 
                maxLength={4} 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                placeholder="XXXX" 
                value={txn.cardLast4 || ""} 
                onChange={(e) => upd("cardLast4", e.target.value)} 
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Bank name">
              <input 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                placeholder="e.g. HDFC Bank" 
                value={txn.cardBank || ""} 
                onChange={(e) => upd("cardBank", e.target.value)} 
              />
            </Field>
            <Field label="Approval code">
              <input 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                placeholder="Auth code" 
                value={txn.cardApproval || ""} 
                onChange={(e) => upd("cardApproval", e.target.value)} 
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Terminal ID">
              <input 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                placeholder="Terminal ID" 
                value={txn.cardTerminal || ""} 
                onChange={(e) => upd("cardTerminal", e.target.value)} 
              />
            </Field>
            <Field label="Transaction date">
              <input 
                type="date" 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                value={txn.cardDate || todayISO()} 
                onChange={(e) => upd("cardDate", e.target.value)} 
              />
            </Field>
          </div>
        </div>
      );
    if (method === "cash")
      return (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount received (₹)">
              <input 
                type="number" 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                placeholder="0" 
                value={txn.cashAmt || ""} 
                onChange={(e) => upd("cashAmt", e.target.value)} 
              />
            </Field>
            <Field label="Receipt date">
              <input 
                type="date" 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                value={txn.cashDate || todayISO()} 
                onChange={(e) => upd("cashDate", e.target.value)} 
              />
            </Field>
          </div>
          <Field label="Received by">
            <input 
              className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
              placeholder="Staff name" 
              value={txn.cashBy || ""} 
              onChange={(e) => upd("cashBy", e.target.value)} 
            />
          </Field>
        </div>
      );
    if (method === "cheque")
      return (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cheque number">
              <input 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                placeholder="000123" 
                value={txn.chequeNo || ""} 
                onChange={(e) => upd("chequeNo", e.target.value)} 
              />
            </Field>
            <Field label="Bank name">
              <input 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                placeholder="Issuing bank" 
                value={txn.chequeBank || ""} 
                onChange={(e) => upd("chequeBank", e.target.value)} 
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cheque date">
              <input 
                type="date" 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                value={txn.chequeDate || todayISO()} 
                onChange={(e) => upd("chequeDate", e.target.value)} 
              />
            </Field>
            <Field label="IFSC code">
              <input 
                className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                placeholder="ABCD0001234" 
                value={txn.chequeIFSC || ""} 
                onChange={(e) => upd("chequeIFSC", e.target.value)} 
              />
            </Field>
          </div>
          <Field label="Account holder name">
            <input 
              className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
              placeholder="Name on cheque" 
              value={txn.chequeHolder || ""} 
              onChange={(e) => upd("chequeHolder", e.target.value)} 
            />
          </Field>
        </div>
      );
    return null;
  };

  const PLANS = [
    { n: 1, label: "1×", sub: "One-time" },
    { n: 2, label: "2×", sub: "Monthly" },
    { n: 3, label: "3×", sub: "Monthly" },
    { n: 6, label: "6×", sub: "Monthly" },
    { n: 12, label: "12×", sub: "Monthly" },
    { n: "custom", label: "Custom", sub: "Manual" },
  ];

  const METHODS = [
    { id: "upi", label: "UPI" },
    { id: "card", label: "Card" },
    { id: "cash", label: "Cash" },
    { id: "cheque", label: "Cheque" },
  ];

  const STATUSES = [
    { id: "full", label: "Full Clear", color: "emerald" },
    { id: "emi", label: "Instalments", color: "amber" },
    { id: "pending", label: "Pending", color: "rose" },
  ];

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="bg-gray-50/30">
      <div className="px-6 py-6 pb-24">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            {/* Institute Section */}
            <SectionCard title="Branding" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Institute name">
                  <input 
                    className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                    placeholder="Adhyayan" 
                    value={form.institute.name} 
                    onChange={(e) => updInst("name", e.target.value)} 
                  />
                </Field>
                <Field label="Address / Tagline">
                  <input 
                    className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                    placeholder="City | Contact" 
                    value={form.institute.address} 
                    onChange={(e) => updInst("address", e.target.value)} 
                  />
                </Field>
              </div>
            </SectionCard>

            {/* Student Section */}
            {!isTemplateMode && (
              <SectionCard title="Student Information" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Student name">
                    <input 
                      readOnly
                      className="w-full bg-gray-100/50 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed border"
                      value={form.student.name} 
                    />
                  </Field>
                  <Field label="Enrolment ID">
                    <input 
                      readOnly
                      className="w-full bg-gray-100/50 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed border"
                      value={form.student.enrolId} 
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Field label="Course">
                    <input 
                      className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                      placeholder="e.g. Graphic Design" 
                      value={form.student.course} 
                      onChange={(e) => updStu("course", e.target.value)} 
                    />
                  </Field>
                  <Field label="Session">
                    <input 
                      className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                      placeholder="2024-25" 
                      value={form.student.session} 
                      onChange={(e) => updStu("session", e.target.value)} 
                    />
                  </Field>
                  <Field label="Contact">
                    <input 
                      className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                      placeholder="Phone or Email" 
                      value={form.student.contact} 
                      onChange={(e) => updStu("contact", e.target.value)} 
                    />
                  </Field>
                </div>
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl mt-4 cursor-pointer hover:bg-white transition-colors"
                  onClick={() => updStu("readmission", !form.student.readmission)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl border flex items-center justify-center transition-all ${form.student.readmission ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-400'}`}>
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-700">Re-admission Case</div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Existing student return</div>
                    </div>
                  </div>
                  {form.student.readmission && <Badge type="readmission" />}
                </div>
              </SectionCard>
            )}

            {/* Payment Breakdown */}
            <SectionCard title="Fee breakdown" icon={CreditCard}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Total base fee (₹)">
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200 font-medium"
                    placeholder="0" 
                    value={form.payment.fee} 
                    onChange={(e) => onPayChange("fee", e.target.value)} 
                  />
                </Field>
                <Field label="GST (%)">
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                    placeholder="0" 
                    value={form.payment.gstPct} 
                    onChange={(e) => onPayChange("gstPct", e.target.value)} 
                  />
                </Field>
                <Field label="GST amount (₹)">
                  <div className="w-full bg-info-50/30 border border-info-100 text-info-700 rounded-xl px-4 py-3 text-sm font-bold h-[46px] flex items-center">
                    ₹{fmtMoney(form.payment.gstAmt)}
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field label="Discount (₹)">
                  <input 
                    type="number" 
                    className="w-full bg-emerald-50/30 border-emerald-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none border focus:border-emerald-200 text-emerald-700 font-bold"
                    placeholder="0" 
                    value={form.payment.discount} 
                    onChange={(e) => onPayChange("discount", e.target.value)} 
                  />
                </Field>
                <Field label="Net total payable (₹)">
                  <div className="w-full bg-indigo-600 border border-indigo-700 text-white rounded-xl px-4 py-3 text-sm font-bold h-[46px] flex items-center justify-between shadow-lg shadow-indigo-500/20">
                    <span className="text-[10px] uppercase opacity-70 tracking-widest font-black">Grand Total</span>
                    <span>₹{fmtMoney(form.payment.grand)}</span>
                  </div>
                </Field>
              </div>
            </SectionCard>

            {/* Payment Plan */}
            <SectionCard title="Payment Plan" icon={Calendar}>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PLANS.map((p) => (
                  <button 
                    key={p.n} 
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${form.plan === p.n ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105 z-10' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-600'}`}
                    onClick={() => setForm(prev => ({ ...prev, plan: p.n }))}
                  >
                    <div className="text-sm font-black">{p.label}</div>
                    <div className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${form.plan === p.n ? 'text-indigo-100' : 'text-gray-400'}`}>{p.sub}</div>
                  </button>
                ))}
              </div>
              
              {form.plan === "custom" && (
                <div className="mt-6">
                  <Field label="Number of instalments">
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        min="1" max="24" 
                        className="flex-1 bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200"
                        placeholder="e.g. 4" 
                        value={form.customN} 
                        onChange={(e) => setForm(prev => ({ ...prev, customN: e.target.value }))} 
                      />
                      <div className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Manual</div>
                    </div>
                  </Field>
                </div>
              )}

              {form.emiData.length > 1 && (
                <div className="mt-8">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-100"></div>
                    Instalment Schedule
                    <div className="h-px flex-1 bg-gray-100"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {form.emiData.map((r) => (
                      <div key={r.inst} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 text-xs hover:bg-white hover:border-indigo-100 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="size-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-colors">
                            {r.inst}
                          </div>
                          <span className="font-medium text-gray-600">{r.due}</span>
                        </div>
                        <span className="font-bold text-gray-900 font-mono">₹{fmtMoney(r.amt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Payment Method */}
            <SectionCard title="Payment Method" icon={CreditCard}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {METHODS.map((m) => (
                  <button 
                    key={m.id} 
                    className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${form.method === m.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200 hover:bg-gray-50'}`}
                    onClick={() => setForm((p) => ({ ...p, method: m.id }))}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <TxnFields method={form.method} txn={form.txn} setTxn={(fn: any) => setForm((p) => ({ ...p, txn: typeof fn === "function" ? fn(p.txn) : fn }))} />
            </SectionCard>

            {/* Status & Remarks */}
            <SectionCard title="Status & Remarks" icon={FileText}>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {STATUSES.map((s) => (
                  <button 
                    key={s.id} 
                    className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-[0.15em] transition-all ${form.status === s.id ? `bg-${s.color}-600 border-${s.color}-600 text-white shadow-lg shadow-${s.color}-500/20` : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                    onClick={() => setForm((p) => ({ ...p, status: s.id }))}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <Field label="Remarks (Internal notes)">
                <textarea 
                  rows={3} 
                  className="w-full bg-gray-50/50 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border focus:border-indigo-200 resize-none"
                  placeholder="Any specific notes about this transaction or student request..." 
                  value={form.remarks} 
                  onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} 
                />
              </Field>
            </SectionCard>
          </div>

          {/* Sticky Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 backdrop-blur-xl border border-slate-700/50">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 drop-shadow-md">Payment Snapshot</div>
                <div className="text-4xl font-black mb-10 flex items-baseline gap-1">
                  <span className="text-xl text-slate-400">₹</span>
                  <span className="tracking-tighter drop-shadow-lg">{fmtMoney(form.payment.grand)}</span>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Base Fee</span>
                    <span className="font-bold tracking-tight">₹{fmtMoney(form.payment.fee || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">GST ({form.payment.gstPct}%)</span>
                    <span className="font-bold tracking-tight">₹{fmtMoney(form.payment.gstAmt)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-5 border-t border-slate-700/50">
                    <span className="text-slate-400 font-medium">Discount</span>
                    <span className="font-bold text-emerald-400 tracking-tight">− ₹{fmtMoney(form.payment.discount || 0)}</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Status</span>
                    <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-500/30 shadow-inner">
                      {form.status === 'full' ? 'Full Paid' : form.status === 'partial' ? 'Partial' : 'Unpaid'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Plan</span>
                    <span className="text-xs font-bold text-slate-200 tracking-wide">
                      {form.plan === 1 ? 'One-time' : `${form.plan} Instalments`}
                    </span>
                  </div>
                </div>

                <div className="mt-10 space-y-3">
                  <button 
                    onClick={handleSave}
                    className="w-full bg-white text-slate-900 rounded-xl py-4 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10">{isTemplateMode ? 'Save Template' : 'Generate Invoice'}</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform relative z-10" />
                  </button>
                  {onCancel && (
                    <button 
                      onClick={onCancel}
                      className="w-full bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl py-3.5 font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>

              {/* Tips / Info */}
              <div className="mt-6 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <div className="flex gap-3">
                  <div className="size-10 rounded-2xl bg-white border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Pro Tip</div>
                    <p className="text-[11px] leading-relaxed text-amber-800/70 mt-1 font-medium italic">
                      "All invoices are automatically converted to professional PDF format once generated."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
