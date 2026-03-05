"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Lightbulb, 
  Pen, 
  ChartLine, 
  Users, 
  CheckCircle2
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";

export interface ProgramLevel {
  level: string;
  title: string;
  description: string;
  link: string;
  color: string;
}

export interface ProgramData {
  name: string;
  tagline: string;
  aboutTitle: string;
  aboutDescription: React.ReactNode;
  aboutImage: string;
  levelsTitle: string;
  levelsDescription: string;
  levels: ProgramLevel[];
  whyChoose: string[];
  enrollText: string;
}

interface ProgramOverviewProps {
  data: ProgramData;
}

const ProgramOverview: React.FC<ProgramOverviewProps> = ({ data }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* 🔹 Hero Section */}
      <section className="relative bg-[#183d95] py-16 md:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[-50%] right-[-10%] width-[40%] height-[200%] bg-gradient-to-br from-blue-600/10 to-blue-500/5 rotate-[15deg] z-1 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <AnimatedContent>
            <h1 className="text-4xl md:text-5xl font-black text-white italic">
              <span className="text-[#faa819]">{data.name}</span>
            </h1>
            <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
              {data.tagline}
            </p>
          </AnimatedContent>
        </div>
      </section>

      {/* 🔹 About Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-1/4 -translate-y-1/4 opacity-100 pointer-events-none z-0">
           <Image src="/assets/images/wavwup.png" alt="" width={320} height={320} className="animate-float" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <AnimatedContent direction="horizontal">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
               <Image 
                src={data.aboutImage || "/assets/images/abc.jpeg"} 
                alt={data.aboutTitle} 
                width={600} 
                height={400} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-3xl pointer-events-none"></div>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="horizontal" reverse className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-primary">
              {data.aboutTitle}
            </h2>
            <div className="text-gray-600 text-lg leading-relaxed mb-8">
              {data.aboutDescription}
            </div>
            <Link 
              href="#levels" 
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#2945aa] text-[#2945aa] font-semibold rounded-lg hover:bg-[#2945aa] hover:text-white transition-all duration-300"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedContent>
        </div>
      </section>

      {/* 🔹 Levels Section */}
      <section id="levels" className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute right-0 top-1/4 -translate-y-1/4 opacity-100 pointer-events-none z-0">
           <Image src="/assets/images/dotrotate.png" alt="" width={400} height={400} className="animate-float" />
        </div>
        <div className="absolute left-0 top-3/4 -translate-y-1/2 opacity-50 pointer-events-none z-0">
           <Image src="/assets/images/blackdot.png" alt="" width={150} height={150} className="animate-float" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-semibold text-[#2945aa] bg-blue-100 rounded-full mb-3">
              Academic Levels
            </span>
            <h2 className="text-4xl font-bold text-[#2945aa] font-primary">
              {data.levelsTitle}
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              {data.levelsDescription}
            </p>
          </div>

          <div className={`grid gap-8 ${data.levels.length === 1 ? 'max-w-xl mx-auto' : data.levels.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
            {data.levels.map((level, index) => (
              <AnimatedContent key={index} delay={index * 100}>
                <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-100">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${level.color}`}></div>
                  
                  <div className={`w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold mb-6 transition-colors duration-300 ${
                    level.color.includes('blue') ? 'bg-blue-100 text-[#2945aa]' : 
                    level.color.includes('yellow') ? 'bg-yellow-100 text-[#faa819]' : 
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {level.level}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{level.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                    {level.description}
                  </p>

                  <Link 
                    href={level.link}
                    className="inline-flex items-center gap-2 text-[#2945aa] font-semibold hover:text-[#faa819] transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Methodology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-[#2945aa] font-primary">
              Our Teaching Methodology
            </h2>
            <p className="mt-2 text-gray-600 text-lg">
              A smart and effective learning system
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Concept-Based Learning", icon: <Lightbulb className="w-8 h-8 text-white" />, color: "border-yellow-400", bg: "bg-yellow-400" },
              { title: "Regular Practice", icon: <Pen className="w-8 h-8 text-white" />, color: "border-indigo-500", bg: "bg-indigo-500" },
              { title: "Performance Tracking", icon: <ChartLine className="w-8 h-8 text-white" />, color: "border-emerald-500", bg: "bg-emerald-500" },
              { title: "Personal Attention", icon: <Users className="w-8 h-8 text-white" />, color: "border-pink-500", bg: "bg-pink-500" },
            ].map((item, index) => (
              <AnimatedContent key={index} delay={index * 100}>
                <div className={`bg-white border-t-4 ${item.color} p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${item.bg} flex items-center justify-center shadow-lg`}>
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-gray-800">{item.title}</h4>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Why Choose Section */}
      <section className="py-16 bg-[#2945aa] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 font-primary">
            Why Choose {data.name}?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {data.whyChoose.map((item, index) => (
              <AnimatedContent key={index} delay={index * 50} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#faa819] shrink-0" />
                <span className="text-lg opacity-90">{item}</span>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 CTA Section */}
      <section className="py-16 bg-[#faa819] text-center px-6">
        <AnimatedContent>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 font-primary">
            Give Your Child the Right Beginning
          </h2>
          <p className="mb-6 text-slate-800 text-lg">{data.enrollText}</p>

          <Link
            href="/admission-form"
            className="inline-block mt-6 bg-[#2945aa] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#1e3282] transition-colors shadow-xl hover:scale-105 duration-300"
          >
            Enroll Now
          </Link>
        </AnimatedContent>
      </section>
    </div>
  );
};

export default ProgramOverview;
