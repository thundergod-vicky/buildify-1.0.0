"use client";

import AnimatedContent from "@/components/animated-content";

export default function PrivacyPolicyPage() {
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
                            Privacy <span className="text-yellow-500 italic">Policy</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            Designed to nurture concepts, confidence & competitive excellence through a hybrid learning ecosystem.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <AnimatedContent className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 md:p-14 border border-blue-50">
                        {/* Heading */}
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 relative inline-block font-urbanist">
                                Privacy Policy
                                <span className="absolute left-0 -bottom-3 w-16 h-1.5 bg-yellow-500 rounded-full"></span>
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="space-y-6 text-gray-600 leading-relaxed text-base md:text-lg">
                            <p>
                                We know you care about how your personal information is used and shared, 
                                and we take your privacy seriously. We have therefore created this Privacy Policy
                                in order to clearly communicate our commitment to your privacy. Please read the following
                                to learn more about our Privacy Policy. By using or accessing the Site and the services 
                                provided by us in any manner, you acknowledge that you accept the practices and policies
                                outlined in this Privacy Policy, and you hereby consent that we will collect, use, and 
                                share your information in the manner specified in this Privacy Policy.
                            </p>

                            <p>
                                Remember that your use of the Site is at all times subject to the Terms
                                of Use which incorporates this Privacy Policy. Any terms we use in this Policy
                                without defining them have the definitions given to them in the Terms.
                                The general provisions as outlined in the Terms shall be applicable to this Privacy Policy as well.
                            </p>
                        </div>
                    </AnimatedContent>
                </div>
            </section>
        </main>
    );
}
