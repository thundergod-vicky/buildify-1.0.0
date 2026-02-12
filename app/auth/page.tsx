"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Lock, Mail } from "lucide-react";

const socialIcons = ["Google", "Facebook", "Github", "Linkedin"];

function SocialIconsRow() {
    return (
        <div className="flex justify-center gap-2">
            {socialIcons.map((name) => (
                <a
                    key={name}
                    href="#"
                    className="inline-flex p-2.5 border-2 border-gray-200 rounded-lg text-gray-600 hover:border-orange-200 hover:text-orange-500 transition-colors"
                >
                    <span className="sr-only">{name}</span>
                    <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                </a>
            ))}
        </div>
    );
}

export default function AuthPage() {
    const [active, setActive] = useState(false);

    return (
        <main className="min-h-screen flex justify-center items-center px-4 py-8 bg-gradient-to-r from-gray-200 to-orange-100/50">
            {/* Mobile: stacked layout with tab */}
            <div className="auth-mobile w-full max-w-md md:hidden">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setActive(false)}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                                !active
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setActive(true)}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                                active
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Register
                        </button>
                    </div>
                    {/* Forms - one visible at a time */}
                    <div className="p-6 pb-8">
                        {!active ? (
                            <form action="#" className="w-full" onSubmit={(e) => e.preventDefault()}>
                                <h1 className="text-2xl font-bold font-urbanist mb-5">Login</h1>
                                <div className="relative my-4">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        required
                                        className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                                    />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                                </div>
                                <div className="relative my-4">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                                </div>
                                <div className="-mt-1 mb-3 text-left">
                                    <Link href="#" className="text-sm text-gray-600 hover:text-orange-500">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-lg bg-orange-500 text-white font-semibold text-base shadow-md hover:bg-orange-600 transition-colors"
                                >
                                    Login
                                </button>
                                <p className="text-sm text-gray-500 mt-5 mb-3">or login with social platforms</p>
                                <SocialIconsRow />
                            </form>
                        ) : (
                            <form action="#" className="w-full" onSubmit={(e) => e.preventDefault()}>
                                <h1 className="text-2xl font-bold font-urbanist mb-5">Registration</h1>
                                <div className="relative my-4">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        required
                                        className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                                    />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                                </div>
                                <div className="relative my-4">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                                </div>
                                <div className="relative my-4">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-lg bg-orange-500 text-white font-semibold text-base shadow-md hover:bg-orange-600 transition-colors mt-1"
                                >
                                    Register
                                </button>
                                <p className="text-sm text-gray-500 mt-5 mb-3">or register with social platforms</p>
                                <SocialIconsRow />
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop: split layout with sliding panels */}
            <div
                className={`auth-container relative w-full max-w-[850px] h-[550px] bg-white rounded-3xl shadow-xl overflow-hidden hidden md:block ${active ? "active" : ""}`}
            >
                {/* Login form */}
                <div
                    className={`form-box absolute right-0 top-0 w-1/2 h-full flex items-center text-gray-800 text-center p-8 md:p-10 z-[1] transition-[right] duration-[0.6s] ease-in-out delay-300 ${
                        active ? "right-1/2 invisible pointer-events-none" : "right-0"
                    }`}
                >
                    <form action="#" className="w-full" onSubmit={(e) => e.preventDefault()}>
                        <h1 className="text-3xl md:text-4xl font-bold font-urbanist mb-6">Login</h1>
                        <div className="relative my-6">
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                            />
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                        </div>
                        <div className="relative my-6">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                            />
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                        </div>
                        <div className="-mt-2 mb-4 text-left">
                            <Link href="#" className="text-sm text-gray-600 hover:text-orange-500">
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 rounded-lg bg-orange-500 text-white font-semibold text-base shadow-md hover:bg-orange-600 transition-colors"
                        >
                            Login
                        </button>
                        <p className="text-sm text-gray-500 mt-6 mb-4">or login with social platforms</p>
                        <SocialIconsRow />
                    </form>
                </div>

                {/* Register form */}
                <div
                    className={`form-box absolute top-0 w-1/2 h-full flex items-center text-gray-800 text-center p-8 md:p-10 z-[2] transition-[right] duration-[0.6s] ease-in-out delay-300 ${
                        active ? "right-1/2 visible" : "right-0 invisible pointer-events-none"
                    }`}
                >
                    <form action="#" className="w-full" onSubmit={(e) => e.preventDefault()}>
                        <h1 className="text-3xl md:text-4xl font-bold font-urbanist mb-6">Registration</h1>
                        <div className="relative my-6">
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                            />
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                        </div>
                        <div className="relative my-6">
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                            />
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                        </div>
                        <div className="relative my-6">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-0 outline-none text-base text-gray-800 font-medium placeholder:text-gray-500"
                            />
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 rounded-lg bg-orange-500 text-white font-semibold text-base shadow-md hover:bg-orange-600 transition-colors mt-2"
                        >
                            Register
                        </button>
                        <p className="text-sm text-gray-500 mt-6 mb-4">or register with social platforms</p>
                        <SocialIconsRow />
                    </form>
                </div>

                {/* Toggle overlay and panels */}
                <div className="toggle-box absolute inset-0 pointer-events-none">
                    <div
                        className="absolute h-full w-[300%] bg-orange-500 rounded-[150px] z-[2] transition-[left] duration-[1.8s] ease-in-out"
                        style={{ left: active ? "50%" : "-250%" }}
                    />
                    <div
                        className="toggle-panel-left absolute left-0 top-0 w-1/2 h-full text-white flex flex-col justify-center items-center z-[3] transition-[left] duration-[0.6s] ease-in-out delay-300 pointer-events-auto"
                        style={{ left: active ? "-50%" : "0" }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold font-urbanist mb-2">Hello, Welcome!</h1>
                        <p className="text-sm md:text-base mb-5">Don&apos;t have an account?</p>
                        <button
                            type="button"
                            onClick={() => setActive(true)}
                            className="w-40 h-12 rounded-lg bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
                        >
                            Register
                        </button>
                    </div>
                    <div
                        className="toggle-panel-right absolute top-0 w-1/2 h-full text-white flex flex-col justify-center items-center z-[3] transition-[right] duration-[0.6s] ease-in-out pointer-events-auto"
                        style={{ right: active ? "0" : "-50%", transitionDelay: active ? "0.6s" : "0.3s" }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold font-urbanist mb-2">Welcome Back!</h1>
                        <p className="text-sm md:text-base mb-5">Already have an account?</p>
                        <button
                            type="button"
                            onClick={() => setActive(false)}
                            className="w-40 h-12 rounded-lg bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
