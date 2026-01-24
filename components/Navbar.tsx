"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const MOCK_USER_IS_LOGGED_IN = false;

const useMockAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate an async check for session
        const checkAuth = setTimeout(() => {
            setIsLoggedIn(MOCK_USER_IS_LOGGED_IN);
            setIsLoading(false);
        }, 500); // small delay to simulate loading

        return () => clearTimeout(checkAuth);
    }, []);

    return { isLoggedIn, isLoading };
};
// --------------------------------


const Navbar = () => {
    const { isLoggedIn, isLoading } = useMockAuth();

    return (
        <nav className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-800 bg-gray-950/75ish">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-linear-to-br from-white to-cyan-300 rounded-lg"></div>
                            <span className="font-bold text-xl tracking-tight text-white">
                                TaskFlow
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links / Auth Buttons */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">

                            {isLoading ? (
                                // Loading skeleton state for buttons
                                <div className="flex gap-4 animate-pulse">
                                    <div className="h-10 w-20 bg-gray-800 rounded"></div>
                                    <div className="h-10 w-20 bg-gray-800 rounded"></div>
                                </div>
                            ) : isLoggedIn ? (
                                // State: LOGGED IN
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => alert("Logout logic here")}
                                        className="bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-all border border-gray-700"
                                    >
                                        Log out
                                    </button>
                                </>
                            ) : (
                                // State: NOT LOGGED IN
                                <>
                                    <Link
                                        href="/auth"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/auth"
                                        className="bg-linear-to-r from-white to-cyan-300 hover:from-cyan-100 hover:to-cyan-400 text-gray-900 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button (Simplified for this example) */}
                    <div className="-mr-2 flex md:hidden">
                        <button type="button" className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;