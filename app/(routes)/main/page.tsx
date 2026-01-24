"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
    category: string;
};

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "My Day";
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            router.push("/auth")
        }
    }, [])

    const [todos, setTodos] = useState<Todo[]>([
        { id: "1", text: "Buy milk and eggs", completed: false, category: "Groceries" },
        { id: "2", text: "Finish the dashboard UI", completed: true, category: "Work" },
        { id: "3", text: "Hit the gym", completed: false, category: "My Day" },
    ]);

    const [newTask, setNewTask] = useState("");

    // Filter tasks based on selected category from Sidebar
    const filteredTodos = todos.filter(t => t.category === currentCategory || currentCategory === "All");

    const toggleTodo = (id: string) => {
        // TODO: DB Update
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        // TODO: DB Insert
        const newTodoObj = {
            id: Date.now().toString(),
            text: newTask,
            completed: false,
            category: currentCategory
        };

        setTodos([...todos, newTodoObj]);
        setNewTask("");
    };

    return (
        <div className="max-w-4xl mx-auto">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">{currentCategory}</h1>
                <p className="text-gray-400 mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Add Task Input (Floating / Top) */}
            <div className="mb-8">
                <form onSubmit={addTodo} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-cyan-500 text-xl font-light">+</span>
                    </div>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="block w-full pl-10 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all shadow-lg"
                        placeholder={`Add a task to "${currentCategory}"...`}
                    />
                </form>
            </div>

            {/* Task List */}
            <div className="space-y-2">
                {filteredTodos.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <div className="text-6xl mb-4">☕</div>
                        <p className="text-gray-400">All caught up! No tasks here.</p>
                    </div>
                ) : (
                    filteredTodos.map((todo) => (
                        <div
                            key={todo.id}
                            onClick={() => toggleTodo(todo.id)}
                            className={`group flex items-center p-4 bg-gray-900/50 border border-gray-800/50 hover:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${todo.completed ? "opacity-50" : "opacity-100"
                                }`}
                        >
                            {/* Custom Checkbox */}
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed ? "bg-cyan-600 border-cyan-600" : "border-gray-600 group-hover:border-cyan-500"
                                }`}>
                                {todo.completed && (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>

                            {/* Task Text */}
                            <span className={`ml-4 text-sm sm:text-base transition-all ${todo.completed ? "text-gray-500 line-through" : "text-gray-200"
                                }`}>
                                {todo.text}
                            </span>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}