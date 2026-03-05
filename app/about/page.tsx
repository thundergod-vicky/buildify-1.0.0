"use client";

import { useState } from "react";
import AnimatedContent from "@/components/animated-content";
import { PresentationIcon, PencilRulerIcon, MessageCircleIcon, ClipboardCheckIcon } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    const [showMoreContent, setShowMoreContent] = useState(false);

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-blue-900 relative overflow-hidden py-24 md:py-32">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div
                    className="absolute -top-1/2 -right-[10%] w-[40%] h-[200%] rotate-15 z-0"
                    style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)' }}
                ></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white font-urbanist">
                            About <span className="text-yellow-500 italic">Us</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            Designed to nurture concepts, confidence & competitive excellence through a hybrid learning ecosystem.
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Founder Vision Section */}
            <section className="relative py-24 bg-linear-to-br from-blue-50 via-white to-sky-100 overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <AnimatedContent delay={0.1}>
                        <span className="inline-block mb-4 px-4 py-1.5 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                            Our Philosophy
                        </span>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6 leading-tight font-urbanist">
                            Founder’s Vision
                        </h2>

                        <p className="text-gray-700 leading-relaxed mb-5 text-lg">
                            To develop a deeper connection with students and to ensure that concepts
                            become easily understandable through interactive question-and-answer sessions,
                            selected academic subjects have been chosen with the aim of educational advancement
                            within a short span of time. Using scientifically structured methods that avoid wastage
                            of time, arrangements have been made to achieve excellence within a limited period.
                        </p>

                        {showMoreContent && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Education is provided through both offline and online modes, along with
                                    attractive scholarship-based examinations, which together form the core objective
                                    of this academic initiative. High-quality teaching is delivered by skilled and experienced
                                    educators to ensure effective learning outcomes.
                                </p>

                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Leaving no room for doubt and eliminating unnecessary distractions, this institution
                                    aspires to create an ideal learning environment. Careful and individual attention is given
                                    to every student, with sharp observation to identify whether anyone is facing difficulties
                                    in learning. Continuous efforts are made to resolve such difficulties, and proper implementation
                                    strategies are applied to ensure effective execution of the project.
                                </p>

                                <p className="text-gray-700 leading-relaxed text-lg">
                                    In conclusion, through its dedicated efforts, this academic initiative aims to
                                    build your proud and illustrious future—establishing you as a shining beacon of success,
                                    whose brilliance will illuminate others, allowing you to stand tall with pride and honor
                                    for a long time to come.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setShowMoreContent(!showMoreContent)}
                            className="mt-6 text-blue-700 font-bold hover:text-blue-800 transition-colors hover:underline"
                        >
                            {showMoreContent ? "Read Less" : "Read More"}
                        </button>
                    </AnimatedContent>

                    <AnimatedContent delay={0.3} className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-blue-200">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-2 bg-linear-to-r from-blue-500 to-sky-400 rounded-full"></div>

                        <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-blue-100">
                            <Image
                                src="/assets/images/founder.jpeg"
                                alt="Founder"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <h4 className="text-2xl font-bold text-gray-800 font-urbanist">
                            Sandip Mukherjee
                        </h4>
                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            Founder & Academic Director
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Teaching Methodology */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedContent className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-blue-800 font-urbanist">
                            Teaching Methodology
                        </h2>
                    </AnimatedContent>

                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <AnimatedContent delay={0.1} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <PresentationIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-3 text-gray-900">Rank Producing Faculties</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Good teachers bring out the best in students by building confidence,
                                encouraging critical thinking, and guiding them toward lasting success.
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
                                <PencilRulerIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-3 text-gray-900">Concept Clarity</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Having clear concepts helps students solve problems more effectively,
                                perform calculations quickly, adapt to new question styles, and improve accuracy.
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                                <MessageCircleIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-3 text-gray-900">Doubt Clearing</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                We offer personalized one-to-one mentoring and regular doubt sessions,
                                helping students build strong conceptual clarity and perform better in exams.
                            </p>
                        </AnimatedContent>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <AnimatedContent delay={0.4} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <PresentationIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-3 text-gray-900">Practice Based</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Along with concept-building sessions, we provide regular
                                practice sets to help students achieve strong clarity and confidence.
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.5} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
                                <PencilRulerIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-3 text-gray-900">Regular Assessment</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                We organize weekly mock tests to help students reinforce key concepts,
                                track their progress consistently, and perform better in both school and competitive exams
                            </p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.6} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                                <ClipboardCheckIcon className="size-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-3 text-gray-900">Small batch sizes</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Small batches allow us to focus maximum attention on each student, clear their doubts regularly,
                                monitor their performance closely, and help them achieve stronger academic results.
                            </p>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Infrastructure & Facilities */}
            <section className="py-24 bg-linear-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedContent className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 font-urbanist">
                            Infrastructure & Facilities
                        </h2>
                    </AnimatedContent>

                    <div className="grid md:grid-cols-3 gap-10">
                        <AnimatedContent delay={0.2} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100">
                            <div className="relative h-64 w-full bg-gray-100">
                                <Image
                                    src="/assets/images/classroomnew.jpg"
                                    alt="Modern Classrooms"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="px-8 py-8 text-center bg-white relative z-10">
                                <h4 className="font-bold text-xl mb-3 text-gray-900 font-urbanist">
                                    Modern Classrooms
                                </h4>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    Spacious & smart classrooms designed for focused and effective learning
                                </p>
                            </div>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100">
                            <div className="relative h-64 w-full bg-gray-100">
                                <Image
                                    src="/assets/images/digitalll.png"
                                    alt="Digital Learning"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="px-8 py-8 text-center bg-white relative z-10">
                                <h4 className="font-bold text-xl mb-3 text-gray-900 font-urbanist">
                                    Digital Learning
                                </h4>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    Recorded lectures available to continue learning anytime, anywhere
                                </p>
                            </div>
                        </AnimatedContent>

                        <AnimatedContent delay={0.4} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100">
                            <div className="relative h-64 w-full bg-gray-100">
                                <Image
                                    src="/assets/images/libraryyy.png"
                                    alt="Library & Resources"
                                    fill
                                    className="object-contain bg-sky-50 p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="px-8 py-8 text-center bg-white relative z-10">
                                <h4 className="font-bold text-xl mb-3 text-gray-900 font-urbanist">
                                    Library & Resources
                                </h4>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    Well-curated reference books and exam-focused study materials
                                </p>
                            </div>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* Milestones & Achievements */}
            <section className="py-24 bg-blue-800 text-white relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold font-urbanist">Milestones & Achievements</h2>
                        <p className="mt-4 text-sky-200 text-lg">
                            A journey of excellence and success
                        </p>
                    </AnimatedContent>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-blue-700/50">
                        <AnimatedContent delay={0.1}>
                            <h3 className="text-5xl font-extrabold text-yellow-400 font-urbanist drop-shadow-md">10+</h3>
                            <p className="mt-3 text-sm font-medium text-blue-100 uppercase tracking-widest">Years of Excellence</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.2}>
                            <h3 className="text-5xl font-extrabold text-yellow-400 font-urbanist drop-shadow-md">5000+</h3>
                            <p className="mt-3 text-sm font-medium text-blue-100 uppercase tracking-widest">Students Trained</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.3}>
                            <h3 className="text-5xl font-extrabold text-yellow-400 font-urbanist drop-shadow-md">500+</h3>
                            <p className="mt-3 text-sm font-medium text-blue-100 uppercase tracking-widest">Top Rank Holders</p>
                        </AnimatedContent>

                        <AnimatedContent delay={0.4}>
                            <h3 className="text-5xl font-extrabold text-yellow-400 font-urbanist drop-shadow-md">95%</h3>
                            <p className="mt-3 text-sm font-medium text-blue-100 uppercase tracking-widest">Success Rate</p>
                        </AnimatedContent>
                    </div>
                </div>
            </section>
        </main>
    );
}
