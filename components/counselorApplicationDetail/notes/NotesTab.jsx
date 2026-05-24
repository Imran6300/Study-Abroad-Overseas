import CreateNoteForm from "./CreateNoteForm";
import NotesList from "./NotesList";

export default function NotesTab({
  editingNote,
  handleUpdateNote,
  onEdit,
  onDelete,
  notes,
  noteTitle,
  setNoteTitle,
  noteMessage,
  setNoteMessage,
  visibleToStudent,
  setVisibleToStudent,
  handleCreateNote,
  loadingNotes,
  savingNote,
}) {
  return (
    <div className="space-y-6">
      <CreateNoteForm
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        noteMessage={noteMessage}
        setNoteMessage={setNoteMessage}
        visibleToStudent={visibleToStudent}
        setVisibleToStudent={setVisibleToStudent}
        handleCreateNote={handleCreateNote}
        savingNote={savingNote}
        editingNote={editingNote}
        handleUpdateNote={handleUpdateNote}
      />

      <NotesList
        notes={notes}
        onEdit={onEdit}
        onDelete={onDelete}
        loadingNotes={loadingNotes}
      />
    </div>
  );
}
