"use client";

import AnimatedContent from "@/components/animated-content";
import Image from "next/image";
import { 
    UsersIcon, 
    MessageCircleIcon, 
    HeadphonesIcon, 
    CalendarCheckIcon, 
    ClipboardListIcon, 
    PieChartIcon, 
    AwardIcon, 
    HeartPulseIcon,
    CheckIcon
} from "lucide-react";

export default function LearningExperiencePage() {
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
                            Learning Experience at <span className="text-yellow-500 italic"> Adhyayan</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            Designed to nurture concepts, confidence & competitive excellence through a hybrid learning ecosystem.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Classroom Experience */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute right-0 top-1/4 -translate-y-1/4 w-80 opacity-60 animate-pulse pointer-events-none z-0">
                    <Image src="/assets/images/wavwup.png" alt="" width={320} height={320} className="object-contain" />
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <AnimatedContent delay={0.2} className="relative order-2 md:order-1 h-[400px] md:h-[500px] w-full group">
                        <div className="absolute inset-0 border-2 border-blue-500/10 rounded-[1.5rem] z-20 pointer-events-none transition-all group-hover:border-blue-500/30"></div>
                        <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] shadow-2xl">
                            <Image 
                                src="/assets/images/class222.JPG" 
                                alt="Classroom Experience" 
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                        </div>
                    </AnimatedContent>

                    <AnimatedContent delay={0.1} className="order-1 md:order-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3 font-urbanist">
                            Classroom Experience
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Our classroom experience is designed to create focused,
                            interactive, and concept-driven learning for every student.
                            With limited batch sizes of up to 30 students, we ensure
                            personalized attention, active participation, and continuous
                            doubt resolution during sessions. Teaching is supported through
                            4K interactive smart boards that make complex topics easier to
                            understand through visual explanations, live problem solving,
                            diagrams, and step-by-step concept breakdowns. This blend of
                            personal mentoring and modern teaching technology helps students
                            move beyond rote learning and build strong conceptual foundations.
                            By combining structured lesson delivery, real-time interaction, and
                            technology-enabled visualization, we bridge the gap between traditional
                            teaching methods and modern exam-oriented preparation.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Online Learning Portal */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute left-0 top-1/4 -translate-y-1/4 w-[400px] opacity-60 animate-pulse pointer-events-none z-0">
                    <Image src="/assets/images/dotrotate.png" alt="" width={400} height={400} className="object-contain" />
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <AnimatedContent delay={0.1}>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-urbanist">
                            Online Learning <span className="text-blue-600">Portal</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                            Our online learning portal extends the classroom experience into a continuous,
                            anytime learning system so students can revise and practice without interruption.
                            Through the portal, students get access to recorded classes, allowing them to
                            revisit lectures, review difficult topics, and catch up on missed sessions at
                            their own pace. It also provides organized e-materials including notes, practice
                            questions, and revision resources aligned with exam patterns. Built-in performance
                            tracking and ranking features help students monitor their progress, understand
                            their standing, and identify areas that need improvement. This seamless digital
                            support system ensures that learning continues beyond classroom hours and that
                            every student stays connected, consistent, and exam-ready.
                        </p>
                    </AnimatedContent>

                    <AnimatedContent delay={0.2} className="relative h-[400px] md:h-[500px] w-full group">
                        <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] shadow-2xl">
                            <Image 
                                src="/assets/images/xyz.jpeg" 
                                alt="Online Portal" 
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                        </div>
                    </AnimatedContent>
                </div>
            </section>

            {/* Zero Doubt Policy */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute left-0 top-[80%] -translate-y-1/4 w-24 md:w-36 opacity-30 animate-pulse pointer-events-none z-0">
                    <Image src="/assets/images/blackdot.png" alt="" width={144} height={144} className="object-contain" />
                </div>

                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <AnimatedContent>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-urbanist">Zero Doubt Policy</h2>
                        <p className="text-gray-600 mb-16 max-w-2xl mx-auto text-lg font-medium">
                            We ensure no student goes home with an unanswered question. Our structured resolution system is built for clarity.
                        </p>
                    </AnimatedContent>

                    <div className="grid md:grid-cols-3 gap-8">
                        <AnimatedContent delay={0.1} className="group p-10 bg-white rounded-3xl border border-blue-50 shadow-lg shadow-blue-100/50 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <UsersIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl text-slate-800 mb-4 font-urbanist">In-Class Interaction</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">Ask questions during lectures without hesitation. Our teachers encourage curiosity.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2} className="group p-10 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 border border-blue-600 hover:-translate-y-2 transition-all duration-300">
                            <div className="w-20 h-20 bg-white/20 text-white rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <MessageCircleIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl text-white mb-4 font-urbanist">Dedicated Sessions</h4>
                            <p className="text-blue-100 text-sm leading-relaxed">Specialized time slots everyday specifically for solving complex topic doubts.</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3} className="group p-10 bg-white rounded-3xl border border-blue-50 shadow-lg shadow-blue-100/50 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <HeadphonesIcon className="size-10" />
                            </div>
                            <h4 className="font-bold text-xl text-slate-800 mb-4 font-urbanist">24/7 Digital Desk</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">Post your doubts on our app's doubt desk and get video/text solutions quickly.</p>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Result Driven Assessments */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <AnimatedContent>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 font-urbanist">Result Driven <span className="text-blue-400">Assessments</span></h2>
                    </AnimatedContent>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <AnimatedContent delay={0.1} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-colors">
                            <div className="text-blue-400 flex justify-center mb-5"><CalendarCheckIcon className="size-10" /></div>
                            <h4 className="text-white font-bold text-lg font-urbanist">Weekly Review</h4>
                        </AnimatedContent>
                        <AnimatedContent delay={0.2} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-colors">
                            <div className="text-blue-400 flex justify-center mb-5"><ClipboardListIcon className="size-10" /></div>
                            <h4 className="text-white font-bold text-lg font-urbanist">Monthly Full Tests</h4>
                        </AnimatedContent>
                        <AnimatedContent delay={0.3} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-colors">
                            <div className="text-blue-400 flex justify-center mb-5"><PieChartIcon className="size-10" /></div>
                            <h4 className="text-white font-bold text-lg font-urbanist">Detailed Analysis</h4>
                        </AnimatedContent>
                        <AnimatedContent delay={0.4} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-colors">
                            <div className="text-blue-400 flex justify-center mb-5"><AwardIcon className="size-10" /></div>
                            <h4 className="text-white font-bold text-lg font-urbanist">All India Mock</h4>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Beyond Academics */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <AnimatedContent delay={0.1}>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight font-urbanist">
                            Beyond Academics: <br/><span className="text-blue-600">Personal Mentorship</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            We don't just teach subjects; we build character and discipline. Every student is assigned a personal mentor to navigate the pressure of competitive exams.
                        </p>

                        <ul className="space-y-5">
                            <li className="flex items-center gap-3 text-slate-700 font-bold">
                                <span className="w-6 h-6 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px]"><CheckIcon className="size-3" /></span> 
                                One-to-One Academic Mentoring
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 font-bold">
                                <span className="w-6 h-6 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px]"><CheckIcon className="size-3" /></span> 
                                Regular Parent-Teacher Interaction
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 font-bold">
                                <span className="w-6 h-6 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px]"><CheckIcon className="size-3" /></span> 
                                Stress & Performance Counselling
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 font-bold">
                                <span className="w-6 h-6 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px]"><CheckIcon className="size-3" /></span> 
                                Strategic Career Guidance Sessions
                            </li>
                        </ul>
                    </AnimatedContent>

                    <AnimatedContent delay={0.3} className="relative">
                        <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-3 opacity-10"></div>
                        <div className="relative bg-slate-900 text-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-800">
                            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                                    <HeartPulseIcon className="size-8" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold font-urbanist">Support Focused</h4>
                                    <p className="text-blue-300 text-sm">Mindset & Motivation</p>
                                </div>
                            </div>
                            <p className="text-slate-300 italic mb-8 leading-relaxed">
                                "Success in competitive exams is 50% knowledge and 50% mindset. Our mentors ensure your child is mentally strong for the final day."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-sm font-bold text-blue-400">Continuous Monitoring Active</span>
                            </div>
                        </div>
                    </AnimatedContent>
                </div>
            </section>
        </main>
    );
}
