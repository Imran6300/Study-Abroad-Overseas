import { FileText, Download, Eye, Calendar } from "lucide-react";

export default function DocumentCard({ doc }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
          <FileText size={18} className="text-indigo-500" />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-700">{doc.name}</h4>

          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span>{doc.size}</span>

            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{doc.uploadedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition"
        >
          <Eye size={16} className="text-slate-500" />
        </a>

        <a
          href={doc.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition"
        >
          <Download size={16} className="text-slate-500" />
        </a>
      </div>
    </div>
  );
}
