"use client";

import AnimatedContent from "@/components/animated-content";
import Link from "next/link";
import { 
    BookOpenIcon, 
    FileTextIcon, 
    PenToolIcon, 
    DownloadCloudIcon, 
    CheckCircle2Icon, 
    FileCheck2Icon,
    BrainCircuitIcon,
    ClockIcon,
    TargetIcon,
    VideoIcon,
    PresentationIcon,
    PlayCircleIcon,
    BellRingIcon
} from "lucide-react";

export default function ResourcesPage() {
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
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="h-1 w-8 bg-yellow-500 rounded-full"></span>
                            <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest">Resources</span>
                            <span className="h-1 w-8 bg-yellow-500 rounded-full"></span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white font-urbanist">
                            Student Resources <span className="text-yellow-500 italic">& Exam Support</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            Everything you need to prepare smarter, faster & better.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Free Study Materials */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedContent><h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 text-center mb-16 font-urbanist">Free Study Materials</h2></AnimatedContent>

                    <div className="grid md:grid-cols-4 gap-8">
                        <AnimatedContent delay={0.1} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <BookOpenIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Chapter Notes</h4>
                            <p className="text-gray-600 font-medium">Concept-wise downloadable notes.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                <FileTextIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Formula Sheets</h4>
                            <p className="text-gray-600 font-medium">Quick revision before exams.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                <PenToolIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Practice Problems</h4>
                            <p className="text-gray-600 font-medium">Topic-wise question sets.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.4} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
                            <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-600 group-hover:text-white transition-colors duration-300">
                                <DownloadCloudIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Free Downloads</h4>
                            <p className="text-gray-600 font-medium">Accessible anytime, anywhere.</p>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Previous Year Question Papers */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <AnimatedContent>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-6 font-urbanist leading-tight">
                            Previous Year <span className="text-blue-500">Question Papers</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Practice with authentic previous year papers to understand exam
                            pattern, difficulty level & important topics.
                        </p>

                        <ul className="space-y-4 text-gray-700 text-lg font-medium">
                            <li className="flex gap-4 items-center">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CheckCircle2Icon className="size-5" /></span>
                                JEE (Main & Advanced)
                            </li>
                            <li className="flex gap-4 items-center">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CheckCircle2Icon className="size-5" /></span>
                                NEET / AIIMS
                            </li>
                            <li className="flex gap-4 items-center">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CheckCircle2Icon className="size-5" /></span>
                                Chapter-wise & Full-length papers
                            </li>
                        </ul>
                    </AnimatedContent>

                    <AnimatedContent delay={0.2} className="bg-blue-50 p-12 rounded-[2.5rem] shadow-xl border border-blue-100 relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 group-hover:text-white transition-colors duration-500">
                            <FileCheck2Icon className="size-20 text-blue-600 mb-8 group-hover:text-blue-200 transition-colors" />
                            <p className="text-xl font-bold font-urbanist leading-relaxed text-blue-950 group-hover:text-white transition-colors">
                                Download solved & unsolved papers with answer keys and detailed explanations.
                            </p>
                        </div>
                    </AnimatedContent>
                </div>
            </section>

            {/* Exam Tips */}
            <section className="py-24 bg-blue-900 relative overflow-hidden text-white">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <AnimatedContent><h2 className="text-3xl md:text-5xl font-extrabold mb-16 font-urbanist">Expert Exam <span className="text-yellow-400">Tips</span></h2></AnimatedContent>

                    <div className="grid md:grid-cols-3 gap-8">
                        <AnimatedContent delay={0.1} className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                            <BrainCircuitIcon className="size-16 text-blue-300 mx-auto mb-6" />
                            <h4 className="font-bold text-2xl mb-3 font-urbanist">Smart Preparation</h4>
                            <p className="text-blue-100 font-medium text-lg text-balance">Focus on high-weightage topics.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2} className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                            <ClockIcon className="size-16 text-yellow-300 mx-auto mb-6" />
                            <h4 className="font-bold text-2xl mb-3 font-urbanist">Time Management</h4>
                            <p className="text-blue-100 font-medium text-lg text-balance">Learn to attempt the paper efficiently.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3} className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                            <TargetIcon className="size-16 text-emerald-300 mx-auto mb-6" />
                            <h4 className="font-bold text-2xl mb-3 font-urbanist">Accuracy Focus</h4>
                            <p className="text-blue-100 font-medium text-lg text-balance">Reduce negative marking through accuracy.</p>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Video Lectures & Webinars */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedContent><h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 text-center mb-16 font-urbanist">Video Lectures & Webinars</h2></AnimatedContent>

                    <div className="grid md:grid-cols-3 gap-8">
                        <AnimatedContent delay={0.1} className="bg-gray-50 p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all text-center">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <VideoIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Recorded Lectures</h4>
                            <p className="text-gray-600 font-medium">Learn anytime with expert faculty videos.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2} className="bg-gray-50 p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all text-center">
                            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <PresentationIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Live Webinars</h4>
                            <p className="text-gray-600 font-medium">Strategy sessions & motivation talks.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3} className="bg-gray-50 p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-pink-200 transition-all text-center">
                            <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <PlayCircleIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-3 text-slate-800 font-urbanist">Concept Explainers</h4>
                            <p className="text-gray-600 font-medium">Short videos for tough topics.</p>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Exam Alerts & Notifications */}
            <section className="py-24 bg-gradient-to-r from-blue-700 to-indigo-800 text-white relative overflow-hidden">
                <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px]"></div>

                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <AnimatedContent>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 font-urbanist leading-tight">
                            Exam Alerts <br/><span className="text-yellow-400">& Notifications</span>
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-md">
                            Never miss important exam dates, form deadlines or result updates.
                        </p>

                        <ul className="space-y-4 font-medium text-lg">
                            <li className="flex items-center gap-3"><span className="text-yellow-400 text-2xl">✓</span> Application & Admit Card alerts</li>
                            <li className="flex items-center gap-3"><span className="text-yellow-400 text-2xl">✓</span> Exam date reminders</li>
                            <li className="flex items-center gap-3"><span className="text-yellow-400 text-2xl">✓</span> Result & counselling updates</li>
                        </ul>
                    </AnimatedContent>

                    <AnimatedContent delay={0.2} className="bg-white text-gray-800 p-10 rounded-[2.5rem] shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
                                <BellRingIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-2xl text-blue-900 font-urbanist">Stay Updated</h4>
                        </div>
                        <p className="text-lg text-gray-600 mb-10 font-medium">
                            Get instant updates via WhatsApp, SMS & Email notifications straight to your inbox.
                        </p>

                        <button className="w-full bg-yellow-500 text-blue-950 px-8 py-5 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 active:scale-95 text-center block">
                            Subscribe for Alerts
                        </button>
                    </AnimatedContent>
                </div>
            </section>
        </main>
    );
}
