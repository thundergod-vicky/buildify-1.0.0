"use client";

import { useState, useEffect } from "react";
import { SearchIcon, UserCogIcon, ShieldCheckIcon, Trash2Icon, MailIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { showToast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

const ROLES = ["STUDENT", "TEACHER", "PARENT", "ADMIN"];

export function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    newRole: string;
  }>({ isOpen: false, userId: "", newRole: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      
      const data = await api.get<any[]>('/admin/users', token);
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

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-urbanist">User Management</h1>
        <p className="text-gray-500 mt-1">Control access levels and manage all platform participants</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-md group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
        </div>
        <div className="flex gap-2">
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100">
                {users.length} Total Users
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider">User Information</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Platform Role</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Activity Stats</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                            <UsersIcon className="size-8" />
                        </div>
                        <p className="text-gray-500 font-medium">No users match your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                            user.role === 'TEACHER' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'PARENT' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                           {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                {user.name || "Unnamed User"}
                                {user.role === 'ADMIN' && <ShieldCheckIcon className="size-3.5 text-indigo-600" />}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                                <span className="flex items-center gap-1"><MailIcon className="size-3" /> {user.email}</span>
                                <span className="flex items-center gap-1"><CalendarIcon className="size-3" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <select
                        value={user.role}
                        onChange={(e) => setConfirmModal({
                          isOpen: true,
                          userId: user.id,
                          newRole: e.target.value
                        })}
                        disabled={updatingId === user.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none transition-all ${
                            user.role === 'ADMIN' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                            user.role === 'TEACHER' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                            user.role === 'PARENT' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-sm font-bold text-gray-900">{user._count?.enrollments || 0}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Enrollments</div>
                        </div>
                        {user.role === 'TEACHER' && (
                            <div className="text-center border-l border-gray-100 pl-4">
                                <div className="text-sm font-bold text-gray-900">{user._count?.coursesOwned || 0}</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Courses</div>
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {updatingId === user.id ? (
                                <div className="size-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => updateRole(user.id, user.role)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="Refresh Permissions"
                                    >
                                        <UserCogIcon className="size-5" />
                                    </button>
                                    <button 
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Deactivate Account"
                                    >
                                        <Trash2Icon className="size-5" />
                                    </button>
                                </>
                            )}
                       </div>
                    </td>
                  </tr>
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
    </div>
    </div>
  );
}
