"use client";

import { SearchIcon, BellIcon, FilterIcon } from "lucide-react";

export function StudentDetails() {
  const students = [
    { name: "Rahul Sharma", id: "ST-001", batch: "Batch Alpha", total: "₹45,000", paid: "₹45,000", due: "₹0", status: "Paid", color: "emerald" },
    { name: "Priya Singh", id: "ST-002", batch: "Batch Beta", total: "₹45,000", paid: "₹30,000", due: "₹15,000", status: "Partial", color: "amber" },
    { name: "Arjun Verma", id: "ST-003", batch: "Batch Alpha", total: "₹45,000", paid: "₹0", due: "₹45,000", status: "Overdue", color: "rose" },
    { name: "Sneha Gupta", id: "ST-004", batch: "Batch Gamma", total: "₹35,000", paid: "₹35,000", due: "₹0", status: "Paid", color: "emerald" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Student Accounts</h1>
          <p className="text-gray-500 font-medium">Real-time tracking of institutional receivables and payment latency</p>
        </div>
        <div className="flex gap-4">
             <div className="relative group">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                <input type="text" placeholder="Find student..." className="pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-100 transition-all font-black text-xs uppercase tracking-widest shadow-sm w-64" />
            </div>
            <button className="p-5 bg-white border border-gray-100 rounded-[1.5rem] text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                <FilterIcon className="size-5" />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-100/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/20 border-b border-gray-100">
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Student Identity</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Ledger Balance</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Paid Amount</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Due Obligation</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center">Protocol Status</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right">Engagement</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {students.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-all duration-500 group">
                            <td className="px-10 py-8">
                                <div className="flex items-center gap-6">
                                    <div className={`size-14 bg-${s.color}-50 text-${s.color}-600 rounded-[1.25rem] flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        {s.name[0]}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-gray-900 font-urbanist text-lg">{s.name}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.id}</span>
                                            <div className="size-1 bg-gray-200 rounded-full" />
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{s.batch}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-8">
                                <span className="font-black text-gray-900 text-base font-mono tracking-tighter">{s.total}</span>
                            </td>
                            <td className="px-10 py-8 text-emerald-600">
                                <span className="font-black text-base font-mono tracking-tighter">{s.paid}</span>
                            </td>
                            <td className="px-10 py-8 text-rose-600">
                                <span className="font-black text-base font-mono tracking-tighter">{s.due}</span>
                            </td>
                            <td className="px-10 py-8 text-center">
                                 <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.25em] shadow-sm ${
                                    s.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                    s.status === 'Partial' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    'bg-rose-50 text-rose-600 border border-rose-100'
                                }`}>{s.status}</span>
                            </td>
                            <td className="px-10 py-8 text-right">
                                <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm">
                                    <BellIcon className="size-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic mx-auto block w-fit shadow-xl shadow-gray-100">
          Note: Structural financial records for demonstration
        </div>
      </div>
    </div>
  );
}
