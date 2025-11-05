import connectDB from "../../../libs/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Document ID is required" });
  }

  await connectDB();

  try {
    const user = await User.findOne({ "files.id": id });

    if (!user) {
      return res.status(404).json({ message: "Document not found" });
    }

    const file = user.files.find(f => f.id === id);

    if (!file) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if file has public access
    if (file.access !== 'public') {
      return res.status(403).json({ message: "This document is private" });
    }

    // Check expiry
    if (file.expiresAt && new Date(file.expiresAt) < new Date()) {
      return res.status(410).json({ message: "This document has expired" });
    }

    return res.status(200).json({
      file: file,
      owner: {
        name: user.name,
      }
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
