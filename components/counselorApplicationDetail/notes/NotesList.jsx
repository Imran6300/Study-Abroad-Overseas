import NoteCard from "./NoteCard";

export default function NotesList({ notes, loadingNotes }) {
  if (loadingNotes) {
    return <div className="text-sm text-slate-400">Loading notes...</div>;
  }

  if (notes.length === 0) {
    return <div className="text-sm text-slate-400">No notes yet.</div>;
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
}
