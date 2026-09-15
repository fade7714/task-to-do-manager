import React from 'react';
import {
  Flame,
  Calendar,
  Users,
  Coffee,
  Plus,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { Category, Task } from '../types';
import { TaskCard } from './TaskCard';
import { sounds } from '../utils/sound';

interface MatrixViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onChangeStatus: (taskId: string, status: Task['status']) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onOpenNewTaskWithMatrix: (urgent: boolean, important: boolean) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  tasks,
  categories,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onDuplicateTask,
  onChangeStatus,
  onToggleSubtask,
  onAddSubtask,
  onOpenNewTaskWithMatrix,
}) => {
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  // Classify each task into one of the 4 Eisenhower quadrants
  // Fallback heuristic:
  // if task.isUrgent is explicit, use it. Otherwise priority === 'urgent' means urgent.
  // if task.isImportant is explicit, use it. Otherwise priority in ['urgent', 'high'] means important.
  const isTaskUrgent = (t: Task) =>
    t.isUrgent ?? (t.priority === 'urgent');
  const isTaskImportant = (t: Task) =>
    t.isImportant ?? (t.priority === 'urgent' || t.priority === 'high');

  const q1Tasks = tasks.filter((t) => isTaskUrgent(t) && isTaskImportant(t));
  const q2Tasks = tasks.filter((t) => !isTaskUrgent(t) && isTaskImportant(t));
  const q3Tasks = tasks.filter((t) => isTaskUrgent(t) && !isTaskImportant(t));
  const q4Tasks = tasks.filter((t) => !isTaskUrgent(t) && !isTaskImportant(t));

  const quadrants = [
    {
      id: 'q1',
      title: 'Do First (Urgent & Important)',
      subtitle: 'Critical deadlines, high impact emergencies & Boss tasks',
      icon: <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />,
      colorClass: 'text-rose-700 dark:text-rose-400',
      badgeClass: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
      borderClass: 'border-rose-200 dark:border-rose-900/60',
      headerBg: 'bg-rose-500/10 dark:bg-rose-950/30',
      urgent: true,
      important: true,
      taskList: q1Tasks,
    },
    {
      id: 'q2',
      title: 'Schedule (Important & Not Urgent)',
      subtitle: 'Long-term value, strategy, fitness, learning & career',
      icon: <Calendar className="w-4 h-4 text-indigo-500" />,
      colorClass: 'text-indigo-700 dark:text-indigo-400',
      badgeClass: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300',
      borderClass: 'border-indigo-200 dark:border-indigo-900/60',
      headerBg: 'bg-indigo-500/10 dark:bg-indigo-950/30',
      urgent: false,
      important: true,
      taskList: q2Tasks,
    },
    {
      id: 'q3',
      title: 'Delegate (Urgent & Not Important)',
      subtitle: 'Time-sensitive requests, interruptions & routine favors',
      icon: <Users className="w-4 h-4 text-amber-500" />,
      colorClass: 'text-amber-700 dark:text-amber-400',
      badgeClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300',
      borderClass: 'border-amber-200 dark:border-amber-900/60',
      headerBg: 'bg-amber-500/10 dark:bg-amber-950/30',
      urgent: true,
      important: false,
      taskList: q3Tasks,
    },
    {
      id: 'q4',
      title: 'Eliminate (Not Urgent & Not Important)',
      subtitle: 'Time wasters, non-essential backlog & mindless trivia',
      icon: <Coffee className="w-4 h-4 text-slate-500" />,
      colorClass: 'text-slate-700 dark:text-slate-400',
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      borderClass: 'border-slate-200 dark:border-slate-800',
      headerBg: 'bg-slate-500/10 dark:bg-slate-800/40',
      urgent: false,
      important: false,
      taskList: q4Tasks,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Matrix explanation banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            <strong>The Eisenhower Decision Matrix:</strong> Prioritize high-leverage work in{' '}
            <strong className="text-indigo-600 dark:text-indigo-400">Schedule (Q2)</strong> and eliminate distractions in{' '}
            <strong className="text-slate-600 dark:text-slate-400">Q4</strong>.
          </span>
        </div>
      </div>

      {/* 2x2 Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quadrants.map((q) => (
          <div
            key={q.id}
            className={`rounded-2xl border ${q.borderClass} bg-white dark:bg-slate-900 flex flex-col min-h-[380px] overflow-hidden shadow-xs`}
          >
            {/* Quadrant Header */}
            <div className={`p-4 border-b ${q.borderClass} ${q.headerBg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {q.icon}
                  <h3 className={`text-sm font-bold ${q.colorClass} tracking-tight`}>
                    {q.title}
                  </h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.badgeClass}`}>
                    {q.taskList.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenNewTaskWithMatrix(q.urgent, q.important);
                  }}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Add task directly to this quadrant"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {q.subtitle}
              </p>
            </div>

            {/* Task list */}
            <div className="p-3.5 space-y-3 flex-1 overflow-y-auto max-h-[500px]">
              {q.taskList.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    No items in this quadrant
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenNewTaskWithMatrix(q.urgent, q.important);
                    }}
                    className="mt-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    + Add item here
                  </button>
                </div>
              ) : (
                q.taskList.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={getCategory(task.categoryId)}
                    onToggleComplete={onToggleComplete}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                    onDuplicateTask={onDuplicateTask}
                    onChangeStatus={onChangeStatus}
                    onToggleSubtask={onToggleSubtask}
                    onAddSubtask={onAddSubtask}
                    compact
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
