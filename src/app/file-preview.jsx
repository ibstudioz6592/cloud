"use client";
import { motion } from "framer-motion";
import { FaTimes, FaDownload, FaExpand } from "react-icons/fa";
import Image from "next/image";

export function FilePreview({ file, onClose }) {
  const isImage = file?.type?.startsWith('image/');
  const isPDF = file?.type === 'application/pdf';
  const isVideo = file?.type?.startsWith('video/');
  const isAudio = file?.type?.startsWith('audio/');

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-5xl h-[90vh] bg-neutral-900 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg truncate">{file.name}</h2>
            <p className="text-neutral-300 text-sm">{file.type} • {file.size}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={file.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              title="Download"
            >
              <FaDownload />
            </a>
            <button
              onClick={onClose}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="w-full h-full flex items-center justify-center p-4 pt-20">
          {isImage && (
            <div className="relative w-full h-full">
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          {isPDF && (
            <iframe
              src={file.url}
              className="w-full h-full rounded-lg"
              title={file.name}
            />
          )}

          {isVideo && (
            <video
              src={file.url}
              controls
              className="max-w-full max-h-full rounded-lg"
            >
              Your browser does not support video playback.
            </video>
          )}

          {isAudio && (
            <div className="w-full max-w-2xl">
              <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-xl p-8 border border-red-500/30">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-white text-xl font-bold mb-2">{file.name}</h3>
                </div>
                <audio
                  src={file.url}
                  controls
                  className="w-full"
                >
                  Your browser does not support audio playback.
                </audio>
              </div>
            </div>
          )}

          {!isImage && !isPDF && !isVideo && !isAudio && (
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-white text-xl mb-2">Preview not available</p>
              <p className="text-neutral-400 mb-6">This file type cannot be previewed</p>
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                <FaDownload />
                Download File
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
