"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ToDoSideBar from "@/components/TodoSidebar";
import { Todo, TodoItemUpdate } from "@/types/types";

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentCatId = searchParams.get("catId");
    const currentTitle = searchParams.get("title") || "My Day";

    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGetTodo = useCallback(async () => {
        if (!currentCatId) return;

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/item?id=${currentCatId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setTodos(data);
            } else {
                setTodos([]);
            }
        } catch (error) {
            console.error("Error fetching todos", error);
            toast.error("Could not load tasks");
        } finally {
            setLoading(false);
        }
    }, [currentCatId]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth");
            return;
        }
        handleGetTodo();
    }, [handleGetTodo, router]);

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const token = localStorage.getItem("token");

        // 1. Create the payload expected by your backend
        const payload = {
            title: newTask,
            categoryId: currentCatId,
            steps: [],
            dueDate: new Date().toISOString()
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/item?id=${currentCatId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const savedTodo = await response.json();

                setTodos((prev) => [...prev, savedTodo]);
                setNewTask("");
                toast.success("Task created");
            } else {
                toast.error("Failed to create task");
            }
        } catch (error) {
            console.error("Add error", error);
            toast.error("Something went wrong");
        }
    };

    // --- UPDATE TODO LOCAL STATE ---
    const handleUpdateTodoState = (updatedTodo: Todo) => {
        setTodos((prev) => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));

        // Also update selectedTodo so the sidebar reflects the changes immediately
        setSelectedTodo(updatedTodo);
    };

    const handleRemoveTodo = (id: number) => {
        setTodos((prev) => prev.filter(t => t.id != id))
        setSelectedTodo(null)
    }

    const deleteTodo = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/item?id=${id}&catId=${currentCatId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (response.ok) {
                toast.success("Task deleted! 🤓");
                setTodos(todos.filter(t => t.id !== id));
                setSelectedTodo(null);
            }
            else {
                toast.error("Blud failed to delete todo item 🥀")
            }
        } catch (error) {
            toast.error("Blud failed to delete todo item gng 🥀")
            console.error(error)
        }
    };

    const toggleTodo = async (e: React.MouseEvent, id: number, status: Boolean) => {
        e.stopPropagation();

        const prevTodos = todos;

        // optimistic update of the todo status
        setTodos(todos.map((t) =>
            t.id == id ? { ...t, completed: !t.completed } : t
        ));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/item/complete?id=${id}&catId=${currentCatId}&status=${!status}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })

            if (response.ok) {
                console.log("Completed!")
            }
            else {
                console.error("Failed!")
            }
        } catch (error) {
            setTodos(prevTodos)
            console.error("Failed to update status: ", error)
        }
    };

    return (
        <div className="flex h-full relative">
            <div className={`flex-1 transition-all duration-300 ${selectedTodo ? 'mr-0 lg:mr-96' : ''}`}>
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{currentTitle}</h1>
                        <p className="text-gray-400 mt-1">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                    </div>

                    {/* Add Task Input */}
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
                                placeholder={`Add a task to "${currentTitle}"...`}
                            />
                        </form>
                    </div>

                    {/* List */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-900/50 rounded-lg animate-pulse border border-gray-800"></div>)}
                        </div>
                    ) : (
                        <div className="space-y-2 pb-20">
                            {todos.length === 0 ? (
                                <div className="text-center py-20 opacity-50">
                                    <div className="text-6xl mb-4">☕</div>
                                    <p className="text-gray-400">All caught up! No tasks here.</p>
                                </div>
                            ) : (
                                todos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        onClick={() => setSelectedTodo(todo)}
                                        className={`group flex items-center p-4 bg-gray-900/50 border rounded-lg cursor-pointer transition-all duration-200 
                      ${selectedTodo?.id === todo.id ? "border-cyan-500/50 ring-1 ring-cyan-500/20 bg-gray-800/80" : "border-gray-800/50 hover:border-gray-700"}
                      ${todo.completed ? "opacity-60" : "opacity-100"}
                    `}
                                    >
                                        <div
                                            onClick={(e) => toggleTodo(e, todo.id, todo.completed)}
                                            className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer z-10 ${todo.completed
                                                ? "bg-cyan-600 border-cyan-600"
                                                : "border-gray-600 hover:border-cyan-500"
                                                }`}
                                        >
                                            {todo.completed && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>

                                        <span className={`ml-4 text-sm sm:text-base transition-all ${todo.completed ? "text-gray-500 line-through" : "text-gray-200"}`}>
                                            {todo.title}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar with Update Handler */}
            {selectedTodo && (
                <ToDoSideBar
                    todo={selectedTodo}
                    onClose={() => setSelectedTodo(null)}
                    onDelete={deleteTodo}
                    onUpdate={handleUpdateTodoState}
                    onRemove={handleRemoveTodo}
                />
            )}
        </div>
    );
}