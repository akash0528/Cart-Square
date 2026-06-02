import { useState } from "react";
import axios from "axios";

const Preference = () => {
  const [form, setForm] = useState({
    theme: "dark",
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    newUserAlerts: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.put("/api/admin/preferences", form);
      setSuccess("Preferences save ");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something is wrong , Please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggles = [
    {
      key: "emailNotifications",
      label: "Email notifications",
      sub: "Get email when order & update",
    },
    {
      key: "orderAlerts",
      label: "Order alerts",
      sub: "Get Notification On new Orders",
    },
    {
      key: "lowStockAlerts",
      label: "Low stock alerts",
      sub: "when Product Stock Decrease Then Notifying",
    },
    {
      key: "newUserAlerts",
      label: "New user alerts",
      sub: "When New User Register Turn Notification",
    },
  ];

  return (
    <div className="mt-6 flex flex-col items-center w-full">
      <div className="w-full max-w-2xl space-y-4">
        {/* Display */}
        <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
            Display
          </p>
          <div className="space-y-3">
            {/* Theme */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Theme</p>
              <div className="flex gap-2">
                {["dark", "light"].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleChange("theme", t)}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-all capitalize ${
                      form.theme === t
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-[#0f0f13] border-white/10 text-gray-400"
                    }`}
                  >
                    {t === "dark" ? "🌙 Dark" : "☀️ Light"}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Language</p>
              <select
                value={form.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full bg-[#0f0f13] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Regional */}
        <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
            Regional
          </p>
          <div className="space-y-3">
            {/* Timezone */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Timezone</p>
              <select
                value={form.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className="w-full bg-[#0f0f13] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                <option value="UTC">UTC +0:00</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            {/* Date Format */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Date format</p>
              <select
                value={form.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
                className="w-full bg-[#0f0f13] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
            Notifications
          </p>
          {toggles.map(({ key, label, sub }) => (
            <div
              key={key}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-none"
            >
              <div>
                <p className="text-sm text-gray-200">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => handleChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-10 h-6 bg-[#2a2a3a] rounded-full peer peer-checked:bg-purple-600
               after:content-[''] after:absolute after:top-0.75 after:left-0.75 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:after:translate-x-4"
                ></div>
              </label>
            </div>
          ))}
        </div>

        {/* Error / Success */}
        {error && <p className="text-xs text-red-400">{error}</p>}
        {success && <p className="text-xs text-green-400">{success}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() =>
              setForm({
                theme: "dark",
                language: "en",
                timezone: "Asia/Kolkata",
                dateFormat: "DD/MM/YYYY",
                emailNotifications: true,
                orderAlerts: true,
                lowStockAlerts: true,
                newUserAlerts: false,
              })
            }
            className="px-5 py-2 text-sm text-gray-400 border border-white/10 rounded-lg"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm text-white bg-purple-600
           hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preference;
