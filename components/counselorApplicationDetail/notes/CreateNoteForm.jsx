export default function CreateNoteForm({
  noteTitle,
  setNoteTitle,
  noteMessage,
  setNoteMessage,
  visibleToStudent,
  setVisibleToStudent,
  handleCreateNote,
  savingNote,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-slate-800 mb-4">Create Note</h3>

      <div className="space-y-4">
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Enter note title"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <textarea
          rows={5}
          value={noteMessage}
          onChange={(e) => setNoteMessage(e.target.value)}
          placeholder="Write counselor note..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={visibleToStudent}
            onChange={(e) => setVisibleToStudent(e.target.checked)}
          />
          Visible to student
        </label>

        <div className="flex justify-end">
          <button
            onClick={handleCreateNote}
            disabled={savingNote}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
          >
            {savingNote ? "Creating..." : "Create Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
