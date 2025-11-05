import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../libs/mongodb";
import User from "../../../models/User";
import cloudinary from "../../../libs/cloudinary";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "File ID is required" });
  }

  await connectDB();

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fileIndex = user.files.findIndex(file => file.id === id);

    if (fileIndex === -1) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = user.files[fileIndex];

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(file.publicId);
    } catch (cloudError) {
      console.error("Cloudinary delete error:", cloudError);
      // Continue even if Cloudinary delete fails
    }

    // Parse file size to calculate storage reduction
    const sizeMatch = file.size.match(/(\d+\.?\d*)\s*(B|KB|MB|GB)/);
    let sizeInBytes = 0;
    if (sizeMatch) {
      const value = parseFloat(sizeMatch[1]);
      const unit = sizeMatch[2];
      const multipliers = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 };
      sizeInBytes = value * (multipliers[unit] || 0);
    }

    // Remove file from array
    user.files.splice(fileIndex, 1);
    
    // Update storage used
    user.storageUsed = Math.max(0, (user.storageUsed || 0) - sizeInBytes);
    
    await user.save();

    return res.status(200).json({
      message: "File deleted successfully",
      fileId: id,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
