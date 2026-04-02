"use client";

import AnimatedContent from "@/components/animated-content";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { admissionsApi } from "@/lib/admissions";
import { auth } from "@/lib/auth";

const parentSchema = z.object({
  parentName: z.string().min(2, "Name is required"),
  fatherOrSpouseName: z.string().min(2, "Father/Spouse name is required"),
  studentName: z.string().min(2, "Student's name is required"),
  studentEmail: z.string().email("Invalid student email"),
  address: z.string().min(5, "Full address is required"),
  willingToTakeResp: z.boolean().refine(val => val === true, "You must agree to take responsibility"),
});

type ParentFormData = z.infer<typeof parentSchema>;

export default function ParentOnboardingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      parentName: "",
      fatherOrSpouseName: "",
      studentName: "",
      studentEmail: "",
      address: "",
      willingToTakeResp: false,
    },
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user && user.role === 'PARENT') {
      reset({
        parentName: user.name || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ParentFormData) => {
    setIsSubmitting(true);
    const token = auth.getToken();
    try {
      await admissionsApi.submitParentOnboarding(data, token || undefined);
      toast.success("Onboarding form submitted successfully!");
      // Re-fetch profile to ensure dashboard has parentOnboarding and link requests
      if (typeof (window as any).refreshUserProfile === 'function') {
        await (window as any).refreshUserProfile();
      }
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to submit onboarding form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen py-32 bg-gray-50 uppercase-none">
      <AnimatedContent className="max-w-4xl mx-auto bg-white shadow-2xl rounded-[2.5rem] p-10 md:p-14 border border-gray-100">
        <div className="flex flex-col items-center mb-12 text-center">
          <Image
            src="/assets/images/brandminilogo.png"
            alt="Adhyayan Logo"
            width={120}
            height={60}
            className="mb-8"
          />
          <h1 className="text-3xl md:text-4xl font-black text-blue-900 font-urbanist mb-3">
            Parent Onboarding
          </h1>
          <p className="text-gray-400 font-medium max-w-md">
            Please provide your details to complete the onboarding process and link with your ward.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("parentName")}
                placeholder="Enter your name"
                className={`w-full p-4 rounded-2xl border outline-none transition-all bg-gray-50/50 focus:bg-white ${errors.parentName ? "border-red-500" : "border-gray-100 focus:border-blue-500"}`}
              />
              {errors.parentName && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.parentName.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                 Father / Spouse Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("fatherOrSpouseName")}
                placeholder="Enter father or spouse name"
                className={`w-full p-4 rounded-2xl border outline-none transition-all bg-gray-50/50 focus:bg-white ${errors.fatherOrSpouseName ? "border-red-500" : "border-gray-100 focus:border-blue-500"}`}
              />
              {errors.fatherOrSpouseName && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.fatherOrSpouseName.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Student&apos;s Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("studentName")}
                placeholder="Enter ward's name"
                className={`w-full p-4 rounded-2xl border outline-none transition-all bg-gray-50/50 focus:bg-white ${errors.studentName ? "border-red-500" : "border-gray-100 focus:border-blue-500"}`}
              />
              {errors.studentName && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.studentName.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Student&apos;s Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("studentEmail")}
                placeholder="Enter ward's email"
                className={`w-full p-4 rounded-2xl border outline-none transition-all bg-gray-50/50 focus:bg-white ${errors.studentEmail ? "border-red-500" : "border-gray-100 focus:border-blue-500"}`}
              />
              {errors.studentEmail && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.studentEmail.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Current Residential Address <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("address")}
              placeholder="Enter full address"
              rows={3}
              className={`w-full p-4 rounded-2xl border outline-none transition-all bg-gray-50/50 focus:bg-white resize-none ${errors.address ? "border-red-500" : "border-gray-100 focus:border-blue-500"}`}
            />
            {errors.address && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.address.message}</p>}
          </div>

          <div className="pt-4">
            <label className="flex items-start gap-4 p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100 cursor-pointer group hover:bg-blue-50 transition-all">
              <input
                type="checkbox"
                {...register("willingToTakeResp")}
                className="mt-1 size-5 rounded-lg border-2 border-blue-200 text-blue-600 focus:ring-blue-500 transition-all"
              />
              <span className="text-sm font-bold text-blue-900 leading-snug">
                Are you willing to take all responsibility of the student&apos;s academic outcomes and support their learning journey at Adhyayan?
              </span>
            </label>
            {errors.willingToTakeResp && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.willingToTakeResp.message}</p>}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 disabled:opacity-50 active:scale-[0.98]"
            >
              {isSubmitting ? "Submitting..." : "Complete Onboarding"}
            </button>
          </div>
        </form>
      </AnimatedContent>
    </main>
  );
}
