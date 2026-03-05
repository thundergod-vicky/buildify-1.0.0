"use client";

import AnimatedContent from "@/components/animated-content";
import Link from "next/link";
import { 
    CheckCircle2Icon, 
    AwardIcon, 
    HandHeartIcon, 
    PercentIcon, 
    CalendarCheckIcon 
} from "lucide-react";

export default function AdmissionCounsellingPage() {
    return (
        <main className="min-h-screen pb-20">
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
                            Admission <span className="text-yellow-500 italic">Information</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            Your journey towards academic excellence starts here.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Admission Process */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedContent><h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 text-center mb-16 font-urbanist">Admission Process</h2></AnimatedContent>

                    <div className="grid md:grid-cols-4 gap-8">
                        <AnimatedContent delay={0.1} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="text-5xl font-black text-blue-200 mb-6 font-urbanist">01</div>
                            <h4 className="font-bold text-lg mb-3 text-slate-800">Inquiry & Registration</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Submit your inquiry form or visit our center for registration.
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="text-5xl font-black text-sky-200 mb-6 font-urbanist">02</div>
                            <h4 className="font-bold text-lg mb-3 text-slate-800">Counselling Session</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Personalized counselling to understand student goals.
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="text-5xl font-black text-yellow-200 mb-6 font-urbanist">03</div>
                            <h4 className="font-bold text-lg mb-3 text-slate-800">Eligibility Check</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Academic background and aptitude evaluation.
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.4} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="text-5xl font-black text-emerald-200 mb-6 font-urbanist">04</div>
                            <h4 className="font-bold text-lg mb-3 text-slate-800">Confirmation</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Fee submission & batch allocation confirmation.
                            </p>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Eligibility Criteria */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <AnimatedContent><h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 text-center mb-12 font-urbanist">Eligibility Criteria</h2></AnimatedContent>

                    <AnimatedContent delay={0.1} className="bg-gray-50 rounded-3xl p-10 shadow-sm border border-gray-100">
                        <ul className="space-y-6 text-gray-700">
                            <li className="flex gap-4 items-start">
                                <CheckCircle2Icon className="text-green-500 shrink-0 mt-0.5 size-6" />
                                <span className="text-lg font-medium">Students from Class VIII to XII (Science Stream)</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <CheckCircle2Icon className="text-green-500 shrink-0 mt-0.5 size-6" />
                                <span className="text-lg font-medium">Appearing / Passed students for JEE, NEET & Olympiads</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <CheckCircle2Icon className="text-green-500 shrink-0 mt-0.5 size-6" />
                                <span className="text-lg font-medium">Strong academic foundation & commitment to learning</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <CheckCircle2Icon className="text-green-500 shrink-0 mt-0.5 size-6" />
                                <span className="text-lg font-medium">Willingness to follow disciplined academic routine</span>
                            </li>
                        </ul>
                    </AnimatedContent>
                </div>
            </section>

            {/* Scholarship / Fee Assistance */}
            <section className="py-24 bg-blue-50">
                <div className="max-w-6xl mx-auto px-6">
                    <AnimatedContent><h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 text-center mb-16 font-urbanist">Scholarship & Fee Assistance</h2></AnimatedContent>

                    <div className="grid md:grid-cols-3 gap-8">
                        <AnimatedContent delay={0.1} className="bg-white p-10 rounded-3xl shadow-sm border border-white hover:border-blue-200 transition-colors">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                <AwardIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Merit-Based Scholarship</h4>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                Scholarships based on academic excellence & entrance test performance.
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2} className="bg-white p-10 rounded-3xl shadow-sm border border-white hover:border-blue-200 transition-colors">
                            <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-6 text-sky-600">
                                <HandHeartIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Financial Assistance</h4>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                Support for deserving students from economically weaker backgrounds.
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3} className="bg-white p-10 rounded-3xl shadow-sm border border-white hover:border-blue-200 transition-colors">
                            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 text-yellow-600">
                                <PercentIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Special Discounts</h4>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                Sibling discounts & early admission benefits available.
                            </p>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Book Counselling Session */}
            <section className="py-24 bg-gradient-to-r from-blue-700 to-blue-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]"></div>

                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <AnimatedContent>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 font-urbanist">Book a Counselling Session</h2>
                        <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-md">
                            Get expert guidance and clarity about courses, batches & career paths.
                        </p>
                        <Link href="/admission-form" className="inline-flex items-center justify-center gap-3 bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 active:scale-95 text-lg">
                            <CalendarCheckIcon className="size-5" />
                            Book Appointment / Admission
                        </Link>
                    </AnimatedContent>

                    <AnimatedContent delay={0.2} className="bg-white text-gray-800 p-10 rounded-3xl shadow-2xl">
                        <h4 className="font-bold text-2xl mb-6 text-blue-900 font-urbanist">Why Counselling?</h4>
                        <ul className="space-y-4 text-base font-medium">
                            <li className="flex items-center gap-3"><span className="text-blue-500 text-xl font-bold">✓</span> Personalized study plan</li>
                            <li className="flex items-center gap-3"><span className="text-blue-500 text-xl font-bold">✓</span> Course & batch guidance</li>
                            <li className="flex items-center gap-3"><span className="text-blue-500 text-xl font-bold">✓</span> Scholarship discussion</li>
                            <li className="flex items-center gap-3"><span className="text-blue-500 text-xl font-bold">✓</span> Parent interaction</li>
                        </ul>
                    </AnimatedContent>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6">
                    <AnimatedContent><h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 text-blue-900 font-urbanist">Frequently Asked Questions</h2></AnimatedContent>

                    <div className="space-y-4">
                        <AnimatedContent delay={0.1}>
                            <details className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="font-bold text-blue-900 text-lg flex justify-between items-center outline-none">
                                    What courses does Adhyayan offer?
                                    <span className="text-blue-600 group-open:rotate-45 transition-transform text-2xl font-light">+</span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed font-medium">
                                    We offer coaching for JEE (Main & Advanced), NEET, Olympiads and foundation courses.
                                </p>
                            </details>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2}>
                            <details className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="font-bold text-blue-900 text-lg flex justify-between items-center outline-none">
                                    Is scholarship available for all students?
                                    <span className="text-blue-600 group-open:rotate-45 transition-transform text-2xl font-light">+</span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed font-medium">
                                    Scholarships are merit-based and subject to eligibility criteria through our ADSAT test.
                                </p>
                            </details>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3}>
                            <details className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="font-bold text-blue-900 text-lg flex justify-between items-center outline-none">
                                    Can parents attend counselling?
                                    <span className="text-blue-600 group-open:rotate-45 transition-transform text-2xl font-light">+</span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed font-medium">
                                    Yes, parent interaction is highly encouraged during counselling sessions.
                                </p>
                            </details>
                        </AnimatedContent>
                    </div>
                </div>
            </section>
        </main>
    );
}
