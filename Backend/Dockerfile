# Use an official Python runtime as a parent image
FROM continuumio/miniconda3:latest

# Set the working directory in the container
WORKDIR /app

# Copy the environment file and requirements.txt
COPY gpu_environment.yml /app/
COPY requirements.txt /app/

# Create the conda environment and activate it
RUN conda env create -f gpu_environment.yml

# Make RUN commands use the new environment
SHELL ["conda", "run", "-n", "gpu", "/bin/bash", "-c"]

# Install PyTorch packages
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# Install other pip packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py

# Run app.py when the container launches
CMD ["conda", "run", "--no-capture-output", "-n", "gpu", "python", "app.py"]