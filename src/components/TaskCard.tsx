import React, { useState } from 'react';
import {
  Check,
  Calendar,
  Clock,
  Flame,
  Crown,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Copy,
} from 'lucide-react';
import { Category, PriorityLevel, Task } from '../types';
import { getDueDateStatus } from '../utils/date';
import { sounds } from '../utils/sound';
import { fireBossTaskConfetti, fireStandardConfetti } from '../utils/confetti';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask?: (task: Task) => void;
  onChangeStatus?: (taskId: string, status: Task['status']) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  category,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onDuplicateTask,
  onChangeStatus,
  onToggleSubtask,
  onAddSubtask,
  compact = false,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const isBossTask = task.priority === 'urgent';
  const dueDateInfo = getDueDateStatus(task.dueDate, task.completed);

  // Calculate subtask progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeCompleted = !task.completed;

    if (willBeCompleted) {
      if (isBossTask) {
        sounds.playBossComplete();
        fireBossTaskConfetti();
      } else {
        sounds.playComplete();
        // Fire confetti from trigger location
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const originX = rect.left / window.innerWidth;
        const originY = rect.top / window.innerHeight;
        fireStandardConfetti(originX, originY);
      }
    } else {
      sounds.playClick();
    }

    onToggleComplete(task.id);
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !onAddSubtask) return;
    sounds.playClick();
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  // Priority styling badge mapping
  const priorityConfig: Record<
    PriorityLevel,
    { label: string; badgeClass: string; icon: React.ReactNode }
  > = {
    low: {
      label: 'Low',
      badgeClass:
        'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      icon: null,
    },
    medium: {
      label: 'Medium',
      badgeClass:
        'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
      icon: null,
    },
    high: {
      label: 'High',
      badgeClass:
        'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 font-semibold',
      icon: <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />,
    },
    urgent: {
      label: 'Boss Task',
      badgeClass:
        'bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold shadow-sm shadow-rose-500/30 border-transparent',
      icon: <Crown className="w-3.5 h-3.5 fill-white" />,
    },
  };

  const priorityMeta = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-200 ${
        isBossTask && !task.completed
          ? 'boss-glow bg-gradient-to-br from-rose-500/5 via-orange-500/5 to-transparent dark:from-rose-500/10 dark:via-orange-500/10 border-2 border-rose-500/70 dark:border-rose-500/80'
          : task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 opacity-75'
          : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60'
      } ${compact ? 'p-3.5' : 'p-4 sm:p-5'}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Interactive Checkbox */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
            task.completed
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 scale-100 ring-2 ring-emerald-500/30'
              : isBossTask
              ? 'border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-500 hover:text-white'
              : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          }`}
          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        >
          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Task Core Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${priorityMeta.badgeClass}`}
            >
              {priorityMeta.icon}
              <span>{priorityMeta.label}</span>
            </span>

            {/* Category Tag */}
            {category && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  category.bgLight
                } ${category.textLight} ${category.borderLight}`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </span>
            )}

            {/* Due Date Status */}
            {dueDateInfo.status !== 'none' && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border ${dueDateInfo.badgeClass}`}
              >
                <Clock className="w-3 h-3" />
                <span>{dueDateInfo.label}</span>
              </span>
            )}

            {/* Eisenhower Indicator if Matrix flagged */}
            {(task.isUrgent || task.isImportant) && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">
                {task.isUrgent && task.isImportant
                  ? '⚡ Do First'
                  : task.isImportant
                  ? '📅 Schedule'
                  : '🤝 Delegate'}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onEditTask(task)}
            className={`text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              task.completed ? 'line-through text-slate-400 dark:text-slate-500 font-normal' : ''
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              onClick={() => onEditTask(task)}
              className={`text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 cursor-pointer ${
                task.completed ? 'line-through text-slate-400/80' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Subtasks Progress Bar & Checklist Preview */}
          {totalSubtasks > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowSubtasks(!showSubtasks);
                }}
                className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1 mr-3">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Subtasks: {completedSubtasks}/{totalSubtasks}
                  </span>
                  <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${subtaskPercent}%` }}
                    />
                  </div>
                </div>
                <span className="flex items-center gap-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                  {showSubtasks ? 'Hide' : 'Expand'}
                  {showSubtasks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
              </button>

              {/* Subtasks Expanded Checklist */}
              {showSubtasks && (
                <div className="mt-2.5 space-y-1.5 pl-1">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 group/sub py-0.5 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => {
                          sounds.playClick();
                          onToggleSubtask && onToggleSubtask(task.id, subtask.id);
                        }}
                        className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span
                        className={`flex-1 ${
                          subtask.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : ''
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}

                  {/* Add Subtask Quick Input */}
                  {onAddSubtask && (
                    <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Add subtask..."
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                      />
                      <button
                        type="submit"
                        disabled={!newSubtaskTitle.trim()}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Menu (Three dots & Quick Status) */}
        <div className="relative shrink-0 flex items-center gap-1">
          {/* Quick Kanban Status transition */}
          {onChangeStatus && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                const nextStatus: Record<Task['status'], Task['status']> = {
                  todo: 'in_progress',
                  in_progress: 'done',
                  done: 'todo',
                };
                onChangeStatus(task.id, nextStatus[task.status]);
              }}
              title={`Status: ${task.status}. Click to cycle.`}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-50 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setShowMenu(false);
                    onEditTask(task);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit details</span>
                </button>

                {onDuplicateTask && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setShowMenu(false);
                      onDuplicateTask(task);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>
                )}

                <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />

                <button
                  type="button"
                  onClick={() => {
                    sounds.playDelete();
                    setShowMenu(false);
                    onDeleteTask(task.id);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete task</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
