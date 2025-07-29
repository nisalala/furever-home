// components/VerifyIDModal.jsx
import React, { useState } from "react";
import axios from "axios";

const VerifyIDModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("idDocument", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5002/api/users/upload-id", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("ID uploaded successfully for verification.");
      onClose(); // close the modal
      window.location.reload(); // to refresh user status
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload ID.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-amber-700 mb-4">Upload ID Document</h2>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="mb-4 w-full"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyIDModal;
