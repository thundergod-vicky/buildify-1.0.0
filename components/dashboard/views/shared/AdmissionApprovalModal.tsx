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
  PencilIcon,
  SaveIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";

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
  onAction: () => void;
}

const Field = ({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ElementType }) => (
  <div className="space-y-1 min-w-0">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 truncate">
      {Icon && <Icon className="size-3 shrink-0" />}
      <span className="truncate">{label}</span>
    </p>
    <p className="text-sm font-semibold text-slate-800 break-words">{value || "—"}</p>
  </div>
);

const EditField = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  type = "text",
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  icon?: React.ElementType;
  type?: string;
  className?: string;
}) => (
  <div className={`space-y-1 min-w-0 ${className}`}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 truncate">
      {Icon && <Icon className="size-3 shrink-0" />}
      <span className="truncate">{label}</span>
    </p>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-indigo-50/50 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
    />
  </div>
);

export function AdmissionApprovalModal({ studentId, studentName, isOpen, onClose, onAction }: Props) {
  const { user: currentUser } = useAuth();
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [photoBlobUrl, setPhotoBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Admission>>({});

  const canEdit =
    currentUser?.role === Role.ADMIN ||
    currentUser?.role === Role.ACADEMIC_OPERATIONS ||
    currentUser?.role === Role.ACCOUNTS;

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("lock-scroll");
      document.body.classList.add("lock-scroll");
    } else {
      document.documentElement.classList.remove("lock-scroll");
      document.body.classList.remove("lock-scroll");
    }
    return () => {
      document.documentElement.classList.remove("lock-scroll");
      document.body.classList.remove("lock-scroll");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !studentId) {
      setAdmission(null);
      setIsEditing(false);
      setPhotoBlobUrl(null);
      return;
    }

    setIsLoading(true);
    const token = auth.getToken() || "";
    let objectUrl: string | null = null;

    api
      .get<Admission>(`/admissions/student/${studentId}`, token)
      .then(async (data) => {
        setAdmission(data);
        setEditData(data);
        if (data && data.photoUrl) {
          try {
            const blob = await api.getBlob(`/admissions/photo/${data.id}`, token);
            objectUrl = URL.createObjectURL(blob);
            setPhotoBlobUrl(objectUrl);
          } catch (err) {
            console.error("Failed to fetch photo blob:", err);
          }
        }
      })
      .catch(() => setAdmission(null))
      .finally(() => setIsLoading(false));

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isOpen, studentId]);

  const handleFieldChange = (name: string, value: string) => {
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!admission) return;
    setIsActing(true);
    const token = auth.getToken() || "";
    try {
      await api.patch(`/admissions/${admission.id}`, editData, token);
      showToast.success("Admission details updated successfully");
      setIsEditing(false);
      // Re-fetch to show updated data
      const updated = await api.get<Admission>(`/admissions/student/${studentId}`, token);
      setAdmission(updated);
      setEditData(updated);
      onAction();
    } catch {
      showToast.error("Failed to update admission details");
    } finally {
      setIsActing(false);
    }
  };

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

  const dob = editData.dateOfBirth
    ? new Date(editData.dateOfBirth).toISOString().split("T")[0]
    : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in"
          onWheel={(e) => e.stopPropagation()}
        >
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
              <div className="flex items-center gap-2">
                {canEdit && admission && !isLoading && (
                  isEditing ? (
                    <button
                      onClick={() => { setIsEditing(false); setEditData(admission); }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      <XIcon className="size-3.5" /> Discard
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100"
                    >
                      <PencilIcon className="size-3.5" /> Edit
                    </button>
                  )
                )}
                <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                  <XIcon className="size-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div 
              className="overflow-y-auto flex-1 min-h-0 p-8 overscroll-contain custom-scrollbar"
              onWheel={(e) => e.stopPropagation()}
              data-lenis-prevent
            >
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
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${admission?.status ? statusColor[admission.status] : ""}`}>
                      {admission?.status || "UNKNOWN"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Submitted {new Date(admission.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {isEditing && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                      <PencilIcon className="size-4 text-amber-500 shrink-0" />
                      <p className="text-xs font-bold text-amber-700">
                        Edit mode — modify any field below and click Save Changes to persist.
                      </p>
                    </div>
                  )}

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
                      {isEditing ? (
                        <>
                          <EditField label="Form Number" name="formNumber" value={editData.formNumber || ""} onChange={handleFieldChange} icon={HashIcon} />
                          <EditField label="Enrollment No." name="enrollmentNumber" value={editData.enrollmentNumber || ""} onChange={handleFieldChange} icon={HashIcon} />
                          <EditField label="Date of Birth" name="dateOfBirth" value={dob} onChange={handleFieldChange} icon={CalendarIcon} type="date" />
                          <Field label="Admission Date" value={new Date(admission.admissionDate).toLocaleDateString()} icon={CalendarIcon} />
                        </>
                      ) : (
                        <>
                          <Field label="Form Number" value={admission.formNumber} icon={HashIcon} />
                          <Field label="Enrollment No." value={admission.enrollmentNumber} icon={HashIcon} />
                          <Field label="Admission Date" value={new Date(admission.admissionDate).toLocaleDateString()} icon={CalendarIcon} />
                          <Field label="Date of Birth" value={new Date(admission.dateOfBirth).toLocaleDateString()} icon={CalendarIcon} />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Personal */}
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Personal Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                      {isEditing ? (
                        <>
                          <EditField label="Student Name" name="studentName" value={editData.studentName || ""} onChange={handleFieldChange} icon={UserIcon} />
                          <EditField label="Father's Name" name="fatherName" value={editData.fatherName || ""} onChange={handleFieldChange} icon={UserIcon} />
                          <EditField label="Mother's Name" name="motherName" value={editData.motherName || ""} onChange={handleFieldChange} icon={UserIcon} />
                          <EditField label="Email" name="email" value={editData.email || ""} onChange={handleFieldChange} icon={MailIcon} />
                          <EditField label="Contact" name="contactNumber" value={editData.contactNumber || ""} onChange={handleFieldChange} icon={PhoneIcon} />
                          <EditField label="Alt. Contact" name="alternateContact" value={editData.alternateContact || ""} onChange={handleFieldChange} icon={PhoneIcon} />
                          <EditField label="Address" name="address" value={editData.address || ""} onChange={handleFieldChange} icon={HomeIcon} className="col-span-full" />
                          <EditField label="Caste" name="caste" value={editData.caste || ""} onChange={handleFieldChange} />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>

                  {/* Academic */}
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Academic Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                      {isEditing ? (
                        <>
                          <EditField label="Class" name="studentClass" value={editData.studentClass || ""} onChange={handleFieldChange} icon={BookOpenIcon} />
                          <EditField label="Stream" name="stream" value={editData.stream || ""} onChange={handleFieldChange} icon={BookOpenIcon} />
                          <EditField label="Course" name="course" value={editData.course || ""} onChange={handleFieldChange} icon={GraduationCapIcon} />
                          <EditField label="School Name" name="schoolName" value={editData.schoolName || ""} onChange={handleFieldChange} />
                          <EditField label="Board" name="board" value={editData.board || ""} onChange={handleFieldChange} />
                          <EditField label="Batch Code" name="batchCode" value={editData.batchCode || ""} onChange={handleFieldChange} />
                        </>
                      ) : (
                        <>
                          <Field label="Class" value={`Class ${admission.studentClass}`} icon={BookOpenIcon} />
                          <Field label="Stream" value={admission.stream} icon={BookOpenIcon} />
                          <Field label="Course" value={admission.course} icon={GraduationCapIcon} />
                          <Field label="School Name" value={admission.schoolName} />
                          <Field label="Board" value={admission.board} />
                          <Field label="Batch Code" value={admission.batchCode || "Not assigned"} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {admission && (
              isEditing ? (
                <div className="px-8 py-6 border-t border-slate-100 flex gap-4 shrink-0">
                  <button
                    onClick={() => { setIsEditing(false); setEditData(admission); }}
                    className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isActing}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                  >
                    {isActing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <SaveIcon className="size-5" />
                    )}
                    Save Changes
                  </button>
                </div>
              ) : admission.status === "PENDING" && (
                currentUser?.role === Role.ADMIN || 
                currentUser?.role === Role.ACCOUNTS || 
                currentUser?.role === Role.ACADEMIC_OPERATIONS
              ) ? (
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
              ) : admission.status !== "PENDING" ? (
                <div className="px-8 py-6 border-t border-slate-100 shrink-0">
                  <p className="text-center text-sm text-slate-400 font-medium">
                    This application has already been <strong className="capitalize">{admission.status?.toLowerCase() || "updated"}</strong>.
                  </p>
                </div>
              ) : null
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
