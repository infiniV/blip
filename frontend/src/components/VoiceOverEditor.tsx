import React, { useEffect } from "react";

interface VoiceOverEditorProps {
  initialText: string;
  currentText: string;
  onTextChange: (text: string) => void;
  onImageSubmit: (text: string) => void;
  onVoiceOverSubmit: (text: string) => void;
  canGenerateImages: boolean; // New prop to control button visibility
}

export default function VoiceOverEditor({
  initialText,
  currentText,
  onTextChange,
  onImageSubmit,
  onVoiceOverSubmit,
  canGenerateImages,
}: VoiceOverEditorProps) {
  useEffect(() => {
    if (currentText === "" && initialText !== "") {
      onTextChange(initialText);
    }
  }, [currentText, initialText, onTextChange]);

  const handleSaveImage = () => {
    onImageSubmit(currentText);
  };

  const handleSaveVoiceOver = () => {
    onVoiceOverSubmit(currentText);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-[#000000] rounded-lg shadow-lg">
        <h2 className="text-xl font-thin mb-4 text-[#95e138]">
          Edit Voice Over
        </h2>
        <textarea
          value={currentText}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full bg-transparent p-2 text-[#95e138] border-b-[1px] border-[#95e138] focus:outline-none focus:ring-2 focus:ring-[#95e138]"
          placeholder=""
        />
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSaveVoiceOver}
            className="w-full py-3 px-4 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] rounded hover:bg-[#95e138] hover:text-black transition duration-300"
          >
            Generate Voice-Over
          </button>
          {canGenerateImages && ( // Conditionally render the button
            <button
              onClick={handleSaveImage}
              className="w-full py-3 px-4 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] rounded hover:bg-[#95e138] hover:text-black transition duration-300"
            >
              Generate Image Descriptions
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
