import React, { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      if (audio) setDuration(audio.duration);
    };

    if (audio) {
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Number(e.target.value);
      setCurrentTime(audio.currentTime);
    }
  };

  return (
    <div className="absolute bottom-10 bg-transparent outline outline-1 outline-[#95e138] text-[#95e138] py-2 px-4 rounded hover:bg-[#95e138] hover:text-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#95e138]">
      <div className="w-full max-w-screen bg-[#000000] rounded-lg shadow-lg">
        <h3 className="text-lg font-thin mb-4 text-[#95e138]">
          Generated Voice-Over
        </h3>
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          className="hidden" // Hide default controls
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        >
          Your browser does not support the audio element.
        </audio>
        <div className="custom-controls">
          <button onClick={togglePlayPause} className="play-pause-button">
            {isPlaying ? "Pause" : "Play"}
          </button>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />
        </div>
      </div>
      <style jsx>{`
        .custom-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .play-pause-button {
          background-color: #95e138;
          border: none;
          color: black;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .play-pause-button:hover {
          background-color: #7ab828;
        }
        .progress-bar {
          width: 100%;
          margin-top: 10px;
          cursor: pointer;
          accent-color: #95e138; /* Custom color for progress bar */
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;
