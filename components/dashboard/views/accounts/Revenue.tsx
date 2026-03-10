"use client";

import {
  TrendingUpIcon,
  TrendingDownIcon,
  CreditCardIcon,
  FileTextIcon,
  FilterIcon,
  DownloadIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from "lucide-react";

const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const collectionData = [3.2, 3.8, 4.1, 3.9, 4.25, 4.6];
const maxVal = Math.max(...collectionData);

const transactions = [
  { id: "INV-0156", student: "Arjun Sharma", batch: "Alpha Advanced", amount: "₹45,000", date: "10 Mar 2026", status: "Cleared" },
  { id: "INV-0155", student: "Priya Mehta", batch: "Gamma Regular", amount: "₹22,500", date: "09 Mar 2026", status: "Cleared" },
  { id: "INV-0154", student: "Rohan Das", batch: "Beta Advanced", amount: "₹45,000", date: "09 Mar 2026", status: "Pending" },
  { id: "INV-0153", student: "Sneha Iyer", batch: "Alpha Advanced", amount: "₹33,750", date: "08 Mar 2026", status: "Cleared" },
  { id: "INV-0152", student: "Kunal Bose", batch: "Gamma Regular", amount: "₹22,500", date: "07 Mar 2026", status: "Overdue" },
  { id: "INV-0151", student: "Nandini Roy", batch: "New Joinee", amount: "₹5,000", date: "06 Mar 2026", status: "Cleared" },
];

export function AccountsRevenue() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Live Financial Feed
          </div>
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Revenue & Payments</h1>
          <p className="text-gray-500 font-medium">Detailed fee collections, invoicing, and batch-wise financial tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <FilterIcon className="size-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">
            <DownloadIcon className="size-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Collected", value: "₹4,25,000", change: "+12%", positive: true, icon: TrendingUpIcon, color: "emerald" },
          { label: "Outstanding", value: "₹82,400", change: "-3 accounts", positive: false, icon: TrendingDownIcon, color: "rose" },
          { label: "Invoices Issued", value: "156", change: "+14 today", positive: true, icon: FileTextIcon, color: "blue" },
          { label: "Avg. Transaction", value: "₹12.5k", change: "+₹1.2k avg", positive: true, icon: CreditCardIcon, color: "indigo" },
        ].map((k, i) => (
          <div key={i} className={`bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/30 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${k.color}-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
              <div className={`size-12 bg-${k.color}-50 text-${k.color}-600 rounded-2xl flex items-center justify-center mb-5 border border-${k.color}-100/30`}>
                <k.icon className="size-5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{k.label}</p>
              <p className="text-2xl font-black text-gray-900 font-urbanist">{k.value}</p>
              <div className={`flex items-center gap-1 mt-2 text-[10px] font-black ${k.positive ? "text-emerald-500" : "text-rose-500"}`}>
                {k.positive ? <ArrowUpRightIcon className="size-3" /> : <ArrowDownRightIcon className="size-3" />}
                {k.change} from last month
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/20">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight">Monthly Collection Trend</h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">₹ Lakhs</span>
          </div>
          <div className="flex items-end gap-4 h-48">
            {collectionData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <span className="text-[10px] font-black text-gray-400">{val}L</span>
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-teal-400 transition-colors cursor-pointer shadow-lg shadow-emerald-100"
                  style={{ height: `${(val / maxVal) * 100}%`, minHeight: "16px" }}
                />
                <span className="text-[10px] font-black text-gray-400 uppercase">{months[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
            <TrendingUpIcon className="size-4 text-emerald-500" />
            <span className="text-sm font-bold text-gray-700">Revenue up <span className="text-emerald-600 font-black">34%</span> over the last 6 months</span>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/20 flex flex-col">
          <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight mb-8">Fee Breakdown</h3>
          <div className="space-y-8 flex-1">
            {[
              { label: "Tuition Fees", amount: "₹3,48,500", pct: 82, color: "emerald" },
              { label: "Registration Fees", amount: "₹51,000", pct: 12, color: "blue" },
              { label: "Other Dues", amount: "₹25,500", pct: 6, color: "amber" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-900">{item.label}</span>
                  <span className={`text-xs font-black text-${item.color}-600`}>{item.amount}</span>
                </div>
                <div className={`w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-${item.color}-100/30`}>
                  <div
                    className={`h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transition-all duration-1000`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{item.pct}% of total</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Progress</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-emerald-400">₹4.25L</span>
              <span className="text-sm text-slate-500 mb-1">/ 5.00L</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/20 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight">Recent Transactions</h3>
          <button className="text-[10px] text-emerald-600 font-black uppercase tracking-widest border border-emerald-100 bg-emerald-50 px-5 py-2 rounded-xl hover:bg-emerald-100 transition-all">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="text-left pb-5 pr-6">Invoice ID</th>
                <th className="text-left pb-5 pr-6">Student</th>
                <th className="text-left pb-5 pr-6">Batch</th>
                <th className="text-left pb-5 pr-6">Amount</th>
                <th className="text-left pb-5 pr-6">Date</th>
                <th className="text-left pb-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 pr-6 font-black text-gray-900 text-sm">{t.id}</td>
                  <td className="py-5 pr-6 font-bold text-gray-700 text-sm">{t.student}</td>
                  <td className="py-5 pr-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.batch}</td>
                  <td className="py-5 pr-6 font-black text-gray-900 text-sm">{t.amount}</td>
                  <td className="py-5 pr-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.date}</td>
                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      t.status === "Cleared"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : t.status === "Pending"
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic mx-auto block w-fit shadow-xl shadow-emerald-100">
          Note: All figures shown are mock data for demonstration
        </div>
      </div>
    </div>
  );
}
