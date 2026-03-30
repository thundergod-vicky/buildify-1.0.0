"use client";

import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  ShieldCheckIcon,
  Trash2Icon,
  KeyIcon,
  SaveIcon,
  XIcon,
  Loader2Icon,
  LockIcon,
  PowerIcon,
  ActivityIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/lib/toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

interface WebinarAccount {
  id: string;
  name: string;
  apiKey: string;
  isActive: boolean;
  createdAt: string;
}

export function WebinarAccountManagement() {
  const [accounts, setAccounts] = useState<WebinarAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const [newAccount, setNewAccount] = useState({
    name: "",
    apiKey: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    accountId: string;
    accountName: string;
  }>({ isOpen: false, accountId: "", accountName: "" });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const data = await api.get<WebinarAccount[]>("/webinar-accounts", token);
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch webinar accounts:", error);
      showToast.error("Could not load Webinar.gg accounts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!newAccount.name || !newAccount.apiKey) {
      showToast.error("Please fill in all fields");
      return;
    }

    setIsActionLoading(true);
    try {
      const token = auth.getToken();
      await api.post("/webinar-accounts", newAccount, token!);
      showToast.success("Webinar account added successfully");
      setIsAddModalOpen(false);
      setNewAccount({ name: "", apiKey: "" });
      fetchAccounts();
    } catch (error) {
      showToast.error("Failed to add account");
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleStatus = async (account: WebinarAccount) => {
    try {
      const token = auth.getToken();
      await api.patch(`/webinar-accounts/${account.id}`, { isActive: !account.isActive }, token!);
      showToast.success(`Account ${account.isActive ? 'deactivated' : 'activated'}`);
      fetchAccounts();
    } catch {
      showToast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = auth.getToken();
      await api.delete(`/webinar-accounts/${id}`, token!);
      showToast.success("Account removed");
      fetchAccounts();
    } catch {
      showToast.error("Failed to delete account");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight font-urbanist bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600">
            Webinar.gg Integration
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage multiple Webinar.gg accounts for automated class scheduling
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <PlusIcon className="size-5" />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-50 rounded-3xl animate-pulse" />
          ))
        ) : accounts.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="size-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-6">
              <KeyIcon className="size-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No accounts configured</h3>
            <p className="text-gray-500 mt-2">Add your first Webinar.gg API key to get started</p>
          </div>
        ) : (
          accounts.map((account) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={account.id}
              className={`relative overflow-hidden group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 ${!account.isActive && 'grayscale opacity-75'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${account.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                  <ShieldCheckIcon className="size-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleStatus(account)}
                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                    title={account.isActive ? "Deactivate" : "Activate"}
                  >
                    <PowerIcon className="size-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: true, accountId: account.id, accountName: account.name })}
                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm"
                    title="Remove Account"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 truncate">{account.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`size-2 rounded-full ${account.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">API Identifier</span>
                    <LockIcon className="size-3 text-gray-300" />
                  </div>
                  <code className="text-xs font-mono text-indigo-600 font-bold tracking-widest">
                    {account.apiKey}
                  </code>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="size-3.5 text-indigo-400" />
                    <span className="text-[10px] font-bold text-gray-400">Used in 0 Sessions</span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-300">
                    Added {new Date(account.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute -right-8 -bottom-8 size-32 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors" />
            </motion.div>
          ))
        )}
      </div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add Webinar.gg Account</h2>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Provider Integration</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-rose-500 transition-all"
                >
                  <XIcon className="size-6" />
                </button>
              </div>

              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Account Label</label>
                  <input
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    type="text"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                    placeholder="e.g. Teacher Alpha Account"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">API Secret Key</label>
                  <div className="relative">
                    <KeyIcon className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-gray-300" />
                    <input
                      value={newAccount.apiKey}
                      onChange={(e) => setNewAccount({ ...newAccount, apiKey: e.target.value })}
                      type="password"
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                      placeholder="Paste your API key here..."
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 px-2">
                    Keys are AES-256 encrypted before storage. Never shared with frontend.
                  </p>
                </div>
              </div>

              <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-8 py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAccount}
                  disabled={isActionLoading}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isActionLoading ? <Loader2Icon className="size-5 animate-spin" /> : <SaveIcon className="size-5" />}
                  Register Provider
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
          handleDelete(deleteConfirm.accountId);
          setDeleteConfirm({ ...deleteConfirm, isOpen: false });
        }}
        title="Remove Integration"
        message={`Are you sure you want to remove "${deleteConfirm.accountName}"? This will stop automated scheduling for this account.`}
        confirmText="Remove Account"
        variant="danger"
      />
    </div>
  );
}
