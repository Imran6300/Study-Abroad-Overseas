"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

import { counselorApi } from "@/lib/counselorApi";

const METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export default function DepositTracker({ leadId, leadName }) {
  const [deposit, setDeposit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    paid: false,
    amount: "",
    currency: "INR",
    paidAt: "",
    method: "",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    counselorApi
      .getDeposit(leadId)
      .then((d) => {
        setDeposit(d.data || {});
        populateForm(d.data || {});
      })
      .catch(() => setDeposit({}))
      .finally(() => setLoading(false));
  }, [leadId]);

  function populateForm(d) {
    setForm({
      paid: d.paid || false,
      amount: d.amount != null ? String(d.amount) : "",
      currency: d.currency || "INR",
      paidAt: d.paidAt ? new Date(d.paidAt).toISOString().slice(0, 10) : "",
      method: d.method || "",
      reference: d.reference || "",
      notes: d.notes || "",
    });
  }

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        paid: form.paid,
        amount: form.amount ? Number(form.amount) : null,
        currency: form.currency,
        paidAt: form.paidAt || null,
        method: form.method || null,
        reference: form.reference,
        notes: form.notes,
      };
      const res = await counselorApi.updateDeposit(leadId, payload);
      setDeposit(res.data);
      populateForm(res.data);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const clear = async () => {
    if (!confirm("Clear deposit record?")) return;
    try {
      const d = await counselorApi.clearDeposit(leadId);
      setDeposit(d.data);
      populateForm(d.data || {});
      setEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-center h-24">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );

  const isPaid = deposit?.paid;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 ${isPaid ? "border-green-200" : "border-slate-200"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${isPaid ? "bg-green-100" : "bg-slate-100"}`}
          >
            <DollarSign
              size={16}
              className={isPaid ? "text-green-600" : "text-slate-500"}
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Deposit</h3>
            <p className="text-xs text-slate-500">{leadName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
              isPaid
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            {isPaid ? (
              <>
                <CheckCircle size={11} /> Paid
              </>
            ) : (
              <>
                <XCircle size={11} /> Pending
              </>
            )}
          </span>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Edit2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Display mode */}
      {!editing && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          {isPaid && deposit.amount != null && (
            <div className="col-span-2">
              <p className="text-slate-400 mb-0.5">Amount</p>
              <p className="text-2xl font-bold text-green-700">
                {deposit.currency}{" "}
                {Number(deposit.amount).toLocaleString("en-IN")}
              </p>
            </div>
          )}
          {deposit?.method && (
            <div>
              <p className="text-slate-400 mb-0.5">Method</p>
              <p className="font-semibold text-slate-700 capitalize">
                {deposit.method.replace(/_/g, " ")}
              </p>
            </div>
          )}
          {deposit?.paidAt && (
            <div>
              <p className="text-slate-400 mb-0.5">Date</p>
              <p className="font-semibold text-slate-700">
                {new Date(deposit.paidAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          )}
          {deposit?.reference && (
            <div className="col-span-2">
              <p className="text-slate-400 mb-0.5">Reference / UTR</p>
              <p className="font-semibold text-slate-700 font-mono">
                {deposit.reference}
              </p>
            </div>
          )}
          {deposit?.notes && (
            <div className="col-span-2">
              <p className="text-slate-400 mb-0.5">Notes</p>
              <p className="text-slate-600">{deposit.notes}</p>
            </div>
          )}
          {!isPaid && !deposit?.amount && (
            <div className="col-span-2 py-4 text-center text-slate-400">
              <p>No deposit recorded</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 text-blue-600 hover:underline text-xs"
              >
                Add deposit info
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          {error && (
            <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-2">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {/* Paid toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-semibold text-slate-700">
                Mark as Paid
              </span>
              <button
                onClick={() => setForm((p) => ({ ...p, paid: !p.paid }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.paid ? "bg-green-500" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.paid ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  Amount
                </label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="50000"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  Currency
                </label>
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, currency: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                >
                  {["INR", "USD", "GBP", "AUD", "CAD", "EUR"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  Payment Method
                </label>
                <select
                  value={form.method}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, method: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                >
                  <option value="">— Select —</option>
                  {METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  Date Paid
                </label>
                <input
                  type="date"
                  value={form.paidAt}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, paidAt: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Reference / UTR No.
              </label>
              <input
                value={form.reference}
                onChange={(e) =>
                  setForm((p) => ({ ...p, reference: e.target.value }))
                }
                placeholder="UTR123456789"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                rows={2}
                placeholder="Any additional notes..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <X size={13} /> Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              Save
            </button>
            {deposit?.paid && (
              <button
                onClick={clear}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm transition-colors"
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
