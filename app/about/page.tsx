import SectionTitle from "@/components/section-title";
import AnimatedContent from "@/components/animated-content";
import { BookOpenIcon, TargetIcon, ClockIcon, ShieldCheckIcon } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="px-4 md:px-16 lg:px-24 xl:px-32 pt-32 pb-24">
            <div className="max-w-7xl mx-auto border-x border-gray-200 px-4 md:px-12 pb-24">
                <section className="pt-12 pb-10 flex flex-col items-center">
                    <SectionTitle
                        icon={BookOpenIcon}
                        title="About Adhyayan"
                        subtitle="Adhyayan brings together IIT teachers, live classes, exam-level practice and transparent progress reporting on a single platform."
                    />
                </section>

                <section className="grid gap-8 md:grid-cols-2 text-sm text-zinc-600 mb-12">
                    <AnimatedContent className="space-y-4">
                        <h3 className="text-xl font-semibold font-urbanist">Why we built Adhyayan</h3>
                        <p>
                            Many students attend separate coaching, test series and online doubt-solving platforms. This
                            makes preparation scattered and hard to track. Adhyayan was created to bring everything
                            together in one focused learning space.
                        </p>
                        <p>
                            With live sessions led by IIT teachers, 1000s of test papers and proctored exams, students
                            get exam-like preparation from day one. Parents get visibility into effort, attendance and
                            progress without needing to micromanage.
                        </p>
                    </AnimatedContent>
                    <AnimatedContent className="space-y-4">
                        <h3 className="text-xl font-semibold font-urbanist">How learning works here</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Attend live classes and ask questions directly to IIT educators.</li>
                            <li>Practice with structured test papers and instant solutions.</li>
                            <li>Attempt fully watched, proctored exams to build exam discipline.</li>
                            <li>Review progress reports with teachers and parents regularly.</li>
                        </ul>
                    </AnimatedContent>
                </section>

                <section className="grid gap-6 md:grid-cols-3 text-sm text-zinc-600">
                    <AnimatedContent className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-start gap-3">
                        <TargetIcon className="text-orange-500 mt-1" />
                        <p>Focused on competitive exam success with clear weekly and monthly study targets.</p>
                    </AnimatedContent>
                    <AnimatedContent className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-start gap-3">
                        <ClockIcon className="text-emerald-500 mt-1" />
                        <p>Flexible timings and recordings so students can revise at their own pace.</p>
                    </AnimatedContent>
                    <AnimatedContent className="bg-violet-50 border border-violet-100 rounded-xl p-5 flex items-start gap-3">
                        <ShieldCheckIcon className="text-violet-500 mt-1" />
                        <p>Safe, monitored learning environment with parental controls and exam proctoring.</p>
                    </AnimatedContent>
                </section>
            </div>
        </main>
    );
}

