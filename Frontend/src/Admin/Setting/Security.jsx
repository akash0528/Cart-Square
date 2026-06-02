import { useState } from "react";
import axios from "axios";

const Security = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const getStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return (
      [
        { w: "25%", color: "#ff6b6b", text: "Weak" },
        { w: "50%", color: "#ffaa6b", text: "Fair" },
        { w: "75%", color: "#ffdd6b", text: "Good" },
        { w: "100%", color: "#6bff90", text: "Strong" },
      ][score - 1] || null
    );
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return setError("Submit All Field");
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError("New password aur confirm password Didn't Match");
    }
    if (form.newPassword.length < 8) {
      return setError("Atleast required 8 character password");
    }

    try {
      setLoading(true);
      await axios.put("/api/admin/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess("Password successfully update ho gaya!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Kuch galat hua, dobara try karo",
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = form.newPassword ? getStrength(form.newPassword) : null;

  const fields = [
    { key: "current", name: "currentPassword", label: "Current password" },
    { key: "new", name: "newPassword", label: "New password" },
    { key: "confirm", name: "confirmPassword", label: "Confirm new password" },
  ];

  return (
    <div className="mt-6 flex justify-center w-full">
      <div className="bg-[#16161f] border border-white/10 rounded-xl p-5 w-full max-w-2xl">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
          Change password
        </p>

        <div className="space-y-3 ">
          {fields.map(({ key, name, label }) => (
            <div key={key}>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <div className="relative">
                <input
                  type={showPass[key] ? "text" : "password"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full bg-[#0f0f13] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50 pr-10"
                />
                <button
                  onClick={() => setShowPass((p) => ({ ...p, [key]: !p[key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"
                >
                  {showPass[key] ? "🙈" : "👁"}
                </button>
              </div>

              {/* Strength bar — show on password */}
              {key === "new" && strength && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Password strength</span>
                    <span style={{ color: strength.color }}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="h-1 bg-[#1e1e2e] rounded-full">
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{ width: strength.w, background: strength.color }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Error / Success */}
        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        {success && <p className="text-xs text-green-400 mt-3">{success}</p>}

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Security;
