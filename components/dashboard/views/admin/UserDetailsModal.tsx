"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XIcon,
  UserIcon,
  BookOpenIcon,
  PhoneIcon,
  MailIcon,
  GraduationCapIcon,
  CreditCardIcon,
  UsersIcon,
  LayersIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";
import { showToast } from "@/lib/toast";

interface UserWithDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  enrollmentId?: string;
  profileImage?: string;
  createdAt: string;
  admission?: any;
  enrollments?: any[];
  payments?: any[];
  batchesEnrolled?: any[];
  batchesTaught?: any[];
  coursesOwned?: any[];
  parentOf?: any[];
  studentOf?: any[];
  _count?: {
    enrollments: number;
    practiceTestResults: number;
    coursesOwned: number;
  };
}

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const Section = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: any }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <Icon className="size-4 text-indigo-500" />
      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h3>
    </div>
    {children}
  </div>
);

const Field = ({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: any }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon className="size-3" />}
      {label}
    </p>
    <p className="text-sm font-semibold text-slate-800 break-words">{value || "\u2014"}</p>
  </div>
);

export function UserDetailsModal({ userId, isOpen, onClose }: Props) {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) {
      setUser(null);
      return;
    }

    setIsLoading(true);
    const token = auth.getToken() || "";
    api
      .get<UserWithDetails>(`/admin/users/${userId}/details`, token)
      .then((data) => setUser(data))
      .catch(() => {
        showToast.error("Failed to load user details");
        onClose();
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, userId, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserIcon className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{user?.name || "User Details"}</h2>
                  <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-0.5">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-8">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregating platform data...</p>
                </div>
              ) : user ? (
                <div className="space-y-10">
                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Enrollment ID</p>
                      <p className="text-sm font-black text-slate-900">{user.enrollmentId || "PENDING"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Joined Date</p>
                      <p className="text-sm font-black text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Platform Status</p>
                      <p className="text-sm font-black text-emerald-600 uppercase">Active</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Role Type</p>
                      <p className="text-sm font-black text-indigo-600">{user.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Section title="Contact Information" icon={PhoneIcon}>
                      <div className="grid grid-cols-1 gap-4">
                        <Field label="Full Name" value={user.name} icon={UserIcon} />
                        <Field label="Email Address" value={user.email} icon={MailIcon} />
                        <Field label="Phone Number" value={user.phone} icon={PhoneIcon} />
                      </div>
                    </Section>

                    {user.role === "STUDENT" && user.admission && (
                      <Section title="Admission Details" icon={GraduationCapIcon}>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Father's Name" value={user.admission.fatherName} />
                          <Field label="Mother's Name" value={user.admission.motherName} />
                          <Field label="Class" value={user.admission.studentClass} />
                          <Field label="Stream" value={user.admission.stream} />
                        </div>
                      </Section>
                    )}

                    {user.role === "TEACHER" && (
                      <Section title="Teaching Analytics" icon={BookOpenIcon}>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Courses Owned" value={user._count?.coursesOwned?.toString()} />
                          <Field label="Batches Taught" value={user.batchesTaught?.length?.toString()} />
                        </div>
                      </Section>
                    )}

                    {user.role === "PARENT" && (
                      <Section title="Relations" icon={UsersIcon}>
                        <div className="space-y-3">
                          {user.parentOf?.map((rel: any) => (
                            <div key={rel.id} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                              <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <GraduationCapIcon className="size-4" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900">{rel.student.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Child / Student</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}
                  </div>

                  {/* Course Enrollments Section */}
                  {user.role === "STUDENT" && (
                    <Section title="Course Enrollments" icon={LayersIcon}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.enrollments?.map((enr: any) => (
                          <div key={enr.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                                  <BookOpenIcon className="size-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{enr.course.title}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enrolled {new Date(enr.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!user.enrollments || user.enrollments.length === 0) && (
                          <p className="text-xs text-slate-400 font-medium italic">No active enrollments found.</p>
                        )}
                      </div>
                    </Section>
                  )}

                  {/* Financial History Section - HIDDEN for Operations */}
                  {currentUser?.role !== Role.ACADEMIC_OPERATIONS && (user.role === Role.STUDENT || user.role === Role.ACCOUNTS) && (
                    <Section title="Payment History" icon={CreditCardIcon}>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              <th className="pb-3 px-2">Date</th>
                              <th className="pb-3 px-2">Amount</th>
                              <th className="pb-3 px-2">Mode</th>
                              <th className="pb-3 px-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {user.payments?.map((pay: any) => (
                              <tr key={pay.id} className="text-xs font-semibold">
                                <td className="py-3 px-2 text-slate-500">{new Date(pay.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-2 text-slate-900 font-black">\u20B9{pay.amount}</td>
                                <td className="py-3 px-2 text-slate-500">{pay.mode || "ONLINE"}</td>
                                <td className="py-3 px-2 text-right">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                    pay.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                  }`}>
                                    {pay.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {(!user.payments || user.payments.length === 0) && (
                          <p className="text-xs text-slate-400 font-medium italic mt-2 px-2">No transaction history recorded.</p>
                        )}
                      </div>
                    </Section>
                  )}
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 text-center shrink-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                System generated profile summary \u2022 Data last synced {new Date().toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
