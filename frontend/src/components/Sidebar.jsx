import { Home, History, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    { name: "Activity Logs", icon: <History size={20} />, path: "/logs" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-gradient-to-b from-[#0a0f1a]/95 via-[#0b1220]/90 to-[#060910]/95 border-r border-white/10 flex-col p-5 shadow-[4px_0_25px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white text-lg font-bold tracking-tight">D</span>
          </div>
          <span className="text-xl font-semibold tracking-wide text-white">
            DoTrack
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-indigo-600/60 to-cyan-600/40 text-cyan-100 shadow-inner"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <div
                  className={`transition-transform duration-200 ${
                    active ? "scale-110 text-cyan-300" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="mt-auto pt-8 border-t border-white/10 text-xs text-gray-500">
          <span className="block text-gray-400/70">v1.0 — © 2025</span>
          <span className="block text-gray-500">
            Crafted with 💙 by Dhanush
          </span>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#111827]/70 hover:bg-[#1f2937] text-gray-300 backdrop-blur-md"
        >
          <Menu size={20} />
        </button>

        {/* Overlay */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-[#0d1117]/95 backdrop-blur-xl border-r border-gray-800 p-6 flex flex-col z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <span className="text-lg font-semibold text-gray-100">DoTrack</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "bg-gradient-to-r from-indigo-600/70 to-cyan-500/50 text-cyan-100"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
