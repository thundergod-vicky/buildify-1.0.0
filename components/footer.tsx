"use client";

import { InstagramIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const sections = [
        {
            title: "Quick Links",
            links: [
                { name: "About Us", href: "/about" },
                { name: "ADSAT Scholarship", href: "/adsat" },
                { name: "Learning Experience", href: "/learning-experience" },
                { name: "Admission Counselling", href: "/admission-counselling" },
                { name: "Result & Achievements", href: "/result" },
            ]
        },
        {
            title: "Our Programs",
            links: [
                { name: "Aarambh (VI-VIII)", href: "/programs/aarambh" },
                { name: "Aaradhana (IX-X)", href: "/programs/aaradhana" },
                { name: "Aakriti (XI-XII)", href: "/programs/aakriti" },
                { name: "Abhyaas (12th Passed)", href: "/programs/abhyaas" },
                { name: "Aakankha (NEET Crash)", href: "/programs/aakankha" },
            ]
        },
        {
            title: "Information",
            links: [
                { name: "Fee Deposition", href: "/fee-deposition-modes" },
                { name: "Resources", href: "/resources" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms & Conditions", href: "/terms" },
                { name: "Refund Rules", href: "/refund-rules" },
            ]
        }
    ];

    return (
        <footer className="bg-white pt-24 pb-12 border-t border-gray-100 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/">
                            <Image
                                src="/assets/images/brandlogo.png"
                                alt="Adhyayan Logo"
                                width={200}
                                height={60}
                                className="h-14 w-auto"
                            />
                        </Link>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Empowering students with conceptual clarity and disciplined learning for a brighter academic future.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: <TwitterIcon className="w-5 h-5" />, href: "#" },
                                { icon: <LinkedinIcon className="w-5 h-5" />, href: "#" },
                                { icon: <InstagramIcon className="w-5 h-5" />, href: "#" },
                            ].map((social, i) => (
                                <a 
                                    key={i} 
                                    href={social.href} 
                                    className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Sections */}
                    {sections.map((section, i) => (
                        <div key={i} className="space-y-6">
                            <h4 className="text-lg font-bold text-slate-900 border-l-4 border-[#faa819] pl-3">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link, j) => (
                                    <li key={j}>
                                        <Link 
                                            href={link.href} 
                                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 font-medium">
                        Copyright 2026 © <span className="text-blue-600">Adhyayan</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                         <a href={`${process.env.NEXT_PUBLIC_API_URL}/api`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-400 hover:text-blue-600 transition-colors">
                            API Documentation
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}