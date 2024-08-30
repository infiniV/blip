# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the application code
COPY . /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    imagemagick \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu117 \
    && pip install --no-cache-dir numpy \
    moviepy \
    pydub \
    transformers \
    soundfile \
    diffusers \
    scipy \
    flask \
    accelerate \
    bitsandbytes \
    TTS \
    whisper-timestamped \
    flask-cors \
    && pip install --upgrade --no-cache-dir decorator==4.0.2

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py

# Run app.py when the container launches
CMD ["python", "app.py"]
