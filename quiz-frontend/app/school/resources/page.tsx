// "use client";
// import React, { useEffect, useState } from "react";
// import { ResourcesAPI } from "@/lib/api/resources-api";

// interface Resource {
//   _id: string;
//   title: string;
//   description?: string;
//   type: "BOOK" | "RESOURCE";
//   format: "PDF" | "LINK";
//   fileUrl?: string;
//   linkUrl?: string;
//   createdAt: string;
// }

// const SchoolResources = () => {
//   const [resources, setResources] = useState<Resource[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingResource, setEditingResource] = useState<Resource | null>(null);

//   // Form state
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     type: "RESOURCE" as "BOOK" | "RESOURCE",
//     format: "PDF" as "PDF" | "LINK",
//     linkUrl: "",
//   });
//   const [file, setFile] = useState<File | null>(null);

//   /** Fetch resources on mount */
//   const fetchResources = async () => {
//     try {
//       const data = await ResourcesAPI.getSchoolResources();
//       setResources(data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch resources");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchResources();
//   }, []);

//   /** Handle form input changes */
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
//   };

//   const resetForm = () => {
//     setForm({ title: "", description: "", type: "RESOURCE", format: "PDF", linkUrl: "" });
//     setFile(null);
//     setEditingResource(null);
//   };

//   /** Submit new or updated resource */
//   const handleSubmit = async () => {
//     try {
//       if (editingResource) {
//         const updated = await ResourcesAPI.updateResource(editingResource._id, { ...form, file: file || undefined });
//         setResources(resources.map(r => (r._id === updated._id ? updated : r)));
//         alert("Resource updated");
//       } else {
//         const created = await ResourcesAPI.createResource({ ...form, file: file || undefined });
//         setResources([created, ...resources]);
//         alert("Resource created");
//       }
//       resetForm();
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to submit resource");
//     }
//   };

//   /** Start editing resource */
//   const handleEdit = (resource: Resource) => {
//     setEditingResource(resource);
//     setForm({
//       title: resource.title,
//       description: resource.description || "",
//       type: resource.type,
//       format: resource.format,
//       linkUrl: resource.linkUrl || "",
//     });
//   };

//   /** Delete resource */
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this resource?")) return;
//     try {
//       await ResourcesAPI.deleteResource(id);
//       setResources(resources.filter(r => r._id !== id));
//       alert("Resource deleted");
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to delete resource");
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto text-black">
//       <h1 className="text-2xl font-bold mb-4">School Resources</h1>

//       {/* Form */}
//       <div className="bg-white shadow rounded p-4 mb-6">
//         <h2 className="font-semibold mb-2">{editingResource ? "Edit Resource" : "Add Resource"}</h2>
//         <div className="flex flex-col gap-2">
//           <input
//             type="text"
//             name="title"
//             placeholder="Title"
//             value={form.title}
//             onChange={handleInputChange}
//             className="border rounded px-2 py-1"
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={form.description}
//             onChange={handleInputChange}
//             className="border rounded px-2 py-1"
//           />
//           <select
//             name="type"
//             value={form.type}
//             onChange={handleInputChange}
//             className="border rounded px-2 py-1"
//           >
//             <option value="BOOK">BOOK</option>
//             <option value="RESOURCE">RESOURCE</option>
//           </select>
//           <select
//             name="format"
//             value={form.format}
//             onChange={handleInputChange}
//             className="border rounded px-2 py-1"
//           >
//             <option value="PDF">PDF</option>
//             <option value="LINK">LINK</option>
//           </select>
//           {form.format === "PDF" && (
//             <input type="file" accept="application/pdf" onChange={handleFileChange} />
//           )}
//           {form.format === "LINK" && (
//             <input
//               type="text"
//               name="linkUrl"
//               placeholder="Link URL"
//               value={form.linkUrl}
//               onChange={handleInputChange}
//               className="border rounded px-2 py-1"
//             />
//           )}
//           <div className="flex gap-2 mt-2">
//             <button
//               onClick={handleSubmit}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               {editingResource ? "Update" : "Create"}
//             </button>
//             {editingResource && (
//               <button
//                 onClick={resetForm}
//                 className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Resource List */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {resources.map(r => (
//             <div key={r._id} className="border rounded p-4 shadow flex flex-col gap-2">
//               <h3 className="font-semibold">{r.title}</h3>
//               {r.description && <p>{r.description}</p>}
//               <p>Type: {r.type}</p>
//               <p>Format: {r.format}</p>
//               {r.format === "PDF" && r.fileUrl && (
//                 <a
//                   href={r.fileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   View PDF
//                 </a>
//               )}
//               {r.format === "LINK" && r.linkUrl && (
//                 <a
//                   href={r.linkUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   Visit Link
//                 </a>
//               )}
//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={() => handleEdit(r)}
//                   className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(r._id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SchoolResources;

"use client";
import React, { useEffect, useState, useMemo } from "react";
import { ResourcesAPI } from "@/lib/api/resources-api";
import toast from "react-hot-toast";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: "BOOK" | "RESOURCE";
  format: "PDF" | "LINK";
  fileUrl?: string;
  linkUrl?: string;
  createdAt: string;
}

const BLOCKED_PATTERNS: RegExp[] = [
  /porn/i, /xxx/i, /sex(?!ual.?health|education|ology)/i, /adult.?content/i,
  /erotic/i, /nude/i, /hentai/i, /onlyfans/i, /chaturbate/i, /xvideos/i,
  /xhamster/i, /redtube/i, /youporn/i, /brazzers/i, /bangbros/i, /playboy/i,
  /penthouse/i, /fetish/i, /escort/i,/bet(?:ting|365|way|fair|victor)/i, /casino/i, /poker/i, /gambl/i,
  /slots/i, /lottery/i, /bookie/i, /oddschecker/i, /williamhill/i,
  /ladbrokes/i, /paddypower/i, /draftkings/i, /fanduel/i, /bovada/i,
  /unibet/i, /888casino/i, /spinpalace/i,
  /darkweb/i, /darknet/i, /silkroad/i,
  /stormfront/i,
];

function validateUrl(raw: string): true | string {
  if (!raw.trim()) return "URL cannot be empty.";

  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return "Please enter a valid URL (include https://).";
  }

  const hostname = parsed.hostname.toLowerCase();

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(hostname) || pattern.test(raw)) {
      return "This URL has been flagged as inappropriate and cannot be added. Please use educational or school-approved links only.";
    }
  }

  return true;
}

const PAGE_SIZE = 6;

const SchoolResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "RESOURCE" as "BOOK" | "RESOURCE",
    format: "PDF" as "PDF" | "LINK",
    linkUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [urlError, setUrlError] = useState<string>("");

  const fetchResources = async () => {
    try {
      const data = await ResourcesAPI.getSchoolResources();
      setResources(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? resources.filter(r => r.title.toLowerCase().includes(q))
      : resources;
  }, [resources, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => { setPage(1); }, [search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "linkUrl") {
      if (value.trim()) {
        const result = validateUrl(value);
        setUrlError(result === true ? "" : result);
      } else {
        setUrlError("");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", type: "RESOURCE", format: "PDF", linkUrl: "" });
    setFile(null);
    setEditingResource(null);
    setUrlError("");
  };

  const handleSubmit = async () => {
    if (form.format === "LINK") {
      const result = validateUrl(form.linkUrl);
      if (result !== true) {
        setUrlError(result);
        return;
      }
    }

    try {
      if (editingResource) {
        const updated = await ResourcesAPI.updateResource(editingResource._id, {
          ...form,
          file: file || undefined,
        });
        setResources(prev => prev.map(r => (r._id === updated._id ? updated : r)));
        toast.success("Resource updated");
      } else {
        const created = await ResourcesAPI.createResource({ ...form, file: file || undefined });
        setResources(prev => [created, ...prev]);
        toast.success("Resource created");
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit resource");
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setForm({
      title: resource.title,
      description: resource.description || "",
      type: resource.type,
      format: resource.format,
      linkUrl: resource.linkUrl || "",
    });
    setUrlError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await ResourcesAPI.deleteResource(id);
      setResources(prev => prev.filter(r => r._id !== id));
      toast.success("Resource deleted");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete resource");
    }
  };

  return (
    <div className=" max-w-5xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">School Resources</h1>
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">
          {editingResource ? "Edit Resource" : "Add Resource"}
        </h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          >
            <option value="BOOK">BOOK</option>
            <option value="RESOURCE">RESOURCE</option>
          </select>
          <select
            name="format"
            value={form.format}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          >
            <option value="PDF">PDF</option>
            <option value="LINK">LINK</option>
          </select>

          {form.format === "PDF" && (
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          )}

          {form.format === "LINK" && (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="linkUrl"
                placeholder="https://example.com"
                value={form.linkUrl}
                onChange={handleInputChange}
                className={`border rounded px-2 py-1 ${urlError ? "border-red-500" : ""}`}
              />
              {urlError && (
                <p className="text-red-600 text-sm">{urlError}</p>
              )}
              <p className="text-gray-400 text-xs">
                Only educational and school-appropriate links are allowed.
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              disabled={form.format === "LINK" && !!urlError}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingResource ? "Update" : "Create"}
            </button>
            {editingResource && (
              <button
                onClick={resetForm}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-sm"
        />
        {search && (
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No resources found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {paginated.map(r => (
              <div key={r._id} className="border rounded p-4 shadow flex flex-col gap-2">
                <h3 className="font-semibold">{r.title}</h3>
                {r.description && <p className="text-gray-600 text-sm">{r.description}</p>}
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {r.type}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Format:</span> {r.format}
                </p>
                {r.format === "PDF" && r.fileUrl && (
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View PDF
                  </a>
                )}
                {r.format === "LINK" && r.linkUrl && (
                  <a
                    href={r.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Visit Link
                  </a>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} &mdash; {filtered.length} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-100"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…");
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "…" ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`px-3 py-1 border rounded text-sm ${
                        page === item
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-100"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SchoolResources;