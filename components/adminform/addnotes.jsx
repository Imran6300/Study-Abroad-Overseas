"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function NotesForm() {
  const { user } = useSelector((state) => state.auth);
  const counselorName = user?.name || "Counselor";

  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState("Private");
  const [error, setError] = useState("");

  const handleAddNote = (e) => {
    e.preventDefault();

    if (!noteText.trim()) {
      setError("Note cannot be empty");
      return;
    }

    const newNote = {
      id: Date.now(),
      text: noteText,
      type: noteType,
      createdAt: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      counselor: counselorName,
    };

    setNotes((prev) => [newNote, ...prev]);
    setNoteText("");
    setError("");
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Add Note Form */}
      <motion.form
        onSubmit={handleAddNote}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add New Note
          </label>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            placeholder="Write something important about this student..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
          >
            <option value="Private">Private</option>
            <option value="Shared">Shared</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-md transition-all"
          >
            Add Note
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </motion.form>

      {/* Notes List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Notes History</h3>

        <AnimatePresence>
          {notes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 p-6 rounded-xl text-gray-500 text-center"
            >
              No notes added yet.
            </motion.div>
          )}

          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        note.type === "Private"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {note.type}
                    </span>

                    <span className="text-xs text-gray-500">
                      {note.createdAt}
                    </span>
                  </div>

                  <p className="text-gray-800 whitespace-pre-line">
                    {note.text}
                  </p>

                  <p className="text-xs text-gray-500">
                    Added by {note.counselor}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
