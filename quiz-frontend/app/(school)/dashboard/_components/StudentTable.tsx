"use client";

interface StudentTableProps {
  students: any[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onEdit: (student: any) => void;
}

export default function StudentTable({ students, selectedIds, setSelectedIds, onEdit }: StudentTableProps) {
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Select</th>
          <th className="p-2 border">Full Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Class</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s._id} className="hover:bg-gray-100">
            <td className="p-2 border text-center">
              <input
                type="checkbox"
                checked={selectedIds.includes(s._id)}
                onChange={() => toggleSelect(s._id)}
              />
            </td>
            <td className="p-2 border">{s.fullName}</td>
            <td className="p-2 border">{s.email}</td>
            <td className="p-2 border">{s.className}</td>
            <td className="p-2 border">
              <button
                className="bg-yellow-400 text-white px-2 py-1 rounded"
                onClick={() => onEdit(s)}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
