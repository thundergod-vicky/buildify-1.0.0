"use client";
import { links } from "@/data/links";
import { ILink } from "@/types";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AnimatedContent from "./animated-content";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <AnimatedContent reverse>
                <nav className='fixed w-full top-0 z-50 px-4 md:px-16 lg:px-24 xl:px-32 py-4 border-b transition-all duration-300 border-neutral-300'>
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link href="#!">
                            <Image src="/assets/logo.svg" alt="Adhyayan Logo" width={135} height={36} />
                        </Link>

                        <div className="hidden md:flex gap-3">
                            {links.map((link: ILink) => (
                                <Link key={link.name} href={link.href} className="py-1 px-3 hover:text-zinc-500">
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <MenuIcon className="size-6.5" />
                        </button>

                        <Link href="#!" className="hidden md:inline-block py-2.5 px-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] bg-orange-500 text-white rounded-full">
                            Get Started
                        </Link>
                    </div>
                </nav>
            </AnimatedContent>
            <div className={`fixed top-0 right-0 z-60 w-full bg-white shadow-xl shadow-black/5 transition-all duration-300 ease-in-out ${isMenuOpen ? "h-92 overflow-hidden" : "h-0 overflow-hidden"}`}>
                <div className="flex items-center justify-between p-4">
                    <Image src="/assets/logo.svg" alt="Adhyayan Logo" width={135} height={36} />
                    <XIcon className="size-6.5" onClick={() => setIsMenuOpen(false)} />
                </div>
                <div className="flex flex-col gap-4 p-4 text-base">
                    {links.map((link: ILink) => (
                        <Link key={link.name} href={link.href} className="py-1 px-3" onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </Link>
                    ))}
                    <Link href="#!" className="py-2.5 px-6 w-max text-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] bg-linear-to-tl from-orange-600 to-orange-500 text-white rounded-full">
                        Get Started
                    </Link>
                </div>
            </div>
        </>
    );
}