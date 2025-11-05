"use client";
import { motion } from "framer-motion";
import { FaCheckCircle, FaDownload, FaCopy, FaTimes, FaQrcode } from "react-icons/fa";
import { useState } from "react";

export function FileIDCard({ file, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow-lg"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* ID Card */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-500/30">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  File Uploaded Successfully!
                </h2>
                <p className="text-indigo-100 mt-1">Document verified and secured</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <p className="text-xs text-white/70">Document ID</p>
                <p className="text-white font-mono font-bold">{file.id}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: QR Code */}
              <div className="flex flex-col items-center justify-center bg-white rounded-xl p-6 shadow-inner">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.qrCode}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <div className="flex items-center gap-2 text-indigo-600">
                  <FaQrcode className="text-2xl" />
                  <span className="font-semibold">Scan to Verify</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2 text-center">
                  Instant verification with any QR scanner
                </p>
              </div>

              {/* Right: File Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 border-b border-neutral-700 pb-2">
                    Document Details
                  </h3>
                </div>

                {/* File Name */}
                <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
                  <p className="text-xs text-neutral-400 mb-1">File Name</p>
                  <p className="text-white font-semibold break-all">{file.name}</p>
                </div>

                {/* File Type & Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
                    <p className="text-xs text-neutral-400 mb-1">Type</p>
                    <p className="text-white font-semibold">{file.type}</p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
                    <p className="text-xs text-neutral-400 mb-1">Size</p>
                    <p className="text-white font-semibold">{file.size}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg p-4 border border-indigo-500/30">
                  <p className="text-xs text-indigo-300 mb-1">Upload Timestamp</p>
                  <p className="text-white font-mono text-sm">{formatDate(file.uploadedAt)}</p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                  <FaCheckCircle className="text-green-400 text-xl" />
                  <div>
                    <p className="text-green-400 font-semibold">Verified & Secured</p>
                    <p className="text-xs text-green-300/70">Document encryption enabled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification URL */}
            <div className="mt-6 bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-400">Verification URL</p>
                <button
                  onClick={() => handleCopy(file.qrUrl)}
                  className="flex items-center gap-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition"
                >
                  <FaCopy /> {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-white font-mono text-sm break-all bg-neutral-900 p-3 rounded">
                {file.qrUrl}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition shadow-lg transform hover:scale-105"
              >
                <FaDownload /> Download File
              </a>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition shadow-lg transform hover:scale-105"
              >
                View in Dashboard
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm text-center">
                <strong>🔒 Security Note:</strong> This document is stored securely with end-to-end encryption. 
                Share the QR code or verification link only with trusted parties.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
