"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  TrophyIcon, 
  AwardIcon, 
  MedalIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  StarIcon,
  Share2Icon,
  UserIcon
} from "lucide-react";
import AnimatedContent from "@/components/animated-content";
import { toast } from "react-toastify";
import { resolveImageUrl } from "@/lib/utils";

const MEDAL_COLORS: Record<string, string> = {
  WOOD: "text-[#8B4513] bg-[#8B4513]/10",
  STONE: "text-[#808080] bg-[#808080]/10",
  IRON: "text-[#A19D94] bg-[#A19D94]/10",
  SILVER: "text-[#C0C0C0] bg-[#C0C0C0]/10",
  GOLD: "text-[#FFD700] bg-[#FFD700]/10",
  DIAMOND: "text-[#B9F2FF] bg-[#B9F2FF]/10",
  PLATINUM: "text-[#E5E4E2] bg-[#E5E4E2]/10",
  VIBRANIUM: "text-[#50C878] bg-[#50C878]/10",
};

const GRADE_COLORS: Record<string, string> = {
  E: "text-emerald-600 bg-emerald-50",
  A_PLUS: "text-emerald-500 bg-emerald-50",
  A: "text-emerald-500 bg-emerald-50",
  B_PLUS: "text-blue-600 bg-blue-50",
  B: "text-yellow-500 bg-blue-50",
  C_PLUS: "text-purple-600 bg-purple-50",
  C: "text-purple-500 bg-purple-50",
  D_PLUS: "text-blue-600 bg-blue-50",
  D: "text-yellow-500 bg-blue-50",
  F: "text-red-600 bg-red-50",
};

export default function PublicProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
        const res = await fetch(`${apiUrl}/public/profile/${slug}`);
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="size-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-400 animate-pulse tracking-widest uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
          <UserIcon className="size-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Profile Private or Not Found</h1>
        <p className="text-gray-500 mt-2 max-w-md font-medium">The student profile you&apos;re looking for doesn&apos;t exist or has been made private by the student.</p>
        <Link href="/" className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200">
          Back to Home
        </Link>
      </div>
    );
  }

  const settings = profile.profileSettings || {
    showMedals: true,
    showGrades: true,
    showCourses: true,
    showTestResults: true
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-urbanist">
      <div className="bg-white border-b border-gray-100 pt-16 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimatedContent>
            <div className="flex flex-col items-center text-center">
              <div className="size-32 bg-blue-100 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-blue-600 mb-6 relative overflow-hidden group rotate-3">
                {profile.profileImage ? (
                  <img 
                    src={resolveImageUrl(profile.profileImage)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name?.[0] || "?"
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black text-white tracking-widest uppercase -rotate-3">
                    ADHYAYAN
                </div>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight italic">{profile.name}</h1>
              <div className="flex items-center gap-2 mt-4 text-blue-600 font-bold bg-blue-50 px-6 py-1.5 rounded-full text-sm border border-blue-100">
                <StarIcon className="size-4 fill-current" />
                Verified Adhyayan Student
              </div>
            </div>
          </AnimatedContent>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-50/30 -skew-x-12 -translate-x-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(settings.showMedals || settings.showGrades) && (
              <AnimatedContent delay={0.1}>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/20">
                  <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                    <MedalIcon className="size-6 text-blue-600" />
                    Academic Achievements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {settings.showMedals && (
                      <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all group">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">Honorary Medal</p>
                        {profile.medal ? (
                          <div className="flex items-center gap-5">
                            <div className={`size-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 ${MEDAL_COLORS[profile.medal]}`}>
                              <TrophyIcon className="size-10" />
                            </div>
                            <div>
                              <p className="font-black text-2xl text-gray-900 leading-tight">{profile.medal}</p>
                              <p className="text-xs text-gray-500 font-medium mt-1">Given by {profile.assignedByTeacher?.name || "Teacher"}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 opacity-40">
                             <div className="size-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                               <TrophyIcon className="size-10 text-gray-300" />
                             </div>
                             <p className="text-sm text-gray-400 font-bold italic">No medal earned yet</p>
                          </div>
                        )}
                      </div>
                    )}
                    {settings.showGrades && (
                      <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all group">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">Latest Academic Grade</p>
                        {profile.grade ? (
                          <div className="flex items-center gap-5">
                            <div className={`size-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:-rotate-6 ${GRADE_COLORS[profile.grade]}`}>
                              <AwardIcon className="size-10" />
                            </div>
                            <div>
                              <p className="font-black text-4xl text-gray-900 leading-tight">{profile.grade.replace("_PLUS", "+")}</p>
                              <p className="text-xs text-gray-500 font-medium mt-1 italic">Quality of Excellence</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 opacity-40">
                             <div className="size-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                               <AwardIcon className="size-10 text-gray-300" />
                             </div>
                             <p className="text-sm text-gray-400 font-bold italic">No grade assigned yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedContent>
            )}

            {settings.showCourses && (
              <AnimatedContent delay={0.2}>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/20">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                      <CheckCircle2Icon className="size-6 text-emerald-600" />
                      Completed Courses
                    </h2>
                    <div className="px-4 py-1.5 bg-emerald-50 rounded-2xl text-xs font-black text-emerald-600 uppercase tracking-widest">
                      {profile.enrollments?.length || 0} Total
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.enrollments?.map((e: any) => (
                      <div key={e.course.id} className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:bg-white hover:border-emerald-100 transition-all">
                         <div className="size-16 bg-white rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 relative shadow-sm group-hover:scale-105 transition-transform">
                           {e.course.thumbnail ? (
                             <Image src={e.course.thumbnail} alt="" fill className="object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                               <BookOpenIcon className="size-6" />
                             </div>
                           )}
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-black text-gray-900 text-base leading-tight truncate">{e.course.title}</h4>
                           <p className="text-[10px] text-emerald-600 font-black uppercase mt-1 tracking-widest">Verified Completion</p>
                         </div>
                      </div>
                    ))}
                    {(!profile.enrollments || profile.enrollments.length === 0) && (
                      <div className="col-span-full py-16 text-center">
                        <div className="size-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 grayscale opacity-40">
                           <BookOpenIcon className="size-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 font-bold italic">No public courses displayed</p>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedContent>
            )}

            {settings.showTestResults && (
              <AnimatedContent delay={0.3}>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/20">
                  <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                    <AwardIcon className="size-6 text-blue-600" />
                    Practice Hall of Fame
                  </h2>
                  <div className="space-y-4">
                    {profile.practiceTestResults?.map((r: any) => (
                      <div key={r.id} className="group flex items-center justify-between p-5 border border-gray-100 rounded-3xl bg-gray-50/50 hover:bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all hover:translate-x-2">
                        <div className="flex items-center gap-4">
                          <div className="size-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <CheckCircle2Icon className="size-6" />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-base tracking-tight">{r.test.title}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{new Date(r.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-gray-900 leading-none">{Math.round((r.score/r.total)*100)}%</p>
                          <p className="text-[10px] text-emerald-600 font-black uppercase mt-1 tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Success</p>
                        </div>
                      </div>
                    ))}
                    {(!profile.practiceTestResults || profile.practiceTestResults.length === 0) && (
                      <p className="text-center py-16 text-gray-400 font-bold italic">No hall of fame tests visible</p>
                    )}
                  </div>
                </div>
              </AnimatedContent>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            <AnimatedContent delay={0.4}>
              <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group/pulse">
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-8 tracking-tight italic">Learning Pulse</h3>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover/pulse:scale-110 transition-transform">
                          <BookOpenIcon className="size-7" />
                        </div>
                        <span className="font-black text-lg">Courses</span>
                      </div>
                      <span className="text-4xl font-black italic">{profile.enrollments?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover/pulse:scale-110 transition-transform">
                          <CheckCircle2Icon className="size-7" />
                        </div>
                        <span className="font-black text-lg">Tests</span>
                      </div>
                      <span className="text-4xl font-black italic">{profile.practiceTestResults?.length || 0}</span>
                    </div>
                    <div className="pt-8 border-t border-white/20 mt-8">
                      <p className="text-[10px] opacity-70 mb-2 uppercase font-black tracking-widest">Global Adhyayan Rank</p>
                      <div className="text-4xl font-black flex items-end gap-3 italic">
                        Top 5% 
                        <span className="text-base opacity-60 mb-2 font-black not-italic tracking-widest uppercase">Scholar</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Profile link copied!");
                    }}
                    className="w-full mt-12 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                  >
                    <Share2Icon className="size-5" />
                    Share Profile
                  </button>
                </div>
                <div className="absolute -bottom-20 -left-20 size-60 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -right-20 size-60 bg-black/10 rounded-full blur-3xl"></div>
              </div>
            </AnimatedContent>
            <AnimatedContent delay={0.5}>
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/20">
                <h3 className="text-xl font-black text-gray-900 mb-4 italic tracking-tight">About Adhyayan</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Adhyayan is a premier learning platform dedicated to providing students with high-quality education and tracking their academic growth through a personalized achievement system.
                </p>
                <div className="mt-8">
                  <Link href="/auth" className="inline-flex items-center gap-2 text-blue-600 font-black text-sm hover:gap-3 transition-all">
                    Start Your Learning Journey
                    <span className="text-xl">→</span>
                  </Link>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </div>
  );
}
