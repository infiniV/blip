"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PromptInput from "@/components/PromptInput";
import VoiceOverEditor from "@/components/VoiceOverEditor";
import ImageDescriptionEditor from "@/components/ImageDescriptionEditor";
import GeneratedImages from "@/components/GeneratedImages";
import VideoPlayer from "@/components/VideoPlayer";
import AudioPlayer from "@/components/VoicePlayer";
import dynamic from "next/dynamic";
import VideoGallery from "@/components/VideoGallery"; // Import the new VideoGallery component

const Spinner = dynamic(() => import("@/components/Spinner"), {
  ssr: false,
});

interface Image {
  id: number;
  description: string;
  data: string; // base64 string
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [voiceOverText, setVoiceOverText] = useState("");
  const [imageDescriptions, setImageDescriptions] = useState("");
  const [images, setImages] = useState<Image[]>([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editorText, setEditorText] = useState("");
  const [showGallery, setShowGallery] = useState(false); // State for showing the video gallery

  const handlePromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate_voice_over_script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setVoiceOverText(data["voice-over"]);
      setStep(2);
    } catch (error) {
      console.error("Error generating voice-over script:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDescriptionSubmit = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate_image_description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "voice-over": text }),
      });
      const data = await response.json();
      setImageDescriptions(data["images_guide"]);
      setStep(3);
      alert("bro generate the audio plz");
    } catch (error) {
      console.error("Error generating image descriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSubmit = async (descriptions: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate_images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images_guide: descriptions }),
      });
      const data = await response.json();
      setImages(data.images);
      setStep(4);
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/create_slideshow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        console.log("API Response:", data); // Debugging: Check the response

        // Assuming response contains `video_file` property
        if (data.video_file) {
          setVideoSrc(data.video_file); // Set the video source from the response
          setStep(5);
        } else {
          console.error("Video file not found in response");
        }
      } else {
        console.error("Error generating video:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVoiceOver = async (text: string) => {
    try {
      const response = await fetch("/api/generate_voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voice_over_text: text }),
      });

      if (response.ok) {
        return "/voice_over.wav";
      } else {
        console.error("Error generating voice-over:", response.statusText);
        return "";
      }
    } catch (error) {
      console.error("Error generating voice-over:", error);
      throw error;
    }
  };

  const handleVoiceOverSubmit = async (text: string) => {
    setIsLoading(true);
    try {
      const audioFilePath = await generateVoiceOver(text);
      setAudioSrc(audioFilePath);
      setEditorText(text);
    } catch (error) {
      console.error("Error generating voice-over:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1)); // Decrement step but not below 1
  };

  return (
    <div className="bg-[#000000] relative">
      {step !== 1 && !isLoading && (
        <motion.button
          onClick={handleBack}
          className="absolute top-4 left-4 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] py-2 px-4 rounded hover:bg-[#95e138] hover:text-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#95e138]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              d="M352 128.4L319.7 96 160 256l159.7 160 32.3-32.4L224.7 256z"
              fill="#95e138"
            ></path>
          </svg>
        </motion.button>
      )}

      {step === 1 && (
        <>
          {/* Video Gallery Button */}
          {!isLoading && (
            <motion.button
              onClick={toggleGallery}
              className="absolute top-4 right-4 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] py-2 px-4 rounded hover:bg-[#95e138] hover:text-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#95e138]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Video Gallery
            </motion.button>
          )}

          {/* Show Video Gallery */}
          <AnimatePresence>
            {showGallery && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <VideoGallery onClose={toggleGallery} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Prompt Input */}
          {!isLoading && <PromptInput onSubmit={handlePromptSubmit} />}
          {isLoading && <Spinner />}
        </>
      )}

      {/* Step 2: VoiceOver Editor */}
      {step === 2 && (
        <>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <VoiceOverEditor
                initialText={voiceOverText}
                currentText={editorText}
                onTextChange={setEditorText}
                onImageSubmit={handleImageDescriptionSubmit}
                onVoiceOverSubmit={handleVoiceOverSubmit}
                canGenerateImages={!!audioSrc}
              />
            </motion.div>
          )}
          {!isLoading && (
            <div className="flex flex-row justify-center mt-2">
              {audioSrc && <AudioPlayer src={audioSrc} />}
            </div>
          )}
          {isLoading && <Spinner />}
        </>
      )}

      {/* Step 3: Image Description Editor */}
      {step === 3 && (
        <>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ImageDescriptionEditor
                initialDescriptions={imageDescriptions}
                onSubmit={handleImageSubmit}
              />
            </motion.div>
          )}
          {isLoading && <Spinner />}
        </>
      )}

      {/* Step 4: Generated Images and Generate Final Video Button */}
      {step === 4 && (
        <>
          {!isLoading && (
            <motion.div
              className="flex flex-row justify-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={handleGenerateVideo}
                className="mt-4 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] py-2 px-4 rounded hover:bg-[#95e138] hover:text-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#95e138]"
              >
                Generate Final Video
              </button>
            </motion.div>
          )}
          {!isLoading && images && <GeneratedImages images={images} />}
          {isLoading && <Spinner />}
        </>
      )}

      {/* Step 5: Video Player */}
      {step === 5 && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VideoGallery onClose={toggleGallery} />
          </motion.div>
        </>
      )}
    </div>
  );
}
