import React, { useEffect, useState } from "react";
import axios from "axios";

interface Admin {
  id: number;
  name: string;
  school_id: string;
}

const AdminList: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Admin form state
  const [newName, setNewName] = useState("");
  const [newSchoolId, setNewSchoolId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSchoolId, setEditSchoolId] = useState("");

  const token = localStorage.getItem("token");

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  // Create admin
  const createAdmin = async () => {
    if (!newName || !newSchoolId || !newPassword) return alert("Fill all fields");
    setCreating(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/admins",
        { name: newName, schoolId: newSchoolId, password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(prev => [...prev, res.data]);
      setNewName("");
      setNewSchoolId("");
      setNewPassword("");
      alert("Admin created successfully!");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  // Delete admin
  const deleteAdmin = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.msg || "Failed to delete admin");
    }
  };

const resetPassword = async (id: number) => {
  // Ask superadmin to enter a new password
  const newPassword = prompt("Enter a new password for this admin:");
  if (!newPassword) return alert("Password reset cancelled.");

  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/admin/admins/${id}/reset`,
      { password: newPassword }, // send the new password to backend
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Password reset successfully!");
  } catch (err: any) {
    alert(err.response?.data?.msg || "Failed to reset password");
  }
};



  // Start editing
  const startEditing = (admin: Admin) => {
    setEditingId(admin.id);
    setEditName(admin.name);
    setEditSchoolId(admin.school_id);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditSchoolId("");
  };

const saveEdit = async (id: number) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/admin/admins/${id}`,
      { name: editName, schoolId: editSchoolId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAdmins(prev => prev.map(a => (a.id === id ? res.data : a)));
    cancelEditing();
    alert("Admin updated successfully!");
  } catch (err: any) {
    alert(err.response?.data?.msg || "Failed to update admin");
  }
};


  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) return <p>Loading admins...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">School Admins</h2>

      {/* Create Admin Form */}
      <div className="mb-6 p-4 bg-slate-800 rounded">
        <h3 className="font-semibold text-white mb-2">Create New Admin</h3>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Name"
            className="px-2 py-1 rounded text-black"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <input
            type="text"
            placeholder="School ID"
            className="px-2 py-1 rounded text-black"
            value={newSchoolId}
            onChange={e => setNewSchoolId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            className="px-2 py-1 rounded text-black"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded"
            onClick={createAdmin}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </div>

      {/* Admin Table */}
      <table className="w-full border border-slate-700 rounded">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-2 border-b">ID</th>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">School ID</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id} className="text-center">
              <td className="p-2 border-b">{admin.id}</td>
              <td className="p-2 border-b">
                {editingId === admin.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="px-2 py-1 rounded text-black"
                  />
                ) : (
                  admin.name
                )}
              </td>
              <td className="p-2 border-b">
                {editingId === admin.id ? (
                  <input
                    type="text"
                    value={editSchoolId}
                    onChange={e => setEditSchoolId(e.target.value)}
                    className="px-2 py-1 rounded text-black"
                  />
                ) : (
                  admin.school_id
                )}
              </td>
              <td className="p-2 border-b flex justify-center gap-2">
                {editingId === admin.id ? (
                  <>
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded"
                      onClick={() => saveEdit(admin.id)}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                      onClick={() => startEditing(admin)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => deleteAdmin(admin.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => resetPassword(admin.id)}
                    >
                      Reset Password
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
