"use client";
import { motion } from "framer-motion";
import { FaCheckCircle, FaDownload, FaCopy, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import Image from "next/image";

// File format SVG icons
const FileFormatIcon = ({ type }) => {
  const iconMap = {
    'PDF': '📄',
    'DOC': '📝',
    'DOCX': '📝',
    'XLS': '📊',
    'XLSX': '📊',
    'PPT': '📽️',
    'PPTX': '📽️',
    'TXT': '📃',
    'ZIP': '🗜️',
    'RAR': '🗜️',
    'MP4': '🎬',
    'AVI': '🎬',
    'MP3': '🎵',
    'WAV': '🎵',
  };
  
  const emoji = iconMap[type.toUpperCase()] || '📁';
  
  return (
    <div className="w-32 h-32 flex items-center justify-center text-6xl bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl">
      {emoji}
    </div>
  );
};

export function FileIDCard({ file, onClose }) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  const qrCodeInstance = useRef(null);

  // Auto-extract file name without extension and file type
  const fileName = file?.name || file?.fileName || 'Untitled';
  const fileExtension = fileName.split('.').pop().toUpperCase();
  const fileTitle = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  const isImage = file?.type?.startsWith('image/') || ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG'].includes(fileExtension);

  useEffect(() => {
    if (!file?.qrUrl || !qrRef.current) return;

    // Create branded QR code with AJ STUDIOZ styling (red gradient)
    qrCodeInstance.current = new QRCodeStyling({
      width: 180,
      height: 180,
      type: "canvas",
      data: file.qrUrl,
      image: "/logo.svg",
      dotsOptions: {
        color: "#FF0000", // Red
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        color: "#CC0000", // Darker red
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#990000", // Dark red
        type: "dot",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 4,
        imageSize: 0.3,
      },
      qrOptions: {
        errorCorrectionLevel: "H",
      },
    });

    qrRef.current.innerHTML = "";
    qrCodeInstance.current.append(qrRef.current);

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = "";
      }
    };
  }, [file]);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="relative w-full max-w-md my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow-lg"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* ID Card */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-red-500/30">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-4">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
            <div className="relative flex items-center gap-3">
              <FaCheckCircle className="text-white text-3xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">{fileTitle}</h2>
                <p className="text-red-100 text-sm">{fileExtension} • {formatFileSize(file.size || 0)}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-4">
            {/* File Preview/Icon and QR Code Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* File Preview/Icon */}
              <div className="flex flex-col items-center justify-center bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
                {isImage && file.url ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-neutral-900">
                    <Image 
                      src={file.url} 
                      alt={fileTitle}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <FileFormatIcon type={fileExtension} />
                )}
                <p className="text-neutral-400 text-xs mt-2">{fileExtension} File</p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center bg-white rounded-xl p-3">
                <div ref={qrRef} className="flex items-center justify-center" />
                <p className="text-neutral-600 text-xs mt-2">Scan to Verify</p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-lg p-3 border border-red-500/30">
              <p className="text-xs text-red-300 mb-1">Upload Timestamp</p>
              <p className="text-white font-mono text-sm">{formatDate(file.uploadedAt)}</p>
            </div>

            {/* Document ID */}
            <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
              <p className="text-xs text-neutral-400 mb-1">Document ID</p>
              <p className="text-white font-mono text-sm break-all">{file.id}</p>
            </div>

            {/* Verification URL */}
            <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-neutral-400">Verification URL</p>
                <button
                  onClick={() => handleCopy(file.qrUrl)}
                  className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                >
                  <FaCopy /> {copied ? "✓" : "Copy"}
                </button>
              </div>
              <p className="text-white font-mono text-xs break-all bg-neutral-900 p-2 rounded">
                {file.qrUrl}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg transition"
              >
                <FaDownload /> Download
              </a>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/50 rounded-lg p-2.5">
              <FaCheckCircle className="text-green-400 text-lg flex-shrink-0" />
              <p className="text-green-400 text-sm font-semibold">Verified & Secured by AJ STUDIOZ</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
