"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Lock, Mail } from "lucide-react";

function GoogleLoginButton() {
    return (
        <a
            href="#"
            className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
            <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
            Continue with Google
        </a>
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
                                <p className="text-sm text-gray-500 mt-5 mb-3">or</p>
                                <GoogleLoginButton />
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
                                <p className="text-sm text-gray-500 mt-5 mb-3">or</p>
                                <GoogleLoginButton />
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
                        <p className="text-sm text-gray-500 mt-6 mb-4">or</p>
                        <GoogleLoginButton />
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
                        <p className="text-sm text-gray-500 mt-6 mb-4">or</p>
                        <GoogleLoginButton />
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
