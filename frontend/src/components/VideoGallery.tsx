import { useState, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer"; // Adjust import path as necessary

interface VideoGalleryProps {
  onClose: () => void;
}

const VideoGallery = ({ onClose }: VideoGalleryProps) => {
  // Direct URL to the video file in the public directory
  const videoSrc = "/final_video_with_subs.mp4";
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading state if needed
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust timing as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-[#000000] p-4 rounded-lg w-3/4 h-3/4 overflow-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
      >
        Close
      </button>
      <h2 className="text-xl font-thin mb-4 text-[#95e138]">
        Video Gallery
      </h2>

      {loading ? (
        <div className="text-center text-[#95e138]">Loading...</div>
      ) : (
        <div className="flex justify-center">
          {videoSrc ? (
            <VideoPlayer videoSrc={videoSrc} />
          ) : (
            <div className="text-center text-[#95e138]">No video available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
