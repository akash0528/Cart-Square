import { useContext } from "react";
import { useState, useRef } from "react";
import AuthContext from "../../Context/AuthContext";
import { toast } from "react-toastify";
import Api from "../../Api/axios";

const Profile = () => {
  const [avatar, setAvatar] = useState(null);
  const { user, updateUser, logout } = useContext(AuthContext);
  const fileRef = useRef();

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const loadingToast = toast.loading("updating img...");
    try {
      const res = await Api.put("/auth/updated-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      updateUser(res.data.updateUser);
      toast.update(loadingToast, {
        render: "Profile Updated Successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error);
      toast.error("Image update failed");
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Avatar + Name */}
      <div className="bg-[#16161f] border border-white/10 rounded-xl p-5 flex items-center gap-5">
        <div
          className="w-24 h-24 rounded-full border-2 border-purple-500 bg-[#1e1e2e] flex items-center justify-center text-2xl text-purple-300 cursor-pointer overflow-hidden relative group"
          onClick={() => fileRef.current.click()}
        >
          {user?.avatar ? (
            <img
              src={user?.avatar}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>AD</span>
          )}
          <div className="absolute inset-0 bg-black/55 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs text-gray-300 text-center px-2">
            Change photo
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatar}
        />
        <div>
          <p className="text-white text-lg font-medium">
            Admin {user?.userName}
          </p>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="text-xs bg-[#1e1e2e] border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
              Super Admin
            </span>
            <span className="text-xs bg-[#1e1e2e] border border-green-500/30 text-green-400 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
          Basic info
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["First name", user?.userName],
            ["Last name", user?.role],
            ["Email", user?.email],
            ["Phone", "+91 98765 43210"],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <input
                defaultValue={val}
                className="w-full bg-[#0f0f13] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Role & Permissions */}
      <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
          Role & access
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Role</p>
            <select className="w-full bg-[#0f0f13] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option>Super Admin</option>
              <option>Admin</option>
              <option>Moderator</option>
              <option>Viewer</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Department</p>
            <input
              defaultValue="Management"
              className="w-full bg-[#0f0f13] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-2">Permissions</p>
        <div className="flex flex-wrap gap-2">
          {[
            "View dashboard",
            "Manage products",
            "Manage users",
            "View orders",
            "Manage orders",
            "View analytics",
            "Settings access",
          ].map((p) => (
            <span
              key={p}
              className="text-xs bg-green-900/30 border border-green-500/20 text-green-400 px-3 py-1 rounded-md"
            >
              {p}
            </span>
          ))}
          <span className="text-xs bg-red-900/30 border border-red-500/20 text-red-400 px-3 py-1 rounded-md">
            Delete records
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button className="px-5 py-2 text-sm text-gray-400 border border-white/10 rounded-lg">
          Cancel
        </button>
        <button className="px-5 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg">
          Save changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
