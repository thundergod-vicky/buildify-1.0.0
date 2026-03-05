"use client";

import { links } from "@/data/links";
import { ILink } from "@/types";
import { MenuIcon, XIcon, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AnimatedContent from "./animated-content";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isBluePage = pathname === '/about' || 
                      pathname?.startsWith('/programs') || 
                      pathname === '/fee-deposition-modes' || 
                      pathname === '/admission-counselling' || 
                      pathname === '/adsat' || 
                      pathname?.startsWith('/course-details') ||
                      pathname === '/learning-experience' ||
                      pathname === '/privacy' ||
                      pathname === '/terms' ||
                      pathname === '/refund-rules' ||
                      pathname === '/result' ||
                      pathname === '/resources';

    const useWhiteText = !scrolled && isBluePage;

    return (
        <>
        <nav className={`fixed w-full top-0 z-[100] transition-all duration-300 ${
            scrolled ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100" : "bg-transparent"
        }`}>
            <AnimatedContent reverse>
                <div className="px-4 md:px-8 lg:px-16 xl:px-24 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link href="/" className="flex-shrink-0">
                            <Image 
                                src="/assets/images/brandlogo.png" 
                                alt="Adhyayan Logo" 
                                width={180} 
                                height={50} 
                                className={`h-12 w-auto transition-all duration-300 ${useWhiteText ? 'brightness-0 invert' : ''}`} 
                            />
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                            {links.map((link: ILink) => (
                                <div 
                                    key={link.name} 
                                    className="relative group"
                                    onMouseEnter={() => link.subLinks && setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link 
                                        href={link.href} 
                                        className={`flex items-center gap-1 py-2 px-3 text-[15px] font-semibold transition-colors duration-200 ${
                                            scrolled 
                                                ? "text-slate-700 hover:text-blue-600" 
                                                : useWhiteText 
                                                    ? "text-blue-50/90 hover:text-white" 
                                                    : "text-slate-800 hover:text-blue-600"
                                        }`}
                                    >
                                        {link.name}
                                        {link.subLinks && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {link.subLinks && (
                                        <div className={`absolute left-0 top-full pt-2 w-64 transition-all duration-300 ${
                                            activeDropdown === link.name ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
                                        }`}>
                                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 grid gap-1">
                                                {link.subLinks.map((sub) => (
                                                    <Link 
                                                        key={sub.name} 
                                                        href={sub.href}
                                                        className="px-4 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-sm font-medium transition-all duration-200"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <Link 
                                href="/auth" 
                                className="hidden md:inline-flex items-center justify-center py-2.5 px-6 font-bold text-sm bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-95 transition-all duration-200"
                            >
                                Get Started
                            </Link>

                            <button 
                                className={`lg:hidden p-2 rounded-xl transition-colors ${
                                    useWhiteText ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-600'
                                }`} 
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </AnimatedContent>
        </nav>

            {/* Mobile Sidebar Menu */}
            <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isMenuOpen ? "visible" : "invisible"}`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>

                {/* Content */}
                <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <Image src="/assets/images/brandlogo.png" alt="Adhyayan Logo" width={150} height={40} className="h-10 w-auto" />
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <XIcon className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            {links.map((link: ILink) => (
                                <div key={link.name} className="space-y-1">
                                    {link.subLinks ? (
                                        <>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-700 font-bold">
                                                {link.name}
                                            </div>
                                            <div className="pl-4 border-l-2 border-slate-100 ml-4 mt-2 space-y-2">
                                                {link.subLinks.map((sub) => (
                                                    <Link 
                                                        key={sub.name} 
                                                        href={sub.href} 
                                                        className="block p-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <Link 
                                            href={link.href} 
                                            className="block p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold transition-all"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <Link 
                                href="/auth" 
                                className="flex items-center justify-center w-full py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}