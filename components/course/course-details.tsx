"use client";

import AnimatedContent from "@/components/animated-content";
import Link from "next/link";
import { 
    CheckCircle2Icon, 
    UserIcon, 
    BookOpenIcon, 
    LightbulbIcon, 
    CalculatorIcon, 
    MicroscopeIcon, 
    SpellCheckIcon, 
    BrainCircuitIcon, 
    ShieldCheckIcon,
    ArrowRightIcon
} from "lucide-react";

export type CourseData = {
    name: string;
    classRange: string;
    tagline: string;
    description: string;
    forWho: {
        newStarters: string;
        foundationSeekers: string;
        futureAimers: string;
    };
    subjects: { name: string; icon: any }[];
    timings: { class: string; stream: string; morning: string; evening: string; weekend: string }[];
    feeStructure: {
        admissionFee: string;
        tuitionFee: string;
        totalFee: string;
        plan1Installments: { details: string; amount: string }[];
        plan2Total: string;
        plan2Installments: { details: string; amount: string }[];
    };
};

export default function CourseDetails({ data }: { data: CourseData }) {
    return (
        <main className="min-h-screen pb-20">
            {/* Header Section */}
            <section className="bg-blue-900 relative overflow-hidden py-24 md:py-32">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div
                    className="absolute -top-1/2 -right-[10%] w-[40%] h-[200%] rotate-15 z-0"
                    style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)' }}
                ></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
                    <AnimatedContent>
                        <h1 className="text-4xl md:text-5xl font-black text-white font-urbanist">
                            {data.name} – <span className="text-yellow-500 italic"> {data.classRange}</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                            {data.tagline}
                        </p>
                    </AnimatedContent>
                </div>
            </section>

            {/* Course Overview */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <AnimatedContent>
                        <span className="text-blue-700 font-bold tracking-widest uppercase text-sm border-l-4 border-yellow-500 pl-3 mb-4 block font-urbanist">
                            {data.classRange} Foundation
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight font-urbanist">
                            Course <span className="text-blue-700">Overview</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {data.description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/admission-form" className="inline-flex items-center gap-3 bg-blue-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-200">
                                Enroll Now <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent delay={0.2} className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-10 rounded-3xl border border-blue-100 shadow-sm relative">
                        <div className="absolute -top-4 -left-4 bg-yellow-500 text-slate-900 px-4 py-1.5 rounded-lg font-bold shadow-md text-sm uppercase tracking-wider">Key Features</div>
                        <ul className="space-y-6">
                            {[
                                "Strong conceptual foundation",
                                "Interactive & engaging classes",
                                "Regular assessments & feedback",
                                "Personal academic attention"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-4 group">
                                    <span className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-full text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <CheckCircle2Icon className="w-5 h-5" />
                                    </span>
                                    <span className="text-slate-700 font-semibold text-lg">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </AnimatedContent>
                </div>
            </section>

            {/* Who Should Enroll */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedContent className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 font-urbanist">Who Should <span className="text-blue-700">Enroll?</span></h2>
                        <div className="w-24 h-1.5 bg-yellow-500 mx-auto rounded-full"></div>
                    </AnimatedContent>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "New Starters", desc: data.forWho.newStarters, icon: UserIcon },
                            { title: "Foundation Seekers", desc: data.forWho.foundationSeekers, icon: BookOpenIcon },
                            { title: "Future Aimers", desc: data.forWho.futureAimers, icon: LightbulbIcon },
                        ].map((item, i) => (
                            <AnimatedContent key={i} delay={0.1 * i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all">
                                <div className="w-16 h-16 bg-blue-50 text-blue-700 flex items-center justify-center rounded-2xl mx-auto mb-6">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-2xl text-slate-900 mb-3 font-urbanist">{item.title}</h3>
                                <p className="text-gray-500 text-lg">{item.desc}</p>
                            </AnimatedContent>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subjects */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedContent><h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-16 text-center font-urbanist">Course <span className="text-blue-700">Subjects</span></h2></AnimatedContent>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {data.subjects.map((sub, i) => {
                            let Icon = BrainCircuitIcon;
                            if(sub.icon === 'CalculatorIcon') Icon = CalculatorIcon;
                            if(sub.icon === 'MicroscopeIcon') Icon = MicroscopeIcon;
                            if(sub.icon === 'SpellCheckIcon') Icon = SpellCheckIcon;
                            
                            return (
                                <AnimatedContent key={i} delay={0.05 * i} className="bg-blue-50/50 p-8 rounded-3xl text-center font-bold text-blue-900 border border-blue-100/50 shadow-sm hover:bg-blue-100/50 transition-colors">
                                    <Icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                                    <span className="text-lg">{sub.name}</span>
                                </AnimatedContent>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Class Timing */}
            <section className="py-24 bg-gradient-to-br from-slate-900 to-blue-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-wide font-urbanist mb-6">
                            Class <span className="text-yellow-500">Timing</span>
                        </h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            Structured batch schedules designed for academic excellence. <br/>
                            <span className="text-yellow-400 font-semibold mt-2 block">MONDAY IS WEEKLY OFF (APPLICABLE FOR ACADEMIC ONLY)</span>
                        </p>
                    </AnimatedContent>

                    <div className="overflow-x-auto pb-4">
                        <table className="w-full border border-white/20 rounded-2xl overflow-hidden min-w-[800px]">
                            <thead className="bg-white/10 backdrop-blur-sm">
                                <tr>
                                    <th className="p-5 text-left font-bold tracking-wider">Class</th>
                                    <th className="p-5 text-left font-bold tracking-wider">Board/Stream</th>
                                    <th className="p-5 text-center font-bold tracking-wider">Morning</th>
                                    <th className="p-5 text-center font-bold tracking-wider">Evening</th>
                                    <th className="p-5 text-center font-bold tracking-wider">Weekend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 text-slate-300">
                                {data.timings.map((time, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="p-5 font-bold text-white text-lg">{time.class}</td>
                                        <td className="p-5 font-medium">{time.stream}</td>
                                        <td className={`p-5 text-center font-semibold ${time.morning === 'N/A' ? 'text-slate-500' : 'text-yellow-400'}`}>{time.morning}</td>
                                        <td className={`p-5 text-center font-semibold ${time.evening === 'N/A' ? 'text-slate-500' : 'text-yellow-400'}`}>{time.evening}</td>
                                        <td className={`p-5 text-center font-semibold ${time.weekend === 'N/A' ? 'text-slate-500' : 'text-yellow-400'}`}>{time.weekend}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

             {/* Fee Structure */}
            <section className="py-24 bg-blue-50 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100 rounded-full blur-2xl"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedContent className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-urbanist mb-4">
                            Fee Structure – <span className="text-blue-700">{data.classRange}</span>
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Choose a payment plan that suits your convenience
                        </p>
                    </AnimatedContent>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Plan 1 */}
                        <AnimatedContent delay={0.1} className="bg-white rounded-3xl shadow-xl p-10 border border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all">
                            <h3 className="text-2xl font-black text-blue-900 mb-8 font-urbanist">
                                Plan 1 <span className="text-sm text-gray-400 font-bold ml-2">(Installment Based)</span>
                            </h3>

                            <ul className="space-y-5 text-gray-700 mb-8 text-lg">
                                <li className="flex justify-between border-b border-gray-100 pb-3">
                                    <span>Admission Fee</span>
                                    <span className="font-bold text-slate-900">{data.feeStructure.admissionFee}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-100 pb-3">
                                    <span>Tuition Fee (One Time)</span>
                                    <span className="font-bold text-slate-900">{data.feeStructure.tuitionFee}</span>
                                </li>
                                <li className="flex justify-between text-xl font-black text-blue-700 pt-2">
                                    <span>Total Fees</span>
                                    <span>{data.feeStructure.totalFee}</span>
                                </li>
                            </ul>

                            <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-100">
                                <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Installment Schedule</h4>
                                <ul className="space-y-4 text-slate-700">
                                    {data.feeStructure.plan1Installments.map((inst, i) => (
                                        <li key={i} className="flex justify-between items-center">
                                            <span className="font-medium text-sm bg-white px-3 py-1 rounded-md shadow-sm border border-gray-100">{inst.details}</span>
                                            <span className="font-bold text-slate-900">{inst.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedContent>

                        {/* Plan 2 */}
                        <AnimatedContent delay={0.2} className="bg-white rounded-3xl shadow-xl p-10 border border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all">
                            <h3 className="text-2xl font-black text-blue-900 mb-8 font-urbanist">
                                Plan 2 <span className="text-sm text-gray-400 font-bold ml-2">(Extended Installments)</span>
                            </h3>

                            <ul className="space-y-5 text-gray-700 mb-8 text-lg">
                                <li className="flex justify-between border-b border-gray-100 pb-3">
                                    <span>Admission + Tuition + Materials</span>
                                    <span className="font-bold text-slate-900">{data.feeStructure.plan2Total}</span>
                                </li>
                                <li className="flex justify-between text-xl font-black text-blue-700 pt-2 pb-5 border-transparent">
                                    <span>Total Fees</span>
                                    <span>{data.feeStructure.plan2Total}</span>
                                </li>
                            </ul>

                            <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-100">
                                <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Installment Schedule</h4>
                                <ul className="space-y-4 text-slate-700">
                                     {data.feeStructure.plan2Installments.map((inst, i) => (
                                        <li key={i} className="flex justify-between items-center">
                                            <span className="font-medium text-sm bg-white px-3 py-1 rounded-md shadow-sm border border-gray-100">{inst.details}</span>
                                            <span className="font-bold text-slate-900">{inst.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedContent>
                    </div>

                    <AnimatedContent delay={0.3} className="text-center mt-12">
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-2.5 rounded-full font-bold text-sm">
                            <ShieldCheckIcon className="w-5 h-5" /> 100% Transparent Fee Policy
                        </span>
                    </AnimatedContent>
                </div>
            </section>

             {/* CTA */}
             <section className="py-24 bg-yellow-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <AnimatedContent>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight font-urbanist">
                            Start Your Child’s Academic Journey <br className="hidden md:block" /> with <span className="text-white bg-black/10 px-4 py-1 rounded-xl">{data.name}</span>
                        </h2>
                        <p className="text-xl text-slate-800 font-bold mb-10 opacity-90">
                            Limited seats available for the upcoming session. Secure your spot today!
                        </p>

                        <Link href="/admission-form" className="inline-flex items-center gap-3 bg-blue-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                            ENROLL NOW <ArrowRightIcon className="w-6 h-6" />
                        </Link>
                    </AnimatedContent>
                </div>
            </section>
        </main>
    );
}
