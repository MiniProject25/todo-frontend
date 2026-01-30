"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useCategories } from "@/hook/useCategories";
import UserProfile from "@/components/UserProfile";
import { useSearchParams } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams()
    // 1. Use SWR Hook (Replaces useState/useEffect)
    const { categories, mutate } = useCategories();

    const [newCatName, setNewCatName] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // FIX: Matches the 'title' param used in your Links
    const activeCategory = searchParams.get("title") || "My Day";

    // --- ADD CATEGORY ---
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        // Optimistic UI Update (Fake it immediately)
        // We create a temp object to show instantly
        const tempCat = { id: Date.now(), category: newCatName };
        mutate([...categories, tempCat], false); // false = don't revalidate yet

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ category: newCatName })
            });

            if (response.ok) {
                setNewCatName("");
                mutate(); // Fetch true data from server to sync IDs
            }
        } catch (error) {
            console.error(error);
            toast.error("Blud failed to add category 🥀");
        }
    };

    // --- DELETE CATEGORY ---
    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm("Delete this category?")) return;

        // Optimistic UI Update (Remove immediately)
        mutate(categories.filter((c) => c.id !== id), false);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories?id=${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success("Category deleted gng 🤓");
                mutate(); // Sync with server
            } else {
                toast.error("Blud failed to delete 🥀");
                mutate(); // Revert if failed
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting category gng 🥀");
        }
    };

    // --- SEPARATE "MY DAY" FROM OTHERS ---
    const myDayCat = categories?.find(c => c.category === "My Day");
    const otherCategories = categories?.filter(c => c.category !== "My Day") || [];

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">

            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mr-3"></div>
                    <span className="font-bold text-xl tracking-tight">TaskFlow</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">

                    {/* 1. MY DAY (Pinned) */}
                    {myDayCat && (
                        <div className="mb-4">
                            <Link
                                href={`/main?catId=${myDayCat.id}&title=${myDayCat.category}`}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group ${activeCategory === "My Day"
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <svg className={`w-5 h-5 mr-3 shrink-0 ${activeCategory === "My Day" ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                My Day
                            </Link>
                        </div>
                    )}

                    {/* 2. OTHER COLLECTIONS */}
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Collections
                    </p>

                    {otherCategories.map((cat) => {
                        const isActive = activeCategory === cat.category;
                        console.log(isActive)
                        return (
                            <div
                                key={cat.id}
                                className={`group flex items-center gap-0.5 justify-between relative text-sm font-medium rounded-md transition-all duration-200 ${isActive
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <Link
                                    href={`/main?catId=${cat.id}&title=${cat.category}`}
                                    className="flex items-center w-full px-3 py-2.5 flex-1"
                                >
                                    <span className={`w-2 h-2 rounded-full mr-3 shrink-0 ${isActive ? "bg-cyan-400" : "bg-gray-600 group-hover:bg-gray-400"}`}></span>
                                    {cat.category}
                                </Link>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteCategory(cat.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-all rounded hover:bg-gray-700/50"
                                    title="Delete Category"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <form onSubmit={handleAddCategory} className="relative">
                        <input
                            type="text"
                            placeholder="+ New List"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="w-full bg-gray-950 text-sm text-gray-300 rounded-md border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 pl-3 py-2 outline-none transition-all"
                        />
                    </form>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Search & Profile (Same as before) */}
                    <div className="flex-1 max-w-lg">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input type="text" placeholder="Search tasks..." className="block w-full pl-10 pr-3 py-1.5 border border-gray-700 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-950 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm" />
                        </div>
                    </div>
                    <div
                        onClick={() => setIsProfileOpen(true)}
                        className="h-9 w-9 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 shadow-lg cursor-pointer transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
                    {children}
                </main>

                {isProfileOpen && (
                    <UserProfile onClose={() => setIsProfileOpen(false)} />
                )}
            </div>
        </div>
    );
}