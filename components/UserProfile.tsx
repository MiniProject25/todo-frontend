"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UserData, UserProfileProps } from "@/types/types";

export default function UserProfile({ onClose }: UserProfileProps) {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData>({ username: "", email: "" });

    // Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // --- 1. FETCH USER DATA ---
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData({ username: data.username, email: data.email });
                } else {
                    toast.error("Failed to load profile");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    // --- 2. UPDATE USER ---
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Password Validation Logic
        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                toast.error("New passwords do not match");
                return;
            }
            if (newPassword.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }
            if (!currentPassword) {
                toast.error("Please enter current password to verify changes");
                return;
            }
        }

        setIsSaving(true);
        const token = localStorage.getItem("token");

        const payload = {
            username: userData.username,
            email: userData.email,
            ...(newPassword && { password: newPassword }),
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Profile updated 🤓");
                // Clear password fields on success
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error("Update failed. Check your current password. 🥀");
            }
        } catch (error) {
            toast.error("Error updating profile 🥀");
        } finally {
            setIsSaving(false);
        }
    };

    // --- 3. LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out");
        router.push("/auth");
    };

    // --- 4. DELETE ACCOUNT ---
    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/delete`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem("token");
                router.push("/auth");
                toast.success("Account deleted");
            } else {
                toast.error("Failed to delete account");
            }
        } catch (error) {
            toast.error("Error deleting account");
        }
    };

    if (isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
                    <h2 className="text-lg font-bold text-white">Account Settings</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                    {/* Avatar Placeholder */}
                    <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4">

                        {/* Read-Only Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                            <input
                                type="email"
                                value={userData.email}
                                disabled
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed select-none"
                            />
                        </div>

                        {/* Editable Username */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
                            <input
                                type="text"
                                value={userData.username}
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>

                        <hr className="border-gray-800 my-4" />

                        {/* Password Section Header */}
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-medium text-cyan-500 uppercase tracking-wider">Change Password</label>
                            {/* Forgot Password Placeholder */}
                            <button type="button" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Forgot Password?</button>
                        </div>

                        {/* Current Password (Validation) */}
                        <div>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Current Password"
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>

                        {/* New Password */}
                        <div className="grid gap-3">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>

                        <div className="grid gap-3">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm New Password"
                                className={`w-full bg-gray-950 border rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:ring-1 focus:border-cyan-500 outline-none transition-all ${confirmPassword && newPassword !== confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-cyan-500"
                                    }`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full mt-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded-lg transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>

                    <hr className="border-gray-800" />

                    {/* Danger Zone */}
                    <div className="space-y-3">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2 rounded-lg hover:bg-gray-800 transition-all border border-transparent hover:border-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Log Out
                        </button>

                        <button
                            onClick={handleDeleteAccount}
                            className="w-full text-red-500 hover:text-red-400 text-sm py-2 hover:bg-red-900/10 rounded-lg transition-all"
                        >
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}