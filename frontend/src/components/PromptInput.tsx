// src/components/PromptInput.tsx

import { useState } from "react";
import { motion } from "framer-motion";

export default function PromptInput({
  onSubmit,
}: {
  onSubmit: (prompt: string) => void;
}) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        className="w-full max-w-md p-6 bg-[#000000] rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-thin mb-4 text-[#95e138]">
          Enter your prompt
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-transparent p-1 text-[#95e138] border-b-[1px] border-[#95e138] focus:rounded-sma focus:outline-none focus:ring-2 focus:ring-[#95e138]"
            placeholder="Enter your text here..."
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
            Generate Voice-Over Script
            <p className="h-8 w-8 pb-8 absolute">
              <svg
                fill="none"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 14V8.5M6 13V6a3 3 0 0 1 3-3h5M18 4h4M12 21H6a4 4 0 0 1 0-8h12a4 4 0 1 0 4 4v-3"
                  stroke="#95e138"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="stroke-000000"
                ></path>
              </svg>
            </p>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
