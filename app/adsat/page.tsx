"use client";

import AnimatedContent from "@/components/animated-content";
import Image from "next/image";

export default function AdsatPage() {
    return (
        <main className="min-h-screen">
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
                            Adhyayan Scholarship <span className="text-yellow-500 italic"> Admission Test</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            A competitive scholarship test designed to identify talent and provide financial support for academic excellence.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Why Take This Scholarship Test */}
            <section className="py-24 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden relative">
                <div className="absolute right-0 top-[30px] -translate-y-1/4 w-64 md:w-64 opacity-40 animate-pulse pointer-events-none z-0">
                    <Image
                        src="/assets/images/spiralshape.png"
                        alt=""
                        width={256}
                        height={256}
                        className="object-contain"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 font-urbanist" id="top">
                            Why Take This <span className="text-blue-700">Scholarship Test?</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
                            Designed to recognize talent, reward merit, and guide students towards academic excellence.
                        </p>
                    </AnimatedContent>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* LEFT: Benefits + Exam Details */}
                        <div className="space-y-8">
                            <AnimatedContent delay={0.1} className="bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-3xl p-6 shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-full bg-white/20 text-2xl">
                                    🎓
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold tracking-wide font-urbanist">
                                        HIGH SCHOLARSHIP BENEFITS
                                    </h3>
                                    <p className="text-sm text-white/90">
                                        Get up to <span className="font-bold text-yellow-300">90% scholarship</span> for top scorers.
                                    </p>
                                </div>
                            </AnimatedContent>

                            <AnimatedContent delay={0.2} className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-3xl p-6 shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-full bg-white/20 text-2xl">
                                    🌍
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold tracking-wide font-urbanist">
                                        NATIONAL BENCHMARK
                                    </h3>
                                    <p className="text-sm text-white/90">
                                        Compete with students across India.
                                    </p>
                                </div>
                            </AnimatedContent>

                            <AnimatedContent delay={0.3} className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white rounded-3xl p-6 shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-full bg-white/20 text-2xl">
                                    🧭
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold tracking-wide font-urbanist">
                                        CAREER GUIDANCE
                                    </h3>
                                    <p className="text-sm text-white/90">
                                        Identify strengths, weaknesses and the right academic direction.
                                    </p>
                                </div>
                            </AnimatedContent>

                            <AnimatedContent delay={0.4} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-3xl p-6 shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-full bg-white/20 text-2xl">
                                    ⭐
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold tracking-wide font-urbanist">
                                        NO REGISTRATION FEE
                                    </h3>
                                    <p className="text-sm text-white/90">
                                        Apply for the scholarship test absolutely free of cost.
                                    </p>
                                </div>
                            </AnimatedContent>

                            {/* Exam Details */}
                            <AnimatedContent delay={0.5} className="bg-white rounded-3xl shadow-xl p-8 border border-blue-50">
                                <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center font-urbanist">
                                    Exam Details
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 transition-colors hover:bg-blue-100/50">
                                        <span className="font-semibold text-blue-700">🖥 Mode</span>
                                        <p className="text-gray-700 text-sm mt-1 font-medium">Offline</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 transition-colors hover:bg-sky-100/50">
                                        <span className="font-semibold text-sky-700">🎓 Eligibility</span>
                                        <p className="text-gray-700 text-sm mt-1 font-medium">Class 5 to 11 Students</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 transition-colors hover:bg-yellow-100/50">
                                        <span className="font-semibold text-yellow-700">📘 Syllabus [NCERT]</span>
                                        <p className="text-gray-700 text-sm mt-1 font-medium">Physics, Chemistry, Biology, Mathematics, Mental Ability</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 transition-colors hover:bg-gray-100/50">
                                        <span className="font-semibold text-gray-700">📝 Exam Pattern</span>
                                        <p className="text-gray-700 text-sm mt-1 font-medium">MCQ Based Test</p>
                                    </div>
                                </div>
                            </AnimatedContent>
                        </div>

                        {/* RIGHT: FORM */}
                        <AnimatedContent delay={0.3}>
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                                <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center font-urbanist">
                                    Apply for Scholarship Test
                                </h3>
                                <form className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all focus:bg-blue-50/30" placeholder="Enter full name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Photo</label>
                                        <input type="file" className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course</label>
                                            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all focus:bg-blue-50/30">
                                                <option value="">Select Course</option>
                                                <option value="AARAMBH">AARAMBH</option>
                                                <option value="AARADHANA">AARADHANA</option>
                                                <option value="AAKRITI">AAKRITI</option>
                                                <option value="ABHYAAS">ABHYAAS</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class</label>
                                            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all focus:bg-blue-50/30">
                                                <option value="">Select Class</option>
                                                <option value="5">Class 5</option>
                                                <option value="6">Class 6</option>
                                                <option value="7">Class 7</option>
                                                <option value="8">Class 8</option>
                                                <option value="9">Class 9</option>
                                                <option value="10">Class 10</option>
                                                <option value="11">Class 11</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Guardian Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all focus:bg-blue-50/30" placeholder="Enter guardian name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Number</label>
                                        <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all focus:bg-blue-50/30" placeholder="+91" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all focus:bg-blue-50/30" placeholder="your@email.com" />
                                    </div>
                                    <button type="submit" className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-4 active:scale-[0.98]">
                                        Submit Application
                                    </button>
                                </form>
                            </div>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Download Syllabus & Exam Pattern */}
            <section className="py-24 bg-gray-50 overflow-hidden relative">
                <div className="absolute right-0 top-[30px] -translate-y-1/4 w-16 opacity-40 animate-pulse pointer-events-none z-0">
                    <Image src="/assets/images/starshape.png" alt="" width={64} height={64} />
                </div>
                <div className="absolute left-0 top-[30px] -translate-y-1/4 w-16 opacity-40 animate-pulse pointer-events-none z-0">
                    <Image src="/assets/images/starshape.png" alt="" width={64} height={64} />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 font-urbanist">
                            Download <span className="text-blue-600">Syllabus & Exam Pattern</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            Select your class to download the detailed syllabus and exam pattern for the scholarship aptitude test.
                        </p>
                    </AnimatedContent>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Class 5 to 11 syllabus cards */}
                        {[
                            { class: "Class V", desc: "Basic aptitude, logical reasoning & core subjects." },
                            { class: "Class VI", desc: "Concept clarity with analytical thinking." },
                            { class: "Class VII", desc: "Strengthening fundamentals & problem solving." },
                            { class: "Class VIII", desc: "Advanced reasoning with subject depth." },
                            { class: "Class IX", desc: "Strong foundation for higher academics." },
                            { class: "Class X", desc: "Board-focused aptitude & subject mastery." },
                            { class: "Class XI", desc: "Higher secondary level aptitude assessment." }
                        ].map((item, index) => (
                            <AnimatedContent key={item.class} delay={0.1 * index} className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all border border-blue-50 group hover:-translate-y-1">
                                <h3 className="text-2xl font-bold text-blue-900 font-urbanist">{item.class}</h3>
                                <p className="mt-3 text-gray-600 font-medium">
                                    {item.desc}
                                </p>
                                <div className="mt-8 space-y-3">
                                    <button className="w-full text-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition active:scale-[0.98]">
                                        Download Syllabus
                                    </button>
                                    <button className="w-full text-center px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition active:scale-[0.98]">
                                        Download Exam Pattern
                                    </button>
                                </div>
                            </AnimatedContent>
                        ))}
                    </div>
                </div>
            </section>

            {/* Registration CTA */}
            <section id="register" className="py-24 bg-blue-800 text-white text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[100px] pointer-events-none"></div>

                <AnimatedContent className="relative z-10 max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-extrabold mb-6 font-urbanist">
                        Take the First Step Towards Your Scholarship
                    </h2>
                    <p className="mb-10 text-blue-100 text-lg">
                        Register now and unlock opportunities for academic success.
                    </p>
                    <a href="#top" className="inline-block px-10 py-4 bg-yellow-500 text-gray-900 font-bold text-lg rounded-xl hover:bg-yellow-400 hover:scale-105 transition shadow-lg shadow-yellow-500/20 active:scale-95">
                        Apply for Scholarship Test
                    </a>
                </AnimatedContent>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <AnimatedContent className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-blue-900 font-urbanist">
                            Frequently Asked Questions
                        </h2>
                    </AnimatedContent>

                    <div className="space-y-4">
                        <AnimatedContent delay={0.1}>
                            <details className="bg-gray-50 p-6 rounded-2xl border border-gray-100 cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="font-bold text-blue-900 text-lg flex justify-between items-center outline-none">
                                    Who is eligible for ADSAT?
                                    <span className="text-blue-600 group-open:rotate-45 transition-transform text-2xl font-light">+</span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed font-medium">
                                    Students from Class 5 up to Class 11 are eligible to apply and sit for the Adhyayan Scholarship Admission Test.
                                </p>
                            </details>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2}>
                            <details className="bg-gray-50 p-6 rounded-2xl border border-gray-100 cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="font-bold text-blue-900 text-lg flex justify-between items-center outline-none">
                                    Is ADSAT mandatory for all courses at Adhyayan?
                                    <span className="text-blue-600 group-open:rotate-45 transition-transform text-2xl font-light">+</span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed font-medium">
                                    While not always mandatory for admission, ADSAT is highly recommended to avail scholarship benefits up to 90% depending on performance.
                                </p>
                            </details>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3}>
                            <details className="bg-gray-50 p-6 rounded-2xl border border-gray-100 cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="font-bold text-blue-900 text-lg flex justify-between items-center outline-none">
                                    What is the test format?
                                    <span className="text-blue-600 group-open:rotate-45 transition-transform text-2xl font-light">+</span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed font-medium">
                                    It is an offline MCQ-based test. The syllabus will be based on standard NCERT topics encompassing Science, Maths, and Mental Aptitude for your respective class.
                                </p>
                            </details>
                        </AnimatedContent>
                    </div>
                </div>
            </section>
        </main>
    );
}
