import StudentDetailsCard from "./StudentDetailsCard";
import ApplicationDetailCard from "./ApplicationDetailsCard";

export default function OverviewTab({ application }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StudentDetailsCard student={application.student} />

      <ApplicationDetailCard application={application} />
    </div>
  );
}
