/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus,
  RotateCcw,
  Download,
  Upload,
  Command,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FilterBar, SortOption, StatusFilter } from './components/FilterBar';
import { QuickAddBar } from './components/QuickAddBar';
import { ListView } from './components/ListView';
import { KanbanView } from './components/KanbanView';
import { MatrixView } from './components/MatrixView';
import { TaskModal } from './components/TaskModal';
import { useTasks } from './hooks/useTasks';
import { PriorityLevel, Task, TaskStatus, ViewMode } from './types';
import { sounds } from './utils/sound';

export default function App() {
  const {
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
  } = useTasks();

  // View & Filter States
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Hidden file input ref for JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        sounds.playClick();
        setEditingTask(null);
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return tasks
      .filter((task) => {
        // 1. Search filter
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(query);
          const matchesDesc = task.description?.toLowerCase().includes(query);
          const matchesSubtasks = task.subtasks?.some((s) =>
            s.title.toLowerCase().includes(query)
          );
          if (!matchesTitle && !matchesDesc && !matchesSubtasks) {
            return false;
          }
        }

        // 2. Category filter
        if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) {
          return false;
        }

        // 3. Priority filter
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
          return false;
        }

        // 4. Status filter
        if (statusFilter === 'active' && task.completed) {
          return false;
        }
        if (statusFilter === 'completed' && !task.completed) {
          return false;
        }
        if (statusFilter === 'overdue') {
          if (task.completed || !task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          if (taskDate.getTime() >= now.getTime()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          // Put tasks with due dates first, then ascending date
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        if (sortBy === 'priority') {
          const weights: Record<PriorityLevel, number> = {
            urgent: 4,
            high: 3,
            medium: 2,
            low: 1,
          };
          return weights[b.priority] - weights[a.priority];
        }

        if (sortBy === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }

        return 0;
      });
  }, [tasks, searchQuery, selectedCategory, selectedPriority, statusFilter, sortBy]);

  // Handler for opening task creation with preset Kanban status
  const handleOpenNewTaskWithStatus = (status: TaskStatus) => {
    setEditingTask({
      id: '',
      title: '',
      status,
      completed: status === 'done',
      priority: 'medium',
      categoryId: categories[0]?.id || 'work',
      subtasks: [],
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  // Handler for opening task creation with preset Eisenhower Matrix Quadrant
  const handleOpenNewTaskWithMatrix = (isUrgent: boolean, isImportant: boolean) => {
    setEditingTask({
      id: '',
      title: '',
      status: 'todo',
      completed: false,
      priority: isUrgent && isImportant ? 'urgent' : isImportant ? 'high' : 'medium',
      categoryId: categories[0]?.id || 'work',
      isUrgent,
      isImportant,
      subtasks: [],
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setStatusFilter('all');
    setSortBy('dueDate');
  };

  // Export tasks as JSON file
  const handleExportData = () => {
    sounds.playClick();
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ tasks, categories }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import tasks from JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (Array.isArray(parsed.tasks)) {
          sounds.playComplete();
          parsed.tasks.forEach((t: Task) => addTask(t));
        }
      } catch (err) {
        alert('Could not parse backup file. Please select a valid JSON export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenNewTask={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        completedTodayCount={stats.completed}
        totalTodayCount={stats.total}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Gamification Dashboard */}
        <Dashboard
          tasks={tasks}
          stats={stats}
          currentFilter={statusFilter}
          onFilterStatus={(st) => {
            if (st === 'boss') {
              setSelectedPriority('urgent');
              setStatusFilter('all');
            } else {
              setStatusFilter(st);
            }
          }}
        />

        {/* Quick Add Bar */}
        <QuickAddBar
          categories={categories}
          onAddTask={addTask}
          onOpenFullModal={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        />

        {/* Filter, View Switcher & Sorting Bar */}
        <FilterBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetFilters={handleResetFilters}
          totalFilteredCount={filteredTasks.length}
        />

        {/* Dynamic Views: List View, Kanban Board, or Eisenhower Matrix */}
        <section className="pt-2">
          {viewMode === 'list' && (
            <ListView
              tasks={filteredTasks}
              categories={categories}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
              onDuplicateTask={duplicateTask}
              onChangeStatus={changeStatus}
              onToggleSubtask={toggleSubtask}
              onAddSubtask={addSubtask}
              onOpenNewTask={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
            />
          )}

          {viewMode === 'kanban' && (
            <KanbanView
              tasks={filteredTasks}
              categories={categories}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
              onDuplicateTask={duplicateTask}
              onChangeStatus={changeStatus}
              onToggleSubtask={toggleSubtask}
              onAddSubtask={addSubtask}
              onOpenNewTaskWithStatus={handleOpenNewTaskWithStatus}
            />
          )}

          {viewMode === 'matrix' && (
            <MatrixView
              tasks={filteredTasks}
              categories={categories}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
              onDuplicateTask={duplicateTask}
              onChangeStatus={changeStatus}
              onToggleSubtask={toggleSubtask}
              onAddSubtask={addSubtask}
              onOpenNewTaskWithMatrix={handleOpenNewTaskWithMatrix}
            />
          )}
        </section>
      </main>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          sounds.playClick();
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={(savedTask) => {
          if (editingTask && editingTask.id) {
            updateTask(savedTask);
          } else {
            addTask(savedTask);
          }
        }}
        initialTask={editingTask}
        categories={categories}
      />

      {/* Footer & Productivity Utilities */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              To-Do List & Task Planner
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                N
              </kbd>
              New Task Shortcut
            </span>
          </div>

          {/* Backup & Sample Data Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Download your tasks backup as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Import tasks backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            <span>•</span>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                if (confirm('Reset to initial sample tasks and categories?')) {
                  resetToSampleData();
                }
              }}
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              title="Restore initial demo tasks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
