import { useState } from "react";
import { User } from "lucide-react";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoTvOutline } from "react-icons/io5";
import Profile from "../../Admin/Setting/Profile";
import Security from "../../Admin/Setting/Security";
import Preference from "../../Admin/Setting/Preference";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    {
      id: "security",
      label: "Security",
      icon: <RiLockPasswordLine size={16} />,
    },
    { id: "preference", label: "Preference", icon: <IoTvOutline size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f13] px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Setting
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Manage your Account, Setting & Preference
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex w-full sm:w-auto bg-gray-700 border border-white/10 rounded-xl p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center cursor-pointer gap-1.5 flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm text-white transition-all ${
                activeTab === tab.id
                  ? "bg-gray-900 shadow "
                  : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              {tab.icon}
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "profile" && <Profile />}
        {activeTab === "security" && <Security />}
        {activeTab === "preference" && <Preference />}
      </div>
    </div>
  );
};

export default Setting;
