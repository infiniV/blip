import torch
from diffusers import StableAudioPipeline
import soundfile as sf


def forBeats(pipe,prompt):
    """
    Uses the Meta-Llama model to generate text-based arguments for audio generation.

    Args:
        prompt (str): The base prompt for generating arguments.

    Returns:
        dict: A dictionary containing the arguments for audio generation.
    """

    # Function to generate text
    def generate_text(pipe, prompt, max_new_tokens):
        sequences = pipe(
            prompt,
            max_new_tokens=max_new_tokens
        )
        return sequences[0]['generated_text']
    print("Generating background sound...")
    # Generate arguments for audio generation
    gen_prompt = f"""Generate parameters for an audio generation function using the following prompt:

    base story: {prompt}

    Provide the following arguments:
    - prompt: The text prompt to generate the audio. the audio should be based on the theme of the story.
    - negative_prompt: The negative prompt to guide the generation.
    - output_path: The file path to save the generated audio.
    - seed: The seed for the random number generator.
    - num_inference_steps: Number of inference steps for generation.
    - audio_end_in_s: Duration of the generated audio in seconds.
    - num_waveforms_per_prompt: Number of waveforms to generate per prompt.

    Return the arguments as a dictionary in Python format."""

    args_text = generate_text(pipe, gen_prompt, max_new_tokens=500)
    print("Generated arguments:\n", args_text)

    try:
        args = eval(args_text)  # Caution: eval can be dangerous; use with sanitized input.
    except Exception as e:
        print(f"Error parsing arguments: {e}")
        args = {
            "prompt": prompt,
            "negative_prompt": "Low quality.",
            "output_path": "output.wav",
            "seed": 0,
            "num_inference_steps": 200,
            "audio_end_in_s": 10.0,
            "num_waveforms_per_prompt": 3
        }

    return args


def generate_and_save_audio(prompt, negative_prompt="Low quality.", output_path="output.wav", seed=0,
                            num_inference_steps=200, audio_end_in_s=10.0, num_waveforms_per_prompt=3):
    """
    Generates audio based on a text prompt using a pre-trained StableAudio model and saves it to a file.

    Args:
        prompt (str): The text prompt to generate the audio.
        negative_prompt (str): The negative prompt to guide the generation. Defaults to "Low quality.".
        output_path (str): The file path to save the generated audio. Defaults to "output.wav".
        seed (int): The seed for the random number generator. Defaults to 0.
        num_inference_steps (int): Number of inference steps for generation. Defaults to 200.
        audio_end_in_s (float): Duration of the generated audio in seconds. Defaults to 10.0.
        num_waveforms_per_prompt (int): Number of waveforms to generate per prompt. Defaults to 3.
    """
    # Load pre-trained model
    pipe = StableAudioPipeline.from_pretrained("stabilityai/stable-audio-open-1.0", torch_dtype=torch.float16)
    pipe = pipe.to("cuda")

    # Set the seed for the generator
    generator = torch.Generator("cuda").manual_seed(seed)

    # Run the generation
    audio = pipe(
        prompt,
        negative_prompt=negative_prompt,
        num_inference_steps=num_inference_steps,
        audio_end_in_s=audio_end_in_s,
        num_waveforms_per_prompt=num_waveforms_per_prompt,
        generator=generator,
    ).audios

    # Process and save the audio
    output = audio[0].T.float().cpu().numpy()
    sf.write(output_path, output, pipe.vae.sampling_rate)

    print(f"Audio saved to {output_path}")
