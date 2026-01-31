"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteBatchStudents,
} from "@/lib/api/student-api";
import StudentTable from "./_components/StudentTable";
import StudentFormModal from "./_components/StudentFormModal";

export default function SchoolDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  // redirect if not authenticated or role != SCHOOL
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "SCHOOL") {
        router.replace("/login");
      }
    }
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "SCHOOL") {
      loadStudents();
    }
  }, [isAuthenticated, user]);

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteBatchStudents(selectedIds);
      setSelectedIds([]);
      loadStudents();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!isAuthenticated || user?.role !== "SCHOOL") return null;
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-5 flex flex-col gap-4">
        <h2 className="font-bold text-lg">School Dashboard</h2>
        <button
          className="bg-blue-600 text-white p-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Student
        </button>
        <button
          className="bg-red-600 text-white p-2 rounded"
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0}
        >
          Delete Selected
        </button>
        <button
          className="mt-auto bg-gray-500 text-white p-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-5">Student Management</h1>
        <StudentTable
          students={students}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onEdit={(student) => {
            setEditingStudent(student);
            setShowModal(true);
          }}
        />
      </div>

      {showModal && (
        <StudentFormModal
          student={editingStudent}
          onClose={() => {
            setShowModal(false);
            setEditingStudent(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditingStudent(null);
            loadStudents();
          }}
        />
      )}
    </div>
  );
}
