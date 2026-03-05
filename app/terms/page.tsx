"use client";

import AnimatedContent from "@/components/animated-content";

export default function TermsAndConditionPage() {
    return (
        <main className="min-h-screen pb-20 bg-gradient-to-br from-[#f0f4ff] to-white">
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
                            Terms And <span className="text-yellow-500 italic">Condition</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            Designed to nurture concepts, confidence & competitive excellence through a hybrid learning ecosystem.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-6 space-y-12">
                    
                    <AnimatedContent className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 md:p-14 border border-blue-50">
                        {/* Heading */}
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 relative inline-block font-urbanist">
                                Terms and Condition
                                <span className="absolute left-0 -bottom-3 w-16 h-1.5 bg-yellow-500 rounded-full"></span>
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="text-gray-600 leading-relaxed text-base md:text-lg space-y-4">
                            <p>1. Admission is confirmed only after full/partial fee payment as decided by the institute.</p>
                            <p>2. The institute reserves the right to modify the schedule, faculty, or course structure if required, without affecting course quality.</p>
                            <p>3. All study materials, tests, videos, and notes are intellectual property of the institute.</p>
                            <p>4. Sharing, copying, photographing, or distributing materials without permission is strictly prohibited.</p>
                            <p>5. Test results and performance analysis are meant for academic guidance only. Student information may be used for academic communication, result analysis, and internal records. Parents are encouraged to stay in touch regarding attendance and performance.</p>
                            <p>6. The institute reserves the right to update or modify these terms at any time.</p>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent delay={0.1} className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 md:p-14 border border-blue-50">
                        {/* Heading */}
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 relative inline-block font-urbanist">
                                Law of Jurisdiction
                                <span className="absolute left-0 -bottom-3 w-16 h-1.5 bg-yellow-500 rounded-full"></span>
                            </h2>
                        </div>

                        {/* Content */}
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                            All disputes and legal matters arising out of any transaction or usage of this website,
                            including payments processed through our integrated payment gateway, shall be subject
                            to the exclusive jurisdiction of the courts in Durgapur, West Bengal, India.
                            By using our services and proceeding with any payment, the user agrees to comply with
                            the applicable laws of India and acknowledges Durgapur, West Bengal as the designated
                            legal jurisdiction.
                        </p>
                    </AnimatedContent>

                    <AnimatedContent delay={0.2} className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 md:p-14 border border-blue-50">
                        {/* Heading */}
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 relative inline-block font-urbanist">
                                Refund Policy
                                <span className="absolute left-0 -bottom-3 w-16 h-1.5 bg-yellow-500 rounded-full"></span>
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="text-gray-600 leading-relaxed text-base md:text-lg space-y-4">
                            <p>1. Fees once paid are non-refundable and non-transferable, except in cases specifically mentioned in this policy.</p>
                            <p>2. Refund requests must be made in writing (email or application) by the student/parent.</p>
                            <p>3. Batch change is subject to availability and institute approval.</p>
                            <p>4. Fees will not be refunded for course change; any fee difference must be paid by the student.</p>
                            <div className="space-y-2">
                                <p>5. No refund will be issued if a student:</p>
                                <ul className="pl-6 list-disc space-y-2">
                                    <li>Discontinues the course voluntarily</li>
                                    <li>Is expelled due to misconduct, indiscipline, or rule violation</li>
                                </ul>
                            </div>
                        </div>
                    </AnimatedContent>

                </div>
            </section>
        </main>
    );
}
