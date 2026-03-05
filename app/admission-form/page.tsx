"use client";

import AnimatedContent from "@/components/animated-content";
import Image from "next/image";
import { useState, ChangeEvent } from "react";

export default function AdmissionFormPage() {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <main className="min-h-screen py-32 bg-gray-50">
            <AnimatedContent className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 md:p-14 border border-gray-100">
                {/* Header */}
                <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    {/* LEFT : LOGO */}
                    <div className="flex-shrink-0">
                        <Image
                            src="/assets/images/brandminilogo.png"
                            alt="Adhyayan Logo"
                            width={160}
                            height={80}
                            className="object-contain"
                        />
                    </div>

                    {/* CENTER : TEXT */}
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 font-urbanist">
                            Admission Form
                        </h2>
                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            Adhyayan – An initiative by EICS Tutorial LLP
                        </p>
                    </div>

                    {/* RIGHT : PHOTO UPLOAD */}
                    <div className="w-32">
                        <label className="block text-sm font-semibold text-gray-600 mb-2 text-center">
                            Student Photo
                        </label>
                        <div className="relative w-32 h-36 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors">
                            {photoPreview ? (
                                <Image 
                                    src={photoPreview} 
                                    alt="Student Preview" 
                                    fill 
                                    className="object-cover" 
                                />
                            ) : (
                                <span className="text-xs text-gray-400 text-center px-2 font-medium">
                                    Click to upload<br />photo
                                </span>
                            )}
                            <input
                                type="file"
                                name="student_photo"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handlePhotoUpload}
                            />
                        </div>
                    </div>
                </div>

                <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Form No</label>
                            <input type="text" placeholder="Enter Form No" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                        <div className="relative lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Roll No</label>
                            <input type="text" placeholder="Enter Roll No" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Date</label>
                            <input type="date" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white text-gray-600" />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Bill No</label>
                            <input type="text" placeholder="Enter Bill No" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Batch No</label>
                            <input type="text" placeholder="Enter Batch No" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Course */}
                    <div>
                        <label className="text-lg font-bold text-blue-900 block mb-4 font-urbanist">Course</label>
                        <div className="flex flex-wrap gap-4">
                            {['AARAMBH', 'Aaradhanya', 'Aakriti', 'Abhyaas'].map((course) => (
                                <label key={course} className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="font-semibold text-gray-700">{course}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Class */}
                    <div>
                        <label className="text-lg font-bold text-blue-900 block mb-4 font-urbanist">Class</label>
                        <div className="flex flex-wrap gap-4">
                            {['VI–VIII', 'IX–X', 'XI–XII', 'NEET / JEE'].map((className) => (
                                <label key={className} className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                    <input type="radio" name="class" className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="font-semibold text-gray-700">{className}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Name */}
                    <div>
                        <label className="text-lg font-bold text-blue-900 block mb-6 font-urbanist">Personal Details</label>
                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <input type="text" placeholder="First Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                            <input type="text" placeholder="Middle Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                            <input type="text" placeholder="Last Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <input type="text" placeholder="Father's Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                            <input type="text" placeholder="Mother's Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <textarea placeholder="Postal Address" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white h-24 resize-none"></textarea>
                            <textarea placeholder="Permanent Address" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white h-24 resize-none"></textarea>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <input type="tel" placeholder="Student Phone No" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                            <input type="tel" placeholder="Guardian Phone No" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                            <input type="email" placeholder="Email ID" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                        <div className="grid md:grid-cols-4 gap-6 mb-6">
                            <input type="text" placeholder="Aadhaar No" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">DOB</label>
                                <input type="date" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white text-gray-600" />
                            </div>
                            <select className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white text-gray-600 appearance-none">
                                <option value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <input type="text" placeholder="Blood Group" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <input type="text" placeholder="Religion" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                            <input type="text" placeholder="Mother Tongue" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                            <input type="text" placeholder="School Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Academic Table */}
                    <div>
                        <label className="text-lg font-bold text-blue-900 block mb-6 font-urbanist">Academic Qualification</label>
                        <div className="space-y-4">
                            {[1, 2].map((num) => (
                                <div key={num} className="p-5 border border-gray-200 rounded-2xl bg-gray-50 space-y-4">
                                    <h4 className="font-semibold text-gray-700">Record {num}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                        <input placeholder="Exam Passed" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 text-sm" />
                                        <input placeholder="Year" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 text-sm" />
                                        <input placeholder="Board" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 text-sm" />
                                        <input placeholder="Subject" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 text-sm" />
                                        <input placeholder="Aggregate %" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 text-sm" />
                                        <input placeholder="Total Marks" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 text-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Signatures */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 border-dashed hover:border-blue-400 transition-colors">
                            <label className="font-bold text-gray-800 block mb-3">Student Signature <span className="text-red-500">*</span></label>
                            <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 border-dashed hover:border-blue-400 transition-colors">
                            <label className="font-bold text-gray-800 block mb-3">Guardian Signature <span className="text-red-500">*</span></label>
                            <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <button className="px-12 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95 w-full md:w-auto">
                            Submit Admission Form
                        </button>
                        <p className="text-sm text-gray-400 mt-4">* Please ensure all details are correct before submitting</p>
                    </div>
                </form>
            </AnimatedContent>
        </main>
    );
}
