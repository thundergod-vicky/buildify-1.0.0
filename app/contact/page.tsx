"use client";

import React from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  ArrowRight
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 🔹 Contact Header & Form Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <AnimatedContent>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#2945aa] font-primary">
                Get in Touch
              </h2>
              <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                We&apos;d love to hear from you. Reach out with your questions, feedback, or inquiries, and our team will respond shortly.
              </p>
            </AnimatedContent>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Form */}
            <AnimatedContent direction="horizontal">
              <form className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Select Course</label>
                    <select className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 appearance-none">
                      <option>Aarambh</option>
                      <option>Aaradhanya</option>
                      <option>Aakriti</option>
                      <option>Abhyaas</option>
                      <option>Aakanksha</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Your Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="Tell us how we can help you..." 
                    className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                  ></textarea>
                </div>

                <button className="bg-[#faa819] hover:bg-yellow-500 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                  Submit Inquiry
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </AnimatedContent>

            {/* Map */}
            <AnimatedContent direction="horizontal" reverse>
              <div className="rounded-[2rem] overflow-hidden shadow-2xl h-full min-h-[450px] border-8 border-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14631.23380590809!2d87.28768549899044!3d23.53939087755663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f7733e9119aae7%3A0xed18bcb8052d00fa!2sADHYAYAN!5e0!3m2!1sen!2sin!4v1768374038911!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* 🔹 WhatsApp CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-100 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedContent>
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 md:p-14 border border-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-extrabold text-[#2945aa] mb-3 font-primary">
                  Need Quick Assistance?
                </h3>
                <p className="text-gray-600 text-lg max-w-xl">
                  Chat directly with our academic counselors on WhatsApp and get instant guidance.
                </p>
              </div>

              <a 
                href="https://wa.me/919475974315" 
                target="_blank"
                className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-105 hover:shadow-emerald-500/20"
              >
                <MessageCircle className="w-7 h-7" />
                Chat on WhatsApp
              </a>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* 🔹 Contact Info Cards */}
      <section className="py-24 bg-[#2945aa] relative overflow-hidden px-6">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Call */}
            <AnimatedContent delay={0}>
              <div className="bg-white group p-10 rounded-[2.5rem] shadow-2xl relative transition-all duration-300 hover:-translate-y-2 h-full text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#faa819] rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-[#2945aa] mt-8 mb-4">Call Us</h4>
                <div className="space-y-2">
                  <a href="tel:919475974315" className="block text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors">
                    +91 9475 974 315
                  </a>
                  <a href="tel:03432548899" className="block text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors">
                    0343 2548899
                  </a>
                </div>
              </div>
            </AnimatedContent>

            {/* Email */}
            <AnimatedContent delay={100}>
              <div className="bg-white group p-10 rounded-[2.5rem] shadow-2xl relative transition-all duration-300 hover:-translate-y-2 h-full text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#faa819] rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-[#2945aa] mt-8 mb-4">Email Us</h4>
                <a href="mailto:adhyayan.durgapur@gmail.com" className="block text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors break-all">
                  adhyayan.durgapur@gmail.com
                </a>
              </div>
            </AnimatedContent>

            {/* Location */}
            <AnimatedContent delay={200}>
              <div className="bg-white group p-10 rounded-[2.5rem] shadow-2xl relative transition-all duration-300 hover:-translate-y-2 h-full text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#faa819] rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-[#2945aa] mt-8 mb-4">Our Branch</h4>
                <p className="text-gray-700 text-lg font-medium">
                  A3 Nandalal Bithi,<br />
                  City Center, Durgapur – 16
                </p>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>
    </div>
  );
}
