import numpy as np
from moviepy.config import change_settings
from pydub import AudioSegment
import torch
from moviepy.audio.io.AudioFileClip import AudioFileClip
from moviepy.video.VideoClip import TextClip, ImageClip
from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip
from moviepy.video.compositing.concatenate import concatenate_videoclips
from whisper_timestamped import load_model
import soundfile as sf
import os

os.environ["TOKENIZERS_PARALLELISM"] = "false"

# # Set the paths for ffmpeg and ImageMagick
# change_settings({"FFMPEG_BINARY": r"C:\ProgramData\chocolatey\bin\ffmpeg.exe"})
# change_settings({"IMAGEMAGICK_BINARY": r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\magick.exe"})
change_settings({"IMAGEMAGICK_BINARY": "/home/user/mambaforge/envs/gpu/bin/convert"})
# Define pipeline
device = "cuda:0" if torch.cuda.is_available() else "cpu"


def getCaptions(audio_path):
    model = load_model("tiny.en", device=device)
    # Transcribe with word-level timestamps
    result = model.transcribe(audio_path, word_timestamps=True)
    transcription = result["segments"]

    # Debugging
    print("Transcription result:", transcription)

    return transcription


def create_slideshow():
    #print working directory
    print(os.getcwd())
    voice_over_path = '../frontend/public/voice_over.wav'
    sound = AudioSegment.from_wav(voice_over_path)
    sound.export("scripts/voice/voice_over.mp3", format='mp3', codec='libmp3lame')
    voice_over_path = 'scripts/voice/voice_over.mp3'
    images_dir = "scripts/images"
    font_loc = "scripts/fonts/MotleyForcesRegular-w1rZ3.ttf"
    print("Creating slideshow...")
    width = 1080
    height = 1920

    audio_clip = AudioFileClip(voice_over_path)

    # make image directory if it does not exist
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)
    image_files = [os.path.join(images_dir, img) for img in os.listdir(images_dir) if
                   img.endswith(('.png', '.jpg', '.jpeg'))]

    if not image_files:
        raise ValueError("No images found in the images directory.")

    duration_per_image = audio_clip.duration / len(image_files)
    video_clips = [ImageClip(image_path).set_duration(duration_per_image) for image_path in image_files]

    final_video = concatenate_videoclips(video_clips, method="compose").set_audio(audio_clip)
    fps = 24  # Set fps explicitly

    def create_subtitle_clips(word_segments):
        subtitle_clips = []

        for segment in word_segments:
            for word in segment['words']:
                word_start = word['start']
                word_end = word['end']
                word_text = word['word']

                subtitle = TextClip(word_text, fontsize=100, color='white', font=font_loc, method='caption',
                                    stroke_color='black', stroke_width=8)
                subtitle = subtitle.set_position("center").set_start(word_start).set_duration(word_end - word_start)
                subtitle_clips.append(subtitle)

        return subtitle_clips

    transcription = getCaptions(voice_over_path)
    subtitle_clips = create_subtitle_clips(transcription)

    final_video_with_subs = CompositeVideoClip([final_video] + subtitle_clips)
    output_path = "../frontend/public/final_video_with_subs.mp4"

    final_video_with_subs.write_videofile(
        output_path,
        codec='libx264',
        audio_codec="libmp3lame",
        fps=fps,  # Use the explicitly defined fps
        preset='fast',
        ffmpeg_params=['-vf', f'scale={width}:{height}']
    )

    return output_path
