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

const admissionSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Full address is required"),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date of birth"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  alternateContact: z.string().optional().or(z.literal("")),
  studentClass: z.string().min(1, "Class selection is required"),
  stream: z.string().min(1, "Stream selection is required"),
  course: z.string().min(1, "Course selection is required"),
  enrollmentNumber: z.string().min(1, "Enrollment number is required"),
  schoolName: z.string().min(2, "School name is required"),
  board: z.string().min(2, "Board is required"),
  caste: z.string().min(1, "Caste selection is required"),
  batchCode: z.string().optional().or(z.literal("")),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

export default function AdmissionFormPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextNumbers, setNextNumbers] = useState({
    formNumber: "",
    enrollmentNumber: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      studentName: "",
      fatherName: "",
      motherName: "",
      email: "",
      address: "",
      dateOfBirth: "",
      contactNumber: "",
      alternateContact: "",
      studentClass: "",
      stream: "",
      course: "",
      enrollmentNumber: "",
      schoolName: "",
      board: "",
      caste: "GENERAL",
      batchCode: "",
    },
  });

  const selectedCourse = watch("course");
  const selectedClass = watch("studentClass");
  const selectedStream = watch("stream");

  // Redirect unauthenticated users once loading is done
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (isLoading || !user) return; // Wait for auth
    const fetchNumbers = async () => {
      try {
        const token = auth.getToken();
        const res = await admissionsApi.getNextNumbers(token || undefined);
        setNextNumbers(res);
        setValue("enrollmentNumber", res.enrollmentNumber);
      } catch (error) {
        console.error("Failed to fetch next numbers", error);
      }
    };
    fetchNumbers();
  }, [isLoading, user, setValue]);

  useEffect(() => {
    if (user) {
      reset({
        ...watch(),
        studentName: user.name || "",
        email: user.email || "",
        contactNumber: user.phone || "",
      });
    }
  }, [user, reset]); // Removed watch from deps to avoid loop, or use a more stable way

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AdmissionFormData) => {

    setIsSubmitting(true);
    const token = auth.getToken();
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value || "");
      });
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await admissionsApi.submitAdmission(formData, token || undefined);
      // Refresh user profile so user.admission is populated
      await auth.getProfile();
      toast.success(
        "Admission Form Submitted Successfully! Awaiting Approval.",
      );
      // Hard reload to re-initialize AuthContext with fresh user data
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || "Failed to submit admission form",
      );
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
    <main className="min-h-screen py-32 bg-gray-50">
      <AnimatedContent className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 md:p-14 border border-gray-100">
        {/* Header */}
        <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="flex-shrink-0">
            <Image
              src="/assets/images/brandminilogo.png"
              alt="Adhyayan Logo"
              width={160}
              height={80}
              className="object-contain"
            />
          </div>

          <div className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 font-urbanist">
              Admission Form
            </h2>
          </div>

          <div className="w-32">
            <label className="block text-sm font-semibold text-gray-600 mb-2 text-center">
              Student Photo <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative w-32 h-36 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 group hover:border-blue-500 hover:bg-blue-50/50 transition-colors">
              {photoPreview ? (
                <>
                  <Image
                    src={photoPreview}
                    alt="Student Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setPhotoPreview(null);
                      setPhotoFile(null);
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-gray-400 text-center px-2 font-medium">
                    Click to upload
                    <br />
                    photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handlePhotoUpload}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
          {/* Office Use Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Date of Admission
              </label>
              <input
                type="text"
                disabled
                value={new Date().toLocaleDateString()}
                className="w-full p-4 rounded-xl border border-gray-200 outline-none transition-all bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Form Number
              </label>
              <input
                type="text"
                disabled
                value={nextNumbers.formNumber || "Generating..."}
                className="w-full p-4 rounded-xl border border-gray-200 outline-none transition-all bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Batch Code
              </label>
              <input
                type="text"
                disabled
                placeholder="To be filled by operations"
                className="w-full p-4 rounded-xl border border-gray-200 outline-none transition-all bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Enrollment Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("enrollmentNumber")}
                placeholder="Auto generated, but can be edited"
                className={`w-full p-4 rounded-xl border outline-none transition-all bg-gray-50/50 focus:bg-white ${errors.enrollmentNumber ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
              />
              {errors.enrollmentNumber && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.enrollmentNumber.message}
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Course Selection */}
          <div>
            <label className="text-lg font-bold text-blue-900 block mb-4 font-urbanist">
              Course <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                "Aarambh (Class 6–8)",
                "Aaradhana (Class 9–10)",
                "Aakriti (Class 11–12)",
                "Abhyaas (After Class 12)",
              ].map((course) => (
                <label
                  key={course}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-colors ${selectedCourse === course ? "bg-blue-50 border-blue-500 shadow-sm" : "bg-gray-50 border-gray-200 hover:bg-blue-50/50"}`}
                >
                  <input
                    type="radio"
                    {...register("course")}
                    value={course}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCourse === course ? "border-blue-500" : "border-gray-300"}`}
                  >
                    {selectedCourse === course && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="font-semibold text-gray-700">{course}</span>
                </label>
              ))}
            </div>
            {errors.course && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.course.message}
              </p>
            )}
          </div>

          {/* Class & Stream Selection */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-lg font-bold text-blue-900 block mb-4 font-urbanist">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {["6", "7", "8", "9", "10", "11", "12", "12+"].map((cls) => (
                  <label
                    key={cls}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${selectedClass === cls ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200 hover:border-blue-200"}`}
                  >
                    <input
                      type="radio"
                      {...register("studentClass")}
                      value={cls}
                      className="hidden"
                    />
                    <span
                      className={`text-sm font-medium ${selectedClass === cls ? "text-blue-600" : "text-gray-700"}`}
                    >
                      Class {cls}
                    </span>
                  </label>
                ))}
              </div>
              {errors.studentClass && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.studentClass.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-lg font-bold text-blue-900 block mb-4 font-urbanist">
                Stream <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {["Foundation", "NEET", "JEE"].map((stream) => (
                  <label
                    key={stream}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${selectedStream === stream ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200 hover:border-blue-200"}`}
                  >
                    <input
                      type="radio"
                      {...register("stream")}
                      value={stream}
                      className="hidden"
                    />
                    <span
                      className={`text-sm font-medium ${selectedStream === stream ? "text-blue-600" : "text-gray-700"}`}
                    >
                      {stream}
                    </span>
                  </label>
                ))}
              </div>
              {errors.stream && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.stream.message}
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Personal Details */}
          <div>
            <label className="text-lg font-bold text-blue-900 block mb-6 font-urbanist">
              Personal Details
            </label>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("studentName")}
                  placeholder="Enter Student Name"
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white ${errors.studentName ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                />
                {errors.studentName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.studentName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("fatherName")}
                  placeholder="Enter Father's Name"
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white ${errors.fatherName ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.fatherName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Mother's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("motherName")}
                  placeholder="Enter Mother's Name"
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white ${errors.motherName ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                />
                {errors.motherName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.motherName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("address")}
                  placeholder="Enter Full Address"
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white h-24 resize-none ${errors.address ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("contactNumber")}
                  placeholder="Enter Contact Number"
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white ${errors.contactNumber ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Alt Contact Number
                </label>
                <input
                  type="tel"
                  {...register("alternateContact")}
                  placeholder="Enter Alternate Contact"
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter Email Address"
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white ${errors.email ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white text-gray-600 ${errors.dateOfBirth ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("schoolName")}
                  placeholder="Enter School Name"
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white ${errors.schoolName ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                />
                {errors.schoolName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.schoolName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Board <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("board")}
                  placeholder="Enter Board (CBSE, ICSE, etc)"
                  className={`w-full p-4 rounded-xl border outline-none transition-all focus:bg-white ${errors.board ? "border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                />
                {errors.board && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.board.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Caste <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("caste")}
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white text-gray-600 appearance-none"
                >
                  <option value="GENERAL">General</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="EWS">EWS</option>
                </select>
                {errors.caste && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.caste.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95 w-full md:w-auto disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Admission Form"
              )}
            </button>
            <p className="text-sm text-gray-400 mt-4">
              * Please ensure all details are correct before submitting
            </p>
          </div>
        </form>
      </AnimatedContent>
    </main>
  );
}
