"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { user } from "@/types/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"

type AuthMode = "LOGIN" | "SIGNUP";

export default function AuthPage() {
    const router = useRouter()
    const [authMode, setAuthMode] = useState<AuthMode>("LOGIN");
    const [user, setUser] = useState<user>({
        email: "",
        username: "",
        password: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            router.push("/main")
        }
    }, [])

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const toggleAuthMode = () => {
        setAuthMode((prev) => (prev === "LOGIN" ? "SIGNUP" : "LOGIN"));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authMode === "LOGIN") {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user),
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("token", data.jwt)

                    setUser({
                        email: "",
                        username: "",
                        password: ""
                    });

                    toast.success("Success!", {
                        className: "bg-gray-800 text-white border border-gray-700",
                    });

                    router.push("/main")
                }
                else {
                    toast.error("Error!", {
                        className: "bg-gray-800 text-white border border-gray-700",
                    });
                }

            } catch (error) {
                toast.error("Error!", {
                    className: "bg-gray-800 text-white border border-gray-700",
                });
                console.error("Error: ", error)
            }

        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user),
                    credentials: "include"
                });

                if (response.ok) {
                    setUser({
                        username: "",
                        email: "",
                        password: ""
                    })
                    setAuthMode("LOGIN")

                    toast.success("Success!", {
                        className: "bg-gray-800 text-white border border-gray-700",
                    });
                }
                else {
                    toast.error("Error!", {
                        className: "bg-gray-800 text-white border border-gray-700",
                    });
                }

            } catch (error) {
                toast.error("Error!", {
                    className: "bg-gray-800 text-white border border-gray-700",
                });
                console.error("Error: ", error)
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background Decorative Gradient (Matches Homepage) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">

                {/* Header Section */}
                <div className="text-center">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-500">
                            TaskFlow
                        </span>
                    </Link>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-white transition-all duration-300">
                        {authMode === "LOGIN" ? "Welcome back" : "Create an account"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {authMode === "LOGIN"
                            ? "Enter your credentials to access your workspace."
                            : "Start organizing your life in seconds."}
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Name Field - Only visible in SIGNUP mode */}
                        {authMode === "SIGNUP" && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-gray-300"
                                >
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="username"
                                        type="text"
                                        value={user.username}
                                        onChange={changeHandler}
                                        required
                                        className="block w-full rounded-md border-0 bg-gray-800/50 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-300"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={user.email}
                                    onChange={changeHandler}
                                    required
                                    className="block w-full rounded-md border-0 bg-gray-800/50 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-300"
                            >
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={user.password}
                                    onChange={changeHandler}
                                    autoComplete={authMode === "LOGIN" ? "current-password" : "new-password"}
                                    required
                                    className="block w-full rounded-md border-0 bg-gray-800/50 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Forgot Password Link (Only for Login) */}
                        {authMode === "LOGIN" && (
                            <div className="flex items-center justify-end">
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all duration-200"
                            >
                                {authMode === "LOGIN" ? "Sign in" : "Create account"}
                            </button>
                        </div>
                    </form>

                    {/* Social / Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-gray-900 px-2 text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-800 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-700 hover:bg-gray-700 transition-colors border border-gray-700">
                                <span className="text-sm font-semibold leading-6">GitHub</span>
                            </button>
                            <button className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-800 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-700 hover:bg-gray-700 transition-colors border border-gray-700">
                                <span className="text-sm font-semibold leading-6">Google</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Toggle Mode Footer */}
                <p className="text-center text-sm text-gray-400">
                    {authMode === "LOGIN"
                        ? "Not a member? "
                        : "Already have an account? "}
                    <button
                        onClick={toggleAuthMode}
                        className="font-semibold leading-6 text-cyan-500 hover:text-cyan-400 transition-colors"
                    >
                        {authMode === "LOGIN" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}