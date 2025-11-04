import React, { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  firstname: string | null;
  lastname: string | null;
  class: string | null;
}

const StudentsLog: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    firstname: "",
    lastname: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Universal class & password for all students
  const [universalClass, setUniversalClass] = useState("");
  const [universalPassword, setUniversalPassword] = useState("");

  const token = localStorage.getItem("token"); // auth token
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student", config);
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add or update student
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!universalPassword || !universalClass) {
      return alert("Set universal password and class first");
    }

    try {
      const payload = {
        name: form.name, // Make sure this is included
        firstname: form.firstname,
        lastname: form.lastname,
        password: universalPassword,
        class: universalClass,
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/student/${editingId}`, payload, config);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/student", payload, config);
      }

      setForm({ name: "", firstname: "", lastname: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to save student");
    }
  };

  // Edit student
  const handleEdit = (student: Student) => {
    setForm({ name: student.name, firstname: student.firstname || "", lastname: student.lastname || "" });
    setEditingId(student.id);
  };

  // Delete student
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/student/${id}`, config);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  // Filter students
  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.firstname && s.firstname.toLowerCase().includes(search.toLowerCase())) ||
          (s.lastname && s.lastname.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <div className="p-4">
      {/* Universal class & password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Universal Class"
          className="p-2 rounded text-black"
          value={universalClass}
          onChange={(e) => setUniversalClass(e.target.value)}
        />
        <input
          type="password"
          placeholder="Universal Password"
          className="p-2 rounded text-black"
          value={universalPassword}
          onChange={(e) => setUniversalPassword(e.target.value)}
        />
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search students..."
        className="p-2 rounded mb-4 w-full text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-700 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Username"
            className="p-2 rounded text-black"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            className="p-2 rounded text-black"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="p-2 rounded text-black"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          {editingId ? "Update Student" : "Add Student"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-4 px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
            onClick={() => {
              setForm({ name: "", firstname: "", lastname: "" });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-slate-700 rounded text-left">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Class</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-slate-600">
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.firstname}</td>
                <td className="px-4 py-2">{student.lastname}</td>
                <td className="px-4 py-2">{student.class}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 rounded hover:bg-red-600"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-400">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsLog;
