"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { todocat } from "@/types/types";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [categories, setCategories] = useState<todocat[]>([]);
    const [newCatName, setNewCatName] = useState("");
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("My Day");
    const router = useRouter()

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/`, {
                method: "POST",
                body: JSON.stringify({
                    category: newCatName
                }),
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
            })

            if (response.ok) {
                const data = await response.json()

                setCategories((prev) => {
                    return prev ? [...prev, data] : [data]
                })
            }
        } catch (error) {
            toast.error("Blud could not add category 🥀")
        }

        setNewCatName("");
    };

    const getTodoCatFromDB = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
            })

            if (response.ok) {
                const data = await response.json()

                setCategories(data)
            }

        } catch (error) {
            toast.error("Blud could not get categories 🥀")
        }
    }

    const deleteTodoCat = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            })

            if (response.ok) {
                toast.success("Blud deleted the category 🤓")
                setCategories(prev => prev.filter(category => category.id != id))
                router.push("/main")
            } else {
                toast.error("Blud could not delete the category 🥀")
            }
        } catch (error) {
            toast.error("Blud could not delete the category 🥀")
        }
    }

    useEffect(() => {
        getTodoCatFromDB()
    }, [])

    const orderedCat = [
        ...categories.filter(cat => cat.category === "My Day"),
        ...categories.filter(cat => cat.category !== "My Day"),
    ]

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">

            {/* --- SIDEBAR (Left) --- */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col md:flex">

                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <div className="w-8 h-8 bg-linear-to-br from-cyan-500 to-blue-600 rounded-lg mr-3"></div>
                    <span className="font-bold text-xl tracking-tight">TaskFlow</span>
                </div>

                {/* Categories List */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Collections
                    </p>

                    {orderedCat.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/main?catId=${cat.id}&title=${cat.category}`}
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group ${activeCategory === cat.category
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-3 ${activeCategory === cat.category ? "bg-cyan-400" : "bg-gray-600 group-hover:bg-gray-400"}`}></span>
                                {cat.category}
                            </div>

                            {cat.category !== "My Day" && (
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteTodoCat(cat.id) }} className="ml-auto cursor-pointer group-hover:bg-slate-800 transition">
                                    🗑️
                                </button>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Add Category Input */}
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
            </aside >

            {/* --- MAIN CONTENT WRAPPER --- */}
            < div className="flex-1 flex flex-col min-w-0" >

                {/* --- TOP NAVBAR --- */}
                < header className="h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8" >

                    {/* Search Bar */}
                    < div className="flex-1 max-w-lg" >
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="block w-full pl-10 pr-3 py-1.5 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-950 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-colors"
                            />
                        </div>
                    </div >

                    {/* User Profile */}
                    < div className="ml-4 flex items-center gap-4" >
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <span className="sr-only">Notifications</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 cursor-pointer">
                            U
                        </div>
                    </div >
                </header >

                {/* --- PAGE CONTENT INJECTION --- */}
                < main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative" >
                    {children}
                </main >
            </div >
        </div >
    );
}