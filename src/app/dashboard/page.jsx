"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "../background-beams";
import { FileIDCard } from "../file-id-card";
import { CompactIDCard } from "../compact-id-card";
import { AdvancedSearch } from "../advanced-search";
import { BulkUpload } from "../bulk-upload";
import { FilePreview } from "../file-preview";
import { StorageAnalytics } from "../storage-analytics";
import { 
  FaSearch, FaUpload, FaDownload, FaTrash, FaQrcode, 
  FaFolder, FaFile, FaSignOutAlt, FaFilter, FaEdit,
  FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileArchive,
  FaFileVideo, FaFileAudio, FaFileCode, FaList, FaTh, FaCloudUploadAlt,
  FaChartPie, FaEye
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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [fileCategory, setFileCategory] = useState('all'); // 'all', 'documents', 'images', 'videos', 'audio', 'archives'
  const [showCompactCard, setShowCompactCard] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(null);
  const [showStorageAnalytics, setShowStorageAnalytics] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(null);

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
      case "VIDEO": return <FaFileVideo className="text-pink-500 text-2xl" />;
      case "AUDIO": return <FaFileAudio className="text-indigo-500 text-2xl" />;
      case "CODE": return <FaFileCode className="text-cyan-500 text-2xl" />;
      default: return <FaFile className="text-gray-500 text-2xl" />;
    }
  };

  const getFileCategory = (type) => {
    const upperType = type.toUpperCase();
    if (['PDF', 'DOC', 'TXT', 'CSV'].includes(upperType)) return 'documents';
    if (['IMAGE', 'PNG', 'JPG', 'JPEG', 'GIF', 'SVG'].includes(upperType)) return 'images';
    if (['VIDEO', 'MP4', 'AVI', 'MOV'].includes(upperType)) return 'videos';
    if (['AUDIO', 'MP3', 'WAV'].includes(upperType)) return 'audio';
    if (['ZIP', 'RAR', '7Z'].includes(upperType)) return 'archives';
    return 'other';
  };

  const filteredFiles = files.filter(file => {
    if (fileCategory === 'all') return true;
    return getFileCategory(file.type) === fileCategory;
  });

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
        {/* Advanced Action Bar */}
        <div className="mb-6 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition"
            >
              <FaUpload />
              <span className="hidden sm:inline">Upload File</span>
            </button>
            <button
              onClick={() => setShowBulkUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition"
            >
              <FaCloudUploadAlt />
              <span className="hidden sm:inline">Bulk Upload</span>
            </button>
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition"
            >
              <FaFilter />
              <span className="hidden sm:inline">Advanced Search</span>
            </button>
            <button
              onClick={() => setShowStorageAnalytics(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition"
            >
              <FaChartPie />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            <div className="flex-1"></div>
            <div className="text-neutral-400 text-sm">
              <span className="font-semibold text-white">{filteredFiles.length}</span> files
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">File Categories</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'All Files', icon: '📁', count: files.length },
              { key: 'documents', label: 'Documents', icon: '📄', count: files.filter(f => getFileCategory(f.type) === 'documents').length },
              { key: 'images', label: 'Images', icon: '🖼️', count: files.filter(f => getFileCategory(f.type) === 'images').length },
              { key: 'videos', label: 'Videos', icon: '🎥', count: files.filter(f => getFileCategory(f.type) === 'videos').length },
              { key: 'audio', label: 'Audio', icon: '🎵', count: files.filter(f => getFileCategory(f.type) === 'audio').length },
              { key: 'archives', label: 'Archives', icon: '📦', count: files.filter(f => getFileCategory(f.type) === 'archives').length },
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setFileCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  fileCategory === category.key
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-semibold">{category.label}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

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
        {filteredFiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-xl">
              {fileCategory === 'all' ? 'No files uploaded yet' : `No ${fileCategory} found`}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Upload Your First File
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-indigo-500 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  {getFileIcon(file.type)}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowFilePreview(file)}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      title="Preview"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => setShowCompactCard(file)}
                      className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                      title="QR Code"
                    >
                      <FaQrcode />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      title="Delete"
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

      {/* Compact ID Card */}
      {showCompactCard && (
        <CompactIDCard
          file={showCompactCard}
          onClose={() => setShowCompactCard(null)}
        />
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <AdvancedSearch
          onClose={() => setShowAdvancedSearch(false)}
          onSearch={(filters) => {
            setAdvancedFilters(filters);
            // You can implement advanced filtering logic here
          }}
        />
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <BulkUpload
          onClose={() => setShowBulkUpload(false)}
          onUploadComplete={() => {
            fetchFiles();
            setShowBulkUpload(false);
          }}
        />
      )}

      {/* File Preview Modal */}
      {showFilePreview && (
        <FilePreview
          file={showFilePreview}
          onClose={() => setShowFilePreview(null)}
        />
      )}

      {/* Storage Analytics Modal */}
      {showStorageAnalytics && (
        <StorageAnalytics
          files={files}
          storageLimit={storageInfo.limit}
          onClose={() => setShowStorageAnalytics(false)}
        />
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
