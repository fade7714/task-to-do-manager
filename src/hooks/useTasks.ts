import { useState, useEffect, useMemo } from 'react';
import { Category, PriorityLevel, Task, TaskStats, TaskStatus } from '../types';
import { INITIAL_CATEGORIES, INITIAL_TASKS } from '../data/initialData';
import { calculateStreak } from '../utils/date';

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  CATEGORIES: 'taskflow_categories_v1',
  DARK_MODE: 'taskflow_dark_mode_v1',
  SOUND_ENABLED: 'taskflow_sound_v1',
};

export function useTasks() {
  // 1. Tasks state with LocalStorage hydration
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  // 2. Categories state
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    }
    return INITIAL_CATEGORIES;
  });

  // 3. Dark Mode preference
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    } catch {
      return false;
    }
  });

  // 4. Sound feedback toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {}
    return true;
  });

  // Sync tasks to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist tasks', e);
    }
  }, [tasks]);

  // Sync categories
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to persist categories', e);
    }
  }, [categories]);

  // Sync dark mode class on document element
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to persist dark mode', e);
    }
  }, [darkMode]);

  // Sync sound settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  // Task Mutators (Strictly Immutable)
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...updatedTask } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const duplicateTask = (taskToDup: Task) => {
    const duplicated: Task = {
      ...taskToDup,
      id: `task-${Date.now()}`,
      title: `${taskToDup.title} (Copy)`,
      completed: false,
      status: 'todo',
      createdAt: new Date().toISOString(),
      completedAt: undefined,
    };
    setTasks((prev) => [duplicated, ...prev]);
  };

  const toggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const willComplete = !t.completed;
        return {
          ...t,
          completed: willComplete,
          status: willComplete ? 'done' : 'todo',
          completedAt: willComplete ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const changeStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const isCompleted = status === 'done';
        return {
          ...t,
          status,
          completed: isCompleted,
          completedAt: isCompleted
            ? t.completedAt || new Date().toISOString()
            : undefined,
        };
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newSubtask = {
          id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title,
          completed: false,
        };
        return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
      })
    );
  };

  const resetToSampleData = () => {
    setTasks(INITIAL_TASKS);
    setCategories(INITIAL_CATEGORIES);
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  // Compute Gamification and Timeline Stats
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Overdue tasks
    let overdue = 0;
    let dueToday = 0;

    tasks.forEach((t) => {
      if (t.completed || !t.dueDate) return;
      const tDate = new Date(t.dueDate);
      const tDateStr = t.dueDate.split('T')[0];

      if (tDateStr === todayStr) {
        dueToday++;
      } else if (tDate.getTime() < now.getTime()) {
        overdue++;
      }
    });

    const urgentCompleted = tasks.filter(
      (t) => t.priority === 'urgent' && t.completed
    ).length;

    // Collect dates of completions for streak
    const completionDates = tasks
      .filter((t) => t.completed && t.completedAt)
      .map((t) => t.completedAt as string);

    // If initial tasks have completed tasks without explicit completedAt, use today for sample
    if (completed > 0 && completionDates.length === 0) {
      completionDates.push(new Date().toISOString());
    }

    const streakDays = calculateStreak(completionDates);

    return {
      total,
      completed,
      active,
      overdue,
      dueToday,
      urgentCompleted,
      streakDays: streakDays > 0 ? streakDays : 1, // Minimum 1 for active participant
      lastCompletionDate: completionDates[completionDates.length - 1],
    };
  }, [tasks]);

  return {
    tasks,
    categories,
    darkMode,
    setDarkMode,
    soundEnabled,
    setSoundEnabled,
    stats,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleComplete,
    changeStatus,
    toggleSubtask,
    addSubtask,
    resetToSampleData,
    clearAllTasks,
  };
}
