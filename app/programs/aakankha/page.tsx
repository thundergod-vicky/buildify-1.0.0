"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  Play, 
  Clock, 
  CalendarCheck, 
  FileText, 
  CheckCircle2 
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";

export default function AakankhaPage() {
  const highlights = [
    "Complete NEET syllabus revision in a short, structured time",
    "Daily MCQ practice with in-depth discussion",
    "Smart shortcuts, tricks & time-management techniques",
    "Experienced NEET faculty with proven results",
    "Regular mock tests strictly based on NEET exam pattern",
    "Focused coverage of Botany, Zoology, Physics & Chemistry weightage topics",
    "Strong emphasis on concept clarity & exam confidence",
    "Personal mentoring, motivation & last-minute doubt-solving sessions"
  ];

  const courseInfo = [
    { label: "Duration", value: "45 Days", icon: <Calendar className="w-6 h-6 text-[#faa819]" /> },
    { label: "Start Date", value: "19th February 2026", icon: <Play className="w-6 h-6 text-[#faa819]" /> },
    { label: "Timing", value: "9:00 AM – 3:00 PM", icon: <Clock className="w-6 h-6 text-[#faa819]" /> },
    { label: "Days", value: "6 Days / Week", icon: <CalendarCheck className="w-6 h-6 text-[#faa819]" /> },
    { label: "Test Papers", value: "21 NEET Pattern Tests", icon: <FileText className="w-6 h-6 text-[#faa819]" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 🔹 Hero Section */}
      <section className="relative bg-[#183d95] py-16 md:py-24 overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[-50%] right-[-10%] width-[40%] height-[200%] bg-gradient-to-br from-blue-600/10 to-blue-500/5 rotate-[15deg] z-1 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <AnimatedContent>
            <h1 className="text-4xl md:text-5xl font-black text-white italic">
              <span className="text-[#faa819]">AAKANKHA</span>
            </h1>
            <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
              Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.
            </p>
          </AnimatedContent>
        </div>
      </section>

      {/* 🔹 Main Content */}
      <section className="py-16 bg-white overflow-hidden relative">
        <div className="absolute right-0 top-[500px] -translate-y-1/4 opacity-100 pointer-events-none z-0">
           <Image src="/assets/images/dotrotate.png" alt="" width={400} height={400} className="animate-float" />
        </div>
        <div className="absolute left-0 top-[600px] -translate-y-1/2 opacity-50 pointer-events-none z-0">
           <Image src="/assets/images/blackdot.png" alt="" width={150} height={150} className="animate-float" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <AnimatedContent>
              <span className="inline-block bg-green-100 text-green-700 px-6 py-2 rounded-full text-sm font-semibold tracking-wide">
                Admissions Open
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 font-primary">
                AAKANKHA <span className="text-[#183d95]">NEET UG 2026</span><br />
                Crash Course
              </h2>
              <p className="mt-6 text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
                Aakanksha is a specialized and result-oriented program for <strong> NEET UG aspirants, offering complete syllabus coverage, structured revision modules,</strong> and <strong> regular full-length mock tests</strong> that simulate real exam conditions. Through expert mentoring and performance analysis, the program enhances exam temperament, speed, and accuracy—preparing students to compete at the highest level.
              </p>
            </AnimatedContent>
          </div>

          {/* Course Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-14">
            {courseInfo.map((item, index) => (
              <AnimatedContent key={index} delay={index * 100}>
                <div className="bg-slate-50 border border-gray-100 rounded-3xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-slate-800">{item.label}</h4>
                  <p className="text-gray-600 mt-1 font-medium">{item.value}</p>
                </div>
              </AnimatedContent>
            ))}
          </div>

          {/* Key Highlights */}
          <AnimatedContent>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center">
                NEET Crash Course – <span className="text-[#faa819]">Key Highlights</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {highlights.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start group">
                    <CheckCircle2 className="w-6 h-6 text-[#faa819] shrink-0 transition-transform group-hover:scale-110" />
                    <span className="text-gray-300 text-lg leading-snug group-hover:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-14 text-center border-t border-white/10 pt-10">
                <p className="text-xl md:text-2xl italic text-[#faa819] font-bold">
                  “When concepts meet strategy, success follows.”
                </p>
              </div>
            </div>
          </AnimatedContent>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/admission-form"
              className="inline-block bg-[#2945aa] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#1e3282] transition-colors shadow-xl hover:scale-105 duration-300"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
