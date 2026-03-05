"use client";

import AnimatedContent from "@/components/animated-content";
import { team } from "@/data/team";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function OurTeamSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 400;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <AnimatedContent>
                        <h2 className="text-4xl md:text-5xl font-black text-[#2945aa] font-urbanist leading-tight">
                            Learn from India&apos;s <span className="text-yellow-500">Best Faculty</span>
                        </h2>
                        <p className="mt-4 text-gray-600 text-lg font-medium">
                            Experienced educators with proven success records
                        </p>
                    </AnimatedContent>

                    {/* Navigation Arrows */}
                    <div className="flex gap-3">
                        <button 
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
                            aria-label="Scroll Left"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
                            aria-label="Scroll Right"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Team Members Slider */}
                <div 
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
                >
                    {team.map((member, index) => (
                        <AnimatedContent 
                            key={index} 
                            delay={index * 0.1}
                            className="min-w-[300px] md:min-w-[320px] snap-start"
                        >
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 group hover:-translate-y-3 transition-all duration-500 border border-gray-100 flex flex-col h-full">
                                {/* Image Container */}
                                <div className="h-80 relative overflow-hidden">
                                    <Image 
                                        src={member.image} 
                                        alt={member.name} 
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>

                                {/* Content Container */}
                                <div className="p-8 text-center flex-grow flex flex-col items-center justify-center bg-white">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-urbanist tracking-tight">
                                        {member.name}
                                    </h3>
                                    <p className="text-blue-600 font-bold mb-3 tracking-wide text-sm">
                                        {member.qualification}
                                    </p>
                                    <div className="w-12 h-0.5 bg-yellow-400 mb-4 opacity-50 group-hover:w-20 transition-all duration-500"></div>
                                    <p className="text-gray-500 font-semibold text-xs tracking-[0.1em] uppercase">
                                        {member.subject}
                                    </p>
                                </div>
                            </div>
                        </AnimatedContent>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}