import { Category, Task } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'work',
    name: 'Work',
    color: '#3b82f6',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    textLight: 'text-blue-700 dark:text-blue-300',
    borderLight: 'border-blue-200 dark:border-blue-800/60',
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#8b5cf6',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40',
    textLight: 'text-purple-700 dark:text-purple-300',
    borderLight: 'border-purple-200 dark:border-purple-800/60',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    color: '#10b981',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    textLight: 'text-emerald-700 dark:text-emerald-300',
    borderLight: 'border-emerald-200 dark:border-emerald-800/60',
  },
  {
    id: 'ideas',
    name: 'Ideas',
    color: '#f59e0b',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    textLight: 'text-amber-700 dark:text-amber-300',
    borderLight: 'border-amber-200 dark:border-amber-800/60',
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#06b6d4',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    textLight: 'text-cyan-700 dark:text-cyan-300',
    borderLight: 'border-cyan-200 dark:border-cyan-800/60',
  },
];

// Helper to format ISO dates relative to today
const getRelativeDate = (dayOffset: number, hours = 17, minutes = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hours, minutes, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '👑 Ship Q3 Product Roadmap & Final Architecture',
    description: 'Finalize core microservices migration and review tech debt budget with stakeholders.',
    completed: false,
    status: 'in_progress',
    priority: 'urgent', // Boss Task!
    categoryId: 'work',
    dueDate: getRelativeDate(0, 18, 30), // Due Today
    isUrgent: true,
    isImportant: true,
    subtasks: [
      { id: 'sub-1', title: 'Compile benchmark numbers', completed: true },
      { id: 'sub-2', title: 'Sync with security audit team', completed: true },
      { id: 'sub-3', title: 'Prepare slide deck for executive demo', completed: false },
    ],
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Complete 5km Morning Interval Run',
    description: 'Maintain 5:15 pace with 3 high-intensity sprints.',
    completed: true,
    status: 'done',
    priority: 'medium',
    categoryId: 'fitness',
    dueDate: getRelativeDate(0, 8, 0),
    isUrgent: false,
    isImportant: true,
    subtasks: [
      { id: 'sub-4', title: 'Dynamic warmup stretches', completed: true },
      { id: 'sub-5', title: 'Hydration & electrolyte intake', completed: true },
    ],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Review Quarterly Investment Portfolio & Budget Rebalance',
    description: 'Adjust index allocations and maximize tax-advantaged contributions.',
    completed: false,
    status: 'todo',
    priority: 'high',
    categoryId: 'finance',
    dueDate: getRelativeDate(1, 14, 0), // Tomorrow
    isUrgent: false,
    isImportant: true,
    subtasks: [
      { id: 'sub-6', title: 'Download latest monthly brokerage statements', completed: false },
      { id: 'sub-7', title: 'Audit recurring subscriptions', completed: false },
    ],
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Brainstorm AI Assistant Audio Visualizer Prototype',
    description: 'Explore WebGL shaders vs SVG ripple animations for low-overhead audio feedback.',
    completed: false,
    status: 'todo',
    priority: 'low',
    categoryId: 'ideas',
    dueDate: getRelativeDate(3, 19, 0), // Upcoming
    isUrgent: false,
    isImportant: false,
    subtasks: [],
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Fix Critical Production SSL Certificate Warning',
    description: 'Renew wildcard cert for staging subdomains before automated rotation failure.',
    completed: false,
    status: 'todo',
    priority: 'urgent', // Boss Task!
    categoryId: 'work',
    dueDate: getRelativeDate(-1, 12, 0), // Overdue!
    isUrgent: true,
    isImportant: true,
    subtasks: [
      { id: 'sub-8', title: 'Generate CSR on ingress node', completed: true },
      { id: 'sub-9', title: 'Deploy updated secret to Kubernetes cluster', completed: false },
    ],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Pick up organic groceries and meal prep for the week',
    description: 'Stock up on greens, wild salmon, avocados, and fresh kombucha.',
    completed: false,
    status: 'in_progress',
    priority: 'medium',
    categoryId: 'personal',
    dueDate: getRelativeDate(0, 20, 0), // Today
    isUrgent: true,
    isImportant: false,
    subtasks: [
      { id: 'sub-10', title: 'Check pantry inventory', completed: true },
      { id: 'sub-11', title: 'Grab reusable produce bags', completed: false },
    ],
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
];
