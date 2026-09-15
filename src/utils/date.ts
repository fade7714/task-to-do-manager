export interface DueDateStatus {
  status: 'overdue' | 'today' | 'upcoming' | 'none';
  label: string;
  badgeClass: string;
}

/**
 * Normalizes a Date to midnight (00:00:00.000) for clean calendar day comparisons
 */
export function normalizeDate(d: Date): Date {
  const normalized = new Date(d);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Returns dynamic status information for a given task's due date
 */
export function getDueDateStatus(dueDateStr?: string, completed = false): DueDateStatus {
  if (!dueDateStr) {
    return {
      status: 'none',
      label: '',
      badgeClass: '',
    };
  }

  if (completed) {
    return {
      status: 'none',
      label: 'Completed',
      badgeClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
    };
  }

  const taskDate = new Date(dueDateStr);
  const now = new Date();
  const todayMidnight = normalizeDate(now);
  const taskMidnight = normalizeDate(taskDate);

  const diffTime = taskMidnight.getTime() - todayMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const hasTime = dueDateStr.includes('T') && !dueDateStr.endsWith('T00:00');
  const timeFormatted = hasTime
    ? ' at ' +
      taskDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      status: 'overdue',
      label: daysAgo === 1 ? `Overdue by 1 day` : `Overdue by ${daysAgo} days`,
      badgeClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60 font-semibold',
    };
  }

  if (diffDays === 0) {
    // Check if overdue by hours today
    if (hasTime && taskDate.getTime() < now.getTime()) {
      return {
        status: 'overdue',
        label: `Overdue (${taskDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })})`,
        badgeClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60 font-semibold',
      };
    }
    return {
      status: 'today',
      label: `Due Today${timeFormatted}`,
      badgeClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60 font-medium',
    };
  }

  if (diffDays === 1) {
    return {
      status: 'upcoming',
      label: `Tomorrow${timeFormatted}`,
      badgeClass: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/50',
    };
  }

  return {
    status: 'upcoming',
    label: `${taskDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}${timeFormatted}`,
    badgeClass: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
  };
}

/**
 * Calculates current completion streak in consecutive days
 */
export function calculateStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;

  // Extract unique sorted YYYY-MM-DD strings
  const uniqueDates = Array.from(
    new Set(
      completedDates
        .map((d) => {
          try {
            return new Date(d).toISOString().split('T')[0];
          } catch {
            return '';
          }
        })
        .filter(Boolean)
    )
  ).sort().reverse();

  if (uniqueDates.length === 0) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let streak = 0;
  let checkDate = new Date();

  // If didn't complete anything today, check if active up to yesterday
  if (uniqueDates[0] === todayStr) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (uniqueDates[0] === yesterdayStr) {
    streak = 1;
    checkDate = yesterday;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Streak broken
    return 0;
  }

  for (let i = 1; i < uniqueDates.length; i++) {
    const expectedStr = checkDate.toISOString().split('T')[0];
    if (uniqueDates.includes(expectedStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
