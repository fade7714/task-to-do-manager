import React, { useState } from 'react';
import { Plus, Flame, Calendar, Tag, Sparkles } from 'lucide-react';
import { Category, PriorityLevel, Task } from '../types';
import { sounds } from '../utils/sound';

interface QuickAddBarProps {
  categories: Category[];
  onAddTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  onOpenFullModal: () => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  categories,
  onAddTask,
  onOpenFullModal,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'work');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playClick();
    onAddTask({
      title: title.trim(),
      priority,
      categoryId,
      completed: false,
      status: 'todo',
      dueDate: dueDate || undefined,
      isUrgent: priority === 'urgent' || priority === 'high',
      isImportant: priority === 'urgent' || priority === 'high',
      subtasks: [],
    });

    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-3 sm:p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Title Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task... (e.g. '👑 Prepare investor update' or 'Workout')"
            className="w-full pl-3.5 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Inline Quick Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Category Selector */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Priority Quick Picker */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              const cycle: PriorityLevel[] = ['low', 'medium', 'high', 'urgent'];
              const nextIndex = (cycle.indexOf(priority) + 1) % cycle.length;
              setPriority(cycle[nextIndex]);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              priority === 'urgent'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                : priority === 'high'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                : priority === 'medium'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title="Click to cycle priority level"
          >
            {priority === 'urgent' && <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />}
            <span className="capitalize">{priority === 'urgent' ? 'Boss' : priority}</span>
          </button>

          {/* Date Picker Input */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* Detailed Creator CTA */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenFullModal();
            }}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="Open comprehensive task details form"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
