"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  XIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  BookOpenIcon,
  PhoneIcon,
  MailIcon,
  HomeIcon,
  GraduationCapIcon,
  CalendarIcon,
  HashIcon,
  ImageIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { showToast } from "@/lib/toast";

interface Admission {
  id: string;
  studentId: string;
  formNumber: string;
  enrollmentNumber: string;
  admissionDate: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  email: string;
  address: string;
  dateOfBirth: string;
  contactNumber: string;
  alternateContact?: string;
  studentClass: string;
  stream: string;
  course: string;
  batchCode?: string;
  schoolName: string;
  board: string;
  caste: string;
  photoUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  student?: { name: string; email: string };
}

interface Props {
  studentId: string;
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void; // callback to refresh parent list
}

const Field = ({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ElementType }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon className="size-3" />}
      {label}
    </p>
    <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
  </div>
);

export function AdmissionApprovalModal({ studentId, studentName, isOpen, onClose, onAction }: Props) {
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [photoBlobUrl, setPhotoBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    if (!isOpen || !studentId) {
      setAdmission(null);
      if (photoBlobUrl) {
        URL.revokeObjectURL(photoBlobUrl);
        setPhotoBlobUrl(null);
      }
      return;
    }

    setIsLoading(true);
    const token = auth.getToken() || "";
    api
      .get<Admission>(`/admissions/student/${studentId}`, token)
      .then(async (data) => {
        setAdmission(data);
        if (data && data.photoUrl) {
          try {
            const blob = await api.getBlob(`/admissions/photo/${data.id}`, token);
            const url = URL.createObjectURL(blob);
            setPhotoBlobUrl(url);
          } catch (err) {
            console.error("Failed to fetch photo blob:", err);
          }
        }
      })
      .catch(() => setAdmission(null))
      .finally(() => setIsLoading(false));

    return () => {
      if (photoBlobUrl) {
        URL.revokeObjectURL(photoBlobUrl);
        setPhotoBlobUrl(null);
      }
    };
  }, [isOpen, studentId]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!admission) return;
    setIsActing(true);
    const token = auth.getToken() || "";
    try {
      await api.patch(`/admissions/${admission.id}/${action}`, {}, token);
      showToast.success(`Admission ${action === "approve" ? "approved" : "rejected"} successfully`);
      onAction();
      onClose();
    } catch {
      showToast.error(`Failed to ${action} admission`);
    } finally {
      setIsActing(false);
    }
  };

  const statusColor = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900">Admission Application</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{studentName}</p>
              </div>
              <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                <XIcon className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-8">
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !admission ? (
                <div className="text-center py-16 text-slate-400">
                  <GraduationCapIcon className="size-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No admission form submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${statusColor[admission.status]}`}>
                      {admission.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Submitted {new Date(admission.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Photo + IDs */}
                  <div className="flex gap-6 items-start">
                    <div className="shrink-0 w-24 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                      {photoBlobUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoBlobUrl} alt="Student" className="w-full h-full object-cover" />
                      ) : admission.photoUrl ? (
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ImageIcon className="size-8 text-slate-300" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <Field label="Form Number" value={admission.formNumber} icon={HashIcon} />
                      <Field label="Enrollment No." value={admission.enrollmentNumber} icon={HashIcon} />
                      <Field label="Admission Date" value={new Date(admission.admissionDate).toLocaleDateString()} icon={CalendarIcon} />
                      <Field label="Date of Birth" value={new Date(admission.dateOfBirth).toLocaleDateString()} icon={CalendarIcon} />
                    </div>
                  </div>

                  {/* Personal */}
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Personal Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                      <Field label="Student Name" value={admission.studentName} icon={UserIcon} />
                      <Field label="Father's Name" value={admission.fatherName} icon={UserIcon} />
                      <Field label="Mother's Name" value={admission.motherName} icon={UserIcon} />
                      <Field label="Email" value={admission.email} icon={MailIcon} />
                      <Field label="Contact" value={admission.contactNumber} icon={PhoneIcon} />
                      <Field label="Alt. Contact" value={admission.alternateContact} icon={PhoneIcon} />
                      <div className="col-span-full">
                        <Field label="Address" value={admission.address} icon={HomeIcon} />
                      </div>
                      <Field label="Caste" value={admission.caste} />
                    </div>
                  </div>

                  {/* Academic */}
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Academic Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                      <Field label="Class" value={`Class ${admission.studentClass}`} icon={BookOpenIcon} />
                      <Field label="Stream" value={admission.stream} icon={BookOpenIcon} />
                      <Field label="Course" value={admission.course} icon={GraduationCapIcon} />
                      <Field label="School Name" value={admission.schoolName} />
                      <Field label="Board" value={admission.board} />
                      <Field label="Batch Code" value={admission.batchCode || "Not assigned"} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {admission && admission.status === "PENDING" && (
              <div className="px-8 py-6 border-t border-slate-100 flex gap-4 shrink-0">
                <button
                  onClick={() => handleAction("reject")}
                  disabled={isActing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all disabled:opacity-50 border border-rose-100"
                >
                  <XCircleIcon className="size-5" />
                  Reject Application
                </button>
                <button
                  onClick={() => handleAction("approve")}
                  disabled={isActing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-emerald-100"
                >
                  {isActing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircleIcon className="size-5" />
                  )}
                  Approve Application
                </button>
              </div>
            )}
            {admission && admission.status !== "PENDING" && (
              <div className="px-8 py-6 border-t border-slate-100 shrink-0">
                <p className="text-center text-sm text-slate-400 font-medium">
                  This application has already been <strong className="capitalize">{admission.status.toLowerCase()}</strong>.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
