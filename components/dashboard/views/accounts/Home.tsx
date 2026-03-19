"use client";

import { useState, useEffect } from "react";
import {
  IndianRupeeIcon,
  UsersIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  BellIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-react";
import { api } from "@/lib/api";

export function AccountsHome() {
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token") || "";
    
    api
      .get<any[]>("/users/students", token)
      .then((d) => setStudentCount(d.length))
      .catch(() => setStudentCount(null));

    api
      .get<any>("/billing/summary", token)
      .then((d) => setSummary(d))
      .catch(() => setSummary(null));

    api
      .get<any[]>("/billing/invoices", token)
      .then((d) => setRecentInvoices(d.slice(0, 4)))
      .catch(() => setRecentInvoices([]));
  }, []);

  const alerts = recentInvoices.map(inv => ({
    label: `Invoice ${inv.invoiceNumber} — ${inv.status}`,
    type: inv.status === "PAID" ? "success" : inv.status === "PENDING" ? "warning" : "critical",
    time: new Date(inv.createdAt).toLocaleDateString()
  }));

  if (alerts.length === 0) {
    alerts.push({ label: "No recent invoicing activity", type: "warning", time: "Now" });
  }

  const quickActions = [
    { label: "View Revenue", icon: TrendingUpIcon, view: "revenue", color: "emerald" },
    { label: "Student Details", icon: UsersIcon, view: "student-details", color: "blue" },
    { label: "Billing Templates", icon: IndianRupeeIcon, view: "billing", color: "indigo" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-64 -mt-64 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full -ml-20 -mb-20 blur-[60px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-black uppercase tracking-[0.2em]">
              <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
              Accounts Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-urbanist leading-tight">
              Good morning,{" "}
              <span className="text-emerald-400">Finance Team</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
              Here's a snapshot of today's financial health, pending actions, and key metrics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[300px]">
            {[
              { label: "Total Students", value: studentCount !== null ? studentCount.toString() : "...", color: "bg-white/5" },
              { label: "Outstanding", value: summary ? `₹${summary.outstandingAmount.toLocaleString()}` : "...", color: "bg-rose-500/10" },
              { label: "Cleared Today", value: summary ? `₹${summary.clearedTodayAmount.toLocaleString()}` : "...", color: "bg-emerald-500/10" },
              { label: "Invoices", value: summary ? summary.totalInvoices.toString() : "...", color: "bg-indigo-500/10" },
            ].map((s, i) => (
              <div key={i} className={`${s.color} backdrop-blur-md border border-white/10 rounded-[2rem] p-5 space-y-1`}>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-6 px-1">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((a, i) => (
            <button
              key={i}
              onClick={() => {
                window.history.pushState({}, "", `/dashboard?view=${a.view}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className={`group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 flex items-center gap-6 text-left`}
            >
              <div className={`size-16 bg-${a.color}-50 text-${a.color}-600 rounded-[1.75rem] flex items-center justify-center group-hover:rotate-6 transition-transform duration-500 border border-${a.color}-100/50`}>
                <a.icon className="size-7" />
              </div>
              <div className="flex-1">
                <p className="font-black text-gray-900 font-urbanist text-lg">{a.label}</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Open module →</p>
              </div>
              <ArrowRightIcon className={`size-5 text-${a.color}-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300`} />
            </button>
          ))}
        </div>
      </div>

      {/* Alerts + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Alerts */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight">Action Alerts</h3>
            <BellIcon className="size-5 text-gray-300" />
          </div>
          <div className="space-y-4">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-5 p-5 bg-gray-50/60 rounded-[2rem] border border-gray-100 hover:border-gray-200 hover:bg-white transition-all duration-300">
                <div className={`mt-1 shrink-0 size-5 ${a.type === "critical" ? "text-rose-500" : a.type === "success" ? "text-emerald-500" : "text-amber-500"}`}>
                  {a.type === "success" ? <CheckCircleIcon className="size-5" /> : a.type === "critical" ? <AlertCircleIcon className="size-5" /> : <ClockIcon className="size-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 leading-snug">{a.label}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Summary */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/20 flex flex-col">
          <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight mb-8">Monthly Summary</h3>
          <div className="space-y-8 flex-1">
            {[
              { label: "Total Collected", amount: "₹4,25,000", pct: 85, color: "emerald" },
              { label: "Pending / Outstanding", amount: "₹82,400", pct: 16, color: "rose" },
              { label: "Waivers / Scholarships", amount: "₹38,750", pct: 7, color: "amber" },
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-900">{item.label}</span>
                  <span className={`text-sm font-black text-${item.color}-600`}>{item.amount}</span>
                </div>
                <div className={`w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-${item.color}-100/30`}>
                  <div
                    className={`h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transition-all duration-1000`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Collection Rate</p>
            <p className="text-3xl font-black font-urbanist text-emerald-400">85% <span className="text-white text-lg">achieved</span></p>
            <p className="text-slate-500 text-[11px] font-medium mt-1">Target: ₹5,00,000 / Month</p>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic mx-auto block w-fit shadow-xl shadow-emerald-100">
          Note: Figures shown are mock data for demonstration
        </div>
      </div>
    </div>
  );
}
