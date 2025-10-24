import { useEffect, useState } from "react";
import Header from "../components/Header";
import { api } from "../api";
import { motion } from "framer-motion";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get("/api/logs", { params: { page, limit } });
      setLogs(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const badgeClasses = (action) => {
    const base =
      "inline-flex items-center h-7 px-3 rounded-full text-xs font-medium border transition";
    if (/create/i.test(action)) {
      return `${base} bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-700 shadow-[0_0_8px_rgba(16,185,129,0.3)]`;
    }
    if (/update/i.test(action)) {
      return `${base} bg-gradient-to-r from-amber-600 to-yellow-500 text-white border-amber-700 shadow-[0_0_8px_rgba(245,158,11,0.3)]`;
    }
    if (/delete/i.test(action)) {
      return `${base} bg-gradient-to-r from-rose-600 to-pink-500 text-white border-rose-700 shadow-[0_0_8px_rgba(244,63,94,0.3)]`;
    }
    return `${base} bg-gray-700 text-gray-200 border-gray-600`;
  };

  return (
    <>
      <Header refreshTasks={null} />
      <main className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-gray-800 bg-[#0b0f15]/80 backdrop-blur-xl shadow-lg overflow-hidden"
        >
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 px-6 py-3 text-xs font-semibold text-gray-400 border-b border-gray-800 uppercase tracking-wider bg-[#0d1117]/60">
            <div className="col-span-3">Timestamp</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-2">Task ID</div>
            <div className="col-span-4">Updated Content</div>
            <div className="col-span-1 text-center">Notes</div>
          </div>

          {/* Log entries */}
          {logs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No logs found yet.
            </div>
          ) : (
            logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid sm:grid-cols-12 grid-cols-1 px-4 sm:px-6 py-4 border-b border-gray-800 hover:bg-[#0f172a]/40 transition"
              >
                <div className="col-span-3 text-gray-300 text-sm">
                  {new Date(log.timestamp).toLocaleString()}
                </div>

                <div className="col-span-2 mt-2 sm:mt-0">
                  <span className={badgeClasses(log.action)}>
                    {log.action || "—"}
                  </span>
                </div>

                <div className="col-span-2 text-gray-400 mt-2 sm:mt-0">
                  #{(page - 1) * limit + i + 1}
                </div>

                <div className="col-span-4 mt-2 sm:mt-0 flex flex-wrap gap-2">
                  {log.updatedContent ? (
                    Object.entries(log.updatedContent).map(([k, v]) => (
                      <span
                        key={k}
                        className="inline-flex items-center h-8 px-3 rounded-full text-xs border border-gray-700 text-gray-300 bg-[#0e1622] truncate max-w-[140px]"
                        title={`${k}: ${v}`}
                      >
                        {k}: "{String(v)}"
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>

                <div className="col-span-1 text-center text-gray-500">—</div>
              </motion.div>
            ))
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 text-sm text-gray-400 bg-[#0d1117]/60">
            <span>
              Showing {logs.length} of {total} logs
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-1.5 rounded-md border border-gray-700 bg-[#0b1119] hover:bg-[#112035] hover:text-white transition"
              >
                Prev
              </button>
              <span className="px-4 py-1.5 rounded-md border border-gray-700 bg-[#0b1119] text-gray-300">
                Page {page}
              </span>
              <button
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                className="px-4 py-1.5 rounded-md border border-gray-700 bg-[#0b1119] hover:bg-[#112035] hover:text-white transition"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
