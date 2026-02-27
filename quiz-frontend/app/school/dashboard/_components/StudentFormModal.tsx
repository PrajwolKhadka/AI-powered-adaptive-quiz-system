

"use client";

import { useEffect, useState } from "react";
import { createStudent, updateStudent } from "@/lib/api/student-api";

export default function StudentFormModal({ student, onClose, onSave }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFullName(student.fullName);
      setEmail(student.email);
      setClassName(student.className);
      setPassword(""); // do not prefill password
      setPreview(
        student.imageUrl
          ? `${process.env.NEXT_PUBLIC_API_URL}${student.imageUrl}`
          : null,
      );
    }
  }, [student]);

  const submit = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("fullName", fullName);
    fd.append("email", email);
    fd.append("className", className);
    if (password) fd.append("password", password);
    if (image) fd.append("image", image);

    student ? await updateStudent(student._id, fd) : await createStudent(fd);

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      {/* <form className="bg-white p-6 rounded-2xl w-96 space-y-4 shadow-2xl"> */}
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-2xl w-96 space-y-4 shadow-2xl text-black"
      >
        <h2 className="text-xl font-bold">
          {student ? "Edit Student" : "Add Student"}
        </h2>

        {preview && (
          <img
            src={preview}
            className="w-20 h-20 rounded-full mx-auto object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setImage(f);
              setPreview(URL.createObjectURL(f));
            }
          }}
        />

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {/* {!student && ( */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        {/* )} */}
        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class"
          required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-1 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
