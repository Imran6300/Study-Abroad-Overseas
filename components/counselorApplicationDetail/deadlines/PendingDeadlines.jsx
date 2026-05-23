import DeadlineCard from "./DeadlineCard";

export default function PendingDocuments({
  deadlines,
  toggleComplete,
  removeDeadline,
}) {
  if (deadlines.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {deadlines.map((deadline) => (
        <DeadlineCard
          key={deadline._id}
          deadline={deadline}
          toggleComplete={toggleComplete}
          removeDeadline={removeDeadline}
        />
      ))}
    </div>
  );
}
