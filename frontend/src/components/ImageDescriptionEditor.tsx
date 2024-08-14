import { useState } from "react";

export default function ImageDescriptionEditor({
  initialDescriptions,
  onSubmit,
}: {
  initialDescriptions: string;
  onSubmit: (descriptions: string) => void;
}) {
  const [descriptions, setDescriptions] = useState(initialDescriptions);

  const handleSave = () => {
    onSubmit(descriptions);
  };

  return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md p-6 bg-[#000000] rounded-lg shadow-lg">
          <h2 className="text-xl font-thin mb-4 text-[#95e138]">
            Edit Image Descriptions
          </h2>
          <textarea
              value={descriptions}
              onChange={(e) => setDescriptions(e.target.value)}
              className="w-full bg-transparent p-2 text-[#95e138] border-b-[1px] border-[#95e138] focus:outline-none focus:ring-2 focus:ring-[#95e138]"
              placeholder="Enter image descriptions here..."
          />
          <button
              onClick={handleSave}
              className="w-full mt-4 py-3 px-4 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] rounded hover:bg-[#95e138] hover:text-black transition duration-300"
          >
            Save and Generate Images
          </button>
        </div>
      </div>
  );
}
