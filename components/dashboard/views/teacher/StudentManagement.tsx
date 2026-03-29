"use client";

import { useState, useEffect } from "react";
import { 
  SearchIcon, 
  GraduationCapIcon, 
  TrophyIcon, 
  StarIcon, 
  CheckCircle2Icon,
  SortAscIcon,
  SortDescIcon,
  CalendarIcon,
  ArrowUpDownIcon
} from "lucide-react";
import { showToast } from "@/lib/toast";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { AdmissionApprovalModal } from "@/components/dashboard/views/shared/AdmissionApprovalModal";

const MEDALS = ["WOOD", "STONE", "IRON", "SILVER", "GOLD", "DIAMOND", "PLATINUM", "VIBRANIUM"];
const GRADES = ["F", "D", "D_PLUS", "C", "C_PLUS", "B", "B_PLUS", "A", "A_PLUS", "E"];

export function TeacherStudentManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "enrollmentId">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [admissionModal, setAdmissionModal] = useState<{ isOpen: boolean; studentId: string; studentName: string }>({ isOpen: false, studentId: "", studentName: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      
      const data = await api.get<any[]>('/users/students', token);
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (studentId: string, medal: string, grade: string) => {
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
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.enrollmentId?.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-urbanist">Student Management</h1>
            <p className="text-gray-500 mt-1">Assign medals and grades to your students based on performance</p>
          </div>
          <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100 shadow-sm">
            {processedStudents.length} Students Listed
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div className="relative w-full max-w-md group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex-1">
              <ArrowUpDownIcon className="size-4 text-gray-400 ml-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none pr-4 cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="createdAt">Sort by Date Joined</option>
                <option value="enrollmentId">Sort by ID</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-indigo-600 transition-all shadow-sm"
              title={sortOrder === "asc" ? "Descending" : "Ascending"}
            >
              {sortOrder === "asc" ? <SortAscIcon className="size-4" /> : <SortDescIcon className="size-4" />}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
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
                ) : processedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">No students found matching your criteria</td>
                  </tr>
                ) : (
                  processedStudents.map((student) => (
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
                          onChange={(e) => updateStatus(student.id, e.target.value, student.grade)}
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
                          onChange={(e) => updateStatus(student.id, student.medal, e.target.value)}
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
