import React, { useState } from "react";
import AdminQuestion from "../components/adminquestion.tsx";
import StudentsLog from "../components/studentslog";
import StudentsResults from "../components/studentsresults";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"questions" | "logs" | "results">("questions");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "questions" ? "bg-blue-500" : "bg-slate-700"
          }`}
          onClick={() => setActiveTab("questions")}
        >
          Manage Questions
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "logs" ? "bg-blue-500" : "bg-slate-700"
          }`}
          onClick={() => setActiveTab("logs")}
        >
          Students Logs
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "results" ? "bg-blue-500" : "bg-slate-700"
          }`}
          onClick={() => setActiveTab("results")}
        >
          Students Results
        </button>
      </div>

      {/* Active Component */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        {activeTab === "questions" && <AdminQuestion />}
        {activeTab === "logs" && <StudentsLog />}
        {activeTab === "results" && <StudentsResults />}
      </div>
    </div>
  );
};

export default Admin;
