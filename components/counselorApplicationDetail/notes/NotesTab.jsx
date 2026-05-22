import CreateNoteForm from "./CreateNoteForm";
import NotesList from "./NotesList";

export default function NotesTab({
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
      />

      <NotesList notes={notes} loadingNotes={loadingNotes} />
    </div>
  );
}
