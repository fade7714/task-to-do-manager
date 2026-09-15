export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type ViewMode = 'list' | 'kanban' | 'matrix';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex
  bgLight: string;
  textLight: string;
  borderLight: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: TaskStatus;
  priority: PriorityLevel;
  categoryId: string;
  dueDate?: string; // ISO string YYYY-MM-DD or YYYY-MM-DDTHH:mm
  isUrgent?: boolean; // For Eisenhower Matrix
  isImportant?: boolean; // For Eisenhower Matrix
  subtasks: SubTask[];
  createdAt: string;
  completedAt?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  dueToday: number;
  urgentCompleted: number;
  streakDays: number;
  lastCompletionDate?: string;
}

export interface MotivationalQuote {
  quote: string;
  author: string;
  tag: string;
}
