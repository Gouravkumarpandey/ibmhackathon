import React, { useState } from "react";

export default function UploadFolder() {
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files.map((file) => file.name));
    setUploadMessage("Folder uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Welcome to Folder Upload</h1>
          <p className="text-gray-400 mt-2">Upload a folder to get started</p>
        </div>

        <label
          htmlFor="folderInput"
          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-white/40 rounded-lg px-10 py-12 hover:border-white transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
            />
          </svg>
          <span className="text-lg font-medium">Upload Folder</span>
          <span className="text-sm text-gray-400 mt-1">
            Or drag and drop your folder here
          </span>
          <input
            id="folderInput"
            type="file"
            webkitdirectory="true"
            directory=""
            multiple
            onChange={handleFolderUpload}
            className="hidden"
          />
        </label>

        {uploadMessage && (
          <div className="mt-4 text-green-400">
            <p>{uploadMessage}</p>
            <ul className="mt-2 text-sm text-gray-300 max-h-40 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <li key={index}>📁 {file}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
