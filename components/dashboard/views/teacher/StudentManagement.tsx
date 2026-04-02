"use client";

import { useState, useEffect } from "react";
import { 
  SearchIcon, 
  GraduationCapIcon, 
  CheckCircle2Icon,
  SortAscIcon,
  SortDescIcon,
  CalendarIcon,
  ArrowUpDownIcon,
  MoreHorizontal,
  TrophyIcon,
  BookOpenIcon,
  ClockIcon
} from "lucide-react";
import { showToast } from "@/lib/toast";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { User, AdmissionStatus } from "@/types";
import { AdmissionApprovalModal } from "@/components/dashboard/views/shared/AdmissionApprovalModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UserWithCounts extends User {
  _count?: {
    enrollments: number;
    practiceTestResults: number;
  };
}

const MEDALS = ["WOOD", "STONE", "IRON", "SILVER", "GOLD", "DIAMOND", "PLATINUM", "VIBRANIUM"];
const GRADES = ["F", "D", "D_PLUS", "C", "C_PLUS", "B", "B_PLUS", "A", "A_PLUS", "E"];

function StudentCard({
  student,
  updateStatus,
  updatingId,
  setAdmissionModal,
}: {
  student: UserWithCounts;
  updateStatus: (studentId: string, medal: string | undefined, grade: string | undefined) => void;
  updatingId: string | null;
  setAdmissionModal: (modal: { isOpen: boolean; studentId: string; studentName: string }) => void;
}) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group overflow-visible relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-base">
            {student.name?.[0]?.toUpperCase() || "S"}
          </div>
          <div className="truncate">
            <h4 className="font-black text-gray-900 text-sm leading-none mb-1 truncate max-w-[150px] flex items-center gap-1.5">
              {student.name || "Unnamed Student"}
              {student.admission?.status === AdmissionStatus.APPROVED && (
                <CheckCircle2Icon className="size-3 text-emerald-500 fill-emerald-50" />
              )}
            </h4>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[120px]">
              {student.email}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className={cn(
              "p-2 rounded-xl border transition-all",
              isActionsOpen ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-100 text-gray-400 hover:bg-gray-50"
            )}
          >
            <MoreHorizontal className="size-4" />
          </button>

          <AnimatePresence>
            {isActionsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] p-2 overflow-hidden"
              >
                <div className="space-y-3 p-2">
                  <div className="space-y-1.5">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Assign Medal</p>
                    <div className="grid grid-cols-2 gap-1">
                      <select
                        defaultValue={student.medal || ""}
                        onChange={(e) => {
                          updateStatus(student.id, e.target.value, student.grade || undefined);
                          setIsActionsOpen(false);
                        }}
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold p-1.5 outline-none"
                      >
                        <option value="">No Medal</option>
                        {MEDALS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Assign Grade</p>
                    <select
                      defaultValue={student.grade || ""}
                      onChange={(e) => {
                        updateStatus(student.id, student.medal || undefined, e.target.value);
                        setIsActionsOpen(false);
                      }}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold p-1.5 outline-none"
                    >
                      <option value="">No Grade</option>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g.replace("_PLUS", "+")}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 border-t border-gray-50">
                    <button
                      onClick={() => {
                        setIsActionsOpen(false);
                        setAdmissionModal({ isOpen: true, studentId: student.id, studentName: student.name || "Student" });
                      }}
                      className="flex items-center gap-2 w-full p-2 text-left text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <GraduationCapIcon className="size-3.5" />
                      View Admission
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50/50 rounded-xl p-2.5 border border-gray-100">
           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Medal Status</span>
           <div className="flex items-center gap-1.5">
             <TrophyIcon className={cn("size-3", student.medal ? "text-amber-500" : "text-gray-300")} />
             <span className="text-[10px] font-black text-gray-700 truncate">{student.medal || "NONE"}</span>
           </div>
        </div>
        <div className="bg-gray-50/50 rounded-xl p-2.5 border border-gray-100">
           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Academic Grade</span>
           <div className="flex items-center gap-1.5">
             <BookOpenIcon className={cn("size-3", student.grade ? "text-indigo-500" : "text-gray-300")} />
             <span className="text-[10px] font-black text-gray-700">{student.grade?.replace("_PLUS", "+") || "NONE"}</span>
           </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-900">{student._count?.enrollments || 0}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Courses</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-900">{student._count?.practiceTestResults || 0}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Tests</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
           {student.enrollmentId && (
             <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1">
               {student.enrollmentId}
             </span>
           )}
           <span className="text-[8px] font-bold text-gray-300 flex items-center gap-1">
             <ClockIcon className="size-2.5" />
             {new Date(student.createdAt).toLocaleDateString()}
           </span>
        </div>
      </div>
      
      {updatingId === student.id && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10 transition-all">
          <div className="size-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export function TeacherStudentManagement() {
  const [students, setStudents] = useState<UserWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "enrollmentId">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [admissionModal, setAdmissionModal] = useState<{ isOpen: boolean; studentId: string; studentName: string }>({ isOpen: false, studentId: "", studentName: "" });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING" | "NOT_SUBMITTED">("ALL");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      
      const data = await api.get<UserWithCounts[]>('/users/students', token);
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (studentId: string, medal: string | undefined, grade: string | undefined) => {
    setUpdatingId(studentId);
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.patch(`/users/${studentId}/academic-status`, { medal, grade }, token);
      showToast.success("Student status updated successfully");
      fetchStudents();
    } catch (error) {
      console.error("Update failed:", error);
      showToast.error("Error connecting to server");
    } finally {
      setUpdatingId(null);
    }
  };

  const processedStudents = students
    .filter(
      (s) =>
        (s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.enrollmentId?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === "ALL" || 
         (statusFilter === "APPROVED" && s.admission?.status === AdmissionStatus.APPROVED) ||
         (statusFilter === "PENDING" && s.admission?.status === AdmissionStatus.PENDING) ||
         (statusFilter === "NOT_SUBMITTED" && !s.admission))
    )
    .sort((a, b) => {
      let comp = 0;
      if (sortBy === "name") {
        comp = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "enrollmentId") {
        comp = (a.enrollmentId || "").localeCompare(b.enrollmentId || "");
      } else if (sortBy === "createdAt") {
        comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === "asc" ? comp : -comp;
    });

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(processedStudents.length / itemsPerPage);
  const paginatedStudents = itemsPerPage === 'all' 
    ? processedStudents 
    : processedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage, sortBy, sortOrder, statusFilter]);

  return (
    <>
      <div className="p-3 sm:p-8 max-w-7xl mx-auto space-y-3 sm:space-y-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-6">
          <div className="max-w-full">
            <h1 className="text-xl sm:text-3xl font-black text-gray-900 font-urbanist tracking-tight truncate">
              Student Management
            </h1>
            <p className="text-gray-500 font-medium text-[10px] sm:text-sm mt-0.5 leading-relaxed">
              Manage performance medals and grades
            </p>
          </div>
          <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm w-fit">
            {processedStudents.length} Students
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
          <div className="relative w-full lg:max-w-md group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm flex-1">
              <ArrowUpDownIcon className="size-3.5 text-gray-400 ml-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[10px] font-black text-gray-700 outline-none cursor-pointer appearance-none uppercase tracking-widest pl-1 pr-6"
              >
                <option value="name">Sort by Name</option>
                <option value="enrollmentId">Enrollment ID</option>
                <option value="createdAt">Joining Date</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm shrink-0">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">Status:</span>
               <select 
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value as any)}
                 className="bg-transparent text-[10px] font-black text-gray-700 outline-none cursor-pointer appearance-none uppercase tracking-widest pl-1 pr-6"
               >
                 <option value="ALL">All Students</option>
                 <option value="APPROVED">Approved Only</option>
                 <option value="PENDING">Pending Only</option>
                 <option value="NOT_SUBMITTED">Not Submitted</option>
               </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 sm:p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-indigo-600 transition-all shadow-sm"
              title={sortOrder === "asc" ? "Descending" : "Ascending"}
            >
              {sortOrder === "asc" ? <SortAscIcon className="size-4" /> : <SortDescIcon className="size-4" />}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-visible shadow-sm">
          <div className="hidden lg:block overflow-x-auto pb-48">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">Student Info</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">Stats</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">Medal</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">Grade</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8"><div className="h-10 bg-gray-100 rounded-xl w-full"></div></td>
                    </tr>
                  ))
                ) : paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">No students found matching your criteria</td>
                  </tr>
                ) : (
                  paginatedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{student.name || "Unnamed Student"}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                        <div className="flex items-center gap-3 mt-1.5 font-mono">
                          {student.enrollmentId && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold">
                              ID: {student.enrollmentId}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <CalendarIcon className="size-3" />
                            Joined {new Date(student.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{student._count?.enrollments || 0}</div>
                            <div className="text-[10px] text-gray-400 uppercase mt-0.5">Courses</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{student._count?.practiceTestResults || 0}</div>
                            <div className="text-[10px] text-gray-400 uppercase mt-0.5">Tests</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          defaultValue={student.medal || ""}
                          onChange={(e) => updateStatus(student.id, e.target.value, student.grade || undefined)}
                          className="bg-white border border-gray-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-gray-700"
                        >
                          <option value="">No Medal</option>
                          {MEDALS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          defaultValue={student.grade || ""}
                          onChange={(e) => updateStatus(student.id, student.medal || undefined, e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-gray-700"
                        >
                          <option value="">No Grade</option>
                          {GRADES.map((g) => (
                            <option key={g} value={g}>{g.replace("_PLUS", "+")}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setAdmissionModal({ isOpen: true, studentId: student.id, studentName: student.name || "Student" })}
                            className="p-2.5 bg-indigo-50 text-indigo-500 hover:bg-indigo-100 rounded-xl transition-all shadow-sm"
                            title="View Admission"
                          >
                            <GraduationCapIcon className="size-4" />
                          </button>
                          {updatingId === student.id ? (
                            <div className="size-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle2Icon className="size-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden p-4 pb-12 space-y-4 bg-gray-50/50">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse" />
              ))
            ) : paginatedStudents.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                 <div className="size-16 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-sm border border-gray-50">
                  <GraduationCapIcon className="size-8" />
                </div>
                <p className="text-gray-400 font-bold text-xs">No students found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {paginatedStudents.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    updateStatus={updateStatus}
                    updatingId={updatingId}
                    setAdmissionModal={setAdmissionModal}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!isLoading && processedStudents.length > 0 && (
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Show:</span>
                <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  {[10, 20, 50, 100, 'all'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setItemsPerPage(size as any)}
                      className={cn(
                        "px-3 py-1.5 text-[10px] font-black uppercase transition-all border-r border-gray-100 last:border-0",
                        itemsPerPage === size ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {size === 'all' ? 'All' : size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <SortAscIcon className="size-4 -rotate-90" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <SortAscIcon className="size-4 rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdmissionApprovalModal
        isOpen={admissionModal.isOpen}
        studentId={admissionModal.studentId}
        studentName={admissionModal.studentName}
        onClose={() => setAdmissionModal({ isOpen: false, studentId: "", studentName: "" })}
        onAction={fetchStudents}
      />
    </>
  );
}
