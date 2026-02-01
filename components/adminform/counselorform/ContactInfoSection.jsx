// components/adminform/counselorform/ContactInfoSection.jsx
export default function ContactInfoSection({ form, handleChange, disabled = false }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold mb-5 text-gray-800">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number *
          </label>
          <input
            name="mobile"
            value={form.mobile || ""}
            onChange={handleChange}
            required
            disabled={disabled}
            placeholder="+91 98765 43210"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* WhatsApp / Alternate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            WhatsApp / Alternate Number
          </label>
          <input
            name="whatsapp"
            value={form.whatsapp || ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder="+91 98765 43210"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Official Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            required
            disabled={disabled}
            placeholder="counselor@overseas.com"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Current Address */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Current Address
          </label>
          <textarea
            name="address"  // changed from currentAddress to address for simplicity
            value={form.address || ""}
            onChange={handleChange}
            disabled={disabled}
            rows={2}
            placeholder="House no, Street, Area, City..."
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
          <input
            name="city"
            value={form.city || ""}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
          <input
            name="state"
            value={form.state || ""}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
          <input
            name="pincode"
            value={form.pincode || ""}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>
        
      </div>
    </div>
  );
}