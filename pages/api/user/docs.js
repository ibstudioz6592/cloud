import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../libs/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await connectDB();

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { search, folder, sortBy } = req.query;

    let files = user.files;

    // Filter by folder
    if (folder && folder !== 'all') {
      files = files.filter(file => file.folder === folder);
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      files = files.filter(file => 
        file.name.toLowerCase().includes(searchLower) ||
        file.type.toLowerCase().includes(searchLower) ||
        (file.tags && file.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Sort files
    if (sortBy === 'name') {
      files.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'date') {
      files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    } else if (sortBy === 'type') {
      files.sort((a, b) => a.type.localeCompare(b.type));
    }

    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
      if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    };

    return res.status(200).json({
      files: files,
      totalFiles: files.length,
      storageUsed: formatFileSize(user.storageUsed || 0),
      storageLimit: formatFileSize(user.storageLimit || 5368709120),
      folders: user.folders || [],
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      }
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
