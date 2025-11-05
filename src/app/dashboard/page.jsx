"use client";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "../background-beams";
import { FileIDCard } from "../file-id-card";
import QRCodeStyling from "qr-code-styling";
import { 
  FaSearch, FaUpload, FaDownload, FaTrash, FaQrcode, 
  FaFolder, FaFile, FaSignOutAlt, FaFilter, FaEdit,
  FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileArchive
} from "react-icons/fa";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [storageInfo, setStorageInfo] = useState({ used: "0 B", limit: "5 GB" });
  const [showQRModal, setShowQRModal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const qrModalRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const fetchFiles = async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        folder: selectedFolder,
        sortBy: sortBy,
      });

      const res = await fetch(`/api/user/docs?${params}`);
      const data = await res.json();

      if (res.ok) {
        setFiles(data.files);
        setStorageInfo({ used: data.storageUsed, limit: data.storageLimit });
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedFolder, sortBy]);

  useEffect(() => {
    if (showQRModal && qrModalRef.current) {
      const qrCode = new QRCodeStyling({
        width: 280,
        height: 280,
        type: "canvas",
        data: showQRModal.qrUrl,
        image: "/logo.svg",
        dotsOptions: {
          color: "#6366f1",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        cornersSquareOptions: {
          color: "#a855f7",
          type: "extra-rounded",
        },
        cornersDotOptions: {
          color: "#ec4899",
          type: "dot",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 6,
          imageSize: 0.4,
        },
        qrOptions: {
          errorCorrectionLevel: "H",
        },
      });

      qrModalRef.current.innerHTML = "";
      qrCode.append(qrModalRef.current);
    }
  }, [showQRModal]);

  const handleFileUpload = async () => {
    if (!uploadFile) return;

    setUploadProgress(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("access", "private");
    formData.append("folder", "root");

    try {
      const res = await fetch("/api/upload-auth", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadedFileData(data.file); // Show ID card with uploaded file data
        fetchFiles();
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`/api/delete/${fileId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchFiles();
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const getFileIcon = (type) => {
    switch (type.toUpperCase()) {
      case "PDF": return <FaFilePdf className="text-red-500 text-2xl" />;
      case "DOC": return <FaFileWord className="text-blue-500 text-2xl" />;
      case "XLS": return <FaFileExcel className="text-green-500 text-2xl" />;
      case "IMAGE": return <FaFileImage className="text-purple-500 text-2xl" />;
      case "ZIP": return <FaFileArchive className="text-yellow-500 text-2xl" />;
      default: return <FaFile className="text-gray-500 text-2xl" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative">
      <BackgroundBeams />

      {/* Header */}
      <div className="relative z-10 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-600">
              AJ STUDIOZ Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-neutral-400 text-sm">Storage</p>
                <p className="text-white font-semibold">{storageInfo.used} / {storageInfo.limit}</p>
              </div>
              <div className="flex items-center gap-2">
                {session?.user?.image && (
                  <Image src={session.user.image} alt="Profile" width={40} height={40} className="rounded-full" />
                )}
                <span className="text-white hidden md:block">{session?.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
          </select>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            <FaUpload /> Upload
          </button>
        </div>

        {/* Files Grid */}
        {files.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-xl">No files uploaded yet</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Upload Your First File
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-indigo-500 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  {getFileIcon(file.type)}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowQRModal(file)}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition"
                    >
                      <FaQrcode />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2 truncate">{file.name}</h3>
                <p className="text-neutral-400 text-sm mb-1">Type: {file.type}</p>
                <p className="text-neutral-400 text-sm mb-1">Size: {file.size}</p>
                <p className="text-neutral-400 text-sm mb-3">Uploaded: {formatDate(file.uploadedAt)}</p>
                <div className="flex gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  >
                    <FaDownload /> View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-8 max-w-md w-full border-2 border-indigo-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Document QR Code
            </h2>
            <p className="text-neutral-400 text-sm text-center mb-6">AJ STUDIOZ Branded Verification</p>
            
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl shadow-xl">
                <div ref={qrModalRef} className="flex items-center justify-center" />
              </div>
            </div>
            
            <div className="bg-neutral-800/50 rounded-lg p-3 mb-4">
              <p className="text-neutral-400 text-xs text-center mb-1">Verification URL</p>
              <p className="text-white text-sm text-center break-all font-mono">{showQRModal.qrUrl}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showQRModal.qrUrl);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition font-semibold"
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => setShowQRModal(null)}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-semibold"
              >
                Close
              </button>
            </div>
            
            <p className="text-xs text-neutral-500 text-center mt-4">
              💎 Premium branded QR code with AJ STUDIOZ logo
            </p>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-2xl p-8 max-w-md w-full border border-neutral-800">
            <h2 className="text-2xl font-bold text-white mb-4">Upload File</h2>
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="w-full mb-4 text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleFileUpload}
                disabled={!uploadFile || uploadProgress}
                className={`flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg transition ${
                  !uploadFile || uploadProgress ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
              >
                {uploadProgress ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                }}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File ID Card Modal */}
      {uploadedFileData && (
        <FileIDCard
          file={uploadedFileData}
          onClose={() => setUploadedFileData(null)}
        />
      )}
    </div>
  );
}
