"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ResourcesAPI } from "@/lib/api/resources-api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: "BOOK" | "RESOURCE";
  format: "PDF" | "LINK";
  fileUrl?: string;
  linkUrl?: string;
}

const PAGE_SIZE = 6;

const StudentBooks = () => {
  const [books, setBooks] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchBooks = async () => {
    try {
      const data = await ResourcesAPI.getStudentResources();
      const filtered = Array.isArray(data)
        ? data.filter((r: Resource) => r.type === "BOOK")
        : [];
      setBooks(filtered);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? books.filter((b) => b.title.toLowerCase().includes(q))
      : books;
  }, [books, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const pagePills = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce<(number | "…")[]>((acc, n, idx, arr) => {
      if (idx > 0 && n - (arr[idx - 1] as number) > 1) {
        acc.push("…");
      }
      acc.push(n);
      return acc;
    }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto text-black">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Books</h1>

        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {search && !loading && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} result
          {filtered.length !== 1 ? "s" : ""} for "{search}"
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading books...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
          <span className="text-5xl">📭</span>
          <p className="text-lg font-medium">No books found.</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-1 text-sm text-blue-500 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((book) => (
              <div
                key={book._id}
                className="border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                    {book.format === "PDF" ? "📄" : "🔗"}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                </div>

                {book.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {book.description}
                  </p>
                )}

                <span
                  className={`self-start text-xs font-medium px-2 py-0.5 rounded-full ${
                    book.format === "PDF"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {book.format}
                </span>

                <div className="mt-auto pt-1">
                  {book.format === "PDF" && book.fileUrl && (
                    <button
                      onClick={() => setSelectedPdf(book.fileUrl!)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
                    >
                      View Book
                    </button>
                  )}
                  {book.format === "LINK" && book.linkUrl && (
                    <a
                      href={book.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
                    >
                      Open Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 flex-wrap gap-3">
              <p className="text-sm text-gray-400">
                Page {page} of {totalPages} — {filtered.length} book
                {filtered.length !== 1 ? "s" : ""}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-100 transition"
                >
                  Prev
                </button>

                {pagePills.map((item, idx) =>
                  item === "…" ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-100 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedPdf && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
              <span className="font-semibold text-gray-700 text-sm">PDF Viewer</span>
              <button
                onClick={() => setSelectedPdf(null)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg transition"
              >
                Close
              </button>
            </div>
            <iframe
              src={`${selectedPdf}#toolbar=0&navpanes=0&scrollbar=0`}
              className="flex-1 w-full"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBooks;