import { IncomingForm } from "formidable";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import cloudinary from "../../libs/cloudinary";
import connectDB from "../../libs/mongodb";
import User from "../../models/User";
import File from "../../models/mongo"; // Keep for guest uploads
import fs from "fs";
import { pipeline } from "stream";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

const getFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const typeMap = {
    '.pdf': 'PDF',
    '.doc': 'DOC',
    '.docx': 'DOC',
    '.xls': 'XLS',
    '.xlsx': 'XLS',
    '.ppt': 'PPT',
    '.pptx': 'PPT',
    '.jpg': 'Image',
    '.jpeg': 'Image',
    '.png': 'Image',
    '.gif': 'Image',
    '.svg': 'Image',
    '.zip': 'ZIP',
    '.rar': 'ZIP',
    '.txt': 'TXT',
    '.csv': 'CSV',
  };
  return typeMap[ext] || 'File';
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  // Check if user is authenticated (optional)
  const session = await getServerSession(req, res, authOptions);
  const isAuthenticated = !!session?.user;

  const form = new IncomingForm({ maxFileSize: 100 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(400).json({ message: "Error parsing form", error: err.message });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const access = fields.access?.[0] || fields.access || 'private';
    const folder = fields.folder?.[0] || fields.folder || 'root';
    const tags = fields.tags ? JSON.parse(fields.tags[0] || fields.tags) : [];

    if (!file || !file.filepath) {
      return res.status(400).json({ message: "File upload failed. Filepath is missing." });
    }

    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          timeout: 120000,
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: error.message });
          }

          const fileId = nanoid(12);
          const fileUrl = result.secure_url;
          const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:3000`;
          const verifyUrl = `${baseUrl}/verify/${fileId}`;

          // Generate QR code
          let qrCodeDataUrl = null;
          try {
            qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
              width: 300,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
          } catch (qrError) {
            console.error("QR generation error:", qrError);
          }

          const fileMetadata = {
            id: fileId,
            name: file.originalFilename || "untitled",
            url: fileUrl,
            publicId: result.public_id,
            type: getFileType(file.originalFilename),
            size: formatFileSize(file.size),
            uploadedAt: new Date(),
            qrUrl: verifyUrl,
            qrCode: qrCodeDataUrl,
            access: access,
            status: 'verified',
            folder: folder,
            tags: tags,
          };

          // If authenticated, save to user's files array
          if (isAuthenticated) {
            try {
              const user = await User.findOne({ email: session.user.email });
              
              if (!user) {
                return res.status(404).json({ message: "User not found" });
              }

              // Add file to user's files array
              user.files.push(fileMetadata);
              
              // Update storage used
              user.storageUsed = (user.storageUsed || 0) + file.size;
              
              await user.save();

              return res.status(200).json({
                message: "File uploaded successfully",
                file: fileMetadata,
                storageUsed: formatFileSize(user.storageUsed),
                authenticated: true,
              });
            } catch (dbError) {
              console.error("MongoDB save error:", dbError);
              return res.status(500).json({ message: "Error saving file to user account" });
            }
          } else {
            // Guest upload - save to temporary File collection (24-hour expiry)
            try {
              const fileRecord = new File({
                url: fileUrl,
                public_id: result.public_id,
              });
              await fileRecord.save();

              return res.status(200).json({
                message: "File uploaded (expires in 24 hours)",
                url: fileUrl,
                authenticated: false,
              });
            } catch (dbError) {
              console.error("MongoDB save error:", dbError);
              return res.status(500).json({ message: "Error saving file info" });
            }
          }
        }
      );

      const fileStream = fs.createReadStream(file.filepath);
      pipeline(fileStream, stream, (err) => {
        if (err) {
          console.error("Error in file upload pipeline:", err);
          return res.status(500).json({ message: "Error in file upload pipeline" });
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: error.message });
    }
  });
}
