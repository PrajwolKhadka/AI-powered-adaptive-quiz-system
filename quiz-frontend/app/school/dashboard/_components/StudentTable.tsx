// "use client";

// interface StudentTableProps {
//   students: any[];
//   selectedIds: string[];
//   setSelectedIds: (ids: string[]) => void;
//   onEdit: (student: any) => void;
// }

// export default function StudentTable({ students, selectedIds, setSelectedIds, onEdit }: StudentTableProps) {
//   const toggleSelect = (id: string) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter((i) => i !== id));
//     } else {
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   return (
//     <table className="w-full border-collapse border border-gray-300">
//       <thead>
//         <tr className="bg-gray-200">
//           <th className="p-2 border">Select</th>
//           <th className="p-2 border">Full Name</th>
//           <th className="p-2 border">Email</th>
//           <th className="p-2 border">Class</th>
//           <th className="p-2 border">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {students.map((s) => (
//           <tr key={s._id} className="hover:bg-gray-100">
//             <td className="p-2 border text-center">
//               <input
//                 type="checkbox"
//                 checked={selectedIds.includes(s._id)}
//                 onChange={() => toggleSelect(s._id)}
//               />
//             </td>
//             <td className="p-2 border">{s.fullName}</td>
//             <td className="p-2 border">{s.email}</td>
//             <td className="p-2 border">{s.className}</td>
//             <td className="p-2 border">
//               <button
//                 className="bg-yellow-400 text-white px-2 py-1 rounded"
//                 onClick={() => onEdit(s)}
//               >
//                 Edit
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

interface Props {
  students: any[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onEdit: (student: any) => void;
}

export default function StudentTable({
  students,
  selectedIds,
  setSelectedIds,
  onEdit,
}: Props) {
  const toggle = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <table className="w-full bg-white rounded-xl shadow overflow-hidden">
  <thead className="bg-gray-50 text-gray-600 text-sm">
    <tr>
      <th className="p-3 text-center">✓</th>
      <th className="p-3 text-center">Photo</th>
      <th className="p-3 text-left">Name</th>
      <th className="p-3 text-left">Email</th>
      <th className="p-3 text-left">Class</th>
      <th className="p-3 text-center">Action</th>
    </tr>
  </thead>
  <tbody>
    {students.map((s) => (
      <tr
        key={s._id}
        className="border-t hover:bg-gray-50 transition"
      >
        <td className="p-3 text-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(s._id)}
            onChange={() => toggle(s._id)}
          />
        </td>

        <td className="p-3 text-center">
          {s.imageUrl ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${s.imageUrl}`}
              className="w-10 h-10 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto" />
          )}
        </td>

        <td className="p-3 font-medium text-gray-800">{s.fullName}</td>
        <td className="p-3 text-gray-600">{s.email}</td>
        <td className="p-3 text-gray-600">{s.className}</td>

        <td className="p-3 text-center">
          <button
            className="text-sm bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-lg"
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
