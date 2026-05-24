import { motion } from "framer-motion";
import OverviewTab from "@/components/counselorApplicationDetail/overview/OverviewTab";
import DocumentsTab from "@/components/counselorApplicationDetail/documents/DocumentsTab";
import NotesTab from "@/components/counselorApplicationDetail/notes/NotesTab";
import DeadlinesTab from "@/components/counselorApplicationDetail/deadlines/DeadlinesTab";
import ApplicationsTab from "@/components/counselorApplicationDetail/applications/ApplicationsTab";
import VisaTab from "@/components/counselorApplicationDetail/visa/VisaTab";
import ActivityTab from "@/components/counselorApplicationDetail/activity/ActivityTab";

export default function TabsBar({
  tabs,
  activeTab,
  setActiveTab,
  application,
  profile,
  overviewApplication,
  applicationDocuments,
  visaDocuments,
  financialDocuments,

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

  deadlines,
  savingDeadline,
  handleCreateDeadline,
  handleToggleDeadline,
  handleDeleteDeadline,

  applications,
  savingApplication,
  handleCreateApplication,
  handleDeleteApplication,
  handleUpdateApplicationStatus,
  handleUpdateApplication,

  editingNote,
  handleUpdateNote,
  setEditingNote,
  handleEditNote,
  handleDeleteNote,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      <div className="border-b border-slate-100">
        <div className="flex overflow-x-auto px-4 sm:px-6 pt-4 gap-x-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative pb-4 px-3 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
              >
                <Icon
                  size={15}
                  className={
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }
                />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="appTabIndicator"
                    className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <OverviewTab
            application={application}
            profile={profile}
            overviewApplication={overviewApplication}
          />
        )}
        {/* ── DOCUMENTS ── */}
        {activeTab === "documents" && (
          <DocumentsTab
            applicationDocuments={applicationDocuments}
            visaDocuments={visaDocuments}
            financialDocuments={financialDocuments}
            offerLetters={application?.offerLetters || []}
          />
        )}
        {/* ── DEADLINES ── */}
        {activeTab === "deadlines" && (
          <DeadlinesTab
            applicationId={application._id}
            deadlines={deadlines}
            savingDeadline={savingDeadline}
            handleCreateDeadline={handleCreateDeadline}
            handleToggleDeadline={handleToggleDeadline}
            handleDeleteDeadline={handleDeleteDeadline}
          />
        )}
        {/* ── APPLICATIONS ── */}
        {activeTab === "applications" && (
          <ApplicationsTab
            applications={applications}
            savingApplication={savingApplication}
            handleCreateApplication={handleCreateApplication}
            handleDeleteApplication={handleDeleteApplication}
            handleUpdateApplicationStatus={handleUpdateApplicationStatus}
            handleUpdateApplication={handleUpdateApplication}
          />
        )}
        {/* ── VISA ── */}
        {activeTab === "visa" && <VisaTab application={application} />}
        {/* ── NOTES ── */}
        {activeTab === "notes" && (
          <NotesTab
            notes={notes}
            noteTitle={noteTitle}
            setNoteTitle={setNoteTitle}
            noteMessage={noteMessage}
            setNoteMessage={setNoteMessage}
            visibleToStudent={visibleToStudent}
            setVisibleToStudent={setVisibleToStudent}
            handleCreateNote={handleCreateNote}
            loadingNotes={loadingNotes}
            savingNote={savingNote}
            editingNote={editingNote}
            handleUpdateNote={handleUpdateNote}
            setEditingNote={setEditingNote}
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
          />
        )}
        {/* ── ACTIVITY ── */}
        {activeTab === "activity" && (
          <ActivityTab application={application?.activityLog || []} />
        )}
      </div>
    </motion.div>
  );
}
