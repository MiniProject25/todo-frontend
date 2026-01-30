// hooks/useCategories.ts
import useSWR from "swr";
import { todocat } from "@/types/types";

const fetcher = async (url: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
};

export function useCategories() {
    const { data, error, isLoading, mutate } = useSWR<todocat[]>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/categories/`,
        fetcher,
        {
            revalidateOnFocus: false, // Optional: Stop re-fetching when clicking window
            dedupingInterval: 60000,  // Cache for 1 minute
        }
    );

    return {
        categories: data || [],
        isLoading,
        isError: error,
        mutate, // This function lets us manually refresh the cache (e.g. after adding)
    };
}