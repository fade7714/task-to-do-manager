import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Plus,
  Quote,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { getDailyQuote } from '../utils/quotes';
import { sounds } from '../utils/sound';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenNewTask: () => void;
  completedTodayCount: number;
  totalTodayCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  onOpenNewTask,
  completedTodayCount,
  totalTodayCount,
}) => {
  const [quoteOffset, setQuoteOffset] = useState(0);
  const quote = getDailyQuote(quoteOffset);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  const handleToggleDark = () => {
    sounds.playClick();
    setDarkMode(!darkMode);
  };

  const handleRotateQuote = () => {
    sounds.playClick();
    setQuoteOffset((prev) => prev + 1);
  };

  return (
    <header className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Today's Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/25 text-white font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    TaskFlow
                  </h1>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                    Pro Studio
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {completedTodayCount} of {totalTodayCount} due today completed
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={handleToggleSound}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <VolumeX className="w-4 h-4 opacity-50" />}
              </button>
              <button
                type="button"
                onClick={handleToggleDark}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenNewTask();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Task</span>
              </button>
            </div>
          </div>

          {/* Daily Motivational Quote Widget */}
          <div className="hidden lg:flex items-center gap-2.5 max-w-xl bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
            <Quote className="w-4 h-4 text-indigo-500 shrink-0 opacity-80" />
            <div className="text-xs truncate">
              <span className="font-medium text-slate-700 dark:text-slate-300 italic">
                "{quote.quote}"
              </span>
              <span className="text-slate-400 dark:text-slate-500 ml-1.5 font-normal">
                — {quote.author}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRotateQuote}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors shrink-0 ml-auto"
              title="Next daily quote"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSound}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">Muted</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleDark}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenNewTask();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-98 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

        </div>

        {/* Mobile Quote Banner */}
        <div className="lg:hidden mt-2.5 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate italic">
              "{quote.quote}" — <span className="text-slate-400">{quote.author}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleRotateQuote}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

      </div>
    </header>
  );
};
