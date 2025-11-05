"use client";
import { motion } from "framer-motion";
import { FaTimes, FaChartPie, FaImage, FaFileAlt, FaVideo, FaMusic, FaArchive } from "react-icons/fa";

export function StorageAnalytics({ files, storageLimit, onClose }) {
  const calculateCategoryStats = () => {
    const stats = {
      images: { count: 0, size: 0, icon: FaImage, color: 'bg-blue-500' },
      documents: { count: 0, size: 0, icon: FaFileAlt, color: 'bg-green-500' },
      videos: { count: 0, size: 0, icon: FaVideo, color: 'bg-purple-500' },
      audio: { count: 0, size: 0, icon: FaMusic, color: 'bg-pink-500' },
      archives: { count: 0, size: 0, icon: FaArchive, color: 'bg-yellow-500' },
      others: { count: 0, size: 0, icon: FaFileAlt, color: 'bg-neutral-500' },
    };

    files.forEach(file => {
      const sizeInBytes = parseSizeToBytes(file.size);
      
      if (file.type?.startsWith('image/')) {
        stats.images.count++;
        stats.images.size += sizeInBytes;
      } else if (file.type?.includes('pdf') || file.type?.includes('document') || file.type?.includes('text')) {
        stats.documents.count++;
        stats.documents.size += sizeInBytes;
      } else if (file.type?.startsWith('video/')) {
        stats.videos.count++;
        stats.videos.size += sizeInBytes;
      } else if (file.type?.startsWith('audio/')) {
        stats.audio.count++;
        stats.audio.size += sizeInBytes;
      } else if (file.type?.includes('zip') || file.type?.includes('rar')) {
        stats.archives.count++;
        stats.archives.size += sizeInBytes;
      } else {
        stats.others.count++;
        stats.others.size += sizeInBytes;
      }
    });

    return stats;
  };

  const parseSizeToBytes = (sizeStr) => {
    if (!sizeStr) return 0;
    const match = sizeStr.match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    const multipliers = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
    return value * (multipliers[unit] || 1);
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes.toFixed(0) + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const stats = calculateCategoryStats();
  const totalSize = Object.values(stats).reduce((acc, cat) => acc + cat.size, 0);
  const limitInBytes = parseSizeToBytes(storageLimit || '5 GB');
  const usagePercent = ((totalSize / limitInBytes) * 100).toFixed(1);

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
            <FaChartPie className="text-white text-2xl" />
            <h2 className="text-xl font-bold text-white">Storage Analytics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
          >
            <FaTimes className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Usage */}
          <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-neutral-300 text-sm">Total Storage Used</p>
              <p className="text-white font-bold">{formatBytes(totalSize)} / {storageLimit || '5 GB'}</p>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  usagePercent > 90 ? 'bg-red-500' :
                  usagePercent > 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
              />
            </div>
            <p className="text-neutral-400 text-xs mt-1">{usagePercent}% used</p>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="text-white font-bold mb-3">Category Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(stats).map(([key, data]) => {
                if (data.count === 0) return null;
                const Icon = data.icon;
                const percent = ((data.size / totalSize) * 100).toFixed(1);
                
                return (
                  <div
                    key={key}
                    className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`text-lg ${data.color.replace('bg-', 'text-')}`} />
                        <span className="text-white font-medium capitalize">{key}</span>
                        <span className="text-neutral-400 text-sm">({data.count} files)</span>
                      </div>
                      <p className="text-white text-sm font-semibold">{formatBytes(data.size)}</p>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full rounded-full ${data.color}`}
                      />
                    </div>
                    <p className="text-neutral-400 text-xs mt-1">{percent}% of total</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-lg p-4 border border-blue-500/30 text-center">
              <p className="text-blue-300 text-xs mb-1">Total Files</p>
              <p className="text-white text-2xl font-bold">{files.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-lg p-4 border border-green-500/30 text-center">
              <p className="text-green-300 text-xs mb-1">Available</p>
              <p className="text-white text-2xl font-bold">{formatBytes(limitInBytes - totalSize)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-lg p-4 border border-purple-500/30 text-center">
              <p className="text-purple-300 text-xs mb-1">Usage</p>
              <p className="text-white text-2xl font-bold">{usagePercent}%</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-800/50 border-t border-neutral-700 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
