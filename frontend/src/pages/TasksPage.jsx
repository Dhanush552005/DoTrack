import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import TaskModal from "../components/TaskModal";
import { api } from "../api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/api/tasks", {
        params: { page, limit, q: search || undefined },
      });
      setTasks(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, search]);

  return (
    <>
      <Header
        refreshTasks={() => {
          setPage(1);
          fetchTasks();
        }}
        onSearchChange={(q) => {
          setPage(1);
          setSearch(q);
        }}
      />

      {editingTask && (
        <TaskModal
          onClose={() => setEditingTask(null)}
          onAdded={fetchTasks}
          task={editingTask}
        />
      )}

      <div className="p-4 sm:p-6">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">No tasks yet...</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            {/* Desktop Table */}
            <div className="hidden md:grid md:grid-cols-12 px-6 py-3 text-sm text-gray-400 border-b border-white/10 bg-white/10">
              <div className="col-span-2">ID</div>
              <div className="col-span-3">Title</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Tasks List */}
            {tasks.map((task, idx) => (
              <motion.div
                key={task._id}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                transition={{ duration: 0.2 }}
                className="border-b border-white/5 md:grid md:grid-cols-12 md:items-center px-4 sm:px-6 py-4 text-sm text-gray-200"
              >
                {/* Desktop view */}
                <div className="hidden md:block col-span-2 text-gray-400">
                  {(page - 1) * limit + idx + 1}
                </div>
                <div className="hidden md:block col-span-3 font-medium">{task.title}</div>
                <div className="hidden md:block col-span-4 text-gray-400 truncate">
                  {task.description}
                </div>
                <div className="hidden md:block col-span-2 text-gray-400">
                  {new Date(task.createdAt).toLocaleDateString()}
                </div>
                <div className="hidden md:flex col-span-1 justify-end gap-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-rose-600 to-red-500 text-white hover:opacity-90"
                  >
                    Delete
                  </button>
                </div>

                {/* Mobile view (Card layout) */}
                <div className="md:hidden w-full">
                  <div className="mb-2 text-lg font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-400 mb-2">
                    {task.description}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    <span>#{(page - 1) * limit + idx + 1}</span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="px-3 py-1 rounded-lg text-xs bg-blue-600 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="px-3 py-1 rounded-lg text-xs bg-rose-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-300 bg-white/5">
              <span>
                Showing {tasks.length} of {total} tasks
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/10"
                >
                  Prev
                </button>
                <span className="px-3 py-1 rounded-md border border-white/10">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/10"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
