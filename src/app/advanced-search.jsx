"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSearch, FaCalendar, FaDatabase, FaFilter } from "react-icons/fa";
import { useState } from "react";

export function AdvancedSearch({ onClose, onSearch }) {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    minSize: '',
    maxSize: '',
    fileTypes: [],
  });

  const fileTypeOptions = [
    { value: 'image', label: '🖼️ Images', types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] },
    { value: 'document', label: '📄 Documents', types: ['application/pdf', 'application/msword', 'text/plain'] },
    { value: 'video', label: '🎬 Videos', types: ['video/mp4', 'video/avi', 'video/mov'] },
    { value: 'audio', label: '🎵 Audio', types: ['audio/mpeg', 'audio/wav', 'audio/ogg'] },
    { value: 'archive', label: '🗜️ Archives', types: ['application/zip', 'application/x-rar'] },
  ];

  const handleTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(type)
        ? prev.fileTypes.filter(t => t !== type)
        : [...prev.fileTypes, type]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      minSize: '',
      maxSize: '',
      fileTypes: [],
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaFilter className="text-white text-xl" />
              <h2 className="text-xl font-bold text-white">Advanced Search</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
            >
              <FaTimes className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-neutral-300 font-semibold">
                <FaCalendar className="text-red-400" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* File Size Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-neutral-300 font-semibold">
                <FaDatabase className="text-red-400" />
                File Size (MB)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400">Min Size</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minSize}
                    onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Max Size</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={filters.maxSize}
                    onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* File Types */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-300 font-semibold">File Types</label>
              <div className="grid grid-cols-2 gap-2">
                {fileTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTypeToggle(option.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      filters.fileTypes.includes(option.value)
                        ? 'bg-red-600 text-white border-2 border-red-400'
                        : 'bg-neutral-800 text-neutral-300 border-2 border-neutral-700 hover:border-red-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-neutral-800/50 border-t border-neutral-700 p-4 flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition"
            >
              Reset
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition"
            >
              <FaSearch />
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
