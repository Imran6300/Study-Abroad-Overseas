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
    application_started: {
      label: "Application Started",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-200",
    },

    application_submitted: {
      label: "Application Submitted",
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
    },

    offer_received: {
      label: "Offer Received",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },

    visa_process: {
      label: "Visa Process",
      bg: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-200",
    },

    enrolled: {
      label: "Enrolled",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },

    lost: {
      label: "Lost",
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
