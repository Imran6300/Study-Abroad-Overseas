import { FileText } from "lucide-react";
import DocumentCard from "./DocumentCard";

export default function DocumentsSection({
  title,
  files = [],
  emptyMessage,
  icon: Icon = FileText,
  iconColor = "text-indigo-500",
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
        <Icon size={15} className={iconColor} />

        {title}

        <span className="text-xs text-slate-400 font-normal">
          ({files.length} files)
        </span>
      </h3>

      {files.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2.5">
          {files.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
