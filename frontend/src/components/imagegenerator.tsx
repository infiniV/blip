import React, { useState } from "react";
import { motion } from "framer-motion";
import Spinner from "./Spinner";

interface Image {
  id: number;
  description: string;
  data: string;
}

export default function ImageGenerator({
  onSubmit,
}: {
  onSubmit: (images: Image[]) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Image[]>([]);
  const [showEditor, setShowEditor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate_images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images_guide: prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate images");
      }

      const data = await response.json();
      setGeneratedImages(data.images);
      setShowEditor(true);
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onSubmit(generatedImages);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      {!showEditor ? (
        <motion.div
          className="w-full max-w-md p-6 bg-[#000000] rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-thin mb-4 text-[#95e138]">
            Generate Images
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent p-1 text-[#95e138] border-b-[1px] border-[#95e138] focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-[#95e138]"
              placeholder="Enter image description..."
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] rounded hover:bg-[#95e138] hover:text-black transition duration-300"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Generate Images
            </motion.button>
          </form>
        </motion.div>
      ) : (
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-thin mb-4 text-[#95e138]">
            Generated Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                className="bg-[#000000] border border-[#95e138] rounded-lg p-2"
              >
                <img
                  src={image.data}
                  alt={`Generated Image ${image.id}: ${image.description}`}
                  className="w-full h-auto object-cover rounded"
                />
                <textarea
                  value={image.description}
                  onChange={(e) => {
                    const updatedImages = generatedImages.map((img) =>
                      img.id === image.id ? { ...img, description: e.target.value } : img
                    );
                    setGeneratedImages(updatedImages);
                  }}
                  className="w-full mt-2 bg-transparent p-1 text-[#95e138] border-b-[1px] border-[#95e138] focus:outline-none focus:ring-2 focus:ring-[#95e138]"
                  placeholder="Edit image description..."
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="w-full mt-4 py-3 px-4 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] rounded hover:bg-[#95e138] hover:text-black transition duration-300"
          >
            Save and Use Generated Images
          </button>
        </div>
      )}
    </div>
  );
}