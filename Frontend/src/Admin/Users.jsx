import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import Api from "../Api/axios";

const avatarStyles = [
  {
    border: "border-indigo-500",
    text: "text-indigo-300",
    bg: "bg-indigo-500/10",
  },
  { border: "border-cyan-400", text: "text-cyan-300", bg: "bg-cyan-400/10" },
  { border: "border-pink-500", text: "text-pink-300", bg: "bg-pink-500/10" },
  { border: "border-amber-400", text: "text-amber-300", bg: "bg-amber-400/10" },
];

const Users = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setFilter] = useState("");
  const [totalUser, setTotalUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Api.get("/admin/users", {
          withCredentials: true,
        });
        console.log("API RESPONSE 👉", res.data);
        setTotalUser(res.data.TotalUser || []);
      } catch (err) {
        console.log("Failed to fetch stats", err);
      }
    };
    fetchUser();
  }, []);

  const filtered = totalUser.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.userName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)) &&
      (!roleFilter || u.role === roleFilter)
    );
  });

  const admins = totalUser.filter((u) => u.role === "admin").length;
  const user = totalUser.filter((u) => u.role === "user").length;

  return (
    <div className="min-h-screen bg-[#0f0f13] px-6 py-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Users
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your workspace users & permissions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Total Users",
            value: totalUser.length,
            dot: "bg-indigo-500",
          },
          { label: "Admins", value: admins, dot: "bg-cyan-400" },
          { label: "User", value: user, dot: "bg-pink-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#18181f] border border-[#27272f] rounded-2xl px-5 py-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 mb-2">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </p>
            <p className="text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={15}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-[#18181f] border border-[#27272f] rounded-xl pl-9 pr-4 text-sm text-white
             placeholder-zinc-600 outline-none focus:border-indigo-500 transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 bg-[#18181f] border border-[#27272f] rounded-xl px-4 text-sm
           text-white outline-none focus:border-indigo-500 transition cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="hidden sm:block bg-[#18181f] border border-[#27272f] rounded-2xl overflow-hidden">
        {/* Head */}
        <div className="grid grid-cols-[2.2fr_1fr_1.1fr_90px] px-5 py-3.5 border-b border-[#27272f]">
          {["User", "Role", "Joined", "Actions"].map((h, i) => (
            <span
              key={h}
              className={`text-[11px] font-semibold uppercase tracking-widest text-zinc-600 ${i === 3 ? "text-center" : ""}`}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-600 text-sm py-12">
            No users found
          </p>
        ) : (
          filtered.map((user, idx) => {
            const av = avatarStyles[idx % avatarStyles.length];
            return (
              <div
                key={user.id}
                className="grid grid-cols-[2.2fr_1fr_1.1fr_90px] px-5 py-4 border-b border-[#1e1e27] last:border-0 items-center hover:bg-[#1e1e27] transition-colors"
              >
                {/* User */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold shrink-0 ${av.border} ${av.text} ${av.bg}`}
                  >
                    {user.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">
                      {user.userName}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">{user.email}</p>
                  </div>
                </div>

                {/* Badge */}
                <div>
                  {user.role === "Admin" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      User
                    </span>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs text-zinc-500 tabular-nums">
                  {new Date(user.createdAt).toLocaleDateString("en-IN")}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2">
                  <button className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-lg border border-[#2e2e3a] bg-[#22222c] hover:border-indigo-500 hover:bg-indigo-500/15 transition-all group">
                    <AiOutlineEdit
                      size={14}
                      className="text-zinc-500 group-hover:text-indigo-300"
                    />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg border border-[#2e1f1f] bg-[#1f1717] hover:border-red-500 hover:bg-red-500/15 transition-all group">
                    <AiOutlineDelete
                      size={14}
                      className="text-zinc-600 group-hover:text-red-400"
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cards — mobile only */}
      <div className="sm:hidden space-y-3 py-2">
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-600 text-sm py-12">
            No users found
          </p>
        ) : (
          filtered.map((user, idx) => {
            const av = avatarStyles[idx % avatarStyles.length];
            return (
              <div
                key={user.id}
                className="bg-[#18181f] border border-[#27272f] rounded-2xl px-4 py-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold shrink-0 ${av.border} ${av.text} ${av.bg}`}
                    >
                      {user.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">
                        {user.userName}
                      </p>
                      <p className="text-xs text-zinc-600">{user.email}</p>
                    </div>
                  </div>
                  {user.role === "Admin" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{" "}
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />{" "}
                      User
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-[#27272f] pt-3">
                  <p className="text-xs text-zinc-500">{user.date}</p>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2e2e3a] bg-[#22222c] hover:border-indigo-500 hover:bg-indigo-500/15 transition-all group">
                      <AiOutlineEdit
                        size={14}
                        className="text-zinc-500 group-hover:text-indigo-300"
                      />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2e1f1f] bg-[#1f1717] hover:border-red-500 hover:bg-red-500/15 transition-all group">
                      <AiOutlineDelete
                        size={14}
                        className="text-zinc-600 group-hover:text-red-400"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Users;
