import { Plus, Search, ClipboardList, Clock3, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import TaskModal from "./TaskModal";

export default function Header({ refreshTasks, onSearchChange }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isTasks = pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#0a0f1a]/90 to-[#0d1117]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_2px_15px_rgba(0,0,0,0.4)] transition-all duration-300">
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left Section: Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-md bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-md">
              {isTasks ? <ClipboardList size={16} /> : <Clock3 size={16} />}
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-100 tracking-wide">
              {isTasks ? "DoTrack — Tasks" : "DoTrack — Activity Logs"}
            </h1>
            <span className="hidden sm:inline-block text-xs text-gray-500 border border-gray-700/70 rounded-md px-2 py-0.5">
              v1.0
            </span>
          </div>

          {/* Desktop Create Button */}
          {isTasks && (
            <button
              onClick={() => setOpen(true)}
              className="hidden sm:flex bg-gradient-to-tr from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg items-center gap-2 transition-all shadow-md hover:shadow-cyan-500/20 active:scale-95"
            >
              <Plus size={18} /> Create Task
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden p-2 rounded-md bg-[#111827]/70 hover:bg-[#1f2937] text-gray-300 transition-all"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Tabs + Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-300 ${
                isTasks
                  ? "text-cyan-300 border-cyan-800 bg-cyan-500/10 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                  : "text-gray-400 border-gray-800 hover:text-gray-200 hover:border-cyan-900/50"
              }`}
            >
              Tasks
            </Link>
            <Link
              to="/logs"
              className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-300 ${
                pathname === "/logs"
                  ? "text-cyan-300 border-cyan-800 bg-cyan-500/10 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                  : "text-gray-400 border-gray-800 hover:text-gray-200 hover:border-cyan-900/50"
              }`}
            >
              Activity Logs
            </Link>
          </div>

          {/* Search Bar */}
          {typeof onSearchChange === "function" && (
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full bg-[#0b0f15] text-gray-300 border border-gray-800 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500"
              />
            </div>
          )}
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="sm:hidden px-4 pb-4 border-t border-gray-800 bg-[#0d1117]/95 backdrop-blur-xl">
            {isTasks && (
              <button
                onClick={() => {
                  setOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full bg-gradient-to-tr from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 mt-2 shadow-md"
              >
                <Plus size={18} /> Create Task
              </button>
            )}
          </div>
        )}
      </header>

      {/* Task Modal */}
      {open && (
        <TaskModal
          onClose={() => setOpen(false)}
          onAdded={refreshTasks}
          task={null}
        />
      )}
    </>
  );
}
