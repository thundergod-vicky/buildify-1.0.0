"use client";

import { UsersIcon, CreditCardIcon, FileTextIcon, TrendingUpIcon } from "lucide-react";
import StatCard from "../../stat-card";

export function AccountsHome() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-16 -mb-16 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-black uppercase tracking-[0.2em]">
              <div className="size-2 bg-emerald-300 rounded-full animate-pulse" />
              Financial Monitor
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-urbanist leading-tight">
              Revenue <br />
              <span className="text-emerald-100">& Audit Center</span>
            </h1>
            <p className="text-emerald-50/80 text-lg max-w-md font-medium leading-relaxed">
              Consolidated financial tracking of all platform transactions, fee collections, and batch-wise billing alerts.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-xl p-8 min-w-[280px]">
              <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Monthly Collection</span>
                  <div className="flex items-center gap-1 text-emerald-300">
                      <TrendingUpIcon className="size-4" />
                      <span className="text-xs font-bold">+12%</span>
                  </div>
              </div>
              <div className="space-y-1">
                  <span className="text-sm font-medium opacity-80 italic">Current Target Progress</span>
                  <div className="flex items-end gap-2">
                       <span className="text-4xl font-black">₹4.25L</span>
                       <span className="text-sm font-bold opacity-40 mb-1">/ 5.00L</span>
                  </div>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
              </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Outstanding"
          value="₹82,400"
          icon={CreditCardIcon}
          trend="12 accounts pending"
          trendType="negative"
          colorClass="bg-red-50 text-red-600 border border-red-100/50"
        />
        <StatCard
          title="Successful Invoices"
          value="156"
          icon={FileTextIcon}
          trend="+14 today"
          trendType="positive"
          colorClass="bg-blue-50 text-blue-600 border border-blue-100/50"
        />
        <StatCard
          title="Avg. Transaction"
          value="₹12.5k"
          icon={TrendingUpIcon}
          trend="+₹1.2k avg"
          trendType="positive"
          colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100/50"
        />
        <StatCard
          title="Active Customers"
          value="242"
          icon={UsersIcon}
          trend="82% retention"
          trendType="positive"
          colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight">Recent Financial Activity</h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all border border-emerald-100">Live Stream</button>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-emerald-200 hover:bg-white hover:shadow-lg transition-all duration-300 group/txn">
                            <div className="flex items-center gap-5">
                                <div className="size-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover/txn:scale-110 transition-transform duration-500 text-emerald-600">
                                    <CreditCardIcon className="size-6" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-900">Payment ID #ST{100 + i}</p>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Automated Receipt {4420 + i}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-gray-900">₹12,500</p>
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Cleared</span>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
              <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-2xl font-black text-gray-900 font-urbanist tracking-tight mb-8">Collection Distribution</h3>
                  
                  <div className="space-y-10 flex-1">
                      {[
                        { label: "Tuition Fees", percentage: 82, color: "emerald" },
                        { label: "Registration Fees", percentage: 12, color: "blue" },
                        { label: "Other Dues", percentage: 6, color: "rose" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-gray-900">{item.label}</span>
                            <span className={`text-xs font-black text-${item.color}-600`}>{item.percentage}%</span>
                          </div>
                          <div className={`w-full h-3 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-${item.color}-100/50`}>
                            <div 
                              className={`h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transition-all duration-1000`} 
                              style={{ width: `${item.percentage}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-10 p-8 bg-black rounded-[2.5rem] text-white shadow-2xl shadow-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                          <TrendingUpIcon className="size-4 text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Projection</span>
                      </div>
                      <p className="text-xl font-bold font-urbanist leading-snug">Expected collection <br /><span className="text-emerald-400">₹5,10,000+</span> for Nov.</p>
                      <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose">
                        Based on current batch signups and automated billing cycles.
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic mx-auto block w-fit shadow-xl shadow-emerald-200">
          Note: This is mock financial data for demonstration
        </div>
      </div>
    </div>
  );
}
