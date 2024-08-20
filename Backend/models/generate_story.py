import re
import os
import torch
from transformers import pipeline, BitsAndBytesConfig

from Backend.models.create_slideshow import device


def generate_story(prompt):
    print("CUDA available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("GPU name:", torch.cuda.get_device_name(0))

    # Initialize BitsAndBytesConfig for quantization
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=False  # Optimize memory usage
    )

    # Model name
    model_name = "meta-llama/Meta-Llama-3.1-8B-Instruct"

    # Define pipeline with optimized settings
    pipe = pipeline(
        "text-generation",
        model=model_name,
        tokenizer=model_name,
        model_kwargs={"torch_dtype": torch.float16,
                      "quantization_config": bnb_config}
    )

    def generate_text(pipe, prompt, max_new_tokens):
        sequences = pipe(prompt, max_new_tokens=max_new_tokens)
        return sequences[0]['generated_text'][-1]['content']

    vo_prompt = f"""Create a 45-second voice-over script about: {prompt}
    Important: Write ONLY the words to be spoken, in a single continuous paragraph. Do not include any notes, instructions, tone indicators, or line breaks. Begin immediately with the first word of the script and end with the last word.
    start the voiceover with a question like "Did you know?" or a fact that will grab the listener's attention.
    voice-over:"""
    messages = [
        {"role": "system",
         "content": "You are a creative chatbot specializing in crafting engaging voice-over scripts. Always provide content in a fluid, narrative style that captivates the listener."},
        {"role": "user", "content": vo_prompt}
    ]
    print("Generating voice-over...")
    voice_over = generate_text(pipe, messages, max_new_tokens=1500)
    print(voice_over)

    os.makedirs('scripts', exist_ok=True)
    with open('scripts/voice_over.txt', 'w', encoding='utf-8') as f:
        f.write(voice_over)
    print("Voice-over saved as 'scripts/voice_over.txt'")

    img_prompt = f"""Based on the following voice-over transcript, generate 20 distinct and vivid image prompts for an AI image generator. 
    Each prompt should be 4-8 words long and correspond to a specific part of the story. Ensure the prompts are detailed and visually evocative. Each prompt should be on a new line with no extra notes, tags, or instructions.
    Voice-over transcript:
    {voice_over}

    Start generating the image descriptions:"""
    messages = [
        {"role": "system",
         "content": "You are an image description maker who creates image prompts based on provided narratives."},
        {"role": "user", "content": img_prompt},
    ]
    print("Generating image descriptions...")
    image_descriptions = generate_text(pipe, messages, max_new_tokens=2500)
    print(image_descriptions)
    with open('scripts/image_descriptions.txt', 'w', encoding='utf-8') as f:
        f.write(image_descriptions)
    print("Image descriptions saved as 'scripts/image_descriptions.txt'")

    # Cleanup
    del pipe
    torch.cuda.empty_cache()
    torch.cuda.synchronize()

    return voice_over, image_descriptions


def generate_voice_over_text(prompt):
    print("CUDA available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("GPU name:", torch.cuda.get_device_name(0))

    # Initialize BitsAndBytesConfig for quantization
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=False  # Optimize memory usage
    )

    # Model name
    model_name = "meta-llama/Meta-Llama-3.1-8B-Instruct"

    # Define pipeline with optimized settings
    pipe = pipeline(
        "text-generation",
        model=model_name,
        tokenizer=model_name,
        model_kwargs={"torch_dtype": torch.float16},
        device="cuda"
    )

    def generate_text(pipe, prompt, max_new_tokens):
        sequences = pipe(prompt, max_new_tokens=max_new_tokens)
        return sequences[0]['generated_text'][-1]['content']

    vo_prompt = f"""Create a 45-second voice-over script about: {prompt}
    Important: Write ONLY the words to be spoken, in a single continuous paragraph. Do not include any notes, instructions, tone indicators, or line breaks. Begin immediately with the first word of the script and end with the last word.
    start the voiceover with a question like "Did you know?" or a fact that will grab the listener's attention.
    voice-over:"""
    messages = [
        {"role": "system",
         "content": "You are a creative chatbot specializing in crafting engaging voice-over scripts. Always provide content in a fluid, narrative style that captivates the listener."},
        {"role": "user", "content": vo_prompt}
    ]
    print("Generating voice-over...")
    voice_over = generate_text(pipe, messages, max_new_tokens=800)
    print(voice_over)

    os.makedirs('scripts', exist_ok=True)
    with open('scripts/voice_over.txt', 'w', encoding='utf-8') as f:
        f.write(voice_over)
    print("Voice-over saved as 'scripts/voice_over.txt'")

    # Cleanup
    del pipe
    torch.cuda.empty_cache()
    torch.cuda.synchronize()

    return voice_over


def generate_images_prompts(voice_over):
    print("CUDA available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("GPU name:", torch.cuda.get_device_name(0))

    # Initialize BitsAndBytesConfig for quantization
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=False  # Optimize memory usage
    )

    # Model name
    model_name = "meta-llama/Meta-Llama-3.1-8B-Instruct"

    # Define pipeline with optimized settings
    pipe = pipeline(
        "text-generation",
        model=model_name,
        tokenizer=model_name,
        model_kwargs={"torch_dtype": torch.float16},
        device="cuda"
    )

    def generate_text(pipe, prompt, max_new_tokens):
        sequences = pipe(prompt, max_new_tokens=max_new_tokens)
        return sequences[0]['generated_text'][-1]['content']

    # Split the voice-over transcript into lines
    voice_over_lines = voice_over.splitlines()

    # Generate the image prompt string
    img_prompt = f"""Based on the following voice-over transcript, generate 10-20 distinct and vivid image prompts that follow this structure: "To get good results, use a simple prompt like: 'Portrait of [object] as [role], [movie scene or director], cinematic.'"
    Each prompt should follow this format and be concise and visually evocative. Each prompt should be on a new line with no extra notes, tags, or instructions.
    Voice-over transcript:"""

    # Append each line of the transcript to the img_prompt
    for line in voice_over_lines:
        img_prompt += f"\n{line}"

    img_prompt += "\n\nStart generating the image descriptions:"

    # Prepare the messages for the AI
    messages = [
        {"role": "system",
         "content": "You are an image description maker who creates image prompts based on provided narratives."},
        {"role": "user", "content": img_prompt},
    ]

    print("Generating image descriptions...")
    image_descriptions = generate_text(pipe, messages, max_new_tokens=1500)
    print(image_descriptions)
    with open('scripts/image_descriptions.txt', 'w', encoding='utf-8') as f:
        f.write(image_descriptions)
    print("Image descriptions saved as 'scripts/image_descriptions.txt'")

    # Cleanup
    del pipe
    torch.cuda.empty_cache()
    torch.cuda.synchronize()

    return image_descriptions
