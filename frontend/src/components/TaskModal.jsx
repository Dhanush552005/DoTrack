import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../api";

export default function TaskModal({ onClose, onAdded, task }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = task ? "PUT" : "POST";
      const url = task ? `/api/tasks/${task._id}` : `/api/tasks`;

      const sanitize = (text) => text.replace(/<[^>]*>/g, "");
      const payload = {
        title: sanitize(title).slice(0, 100),
        description: sanitize(description).slice(0, 100),
      };

      await (method === "POST" ? api.post(url, payload) : api.put(url, payload));
      onAdded?.();
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25, type: "spring" }}
        className="bg-gradient-to-br from-[#0e1622] via-[#101924] to-[#0a1018] border border-gray-800 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            {task ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full bg-[#0b1119] text-gray-200 border border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Write a short description (max 100 chars)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
              className="w-full bg-[#0b1119] text-gray-300 border border-gray-700 rounded-lg p-3 h-28 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
            {/* Character counter bar */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Description</span>
              <span>{description.length}/100</span>
            </div>
            <div className="h-1 mt-1 rounded-full bg-gray-800 overflow-hidden">
              <div
                style={{
                  width: `${(description.length / 100) * 100}%`,
                }}
                className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Saving..." : task ? "Update Task" : "Add Task"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
