import { useState } from "react";

import ApplicationsHeader from "./ApplicationsHeader";
import ApplicationForm from "./ApplicationForm";
import ApplicationCard from "./ApplicationCard";

export default function ApplicationsTab({
  applications,
  savingApplication,
  handleCreateApplication,
  handleDeleteApplication,
  handleUpdateApplicationStatus,
  handleUpdateApplication,
}) {
  const [showForm, setShowForm] = useState(false);

  const [editingApplication, setEditingApplication] = useState(null);

  const appSubStatusConfig = {
    pending: {
      label: "Pending",
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
    },
    under_review: {
      label: "Under Review",
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
    },
    accepted: {
      label: "Accepted",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    rejected: {
      label: "Rejected",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
    },
  };

  return (
    <div className="space-y-6">
      <ApplicationsHeader apps={applications} setShowForm={setShowForm} />

      {showForm && (
        <ApplicationForm
          saving={savingApplication}
          initialData={editingApplication || {}}
          onCancel={() => {
            setEditingApplication(null);
            setShowForm(false);
          }}
          onSubmit={async (payload) => {
            if (editingApplication) {
              await handleUpdateApplication(editingApplication._id, payload);
            } else {
              await handleCreateApplication(payload);
            }

            setEditingApplication(null);

            setShowForm(false);
          }}
        />
      )}

      {(applications?.length || 0) === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
          No university applications tracked yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications?.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              updateStatus={handleUpdateApplicationStatus}
              removeApp={handleDeleteApplication}
              appSubStatusConfig={appSubStatusConfig}
              onView={(app) => {
                setEditingApplication(app);

                setShowForm(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
