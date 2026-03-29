"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SearchIcon,
  UserCogIcon,
  ShieldCheckIcon,
  Trash2Icon,
  MailIcon,
  CalendarIcon,
  UsersIcon,
  SaveIcon,
  XIcon,
  SortAscIcon,
  PhoneIcon,
  Loader2Icon,
  Lock,
  GraduationCapIcon,
  EyeIcon,
  SortDescIcon,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { User, Role } from "@/types";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { UserDetailsModal } from "./UserDetailsModal";
import { AdmissionApprovalModal } from "../shared/AdmissionApprovalModal";

// Define UserWithCounts interface based on the instruction and context
interface UserWithCounts extends User {
  _count?: {
    enrollments: number;
    teachingCourses: number;
    coursesOwned: number;
  };
}

const ROLES = [
  "STUDENT",
  "TEACHER",
  "PARENT",
  "ADMIN",
  "ACADEMIC_OPERATIONS",
  "ACCOUNTS",
];

export function AdminUserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithCounts[]>([]); // Changed any[] to UserWithCounts[]
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    newRole: string;
  }>({ isOpen: false, userId: "", newRole: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editIdValue, setEditIdValue] = useState("");
  const [editingUser, setEditingUser] = useState<UserWithCounts | null>(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "Password@123",
    role: "STUDENT" as Role,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({ isOpen: false, userId: "", userName: "" });
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({
    isOpen: false,
    userId: "",
    userName: "",
  });
  const [admissionModal, setAdmissionModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({
    isOpen: false,
    userId: "",
    userName: "",
  });
  const [isGrouped, setIsGrouped] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "role">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    newPassword: string;
  }>({
    isOpen: false,
    userId: "",
    userName: "",
    newPassword: "",
  });
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;

      const data = await api.get<User[]>("/admin/users", token);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showToast.error("Failed to load user directory");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.patch(`/admin/users/${userId}/role`, { role: newRole }, token);
      showToast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
      showToast.error("Error connecting to server");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setIsUpdatingUser(true);
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.patch(
        `/admin/users/${editingUser.id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
        },
        token,
      );

      showToast.success("User particulars updated");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("User update failed:", error);
      showToast.error("Failed to update user details");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const updateEnrollmentId = async (userId: string) => {
    setUpdatingId(userId);
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.patch(
        `/admin/users/${userId}`,
        { enrollmentId: editIdValue },
        token,
      );
      showToast.success("Enrollment ID updated");
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("ID Update failed:", error);
      showToast.error("Failed to update ID");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUpdatingId(userId);
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.delete(`/admin/users/${userId}`, token);
      showToast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
      showToast.error("Failed to delete user");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateUser = async () => {
    setIsCreatingUser(true);
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.post("/admin/users", newUser, token);
      showToast.success("User created successfully");
      setIsAddModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        password: "Password@123",
        role: "STUDENT" as Role,
      });
      fetchUsers();
    } catch (error) {
      console.error("Creation failed:", error);
      showToast.error("Failed to create user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordModal.userId || !passwordModal.newPassword) return;
    setIsResettingPassword(true);
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.patch(
        `/admin/users/${passwordModal.userId}`,
        { password: passwordModal.newPassword },
        token,
      );

      showToast.success(`Password updated for ${passwordModal.userName}`);
      setPasswordModal({ ...passwordModal, isOpen: false, newPassword: "" });
    } catch (error) {
      console.error("Password reset failed:", error);
      showToast.error("Failed to update password");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const processedUsers = users
    .filter((u) => {
      // 1. Search Query Filter
      const matchesSearch =
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.enrollmentId?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Role Filter (Tabs)
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;

      // 3. Security: Operations should not see/manage Admin accounts
      if (currentUser?.role === Role.ACADEMIC_OPERATIONS) {
        return u.role !== Role.ADMIN;
      }

      return true;
    })
    .sort((a, b) => {
      // 4. Sorting Logic
      let comparison = 0;
      if (sortBy === "name") {
        comparison = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "role") {
        comparison = a.role.localeCompare(b.role);
      } else if (sortBy === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">
          User Management
        </h1>
        <p className="text-gray-500 mt-1">
          Control access levels and manage all platform participants
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Search and Action Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full max-w-md group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <UsersIcon className="size-4" />
              Add User
            </button>
            <div className="px-4 py-3 bg-white border border-gray-100 text-gray-700 rounded-xl text-sm font-bold shadow-sm flex items-center whitespace-nowrap">
              {processedUsers.length} Results
            </div>
          </div>
        </div>

        {/* Filter and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-gray-50/50 p-2 rounded-4xl border border-gray-100">
          {/* Quick Filter Tabs */}
          <div className="flex p-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: "ALL", label: "All Users", icon: UsersIcon },
              { id: "STUDENT", label: "Students", icon: GraduationCapIcon },
              { id: "TEACHER", label: "Teachers", icon: UserCogIcon },
              { id: "PARENT", label: "Parents", icon: UsersIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  roleFilter === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105 z-10"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 px-4 w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm flex-1 lg:flex-none">
              <div className="pl-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-50 pr-4">
                Sort By
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "createdAt" | "role")}
                className="bg-transparent text-xs font-bold text-gray-700 py-2 pr-4 pl-2 outline-none cursor-pointer appearance-none"
              >
                <option value="name">Name</option>
                <option value="createdAt">Date Joined</option>
                <option value="role">Account Type</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"
                title={
                  sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"
                }
              >
                {sortOrder === "asc" ? (
                  <SortAscIcon className="size-4" />
                ) : (
                  <SortDescIcon className="size-4" />
                )}
              </button>
            </div>

            {/* Grouping Toggle */}
            <button
              onClick={() => setIsGrouped(!isGrouped)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                isGrouped
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <UsersIcon className="size-3.5" />
              {isGrouped ? "Ungroup" : "Group by Role"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                  User Information
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Enrollment ID
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Platform Role
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Activity Stats
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-10 bg-gray-50 rounded-xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : processedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <UsersIcon className="size-8" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No users match your criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : isGrouped ? (
                // Grouped View
                ROLES.map((role) => {
                  const roleUsers = processedUsers.filter((u) => u.role === role);
                  if (roleUsers.length === 0) return null;

                  return (
                    <React.Fragment key={role}>
                      <tr className="bg-gray-50/80">
                        <td
                          colSpan={5}
                          className="px-6 py-3 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-y border-gray-100/50"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="size-3" />
                            {role}s ({roleUsers.length})
                          </div>
                        </td>
                      </tr>
                      {roleUsers.map((user) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          currentUser={currentUser}
                          updatingId={updatingId}
                          editingId={editingId}
                          editIdValue={editIdValue}
                          setEditingId={setEditingId}
                          setEditIdValue={setEditIdValue}
                          updateEnrollmentId={updateEnrollmentId}
                          setConfirmModal={setConfirmModal}
                          setEditingUser={setEditingUser}
                          setDeleteConfirm={setDeleteConfirm}
                          setDetailsModal={setDetailsModal}
                          setAdmissionModal={setAdmissionModal}
                          setPasswordModal={setPasswordModal}
                        />
                      ))}
                    </React.Fragment>
                  );
                })
              ) : (
                // Flat View
                processedUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    updatingId={updatingId}
                    editingId={editingId}
                    editIdValue={editIdValue}
                    setEditingId={setEditingId}
                    setEditIdValue={setEditIdValue}
                    updateEnrollmentId={updateEnrollmentId}
                    setConfirmModal={setConfirmModal}
                    setEditingUser={setEditingUser}
                    setDeleteConfirm={setDeleteConfirm}
                    setDetailsModal={setDetailsModal}
                    setAdmissionModal={setAdmissionModal}
                    setPasswordModal={setPasswordModal}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={() => {
            setConfirmModal({ ...confirmModal, isOpen: false });
            updateRole(confirmModal.userId, confirmModal.newRole);
          }}
          title="Change User Role"
          message={`Are you sure you want to change this user's role to ${confirmModal.newRole}?`}
          confirmText="Change Role"
          variant="warning"
        />

        {/* Edit User Details Modal */}
        <AnimatePresence>
          {editingUser && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Edit User Particulars
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Direct Record Modification
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                  >
                    <XIcon className="size-5" />
                  </button>
                </div>

                <div className="p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Full Name
                    </label>
                    <input
                      value={editingUser.name || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                      type="text"
                      className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner"
                      placeholder="Enter user name..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Email Address
                      </label>
                      <div className="relative group">
                        <MailIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                          value={editingUser.email || ""}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              email: e.target.value,
                            })
                          }
                          type="email"
                          readOnly={currentUser?.role !== Role.ADMIN}
                          className={`w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner ${
                            currentUser?.role !== Role.ADMIN
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                          placeholder="user@example.com"
                        />
                      </div>
                      {currentUser?.role !== Role.ADMIN && (
                        <p className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter mt-1 ml-1">
                          Admin level clearance required to modify email
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Phone Number
                      </label>
                      <div className="relative group">
                        <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                          value={editingUser.phone || ""}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              phone: e.target.value,
                            })
                          }
                          type="tel"
                          readOnly={currentUser?.role !== Role.ADMIN}
                          className={`w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner ${
                            currentUser?.role !== Role.ADMIN
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      {currentUser?.role !== Role.ADMIN && (
                        <p className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter mt-1 ml-1">
                          Admin level clearance required to modify phone
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    disabled={isUpdatingUser}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingUser ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <SaveIcon className="size-4" />
                    )}
                    Commit Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ConfirmationModal
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
          onConfirm={() => {
            setDeleteConfirm({ ...deleteConfirm, isOpen: false });
            handleDeleteUser(deleteConfirm.userId);
          }}
          title="Delete User"
          message={`Are you sure you want to delete ${deleteConfirm.userName}? This action is permanent and will remove all their data.`}
          confirmText="Delete Permanently"
          variant="danger"
        />

        {/* Add User Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-4xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Register New User
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Platform Onboarding
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                  >
                    <XIcon className="size-5" />
                  </button>
                </div>

                <div className="p-10 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Full Name
                    </label>
                    <input
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      type="text"
                      className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner"
                      placeholder="Enter user name..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <MailIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        type="email"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        value={newUser.phone}
                        onChange={(e) =>
                          setNewUser({ ...newUser, phone: e.target.value })
                        }
                        type="tel"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Assigned Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value as Role })
                      }
                      className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner appearance-none cursor-pointer"
                    >
                      {ROLES.filter((r) => {
                        if (currentUser?.role === Role.ACADEMIC_OPERATIONS) {
                          return r === "STUDENT" || r === "PARENT";
                        }
                        return r !== "ADMIN";
                      }).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Initial Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        type="text"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner"
                        placeholder="Enter password..."
                      />
                    </div>
                  </div>
                </div>

                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-4">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUser}
                    disabled={isCreatingUser || !newUser.name || !newUser.email}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isCreatingUser ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <UsersIcon className="size-4" />
                    )}
                    Register User
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <UserDetailsModal
          isOpen={detailsModal.isOpen}
          userId={detailsModal.userId}
          onClose={() =>
            setDetailsModal({ isOpen: false, userId: "", userName: "" })
          }
        />
        <AdmissionApprovalModal
          isOpen={admissionModal.isOpen}
          studentId={admissionModal.userId}
          studentName={admissionModal.userName}
          onClose={() => setAdmissionModal({ ...admissionModal, isOpen: false })}
          onAction={() => fetchUsers()}
        />

        {/* Reset Password Modal */}
        <AnimatePresence>
          {passwordModal.isOpen && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Reset Password
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Target: {passwordModal.userName}
                    </p>
                  </div>
                  <button
                    onClick={() => setPasswordModal({ ...passwordModal, isOpen: false })}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                  >
                    <XIcon className="size-5" />
                  </button>
                </div>

                <div className="p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        value={passwordModal.newPassword}
                        onChange={(e) =>
                          setPasswordModal({ ...passwordModal, newPassword: e.target.value })
                        }
                        type="text"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm text-slate-700 shadow-inner"
                        placeholder="Enter new password..."
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setPasswordModal({ ...passwordModal, isOpen: false })}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={isResettingPassword || !passwordModal.newPassword}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isResettingPassword ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <SaveIcon className="size-4" />
                    )}
                    Update Password
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Extract row to its own component for better organization in grouped mode
function UserRow({
  user,
  currentUser,
  updatingId,
  editingId,
  editIdValue,
  setEditingId,
  setEditIdValue,
  updateEnrollmentId,
  setConfirmModal,
  setEditingUser,
  setDeleteConfirm,
  setDetailsModal,
  setAdmissionModal,
  setPasswordModal,
}: {
  user: UserWithCounts;
  currentUser: User | null;
  updatingId: string | null;
  editingId: string | null;
  editIdValue: string;
  setEditingId: (id: string | null) => void;
  setEditIdValue: (val: string) => void;
  updateEnrollmentId: (id: string) => void;
  setConfirmModal: (modal: {
    isOpen: boolean;
    userId: string;
    newRole: string;
  }) => void;
  setEditingUser: (user: UserWithCounts | null) => void;
  setDeleteConfirm: (modal: {
    isOpen: boolean;
    userId: string;
    userName: string;
  }) => void;
  setDetailsModal: (modal: {
    isOpen: boolean;
    userId: string;
    userName: string;
  }) => void;
  setAdmissionModal: (modal: {
    isOpen: boolean;
    userId: string;
    userName: string;
  }) => void;
  setPasswordModal: (modal: {
    isOpen: boolean;
    userId: string;
    userName: string;
    newPassword: string;
  }) => void;
}) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setIsActionsOpen(false);
      }
    }

    if (isActionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActionsOpen]);

  return (
    <tr
      key={user.id}
      className="hover:bg-gray-50/30 transition-colors group"
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${
              user.role === "ADMIN"
                ? "bg-indigo-100 text-indigo-700"
                : user.role === "TEACHER"
                  ? "bg-purple-100 text-purple-700"
                  : user.role === "PARENT"
                    ? "bg-blue-100 text-blue-700"
                    : user.role === "ACADEMIC_OPERATIONS"
                      ? "bg-orange-100 text-orange-700"
                      : user.role === "ACCOUNTS"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
            }`}
          >
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              {user.name || "Unnamed User"}
              {user.role === "ADMIN" && (
                <ShieldCheckIcon className="size-3.5 text-indigo-600" />
              )}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1">
                <MailIcon className="size-3" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="size-3" /> Joined{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {editingId === user.id ? (
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-blue-100 shadow-inner">
              <input
                type="text"
                value={editIdValue}
                onChange={(e) =>
                  setEditIdValue(
                    e.target.value.replace(/\s+/g, ""),
                  )
                }
                className="w-32 px-4 py-2 text-xs font-black font-mono bg-white border border-blue-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                autoFocus
              />
              <button
                onClick={() => updateEnrollmentId(user.id)}
                disabled={updatingId === user.id}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all disabled:opacity-50"
              >
                <SaveIcon className="size-4" />
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-3 cursor-pointer group/id"
              onClick={() => {
                if (currentUser?.role === Role.ACADEMIC_OPERATIONS && user.role !== Role.STUDENT && user.role !== Role.PARENT) {
                  showToast.error("Operations can only manage student/parent IDs");
                  return;
                }
                setEditingId(user.id);
                setEditIdValue(user.enrollmentId || "");
              }}
            >
              <div className="inline-flex flex-col bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm group-hover/id:border-blue-200 group-hover/id:bg-white transition-all duration-300">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  Enrollment
                </span>
                <span className="text-xs font-black text-gray-700 font-mono tracking-tighter">
                  {user.enrollmentId || "PENDING"}
                </span>
              </div>
              <div className="size-8 rounded-xl flex items-center justify-center bg-gray-50 text-gray-300 opacity-0 group-hover/id:opacity-100 transition-all hover:bg-white hover:text-blue-600 hover:shadow-sm">
                <UserCogIcon className="size-4" />
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <select
          value={user.role}
          onChange={(e) =>
            setConfirmModal({
              isOpen: true,
              userId: user.id,
              newRole: e.target.value,
            })
          }
          disabled={updatingId === user.id || currentUser?.role === Role.ACADEMIC_OPERATIONS}
          className={`px-4 py-2 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.12em] border outline-none transition-all cursor-pointer shadow-sm hover:shadow-md ${
            user.role === "ADMIN"
              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
              : user.role === "TEACHER"
                ? "bg-purple-50 border-purple-200 text-purple-700"
                : user.role === "PARENT"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : user.role === "ACADEMIC_OPERATIONS"
                    ? "bg-orange-50 border-orange-200 text-orange-700"
                    : user.role === "ACCOUNTS"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          {[
            "STUDENT",
            "TEACHER",
            "PARENT",
            "ADMIN",
            "ACADEMIC_OPERATIONS",
            "ACCOUNTS",
          ].filter(
            (r) =>
              currentUser?.role !== "ACADEMIC_OPERATIONS" ||
              r !== "ADMIN",
          ).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex gap-10">
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-900 leading-none mb-1">
              {user._count?.enrollments || 0}
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Enrollments
            </span>
          </div>
          <div className="flex flex-col border-l border-gray-100 pl-8">
            <span className="text-xs font-black text-gray-900 leading-none mb-1">
              {user._count?.teachingCourses || 0}
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Courses
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-right relative">
        <div className="flex items-center justify-end" ref={actionsRef}>
          {updatingId === user.id ? (
            <div className="size-10 flex items-center justify-center">
              <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
                <div className="relative">
                  <button
                    onClick={() => {
                      if (!isActionsOpen) {
                        const rect = actionsRef.current?.getBoundingClientRect();
                        if (rect) {
                          setOpenUpwards(window.innerHeight - rect.bottom < 300);
                        }
                      }
                      setIsActionsOpen(!isActionsOpen);
                    }}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      isActionsOpen
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 shadow-sm"
                    }`}
                    title="Action Menu"
                  >
                    {isActionsOpen ? (
                      <XIcon className="size-5" />
                    ) : (
                      <MoreHorizontal className="size-5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isActionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        className={`absolute right-full mr-3 w-60 bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 z-[101] overflow-hidden p-2.5 ${
                          openUpwards
                            ? "bottom-0 origin-bottom-right"
                            : "top-0 origin-top-right"
                        }`}
                      >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setIsActionsOpen(false);
                          setDetailsModal({
                            isOpen: true,
                            userId: user.id,
                            userName: user.name || "User",
                          });
                        }}
                        className="flex items-center gap-3 w-full p-3 text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all group/item"
                      >
                        <div className="size-8 rounded-xl bg-gray-50 group-hover/item:bg-white flex items-center justify-center transition-colors">
                          <EyeIcon className="size-4" />
                        </div>
                        <span className="text-xs font-bold">View Profile</span>
                      </button>

                      {(currentUser?.role !== Role.ACADEMIC_OPERATIONS ||
                        user.role === Role.STUDENT ||
                        user.role === Role.PARENT) && (
                        <button
                          onClick={() => {
                            setIsActionsOpen(false);
                            setEditingUser(user);
                          }}
                          className="flex items-center gap-3 w-full p-3 text-left text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all group/item"
                        >
                          <div className="size-8 rounded-xl bg-gray-50 group-hover/item:bg-white flex items-center justify-center transition-colors">
                            <UserCogIcon className="size-4" />
                          </div>
                          <span className="text-xs font-bold">Edit Details</span>
                        </button>
                      )}

                      {(currentUser?.role === Role.ADMIN ||
                        (currentUser?.role === Role.ACADEMIC_OPERATIONS &&
                          (user.role === Role.TEACHER ||
                            user.role === Role.STUDENT ||
                            user.role === Role.PARENT))) && (
                        <button
                          onClick={() => {
                            setIsActionsOpen(false);
                            setPasswordModal({
                              isOpen: true,
                              userId: user.id,
                              userName: user.name || "User",
                              newPassword: "",
                            });
                          }}
                          className="flex items-center gap-3 w-full p-3 text-left text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-2xl transition-all group/item"
                        >
                          <div className="size-8 rounded-xl bg-gray-50 group-hover/item:bg-white flex items-center justify-center transition-colors">
                            <Lock className="size-4" />
                          </div>
                          <span className="text-xs font-bold">Reset Password</span>
                        </button>
                      )}

                      {user.role === Role.STUDENT && (
                        <button
                          onClick={() => {
                            setIsActionsOpen(false);
                            setAdmissionModal({
                              isOpen: true,
                              userId: user.id,
                              userName: user.name || "Student",
                            });
                          }}
                          className="flex items-center gap-3 w-full p-3 text-left text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all group/item"
                        >
                          <div className="size-8 rounded-xl bg-gray-50 group-hover/item:bg-white flex items-center justify-center transition-colors">
                            <GraduationCapIcon className="size-4" />
                          </div>
                          <span className="text-xs font-bold">Admission Info</span>
                        </button>
                      )}

                      {currentUser?.role !== Role.ACADEMIC_OPERATIONS && (
                        <>
                          <div className="h-px bg-gray-50 my-1 mx-2"></div>
                          <button
                            onClick={() => {
                              setIsActionsOpen(false);
                              setDeleteConfirm({
                                isOpen: true,
                                userId: user.id,
                                userName: user.name || "this user",
                              });
                            }}
                            className="flex items-center gap-3 w-full p-3 text-left text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group/item"
                          >
                            <div className="size-8 rounded-xl bg-rose-50/50 group-hover/item:bg-white flex items-center justify-center transition-colors">
                              <Trash2Icon className="size-4" />
                            </div>
                            <span className="text-xs font-bold">Delete User</span>
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
