import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import connectDB from "../../libs/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await connectDB();

  try {
    const { fileId, newName } = req.body;

    if (!fileId || !newName) {
      return res.status(400).json({ message: "File ID and new name are required" });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const file = user.files.find(f => f.id === fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.name = newName;
    await user.save();

    return res.status(200).json({
      message: "File renamed successfully",
      file: file,
    });
  } catch (error) {
    console.error("Error renaming file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
