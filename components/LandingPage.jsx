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

      // Add new file to state instead of refreshing the page
      setAllFiles([response.data.data, ...allFiles]);
      setFilteredFiles([response.data.data, ...filteredFiles]);

      // Reset form
      setFile(null);
      setTitle("");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error uploading file.");
    }
  };

  const handleDelete = async(id) =>{
    const loading = toast.loading("Deleting...");
    try{
      const response = await axios.post("/api/delete-upload",{id});
      toast.dismiss(loading);
      toast.success("File deleted successfully.");
    }catch(e){
      console.log(e);
      toast.dismiss(loading);
      toast.error("Failed to delete file.");
    }finally{
      if(loading){
        toast.dismiss(loading);
      }
    }
    
  }


    // Fetch uploaded files
    useEffect(() => {
      const fetchFiles = async () => {
        try {
          const response = await axios.get('/api/get-uploads');
          const files = response.data.data || [];
          console.log(files);
          setAllFiles(files);
          setFilteredFiles(files);
        } catch (error) {
          toast.error("Failed to fetch documents.");
        }
      };
      fetchFiles();
    }, [handleDelete]);
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
      <section>
  <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">Your Uploaded Documents</h2>
  <div className="bg-white rounded-lg shadow-lg">
    
    {/* Large screen view */}
    <div className="hidden sm:block text-black">
      <div className="grid grid-cols-4 bg-[#F4F6F7] py-4 px-6 font-medium text-[#2C3E50]">
        <span>Document Name</span>
        <span>Type</span>
        <span>Uploaded On</span>
        <span>Actions</span>
      </div>

      {filteredFiles.length > 0 ? (
        filteredFiles.map((file) => (
          <div key={file.id} className="grid grid-cols-4 py-4 px-6 items-center border-b hover:bg-[#ECF0F1]">
            <span>{file.title}</span>
            <span>{file.type}</span>
            <span>{file.dateUploaded}</span>
            <div className="flex gap-4 justify-center items-center">
              <button
                className="px-2 py-2 text-sm font-medium text-[#3498DB] border border-[#3498DB] rounded-md hover:bg-[#3498DB] hover:text-white"
                onClick={() => showFile(file.pdf)}
              >
                View
              </button>
              <MdDeleteForever
                onClick={() => handleDelete(file.id)}
                className="w-6 h-6 text-red-600 cursor-pointer hover:text-red-700"
              />
              <button
                className="px-2 py-2 text-sm font-medium text-[#2ECC71] border border-[#2ECC71] rounded-md hover:bg-[#2ECC71] hover:text-white"
                onClick={() => handleValidity(file.id)}
              >
                Check Validity
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-[#BDC3C7]">No documents found.</div>
      )}
    </div>

    {/* Small screen view */}
    <div className="sm:hidden ">
      {filteredFiles.length > 0 ? (
        filteredFiles.map((file) => (
          <div key={file.id} className="border-b p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#2C3E50]">{file.title}</span>
              <span className="text-sm text-[#000]">{file.type}</span>
            </div>
            <div className="text-sm text-[#000]">Uploaded on: {file.dateUploaded}</div>
            <div className="flex justify-center items-center gap-4">
              <button
                className="px-4 py-2 text-sm font-medium text-[#3498DB] border border-[#3498DB] rounded-md hover:bg-[#3498DB] hover:text-white"
                onClick={() => showFile(file.pdf)}
              >
                View
              </button>
              <MdDeleteForever
                onClick={() => handleDelete(file.id)}
                className="w-6 h-6 text-red-600 cursor-pointer hover:text-red-700"
              />
              <button
                className="px-4 py-2 text-sm font-medium text-[#2ECC71] border border-[#2ECC71] rounded-md hover:bg-[#2ECC71] hover:text-white"
                onClick={() => handleValidity(file.id)}
              >
                Check Validity
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-[#BDC3C7]">No documents found.</div>
      )}
    </div>

  </div>
</section>





      
    </div>
  );
}
