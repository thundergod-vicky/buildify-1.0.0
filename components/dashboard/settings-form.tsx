"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  Loader2Icon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  CameraIcon,
  Trash2Icon,
} from "lucide-react";

import { resolveImageUrl } from "@/lib/utils";
import { isRandomAvatar } from "@/lib/auth";
import { api } from "@/lib/api";

export function SettingsForm() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

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
      const updateData: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      if (updateProfile) {
        await updateProfile(updateData);
        setSuccessMessage("Profile updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        setError("Update profile function not available");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsImageLoading(true);
    setError("");
    try {
      const { api } = await import("@/lib/api");
      const { auth } = await import("@/lib/auth");
      const token = auth.getToken();
      if (!token) throw new Error("Not authenticated");

      const updatedUser = await api.upload<{ profileImage?: string }>(
        "/users/profile-image",
        file,
        token
      );
      if (updateProfile) {
        await updateProfile({ profileImage: updatedUser.profileImage });
        setSuccessMessage("Profile picture updated!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    setIsImageLoading(true);
    setError("");
    try {
      const { auth } = await import("@/lib/auth");
      const token = auth.getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/users/profile-image/reset`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to reset profile image");
      const updatedUser = await response.json() as { profileImage?: string };
      if (updateProfile) {
        await updateProfile({ profileImage: updatedUser.profileImage });
        setSuccessMessage("Profile picture removed!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove image");
    } finally {
      setIsImageLoading(false);
    }
  };

  const hasCustomImage = !isRandomAvatar(user?.profileImage);
  const profileImageSrc = resolveImageUrl(user?.profileImage);

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
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-10 pb-10 border-b border-gray-100">
          {/* Image Preview */}
          <div className="relative group mb-4">
            <div className="size-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-orange-50 flex items-center justify-center">
              {isImageLoading ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-orange-50">
                  <Loader2Icon className="size-10 text-orange-400 animate-spin" />
                  <span className="text-xs text-orange-400 mt-2 font-medium">Uploading...</span>
                </div>
              ) : profileImageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImageSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="size-16 text-orange-200" />
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await handleImageUpload(file);
              // Reset input so the same file can be re-selected
              e.target.value = "";
            }}
          />

          {/* Action Buttons */}
          {hasCustomImage ? (
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                disabled={isImageLoading}
                onClick={() => document.getElementById("profile-upload")?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium shadow-md shadow-orange-100 hover:bg-orange-700 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <CameraIcon className="size-4" />
                Update picture
              </button>
              <button
                type="button"
                disabled={isImageLoading}
                onClick={handleRemoveProfileImage}
                className="flex items-center gap-2 px-4 py-2 bg-white text-red-500 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-50 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Trash2Icon className="size-4" />
                Remove picture
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isImageLoading}
              onClick={() => document.getElementById("profile-upload")?.click()}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl text-sm font-medium hover:bg-orange-100 hover:scale-105 transition-all disabled:opacity-50"
            >
              <CameraIcon className="size-4" />
              Upload profile picture
            </button>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
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
          <h3 className="text-lg font-semibold text-gray-900">
            Change Password
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
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
            disabled={isLoading || isImageLoading}
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
