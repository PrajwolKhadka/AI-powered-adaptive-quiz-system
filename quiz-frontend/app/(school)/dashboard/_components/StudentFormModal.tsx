"use client";

import { useState, useEffect } from "react";
import { createStudent, updateStudent } from "@/lib/api/student-api";

interface Props {
  student?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function StudentFormModal({ student, onClose, onSave }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (student) {
      setFullName(student.fullName);
      setEmail(student.email);
      setClassName(student.className);
      setPassword(""); // do not prefill password
    }
  }, [student]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("className", className);
    if (!student) formData.append("password", password); // only for create

    try {
      if (student) {
        await updateStudent(student._id, formData);
      } else {
        await createStudent(formData);
      }
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        className="bg-black p-6 rounded shadow-md w-96 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold">{student ? "Edit Student" : "Add Student"}</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!student && (
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <input
          type="text"
          placeholder="Class"
          className="border p-2 rounded"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {student ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
