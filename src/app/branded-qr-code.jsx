"use client";
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export function BrandedQRCode({ data, size = 300, downloadName = "qr-code" }) {
  const qrRef = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Create styled QR code with AJ STUDIOZ branding
    qrCodeRef.current = new QRCodeStyling({
      width: size,
      height: size,
      type: "canvas",
      data: data,
      image: "/logo.png", // We'll create this
      dotsOptions: {
        color: "#6366f1", // Indigo-500
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        color: "#a855f7", // Purple-500
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#ec4899", // Pink-500
        type: "dot",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 8,
        imageSize: 0.4,
      },
      qrOptions: {
        errorCorrectionLevel: "H", // High error correction for logo
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCodeRef.current.append(qrRef.current);
    }
  }, [data, size]);

  const handleDownload = (extension) => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({
        name: downloadName,
        extension: extension,
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        ref={qrRef} 
        className="bg-white p-4 rounded-xl shadow-2xl border-4 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      />
      <div className="flex gap-2">
        <button
          onClick={() => handleDownload("png")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition"
        >
          Download PNG
        </button>
        <button
          onClick={() => handleDownload("svg")}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}
