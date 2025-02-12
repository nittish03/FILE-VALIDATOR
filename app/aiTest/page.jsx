"use client";
import { useState } from "react";

export default function DocumentUploader() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/documentAi", {
        method: "POST",
        body: file,
      });

      const data = await response.json();

      if (response.ok) {
        setExtractedText(data.result.extractedText);
      } else {
        setError(data.error || "Failed to process document.");
      }
    } catch (error) {
      setError("Error uploading document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Upload a Document</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {loading ? "Processing..." : "Upload"}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {extractedText && (
        <div className="mt-4 p-2 border rounded">
          <h3 className="text-md font-semibold">Extracted Text:</h3>
          <p className="text-sm">{extractedText}</p>
        </div>
      )}
    </div>
  );
}
