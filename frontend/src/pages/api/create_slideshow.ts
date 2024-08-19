import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Handle the POST request to trigger the slideshow creation
    try {
      // Make a request to the Python backend to create the slideshow
      const response = await fetch("http://127.0.0.1:5000/create_slideshow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`Failed to create slideshow: ${response.statusText}`);
      }

      // Assuming the Python script returns the video path in the response
      const data = await response.json();

      // Send the video path to the frontend
      res.status(200).json({ videoPath: "/api/video" });
    } catch (error) {
      console.error("Error creating slideshow:", error);
      res.status(500).json({ error: "Failed to create slideshow" });
    }
  } else if (req.method === "GET") {
    // Serve the generated video file
    const filePath = path.join(
      process.cwd(),
      "..",
      "..",
      "Backend",
      "scripts",
      "final_video_with_subs.mp4"
    );

    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=final_video_with_subs.mp4"
      );
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
