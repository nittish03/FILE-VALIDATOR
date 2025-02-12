'use client';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const router = useRouter();

  // Filter files based on search
  useEffect(() => {
    setFilteredFiles(
      allFiles.filter((file) =>
        file.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, allFiles]);

  // Open file in a new tab
  const showFile = (filePath) => {
    window.open(`/uploads/${filePath}`, "_blank");
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
    if (!file || !title) return toast.error("Please provide a title and select a file to upload.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const loadingToast = toast.loading("Uploading...");
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss(loadingToast);
      toast.success("File uploaded successfully.");

      setAllFiles([response.data.data, ...allFiles]);
      setFilteredFiles([response.data.data, ...filteredFiles]);

      setFile(null);
      setTitle("");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error uploading file.");
    }
  };

  // Handle file deletion
  const handleDelete = async (id) => {
    const loading = toast.loading("Deleting...");
    try {
      await axios.post("/api/delete-upload", { id });
      toast.dismiss(loading);
      toast.success("File deleted successfully.");
      setAllFiles(allFiles.filter(file => file.id !== id));
      setFilteredFiles(filteredFiles.filter(file => file.id !== id));
    } catch (e) {
      console.log(e);
      toast.dismiss(loading);
      toast.error("Failed to delete file.");
    }
  };

  const handleValidity = async (id) => {
    const loading = toast.loading("Validating...");
    try {
      const response = await axios.post("/api/get-single-upload", { id });
      const aiResponse = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: `Tell me if the invoice is valid and why, INVOICE DATA: ${response.data.data.result}` }] }],
        },
      });
      toast.dismiss(loading);
      toast.success("File validation successful.");
      router.push(`/report?validity=${aiResponse.data.candidates[0].content.parts[0].text}`);
    } catch (e) {
      console.log(e);
      toast.dismiss(loading);
      toast.error("Failed to validate file.");
    }
  };

  // Fetch uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("/api/get-uploads");
        const files = response.data.data || [];
        setAllFiles(files);
        setFilteredFiles(files);
      } catch (error) {
        toast.error("Failed to fetch documents.");
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Manage Your Files</h1>

      {/* Upload Section */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Upload a File</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter file title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 text-black rounded-lg focus:ring-2 focus:ring-blue-500"
          />
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
      <section className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-semibold text-black mb-4">Your Uploaded Documents</h2>
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div key={file.id} className="flex justify-between text-black items-center border-b py-4">
              <span className="font-medium">{file.title}</span>
              <span className="">{file.type}</span>

<span className="text-sm">
  {new Date(file.dateUploaded).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Enables 12-hour format with AM/PM
  })}
</span>


              <div className="flex justify-center items-center gap-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white"
                  onClick={() => showFile(file.pdf)}
                >
                  View
                </button>
                <MdDeleteForever
                  onClick={() => handleDelete(file.id)}
                  className="w-6 h-6 text-red-600 cursor-pointer hover:text-red-700"
                />
                <button
                  className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white"
                  onClick={() => handleValidity(file.id)}
                >
                  Check Validity
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">No documents found.</div>
        )}
      </section>
    </div>
  );
}
