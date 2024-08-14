/* eslint-disable @next/next/no-img-element */
import React from "react";

interface Image {
  id: number;
  description: string;
  data: string;
}

export default function GeneratedImages({ images }: { images: Image[] }) {
  return (

      <div className="pt-20 p-4 mb-10 justify-center items-center h-screen">
          <h2 className="text-xl font-thin mb-4 text-[#95e138]">
              Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                  <div
                      key={image.id}
                      className="bg-[#000000] border border-[#95e138] rounded-lg p-2"
                  >
                      <img
                          src={image.data} // The base64 data is used directly as the image source
                          alt={`Generated Image ${image.id}: ${image.description}`}
                          className="w-full h-auto object-cover rounded"
                      />
                      <p className="mt-2 text-sm text-[#95e138]">{image.description}</p>
                  </div>
              ))}
          </div>
      </div>
  );
}
