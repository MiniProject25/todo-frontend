"use client"

import { ToastContainer } from "react-toastify"

export default function ToastProvider() {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
        />
    )
}