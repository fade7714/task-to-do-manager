import React from 'react';
import {
  Search,
  X,
  List,
  Columns3,
  Grid2X2,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  Tag,
} from 'lucide-react';
import { Category, PriorityLevel, ViewMode } from '../types';
import { sounds } from '../utils/sound';

export type StatusFilter = 'all' | 'active' | 'completed' | 'overdue';
export type SortOption = 'dueDate' | 'priority' | 'createdAt' | 'title';

interface FilterBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: Category[];
  selectedPriority: PriorityLevel | 'all';
  setSelectedPriority: (priority: PriorityLevel | 'all') => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedPriority,
  setSelectedPriority,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  onResetFilters,
  totalFilteredCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedPriority !== 'all' ||
    statusFilter !== 'all';

  const handleViewChange = (mode: ViewMode) => {
    sounds.playClick();
    setViewMode(mode);
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Row: View Switcher Tabs & Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleViewChange('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Standard List View"
          >
            <List className="w-4 h-4" />
            <span>List</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange('kanban')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Kanban Board View (To Do, In Progress, Done)"
          >
            <Columns3 className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Eisenhower Matrix View (Urgent vs Important)"
          >
            <Grid2X2 className="w-4 h-4" />
            <span>Eisenhower Matrix</span>
          </button>
        </div>

        {/* Search Input & Sort Selector */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, tags, or subtasks..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => {
                sounds.playClick();
                setSortBy(e.target.value as SortOption);
              }}
              className="appearance-none pl-7 pr-8 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
            >
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="createdAt">Sort: Newest</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Bottom Filter Chips: Status, Category, Priority */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          
          {/* Status Chips */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/60 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800 mr-2">
            {(['all', 'active', 'completed', 'overdue'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setStatusFilter(status);
                }}
                className={`px-2.5 py-1 text-xs capitalize rounded-md transition-all font-medium cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {status === 'all' ? 'All Tasks' : status}
              </button>
            ))}
          </div>

          {/* Category Dropdown/Selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                sounds.playClick();
                setSelectedCategory(e.target.value);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Quick Filter */}
          <div className="flex items-center gap-1 ml-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => {
                sounds.playClick();
                setSelectedPriority(e.target.value as PriorityLevel | 'all');
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔥 Boss / Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Reset Filters CTA if active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onResetFilters();
              }}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium ml-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Filtered task count tag */}
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-700 dark:text-slate-300">{totalFilteredCount}</span> items
        </div>

      </div>
    </div>
  );
};
