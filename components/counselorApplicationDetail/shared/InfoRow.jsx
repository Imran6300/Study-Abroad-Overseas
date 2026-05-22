export default function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 bg-slate-50 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-slate-500" />
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}
