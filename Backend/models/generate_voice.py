import os
import torch
from TTS.api import TTS
import warnings
from pydub import AudioSegment

warnings.filterwarnings("ignore", category=FutureWarning)


def split_text(text, max_chars=240):
    chunks = []
    current_chunk = ""

    for word in text.split():
        if len(current_chunk) + len(word) + 1 > max_chars:  # +1 accounts for the space between words
            chunks.append(current_chunk)
            current_chunk = word
        else:
            if current_chunk:
                current_chunk += " " + word
            else:
                current_chunk = word

    if current_chunk:
        chunks.append(current_chunk)

    return chunks


def generate_voice(voicetxt):
    voice_over_text = voicetxt.replace("\n", " ")
    if not voice_over_text:
        return None

    device = "cuda" if torch.cuda.is_available() else "cpu"

    voice_dir = "../frontend/public/"
    if not os.path.exists(voice_dir):
        os.makedirs(voice_dir)

    output_file = f"{voice_dir}voice_over.wav"
    print("Generating voice-over...")

    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=True)
    tts.to(device)

    text_chunks = split_text(voice_over_text)

    combined_audio = AudioSegment.empty()

    for i, chunk in enumerate(text_chunks):
        chunk_output_wav = f"{voice_dir}voice_over_chunk_{i}.wav"
        tts.tts_to_file(
            text=chunk,
            file_path=chunk_output_wav,
            speaker="Ana Florence",  # Replace with an available speaker's name if desired
            language="en",
            split_sentences=True,
            emotion="excited",
        )

        # Load the WAV file and add it to the combined audio
        chunk_audio = AudioSegment.from_wav(chunk_output_wav)
        combined_audio += chunk_audio

    del tts
    torch.cuda.empty_cache()

    # Export the combined audio to a single WAV file
    combined_audio.export(output_file, format="wav")

    if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
        print(f"Voice-over saved to {output_file}")
        return output_file
    else:
        print("Failed to generate voice-over.")
        return None



