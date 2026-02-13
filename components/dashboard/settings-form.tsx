"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { User, Role } from "@/types"; // Ensure Role is imported if needed, though strictly not used here
import { CheckCircleIcon, Loader2Icon, UserIcon, MailIcon, PhoneIcon, LockIcon } from "lucide-react";

export function SettingsForm() {
    const { user, updateProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "", // Assuming user has phone property? Check type.
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const updateData: any = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone // Assuming backend handles this
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            // We need to implement updateProfile in AuthContext
             if (updateProfile) {
                await updateProfile(updateData);
                setSuccessMessage("Profile updated successfully!");
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
             } else {
                 setError("Update profile function not available");
             }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UserIcon className="size-6 text-orange-600" />
                Profile Settings
            </h2>

            {successMessage && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <CheckCircleIcon className="size-5" />
                    {successMessage}
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50 text-gray-500 cursor-not-allowed" // Disable email change generally? Or allow? Assuming allow for now but styling. Actually let's allow.
                                placeholder="name@example.com"
                                // disabled // Usually email change requires verification. User asked to control credentials like email. So enable.
                            />
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                         <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                    </div>
                    {formData.password && (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <div className="relative">
                                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-700 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2Icon className="size-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
