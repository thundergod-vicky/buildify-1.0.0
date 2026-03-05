"use client";

import AnimatedContent from "@/components/animated-content";
import { InfoIcon } from "lucide-react";

export default function RefundRulesPage() {
    return (
        <main className="min-h-screen pb-20 bg-gray-50">
            {/* Header Section */}
            <section className="bg-blue-900 relative overflow-hidden py-24 md:py-32">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div
                    className="absolute -top-1/2 -right-[10%] w-[40%] h-[200%] rotate-15 z-0"
                    style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)' }}
                ></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white font-urbanist">
                            Refund <span className="text-yellow-500 italic">Policy</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            Conducted under strict guidelines to ensure fairness and equal opportunity.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-4xl mx-auto my-16 px-6 relative z-20">
                <AnimatedContent className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-white text-center font-urbanist">
                            Refund Rules
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10">
                        <ul className="space-y-6 text-gray-700 text-lg">

                            <li className="flex gap-5 items-start">
                                <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-black font-urbanist text-xl">
                                    1
                                </span>
                                <div className="mt-1 shadow-sm border border-gray-50 rounded-xl p-4 w-full bg-gray-50/50">
                                    <span className="font-bold text-slate-800">Class commencement date:</span>
                                    <span className="ml-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md font-semibold text-sm">02/04/2026</span>
                                </div>
                            </li>

                            <li className="flex gap-5 items-start">
                                <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-black font-urbanist text-xl">
                                    2
                                </span>
                                <div className="mt-1 shadow-sm border border-gray-50 rounded-xl p-4 w-full bg-gray-50/50">
                                    <span className="font-bold text-slate-800">Last refund date:</span>
                                    <span className="ml-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md font-semibold text-sm">01/05/2026</span>
                                </div>
                            </li>

                            <li className="flex gap-5 items-start">
                                <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 font-black font-urbanist text-xl">
                                    3
                                </span>
                                <div className="mt-1 shadow-sm border border-red-100 rounded-xl p-4 w-full bg-red-50/30">
                                    <p className="text-red-600 font-semibold">
                                        No refund shall be made for admission fees under any circumstances.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-5 items-start">
                                <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-600 font-black font-urbanist text-xl">
                                    4
                                </span>
                                <div className="mt-1 shadow-sm border border-orange-100 rounded-xl p-4 w-full bg-orange-50/30">
                                    <p className="font-medium text-orange-900 leading-relaxed">
                                        Refunds requested within <span className="font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">30 days</span> of class commencement shall be
                                        subject to a <span className="font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">35% deduction</span> of the total tuition fees.
                                    </p>
                                </div>
                            </li>

                        </ul>
                    </div>

                    {/* Footer Note */}
                    <div className="bg-slate-50 px-8 py-5 text-sm text-slate-600 border-t border-gray-100 flex items-center gap-3">
                        <InfoIcon className="size-5 text-blue-500 shrink-0" />
                        <p><strong>Note:</strong> Please ensure refund requests are submitted within the eligible period.</p>
                    </div>

                </AnimatedContent>
            </section>
        </main>
    );
}
