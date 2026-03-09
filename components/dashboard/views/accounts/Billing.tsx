"use client";

import { FileTextIcon, SaveIcon, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react";

export function BillingTemplate() {
  const templates = [
    { name: "Quarterly Regular Fees", batch: "General", discount: "0%", total: "₹45,000", status: "Active", color: "blue" },
    { name: "Scholarship Batch A", batch: "Alpha Advanced", discount: "25%", total: "₹33,750", status: "Active", color: "emerald" },
    { name: "Registration Only", batch: "New Joinees", discount: "N/A", total: "₹5,000", status: "Draft", color: "amber" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Billing Templates</h1>
          <p className="text-gray-500 font-medium">Configure automated financial structures and scholarship models</p>
        </div>
        <button className="bg-gray-900 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all flex items-center gap-3">
            <PlusIcon className="size-5" />
            New Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Active Registry</h3>
                  <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              
              <div className="space-y-4">
                {templates.map((t, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/30 flex items-center justify-between group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${t.color}-50/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`} />
                        
                        <div className="flex items-center gap-6 relative z-10">
                            <div className={`size-16 bg-${t.color}-50 text-${t.color}-600 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-${t.color}-100/20 group-hover:rotate-6 transition-transform duration-500`}>
                                <FileTextIcon className="size-7" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-black text-gray-900 font-urbanist">{t.name}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.batch}</span>
                                    <div className="size-1 bg-gray-200 rounded-full" />
                                    <span className={`text-[10px] font-black text-${t.color}-600 uppercase tracking-widest bg-${t.color}-50 px-2 py-0.5 rounded-full`}>{t.discount} Discount</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                            <button className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm"><EyeIcon className="size-5" /></button>
                            <button className="p-3 bg-gray-100 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all shadow-sm"><Trash2Icon className="size-5" /></button>
                        </div>
                    </div>
                ))}
              </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-100 relative overflow-hidden flex flex-col h-full ring-8 ring-gray-50/50">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-40" />
              
              <div className="flex items-start justify-between mb-12 relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight italic">Template Config</h3>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Integrated Ledger</p>
                  </div>
                  <div className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                    <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live Sync
                  </div>
              </div>

              <div className="space-y-8 flex-1 relative z-10">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Structural Variant Name</label>
                      <input type="text" defaultValue="Quarterly Regular Fees" className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 transition-all font-black text-gray-900 placeholder:text-gray-300 shadow-inner" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Basis Ledger (₹)</label>
                          <input type="number" defaultValue="45000" className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 transition-all font-black text-gray-900 shadow-inner" />
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Tenure Logic</label>
                          <div className="relative">
                            <select className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 transition-all font-black text-gray-900 appearance-none shadow-inner cursor-pointer">
                                <option>03 Months</option>
                                <option>06 Months</option>
                                <option>12 Months</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                <PlusIcon className="size-4 rotate-45" />
                            </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                        
                        <div className="relative z-10 space-y-5">
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest opacity-60">
                                <span>Ledger Subtotal</span>
                                <span>₹45,000.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest opacity-60">
                                <span>Calculated GST (18%)</span>
                                <span>₹8,100.00</span>
                            </div>
                            <div className="pt-6 border-t border-white/20 flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Total Obligation</span>
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 bg-emerald-400 rounded-full" />
                                        <p className="text-3xl font-black font-urbanist tracking-tighter">₹53,100.00</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer border border-white/10">
                                    < EyeIcon className="size-4" />
                                </div>
                            </div>
                        </div>
                  </div>
              </div>

              <button className="w-full mt-12 py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-4 group">
                  <div className="size-8 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <SaveIcon className="size-4" />
                  </div>
                  Commit Template
              </button>
          </div>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic mx-auto block w-fit shadow-xl shadow-gray-100">
          Note: Structural financial data for demonstration
        </div>
      </div>
    </div>
  );
}
