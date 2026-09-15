# 🚀 TaskFlow Pro — Modern To-Do & Productivity Suite

A modern, highly creative, and feature-rich To-Do List and task management application built with **React 19**, **TypeScript**, and **Tailwind CSS**.

Designed by combining productivity psychology (Eisenhower Matrix, Kanban velocity) with delightful micro-interactions (confetti celebrations, Web Audio chimes, and streak gamification).

---

## ✨ Features Overview

### 1. 🔀 Dynamic Views & Layouts
- **Standard List View**: Fast, scannable layout with status grouping, progress tracking, and subtask indicators.
- **Kanban Board**: 3-column stage pipeline (*To Do*, *In Progress*, *Done*) with task counters and one-click card movement.
- **Eisenhower Matrix**: 2x2 prioritization grid dividing tasks by urgency and importance:
  - **Q1: Do First** — Urgent & Important (Crises & Boss Tasks)
  - **Q2: Schedule** — Important & Not Urgent (Strategy, Health & Personal Growth)
  - **Q3: Delegate** — Urgent & Not Important (Time-sensitive interrupts)
  - **Q4: Eliminate** — Not Urgent & Not Important (Distractions)

### 2. 🎮 Gamification & Visuals
- **Velocity Ring**: Real-time SVG circular completion gauge showing progress percentage.
- **Fire Day Streak**: Tracks consecutive daily task completions with flame animations.
- **"Boss Tasks" & Aura Glow**: Flag top-priority tasks as *Boss Tasks* with an animated glowing gradient aura.
- **Dopamine Confetti**:
  - Confetti burst on regular task completions.
  - Multi-cannon confetti celebration upon defeating Boss Tasks.

### 3. 📋 Comprehensive Task Management
- **Quick Add Bar**: One-line task capture with quick category, priority, and date pickers.
- **Detailed Modal**: Rich editor for descriptions, subtasks checklist, Eisenhower flags, and datetime selectors.
- **Nested Subtasks**: Expandable step-by-step checklist with real-time percentage bars on every card.
- **Dynamic Due Date Badges**: Automatic relative status tags (*Overdue*, *Due Today*, *Tomorrow*, *Upcoming*).
- **Instant Search & Multi-Filters**: Filter by category, priority level, completion status, or search through task titles, notes, and subtasks.

### 4. 💎 Polish & Ergonomics
- **Web Audio Sound Synthesizer**: Native in-browser chimes, clicks, and fanfare without external audio file latency (toggleable sound).
- **Daily Motivational Quote**: Rotating inspirational quote widget that updates daily or on-demand.
- **Seamless Dark & Light Mode**: High-contrast, eye-friendly palettes.
- **Local Persistence & Portability**: Automatically saved to `localStorage` with JSON export and import capabilities.
- **Keyboard Shortcuts**: Press `N` anywhere to instantly create a new task.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Hooks, Functional Components)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations & FX**: Canvas-Confetti, Tailwind Animations
- **Audio**: Web Audio API (Zero external assets, synthesized audio)
- **Bundler**: Vite 6

---

## 📦 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/taskflow-pro.git
   cd taskflow-pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready static assets will be in the `dist/` directory.

---

## 📄 License

This project is open source and available under the [Apache-2.0 License](LICENSE).
