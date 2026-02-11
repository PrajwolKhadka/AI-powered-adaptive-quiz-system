"use client";

import { useState, useRef } from "react";
import { QuizAPI } from "@/lib/api/quiz-api";

interface UploadCSVProps {
  questionsExist: boolean;
  onUploadSuccess: () => void;
}

export default function UploadCSV({ questionsExist, onUploadSuccess }: UploadCSVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!questionsExist) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (questionsExist) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const droppedFile = files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
      } else {
        alert("Please upload a CSV file");
      }
    }
  };

  const handleBrowseClick = () => {
    if (!questionsExist) {
      fileInputRef.current?.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file first");
    setUploading(true);

    try {
      const res = await QuizAPI.uploadCSV(file);
      alert(`CSV uploaded: ${res.inserted} inserted, ${res.failed} failed`);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-4">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
          ${questionsExist 
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' 
            : isDragging 
              ? 'border-blue-500 bg-blue-50 cursor-pointer' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 cursor-pointer'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={questionsExist}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          {questionsExist ? (
            <div className="text-sm">
              <p className="font-medium text-gray-600">Upload disabled</p>
              <p className="text-gray-500">Questions already exist. Delete them first to upload new ones.</p>
            </div>
          ) : file ? (
            <div className="text-sm">
              <p className="font-medium text-gray-700">{file.name}</p>
              <p className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 font-medium">
                Drag & drop your CSV file here
              </p>
              <p className="text-gray-400 text-sm">or click to browse</p>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleUpload}
          disabled={!file || uploading || questionsExist}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>

        {file && !questionsExist && (
          <button
            onClick={handleClear}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}