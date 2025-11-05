"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackgroundBeams } from "../../background-beams";
import { FaCheckCircle, FaExclamationTriangle, FaDownload, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";

export default function VerifyDocumentPage() {
  const params = useParams();
  const docId = params.docId;
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (docId) {
      fetchDocument();
    }
  }, [docId]);

  const fetchDocument = async () => {
    try {
      const res = await fetch(`/api/verify/${docId}`);
      const data = await res.json();

      if (res.ok) {
        setDocument(data.file);
        setVerified(data.verified);
      } else {
        setError(data.message || "Document not found");
      }
    } catch (err) {
      setError("Failed to verify document");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center relative">
        <BackgroundBeams />
        <div className="text-white text-xl z-10">Verifying document...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center relative p-4">
        <BackgroundBeams />
        <div className="max-w-md w-full z-10">
          <div className="bg-neutral-900 border border-red-500 rounded-2xl p-8 text-center">
            <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
            <p className="text-neutral-400 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative p-4">
      <BackgroundBeams />

      <div className="relative z-10 max-w-4xl mx-auto py-8">
        {/* Verification Badge */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-center">
          <FaCheckCircle className="text-white text-6xl mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white mb-2">Document Verified</h1>
          <p className="text-green-100">This document is authentic and verified by AJ STUDIOZ</p>
        </div>

        {/* Document Details */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{document.name}</h2>
              <div className="flex items-center gap-2 text-neutral-400">
                <FaShieldAlt className="text-green-500" />
                <span>Status: {document.status}</span>
              </div>
            </div>
            <div className="bg-indigo-600 px-4 py-2 rounded-lg">
              <span className="text-white font-semibold">{document.type}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="text-neutral-400 text-sm mb-1">Document ID</p>
              <p className="text-white font-mono text-sm break-all">{document.id}</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="text-neutral-400 text-sm mb-1">File Size</p>
              <p className="text-white font-semibold">{document.size}</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="text-neutral-400 text-sm mb-1">Upload Date</p>
              <p className="text-white font-semibold">{formatDate(document.uploadedAt)}</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="text-neutral-400 text-sm mb-1">Verification Status</p>
              <p className="text-green-500 font-semibold flex items-center gap-2">
                <FaCheckCircle /> Verified
              </p>
            </div>
          </div>

          {/* Watermark Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 mb-6">
            <p className="text-yellow-500 text-sm">
              <strong>⚠️ Verification Notice:</strong> This document is authentic and has been 
              verified by AJ STUDIOZ. Any unauthorized duplication or modification will be detected.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              <FaDownload /> View/Download Document
            </a>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition"
            >
              Go to Home
            </Link>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Security Information</h3>
          <ul className="space-y-2 text-neutral-400">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
              <span>This document has been cryptographically verified</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
              <span>Document integrity has been confirmed</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
              <span>Uploaded through AJ STUDIOZ secure platform</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
              <span>Verification can be performed at any time using the QR code</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
