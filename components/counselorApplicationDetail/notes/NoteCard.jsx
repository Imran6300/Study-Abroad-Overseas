import { Pencil, Trash2 } from "lucide-react";

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-5 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800">{note.title}</h3>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {note.message}
          </p>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
              {note.category}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded-lg ${
                note.isVisibleToStudent
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {note.isVisibleToStudent ? "Visible To Student" : "Private"}
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-400">
          <div className="flex items-center justify-end gap-2 mb-2">
            <button
              onClick={() => onEdit(note)}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center"
            >
              <Pencil size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => onDelete(note._id)}
              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
          <p>{note.counselor?.name}</p>

          <p>{new Date(note.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
