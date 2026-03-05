"use client";

import React from "react";
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";

export default function FeeDepositionPage() {
  const modes = [
    {
      id: "01",
      title: "Online Payment",
      description: "Deposit the fee through Net Banking / Debit Card / Credit Card / UPI facility.",
      extra: "No Extra Charges",
      icon: <Wallet className="w-6 h-6" />,
      color: "bg-indigo-600",
      accent: "text-green-600"
    },
    {
      id: "02",
      title: "RTGS / NEFT Transfer",
      description: "Pay through RTGS / NEFT. Bank account details will be provided on request.",
      extra: "Secure Bank Transfer",
      icon: <Building2 className="w-6 h-6" />,
      color: "bg-blue-600",
      accent: "text-blue-600"
    },
    {
      id: "03",
      title: "Cash Deposition in Bank",
      description: "Deposit the fee in cash at any Branch of ICICI Bank after downloading the Fee Challan from our website.",
      extra: "Bank Charges Applicable",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-amber-500",
      accent: "text-red-500",
      isWarning: true
    },
    {
      id: "04",
      title: "Card Payment at Office",
      description: "Deposit the fee at any Center office by swiping Credit Card / Debit Card.",
      extra: "No Extra Charges",
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-emerald-600",
      accent: "text-green-600"
    },
    {
      id: "05",
      title: "CTS Cheque Payment",
      description: "Deposit the fee through a single crossed CTS Cheque of the requisite amount, either sent via post / courier or submitted by hand at our office.",
      extra: "Standard Processing",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-teal-600",
      accent: "text-teal-600",
      fullWidth: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 🔹 Hero Section */}
      <section className="relative bg-[#183d95] py-16 md:py-24 overflow-hidden px-6">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[-50%] right-[-10%] width-[40%] height-[200%] bg-gradient-to-br from-blue-600/10 to-blue-500/5 rotate-[15deg] z-1 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <AnimatedContent>
            <h1 className="text-4xl md:text-5xl font-black text-white italic">
              Fee <span className="text-[#faa819]">Deposition</span>
            </h1>
            <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              We offer multiple secure and transparent payment options for your convenience. Choose the method that suits you best.
            </p>
          </AnimatedContent>
        </div>
      </section>

      {/* 🔹 Modes Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden px-6">
        {/* Background blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-10">
            {modes.map((mode, index) => (
              <AnimatedContent 
                key={index} 
                delay={index * 100} 
                className={mode.fullWidth ? 'md:col-span-2' : ''}
              >
                <div className="group h-full relative bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className={`absolute -top-5 -left-5 w-14 h-14 rounded-2xl ${mode.color} text-white flex items-center justify-center font-black text-xl shadow-xl transition-transform duration-300 group-hover:rotate-12`}>
                    {mode.id}
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${mode.color} shadow-inner`}>
                      {mode.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 font-primary">
                      {mode.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {mode.description}
                  </p>

                  <div className={`inline-flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-full ${
                    mode.isWarning ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {mode.isWarning ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {mode.extra}
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>

          <AnimatedContent delay={500}>
            <div className="mt-16 text-center">
              <p className="text-gray-500 mb-6">Have questions regarding fee deposition?</p>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-[#2945aa] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1e3282] transition-all shadow-xl hover:scale-105"
              >
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </AnimatedContent>
        </div>
      </section>
    </div>
  );
}
