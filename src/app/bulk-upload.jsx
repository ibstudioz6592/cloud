"use client";
import { motion } from "framer-motion";
import { FaTimes, FaCloudUploadAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { useState } from "react";

export function BulkUpload({ onClose, onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles.map(file => ({
      file,
      status: 'pending',
      progress: 0,
      id: Math.random().toString(36).substr(2, 9)
    }))]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUploadAll = async () => {
    setUploading(true);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      try {
        const formData = new FormData();
        formData.append('file', fileItem.file);
        formData.append('access', 'private');
        formData.append('folder', 'root');

        const response = await fetch('/api/upload-auth', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          results.push({ ...data, fileName: fileItem.file.name, status: 'success' });
          
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, status: 'success', progress: 100 } : f
          ));
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        results.push({ fileName: fileItem.file.name, status: 'error', error: error.message });
        
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error', progress: 0 } : f
        ));
      }
    }

    setUploadResults(results);
    setUploading(false);
    
    // Call onUploadComplete after 2 seconds
    setTimeout(() => {
      onUploadComplete();
      onClose();
    }, 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-400" />;
      case 'error':
        return <FaTimesCircle className="text-red-400" />;
      case 'uploading':
        return <FaSpinner className="text-blue-400 animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-neutral-600"></div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCloudUploadAlt className="text-white text-2xl" />
            <h2 className="text-xl font-bold text-white">Bulk Upload</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
          >
            <FaTimes className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Input */}
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-red-500 rounded-xl cursor-pointer hover:bg-neutral-800/50 transition">
              <FaCloudUploadAlt className="text-red-400 text-4xl mb-2" />
              <p className="text-white font-semibold">Click to select files</p>
              <p className="text-neutral-400 text-sm">or drag and drop here</p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {files.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-lg p-3"
                >
                  {getStatusIcon(fileItem.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{fileItem.file.name}</p>
                    <p className="text-neutral-400 text-xs">{formatFileSize(fileItem.file.size)}</p>
                  </div>
                  {fileItem.status === 'pending' && !uploading && (
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition"
                    >
                      <FaTimes />
                    </button>
                  )}
                  {fileItem.status === 'uploading' && (
                    <div className="text-blue-400 text-xs">{fileItem.progress}%</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {files.length > 0 && (
            <div className="bg-neutral-800/50 rounded-lg p-3 mb-4 flex items-center justify-between">
              <p className="text-neutral-300 text-sm">
                <strong>{files.length}</strong> files selected
              </p>
              <p className="text-neutral-300 text-sm">
                Total: <strong>{formatFileSize(files.reduce((acc, f) => acc + f.file.size, 0))}</strong>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadAll}
              disabled={files.length === 0 || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt />
                  Upload All
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
