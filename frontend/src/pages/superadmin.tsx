import React, { useState } from "react";
import AdminList from "../components/adminlist";
// import Analytics from "../components/Analytics";

const SuperAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"admins" | "analytics">("admins");

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6">SuperAdmin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "admins" ? "bg-blue-500" : "bg-slate-700"}`}
          onClick={() => setActiveTab("admins")}
        >
          Admins
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "analytics" ? "bg-blue-500" : "bg-slate-700"}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      <div>
        {activeTab === "admins" && <AdminList />}
        {/* {activeTab === "analytics" && <Analytics />} */}
      </div>
    </div>
  );
};

export default SuperAdmin;
