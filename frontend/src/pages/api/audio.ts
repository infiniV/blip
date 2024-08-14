import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const audioPath = path.join(process.cwd(), "public", "voice_over.wav"); // Ensure this path is correct
    if (!fs.existsSync(audioPath)) {
      res.status(404).json({ error: "Audio not found" });
      return;
    }

    const stat = fs.statSync(audioPath);
    res.writeHead(200, {
      "Content-Type": "audio/wav", // Ensure this matches the file format
      "Content-Length": stat.size,
    });

    const readStream = fs.createReadStream(audioPath);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error serving audio:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
