"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaDownload, FaCopy, FaTimes, FaQrcode, FaFileAlt, FaCalendar, FaDatabase, FaShieldAlt, FaStar } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import Image from "next/image";

// File format SVG icons
const FileFormatIcon = ({ type }) => {
  const iconMap = {
    'PDF': '📄', 'DOC': '📝', 'DOCX': '📝', 'XLS': '📊', 'XLSX': '📊',
    'PPT': '📽️', 'PPTX': '📽️', 'TXT': '📃', 'ZIP': '🗜️', 'RAR': '🗜️',
    'MP4': '🎬', 'AVI': '🎬', 'MP3': '🎵', 'WAV': '🎵',
  };
  const emoji = iconMap[type.toUpperCase()] || '📁';
  return (
    <div className="w-20 h-20 flex items-center justify-center text-4xl bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg">
      {emoji}
    </div>
  );
};

export function CompactIDCard({ file, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('qr');
  const qrRef = useRef(null);
  const qrCodeInstance = useRef(null);

  // Auto-extract file info
  const fileName = file?.name || file?.fileName || 'Untitled';
  const fileExtension = fileName.split('.').pop().toUpperCase();
  const fileTitle = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  const isImage = file?.type?.startsWith('image/') || ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG'].includes(fileExtension);

  useEffect(() => {
    if (!file?.qrUrl || !qrRef.current) return;

    qrCodeInstance.current = new QRCodeStyling({
      width: 200,
      height: 200,
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
        margin: 5,
        imageSize: 0.35,
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

  const handleDownloadQR = (format) => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({
        name: `${file.name}-qr`,
        extension: format,
      });
    }
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

  const getFileIcon = () => {
    switch (file.type?.toUpperCase()) {
      case 'PDF': return '📄';
      case 'DOC': return '📝';
      case 'XLS': return '📊';
      case 'IMAGE': return '🖼️';
      case 'ZIP': return '📦';
      case 'VIDEO': return '🎥';
      case 'AUDIO': return '🎵';
      default: return '📁';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full transition shadow-lg transform hover:scale-110"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          {/* Compact ID Card */}
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-red-500/30">
            {/* Header with Brand Colors */}
            <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-4">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getFileIcon()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-400 text-sm" />
                      <span className="text-white font-bold text-xs truncate">{fileTitle}</span>
                    </div>
                    <p className="text-red-100 text-xs">{fileExtension} • AJ STUDIOZ</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/30 flex-shrink-0">
                  <p className="text-white font-mono text-xs font-bold">#{file.id?.slice(0, 8)}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-neutral-800/50 border-b border-neutral-700">
              <button
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  activeTab === 'qr'
                    ? 'text-white bg-neutral-800 border-b-2 border-red-500'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FaQrcode className="inline mr-2" />
                QR Code
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  activeTab === 'details'
                    ? 'text-white bg-neutral-800 border-b-2 border-red-600'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FaFileAlt className="inline mr-2" />
                Details
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4">
              {activeTab === 'qr' ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* QR Code Display */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-75 blur"></div>
                      <div className="relative bg-white p-3 rounded-xl">
                        <div ref={qrRef} className="flex items-center justify-center" />
                      </div>
                    </div>
                  </div>

                  {/* File Name */}
                  <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                    <p className="text-xs text-neutral-400 mb-1">File Name</p>
                    <p className="text-white text-sm font-semibold truncate">{file.name}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-neutral-800/30 rounded-lg p-2 border border-neutral-700 text-center">
                      <p className="text-indigo-400 text-xs">Type</p>
                      <p className="text-white text-sm font-bold">{file.type}</p>
                    </div>
                    <div className="bg-neutral-800/30 rounded-lg p-2 border border-neutral-700 text-center">
                      <p className="text-purple-400 text-xs">Size</p>
                      <p className="text-white text-sm font-bold">{file.size}</p>
                    </div>
                    <div className="bg-neutral-800/30 rounded-lg p-2 border border-neutral-700 text-center">
                      <p className="text-pink-400 text-xs">Status</p>
                      <p className="text-green-400 text-sm font-bold">✓ Safe</p>
                    </div>
                  </div>

                  {/* Download QR Options */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadQR('png')}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      PNG
                    </button>
                    <button
                      onClick={() => handleDownloadQR('svg')}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      SVG
                    </button>
                    <button
                      onClick={() => handleDownloadQR('jpeg')}
                      className="flex-1 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      JPEG
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  {/* File Preview/Icon */}
                  <div className="flex justify-center mb-3">
                    {isImage && file.url ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden bg-neutral-900 border-2 border-neutral-700">
                        <Image 
                          src={file.url} 
                          alt={fileTitle}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <FileFormatIcon type={fileExtension} />
                    )}
                  </div>

                  {/* File Title */}
                  <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-lg p-3 border border-red-500/30">
                    <p className="text-xs text-red-300 mb-1">File Name</p>
                    <p className="text-white text-sm font-semibold">{fileTitle}</p>
                    <p className="text-red-200 text-xs mt-1">{fileExtension} Format</p>
                  </div>

                  {/* Detailed Information */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <FaCalendar className="text-red-400" />
                      <span className="text-neutral-400 text-xs">Uploaded:</span>
                      <span className="font-mono text-xs">{formatDate(file.uploadedAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white text-sm">
                      <FaDatabase className="text-red-400" />
                      <span className="text-neutral-400 text-xs">Storage:</span>
                      <span className="font-mono text-xs">{file.size}</span>
                    </div>

                    <div className="flex items-center gap-2 text-white text-sm">
                      <FaShieldAlt className="text-green-400" />
                      <span className="text-neutral-400 text-xs">Security:</span>
                      <span className="text-xs">End-to-end encrypted</span>
                    </div>

                    <div className="flex items-center gap-2 text-white text-sm">
                      <FaStar className="text-yellow-400" />
                      <span className="text-neutral-400 text-xs">Access:</span>
                      <span className="text-xs capitalize">{file.access || 'Private'}</span>
                    </div>
                  </div>

                  {/* Verification URL */}
                  <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                    <p className="text-xs text-neutral-400 mb-2">Verification URL</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={file.qrUrl}
                        readOnly
                        className="flex-1 bg-neutral-900 text-white text-xs px-3 py-2 rounded border border-neutral-700 font-mono"
                      />
                      <button
                        onClick={() => handleCopy(file.qrUrl)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                      >
                        {copied ? '✓' : <FaCopy />}
                      </button>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 text-xs font-semibold mb-2">🔒 Security Features</p>
                    <ul className="text-xs text-green-300/80 space-y-1">
                      <li>✓ 256-bit AES encryption</li>
                      <li>✓ Unique verification code</li>
                      <li>✓ Tamper-proof storage</li>
                      <li>✓ Blockchain-ready hash</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-neutral-800/30 border-t border-neutral-700 p-4 flex gap-2">
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition text-sm"
              >
                <FaDownload /> Download
              </a>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
