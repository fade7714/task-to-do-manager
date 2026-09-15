import React from 'react';
import {
  Circle,
  PlayCircle,
  CheckCircle2,
  Plus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Category, Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { sounds } from '../utils/sound';

interface KanbanViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onOpenNewTaskWithStatus: (status: TaskStatus) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  categories,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onDuplicateTask,
  onChangeStatus,
  onToggleSubtask,
  onAddSubtask,
  onOpenNewTaskWithStatus,
}) => {
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const columns: {
    id: TaskStatus;
    title: string;
    icon: React.ReactNode;
    colorClass: string;
    borderClass: string;
    bgClass: string;
  }[] = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <Circle className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
      colorClass: 'text-slate-700 dark:text-slate-300',
      borderClass: 'border-t-4 border-t-slate-400 dark:border-t-slate-600',
      bgClass: 'bg-slate-50/60 dark:bg-slate-900/40',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <PlayCircle className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />,
      colorClass: 'text-indigo-600 dark:text-indigo-400',
      borderClass: 'border-t-4 border-t-indigo-500',
      bgClass: 'bg-indigo-50/20 dark:bg-indigo-950/10',
    },
    {
      id: 'done',
      title: 'Done',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      borderClass: 'border-t-4 border-t-emerald-500',
      bgClass: 'bg-emerald-50/20 dark:bg-emerald-950/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className={`rounded-2xl border border-slate-200/90 dark:border-slate-800/90 ${col.borderClass} ${col.bgClass} p-3.5 sm:p-4 flex flex-col min-h-[500px] shadow-xs`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className={`text-sm font-bold ${col.colorClass} tracking-tight`}>
                  {col.title}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenNewTaskWithStatus(col.id);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Tasks List */}
            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    No tasks in {col.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenNewTaskWithStatus(col.id);
                    }}
                    className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    + Add one
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task.id} className="relative group/kanban">
                    <TaskCard
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

                    {/* Quick Move Buttons on card hover */}
                    <div className="flex items-center justify-end gap-1 mt-1.5 px-1 opacity-80 group-hover/kanban:opacity-100 transition-opacity">
                      {col.id !== 'todo' && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            onChangeStatus(
                              task.id,
                              col.id === 'done' ? 'in_progress' : 'todo'
                            );
                          }}
                          className="flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs"
                          title="Move card left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Move Back</span>
                        </button>
                      )}

                      {col.id !== 'done' && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            onChangeStatus(
                              task.id,
                              col.id === 'todo' ? 'in_progress' : 'done'
                            );
                          }}
                          className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs"
                          title="Move card right"
                        >
                          <span>Move Next</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
