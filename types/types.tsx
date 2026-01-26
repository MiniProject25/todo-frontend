export interface user {
    email: string
    password: string
    username?: string
}

export interface todocat {
    id: number,
    category: string
}

export type Todo = {
    id: number;
    title: string;
    completed: boolean;
    steps: string[];
    dueDate: string;
    category: string;
};

export interface TodoDetailSidebarProps {
    todo: Todo | null;
    onClose: () => void;
    onDelete: (id: number) => void;
}