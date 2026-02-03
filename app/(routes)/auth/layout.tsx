"use client"

import Navbar from "@/components/Navbar"

export default function AuthLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    )
}