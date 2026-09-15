import React, { useState } from 'react';
import { CheckCircle, Inbox, Plus, Layers, Filter } from 'lucide-react';
import { Category, Task } from '../types';
import { TaskCard } from './TaskCard';
import { sounds } from '../utils/sound';

interface ListViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onChangeStatus: (taskId: string, status: Task['status']) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onOpenNewTask: () => void;
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  categories,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onDuplicateTask,
  onChangeStatus,
  onToggleSubtask,
  onAddSubtask,
  onOpenNewTask,
}) => {
  const [groupByStatus, setGroupByStatus] = useState(false);

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center my-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 mx-auto flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 opacity-80" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No tasks found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No items match your active search or filters. Create a new task or reset your search parameters to see your schedule.
        </p>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenNewTask();
          }}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* View Toolbar: Grouping toggle */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {activeTasks.length} pending, {completedTasks.length} completed
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setGroupByStatus(!groupByStatus);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
            groupByStatus
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{groupByStatus ? 'Ungroup' : 'Group by Status'}</span>
        </button>
      </div>

      {groupByStatus ? (
        <div className="space-y-6">
          {/* Active Tasks Group */}
          {activeTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Incomplete ({activeTasks.length})
                </span>
              </div>
              <div className="space-y-2.5">
                {activeTasks.map((task) => (
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
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks Group */}
          {completedTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Completed ({completedTasks.length})
                </span>
              </div>
              <div className="space-y-2.5">
                {completedTasks.map((task) => (
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
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => (
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
            />
          ))}
        </div>
      )}
    </div>
  );
};
