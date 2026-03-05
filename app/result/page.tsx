"use client";

import AnimatedContent from "@/components/animated-content";
import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, HelpCircleIcon } from "lucide-react";

export default function ResultPage() {
    const [activeTab, setActiveTab] = useState<'neet' | 'jee' | 'foundation'>('neet');
    
    // Sliders ref for horizontal scroll buttons
    const neetRef = useRef<HTMLDivElement>(null);
    const jeeRef = useRef<HTMLDivElement>(null);
    const foundationRef = useRef<HTMLDivElement>(null);

    const [activeVideoTab, setActiveVideoTab] = useState<'neet' | 'jee' | 'foundation'>('neet');
    const videoNeetRef = useRef<HTMLDivElement>(null);
    const videoJeeRef = useRef<HTMLDivElement>(null);
    const videoFoundationRef = useRef<HTMLDivElement>(null);

    const scrollSlider = (direction: 1 | -1, ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: direction * 350, behavior: 'smooth' });
        }
    };

    return (
        <main className="min-h-screen pb-20 pt-24 bg-gray-50 overflow-x-hidden">
            
            {/* Hero & Top Achievers Section */}
            <section className="relative overflow-hidden py-16">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center mb-16 space-y-4">
                        <span className="inline-block px-5 py-2 text-sm font-bold text-blue-800 bg-blue-100/50 border border-blue-200 rounded-full shadow-sm font-urbanist">
                            🏆 Hall of Fame
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 font-urbanist tracking-tight">
                            Our <span className="text-blue-700">Star Achievers</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Celebrating the dedication and hard work of our students who have set new benchmarks in academic excellence.
                        </p>
                    </AnimatedContent>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {['neet', 'jee', 'foundation'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-sm border ${
                                    activeTab === tab
                                        ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white border-transparent shadow-blue-500/30'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {tab === 'neet' && 'NEET Toppers'}
                                {tab === 'jee' && 'JEE Toppers'}
                                {tab === 'foundation' && 'Foundation'}
                            </button>
                        ))}
                    </div>

                    {/* Sliders Container */}
                    <div className="relative group/slider">
                        
                        {/* NEET Slider */}
                        <div className={`${activeTab === 'neet' ? 'block' : 'hidden'}`}>
                            <div ref={neetRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 no-scrollbar scroll-smooth">
                                {[
                                    { rank: "AIR 52", name: "Arjun Verma", exam: "NEET 2024", score: "695", theme: "yellow" },
                                    { rank: "AIR 110", name: "Riya Sen", exam: "NEET 2024", score: "682", theme: "blue" },
                                    { rank: "AIR 250", name: "Kunal Mitra", exam: "NEET 2024", score: "675", theme: "green" },
                                ].map((student, i) => (
                                    <div key={i} className="snap-center shrink-0 w-[300px] md:w-[340px] bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 group">
                                        <div className="relative h-80 overflow-hidden bg-slate-100">
                                            <span className={`absolute top-4 right-4 z-10 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border ${
                                                student.theme === 'yellow' ? 'bg-yellow-400 text-yellow-900 border-yellow-300' :
                                                student.theme === 'blue' ? 'bg-blue-600 text-white border-blue-500' :
                                                'bg-green-500 text-white border-green-400'
                                            }`}>
                                                {student.rank}
                                            </span>
                                            {/* Note: In a real app, replace with actual imported images. Using a placeholder or the provided static path if valid in Next */}
                                            <div className="w-full h-full bg-slate-200 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center text-slate-400">
                                                 <Image src="/assets/images/teacher.jpg" alt={student.name} fill className="object-cover object-top" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-6 left-6 text-white">
                                                <h3 className="text-2xl font-bold font-urbanist">{student.name}</h3>
                                                <p className="text-white/80 text-sm font-medium">{student.exam}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 text-center bg-white relative">
                                            <div className="inline-flex items-baseline gap-1 px-5 py-2.5 bg-slate-50 text-blue-900 rounded-xl font-bold text-xl border border-slate-100">
                                                {student.score} <span className="text-sm font-medium text-slate-500">/ 720</span>
                                            </div>
                                        </div>
                                        <div className={`h-1.5 w-full bg-gradient-to-r ${
                                            student.theme === 'yellow' ? 'from-yellow-400 to-orange-500' :
                                            student.theme === 'blue' ? 'from-blue-500 to-indigo-500' :
                                            'from-emerald-400 to-teal-500'
                                        }`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* JEE Slider */}
                        <div className={`${activeTab === 'jee' ? 'block' : 'hidden'}`}>
                            <div ref={jeeRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 no-scrollbar scroll-smooth">
                                {[
                                    { rank: "AIR 320", name: "Aryan Gupta", exam: "JEE Advanced", score: "99.4 %ile", theme: "indigo" },
                                    { rank: "AIR 540", name: "Neha Roy", exam: "JEE Advanced", score: "98.9 %ile", theme: "purple" },
                                ].map((student, i) => (
                                    <div key={i} className="snap-center shrink-0 w-[300px] md:w-[340px] bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 group">
                                        <div className="relative h-80 overflow-hidden bg-slate-100">
                                            <span className={`absolute top-4 right-4 z-10 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border ${
                                                student.theme === 'indigo' ? 'bg-indigo-600 text-white border-indigo-500' :
                                                'bg-purple-600 text-white border-purple-500'
                                            }`}>
                                                {student.rank}
                                            </span>
                                            <div className="w-full h-full bg-slate-200 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center text-slate-400">
                                                 <Image src="/assets/images/teacher.jpg" alt={student.name} fill className="object-cover object-top" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-6 left-6 text-white">
                                                <h3 className="text-2xl font-bold font-urbanist">{student.name}</h3>
                                                <p className="text-white/80 text-sm font-medium">{student.exam}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 text-center bg-white relative">
                                            <div className="inline-flex px-5 py-2.5 bg-slate-50 text-indigo-900 rounded-xl font-bold text-xl border border-slate-100">
                                                {student.score}
                                            </div>
                                        </div>
                                        <div className={`h-1.5 w-full bg-gradient-to-r ${
                                            student.theme === 'indigo' ? 'from-indigo-500 to-blue-600' :
                                            'from-purple-500 to-pink-500'
                                        }`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Foundation Slider */}
                        <div className={`${activeTab === 'foundation' ? 'block' : 'hidden'}`}>
                            <div ref={foundationRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 no-scrollbar scroll-smooth">
                                {[
                                    { rank: "Topper", name: "Ananya Roy", cls: "Class VIII", score: "98.6%" },
                                    { rank: "Topper", name: "Rahul Das", cls: "Class VII", score: "97.2%" },
                                    { rank: "Topper", name: "Suman Deb", cls: "Class IX", score: "96.5%" },
                                ].map((student, i) => (
                                    <div key={i} className="snap-center shrink-0 w-[300px] md:w-[340px] bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 group">
                                        <div className="relative h-80 overflow-hidden bg-slate-100">
                                            <span className="absolute top-4 right-4 z-10 bg-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-pink-400">
                                                {student.rank}
                                            </span>
                                            <div className="w-full h-full bg-slate-200 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center text-slate-400">
                                                 <Image src="/assets/images/teacher.jpg" alt={student.name} fill className="object-cover object-top" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-6 left-6 text-white">
                                                <h3 className="text-2xl font-bold font-urbanist">{student.name}</h3>
                                                <p className="text-white/80 text-sm font-medium">{student.cls}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 text-center bg-white relative">
                                            <div className="inline-flex px-5 py-2.5 bg-pink-50 text-pink-700 rounded-xl font-bold text-xl border border-pink-100">
                                                {student.score}
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button 
                            onClick={() => scrollSlider(-1, activeTab === 'neet' ? neetRef : activeTab === 'jee' ? jeeRef : foundationRef)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 bg-white text-blue-700 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:bg-blue-700 hover:text-white transition-all z-20 border border-gray-100"
                        >
                            <ChevronLeftIcon className="w-6 h-6" strokeWidth={3} />
                        </button>

                        <button 
                            onClick={() => scrollSlider(1, activeTab === 'neet' ? neetRef : activeTab === 'jee' ? jeeRef : foundationRef)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 bg-white text-blue-700 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:bg-blue-700 hover:text-white transition-all z-20 border border-gray-100"
                        >
                            <ChevronRightIcon className="w-6 h-6" strokeWidth={3} />
                        </button>

                    </div>
                </div>
            </section>

            {/* Video Testimonials */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center mb-16 space-y-4">
                         <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                            Success Stories
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-urbanist">
                            Video <span className="text-blue-600">Testimonials</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            আমাদের টপারদের সাফল্যের গল্প শুনুন তাদের নিজেদের মুখেই।
                        </p>
                    </AnimatedContent>

                     {/* Video Tabs */}
                     <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {['neet', 'jee', 'foundation'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveVideoTab(tab as any)}
                                className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border ${
                                    activeVideoTab === tab
                                        ? 'bg-blue-700 text-white shadow-lg shadow-blue-500/30 border-blue-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-blue-200'
                                }`}
                            >
                                {tab === 'neet' && 'NEET Videos'}
                                {tab === 'jee' && 'JEE Videos'}
                                {tab === 'foundation' && 'Foundation'}
                            </button>
                        ))}
                    </div>

                    {/* Video Sliders Container */}
                     <div className="relative group/video">
                        
                        {/* NEET Video Slider */}
                        <div className={`${activeVideoTab === 'neet' ? 'block' : 'hidden'}`}>
                            <div ref={videoNeetRef} className="flex gap-8 overflow-x-auto snap-x snap-mandatory py-4 px-2 no-scrollbar scroll-smooth">
                                {[
                                    { name: "Arjun Verma", score: "NEET AIR 52 (2024)", quote: "\"The study material provided was exceptional for my NEET prep.\"", color: "blue" },
                                    { name: "Riya Sen", score: "NEET AIR 110 (2024)", quote: "\"Regular doubt sessions helped me clear my concepts.\"", color: "indigo" },
                                ].map((video, i) => (
                                    <div key={i} className="snap-center shrink-0 w-[320px] md:w-[400px] bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                                        <div className="relative h-72 bg-slate-900 group/play cursor-pointer">
                                            {/* In a real scenario, implement a video component. Keeping structural fidelity. */}
                                            <div className="w-full h-full opacity-60 bg-slate-800"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/40 transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-white group-hover/play:text-blue-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z"/></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`p-6 border-t-4 ${video.color === 'blue' ? 'border-blue-500' : 'border-indigo-500'}`}>
                                            <h3 className="text-xl font-bold text-slate-900 font-urbanist">{video.name}</h3>
                                            <p className="text-blue-700 font-bold text-sm mb-3">{video.score}</p>
                                            <p className="text-gray-500 text-sm italic">{video.quote}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                         {/* Placeholder for JEE/Foundation Videos */}
                         <div className={`${activeVideoTab === 'jee' || activeVideoTab === 'foundation' ? 'block' : 'hidden'}`}>
                            <div className="py-24 text-center w-full">
                                <div className="inline-block p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <VideoIcon className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-500 font-medium text-lg">
                                        {activeVideoTab === 'jee' ? 'JEE Testimonials coming soon...' : 'Foundation Videos coming soon...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {activeVideoTab === 'neet' && (
                            <>
                                <button onClick={() => scrollSlider(-1, videoNeetRef)} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 bg-white text-blue-600 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all z-20 border border-slate-100">
                                    <ChevronLeftIcon className="w-6 h-6" strokeWidth={3} />
                                </button>
                                <button onClick={() => scrollSlider(1, videoNeetRef)} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 bg-white text-blue-600 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all z-20 border border-slate-100">
                                    <ChevronRightIcon className="w-6 h-6" strokeWidth={3} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Download PDFs */}
            <section className="py-24 bg-slate-50/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <AnimatedContent className="max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 font-urbanist tracking-tight">
                                Downloadable <span className="text-blue-600">Result PDFs</span>
                            </h2>
                            <p className="text-gray-600 text-lg">সহজেই আমাদের বিগত বছরের রেজাল্ট শীট এবং পারফরম্যান্স রিপোর্টগুলো PDF ফরম্যাটে ডাউনলোড করে দেখে নিন।</p>
                        </AnimatedContent>
                        
                        <AnimatedContent delay={0.2} className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                            <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 shadow-sm">2024</button>
                            <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-700 transition">2023</button>
                            <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-700 transition">2022</button>
                        </AnimatedContent>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "NEET 2024 Summary", size: "2.4 MB", color: "from-emerald-500 to-teal-500" },
                            { title: "JEE Advanced Toppers", size: "1.8 MB", color: "from-blue-600 to-indigo-600" },
                            { title: "Scholarship Test (ASAT)", size: "3.1 MB", color: "from-purple-500 to-fuchsia-500" },
                        ].map((pdf, i) => (
                            <AnimatedContent key={i} delay={0.1 * i} className="bg-white border border-slate-200 rounded-3xl p-6 flex items-start gap-5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer">
                                <div className={`bg-gradient-to-br ${pdf.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <DownloadIcon className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-slate-900 mb-1 font-urbanist">{pdf.title}</h4>
                                    <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider bg-slate-100 inline-block px-2 py-1 rounded">Size: {pdf.size} • PDF</p>
                                    <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-800 transition">
                                        Download PDF <DownloadIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </AnimatedContent>
                        ))}
                    </div>

                    {/* Help Banner */}
                    <AnimatedContent delay={0.4} className="mt-16 p-8 md:p-10 bg-gradient-to-r from-blue-800 to-blue-950 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

                        <div className="flex items-center gap-6 text-center md:text-left relative z-10">
                            <div className="hidden md:flex bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                                <HelpCircleIcon className="w-10 h-10 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-urbanist mb-2">আপনার রেজাল্ট খুঁজে পাচ্ছেন না?</h3>
                                <p className="text-blue-200 font-medium">আপনার রোল নম্বর দিয়ে সরাসরি অনুসন্ধান করতে পারেন।</p>
                            </div>
                        </div>
                        <a href="/contact" className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition-colors shadow-lg active:scale-95 whitespace-nowrap relative z-10">
                            সহায়তা নিন
                        </a>
                    </AnimatedContent>

                </div>
            </section>
        </main>
    );
}
