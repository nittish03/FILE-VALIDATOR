'use client';
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";

export default function LandingPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);

  // Fetch uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/api/get-uploads');
        const files = response.data.data || [];
        setAllFiles(files);
        setFilteredFiles(files);
      } catch (error) {
        toast.error("Failed to fetch documents.");
      }
    };
    fetchFiles();
  }, []);

  // Filter files based on search
  useEffect(() => {
    setFilteredFiles(
      allFiles.filter((file) =>
        file.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, allFiles]);

  // Open file in a new tab
  const showFile = (filePath) => {
    window.open(filePath, "_blank");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type. Only PDF, JPG, PNG, and WEBP are allowed.");
        return;
      }
      setFile(selectedFile);
    }
  };

  // Handle file upload
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return toast.error("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", file);

    const loadingToast = toast.loading("Uploading...");
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss(loadingToast);
      toast.success("File uploaded successfully.");

      // Add new file to state instead of refreshing the page
      setAllFiles([response.data.filePath, ...allFiles]);
      setFilteredFiles([response.data.filePath, ...filteredFiles]);

      // Reset form
      setFile(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error uploading file.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Manage Your Files</h1>

      {/* Upload Section */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Upload a File</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="w-full border px-4 py-2 text-black rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Upload
          </button>
        </form>
      </section>

      {/* Search */}
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />

      {/* File List */}
      <div className="bg-white shadow-md rounded-lg p-4">
        {filteredFiles.length > 0 ? (
          <ul className="divide-y">
            {filteredFiles.map((filePath, index) => (
              <li key={index} className="py-4 flex justify-between items-center">
                <p className="text-gray-700">{filePath.split("/").pop()}</p>
                <button
                  onClick={() => showFile(filePath)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No files found.</p>
        )}
      </div>
    </div>
  );
}
