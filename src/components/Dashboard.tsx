import React from 'react';
import {
  Flame,
  Crown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trophy,
} from 'lucide-react';
import { Task, TaskStats } from '../types';

interface DashboardProps {
  tasks: Task[];
  stats: TaskStats;
  onFilterStatus?: (status: 'all' | 'active' | 'completed' | 'overdue' | 'boss') => void;
  currentFilter?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  stats,
  onFilterStatus,
  currentFilter,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Boss tasks statistics
  const bossTasks = tasks.filter((t) => t.priority === 'urgent');
  const bossTasksCompleted = bossTasks.filter((t) => t.completed).length;

  // SVG Progress Ring calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <section className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        
        {/* Metric 1: Overall Progress Ring */}
        <div className="flex items-center gap-4 bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-700/80"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-700 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                {completionPercentage}%
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                Done
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Velocity</span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {completedTasks} <span className="text-xs font-normal text-slate-400">/ {totalTasks} tasks</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {completionPercentage === 100 && totalTasks > 0
                ? '🎉 All cleared today!'
                : `${totalTasks - completedTasks} remaining`}
            </p>
          </div>
        </div>

        {/* Metric 2: Completion Streak */}
        <div className="flex items-center gap-3.5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-500/15 dark:via-orange-500/10 p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Flame className="w-6 h-6 fill-white animate-bounce duration-1000" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
              <span>Day Streak</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats.streakDays}
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {stats.streakDays > 1 ? 'Days on Fire' : 'Day Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Complete any task daily to maintain
            </p>
          </div>
        </div>

        {/* Metric 3: Boss Tasks (Urgent Tasks Conquered) */}
        <div className="flex items-center gap-3.5 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent dark:from-rose-500/15 dark:via-pink-500/10 p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/25 shrink-0">
            <Crown className="w-6 h-6 fill-white/20 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
              <span>Boss Tasks</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {bossTasksCompleted}
              </span>
              <span className="text-xs font-medium text-slate-400">
                / {bossTasks.length} vanquished
              </span>
            </div>
            <p className="text-[11px] text-rose-600/90 dark:text-rose-400/90 font-medium">
              {bossTasks.length - bossTasksCompleted === 0 && bossTasks.length > 0
                ? '🏆 All Bosses Defeated!'
                : `${bossTasks.length - bossTasksCompleted} Boss fight pending`}
            </p>
          </div>
        </div>

        {/* Metric 4: Due Today & Overdue Warnings */}
        <div className="flex items-center gap-3.5 bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="w-12 h-12 rounded-xl bg-slate-200/80 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
            {stats.overdue > 0 ? (
              <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />
            ) : (
              <Trophy className="w-6 h-6 text-indigo-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <span>Timeline</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {stats.overdue > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400">
                  {stats.overdue} Overdue
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                <Clock className="w-3 h-3" />
                {stats.dueToday} Today
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {stats.overdue > 0 ? 'Prioritize overdue items first' : 'Schedule is on track'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
