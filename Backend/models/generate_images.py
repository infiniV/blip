# import os
# from diffusers import StableDiffusionPipeline, DiffusionPipeline
# import torch
#
#
# def generate_images(prompt):
#     images = prompt.split("\n")
#     if not images:
#         print("No image descriptions provided. Using default descriptions from file.")
#         with open('scripts/image_descriptions.txt', 'r', encoding='utf-8') as f:
#             images = [line.strip() for line in f if line.strip()]
#     # Create images directory if it doesn't exist
#         if not os.path.exists("scripts/images"):
#             os.makedirs("scripts/images")
#     # Delete files in the images directory
#         for file in os.listdir("scripts/images"):
#             os.remove(os.path.join("scripts/images", file))
#
#     generated_images = []
#     model_id = "stabilityai/sdxl-turbo"
#     pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
#     pipe.to("cuda")
#
#     # Set dimensions for 9:16 aspect ratio
#     width = 576  # You can adjust this, keeping the ratio
#     height = 1024  # This maintains 16:9 ratio with 576 width
#
#     # List of negative prompts to avoid
#     negative_prompts = (
#         "poorly rendered face, poorly drawn face, poor facial details, "
#         "poorly drawn hands, poorly rendered hands, low resolution, "
#         "images cut out at the top, left, right, bottom, bad composition, "
#         "mutated body parts, blurry image, disfigured, oversaturated, "
#         "bad anatomy, deformed body features."
#     )
#
#     for i, prompt in enumerate(images, 1):
#         print("prompt : ", prompt)
#         # Split the prompt into positive and negative parts
#         # Assuming the prompt includes a description and possibly other details
#         positive_description = prompt  # This assumes the prompt itself is the positive description
#
#         # Create the enhanced prompt by including negative aspects
#         enhanced_prompt = (
#             "Positive:\n"
#             f"{positive_description.strip()}\n"
#             f"Avoid these : {negative_prompts}"
#         )
#
#         # Truncate filename to avoid excessively long filenames
#         filename = f"image_{i}_{positive_description[:30].replace(' ', '')}.png".replace(":", "")
#
#         # Generate the image using the enhanced prompt
#         image = \
#             pipe(prompt=enhanced_prompt, num_inference_steps=3, guidance_scale=0.0, width=width, height=height).images[
#                 0]
#
#         # Save the generated image
#         image_path = f"scripts/images/{filename}"
#         image.save(image_path)
#         generated_images.append(image_path)
#         print(f"Generated image {i}/{len(images)}: {filename}")
#         break
#
#     del pipe
#     torch.cuda.empty_cache()
#     return generated_images
import os
import base64
from io import BytesIO
from diffusers import DiffusionPipeline
import torch


def generate_images(prompt):
    # Print prompt for debugging
    print("Prompt:", prompt)

    if not prompt:
        print("No image descriptions provided. Using default descriptions from file.")
        with open('scripts/image_descriptions.txt', 'r', encoding='utf-8') as f:
            images = [line.strip() for line in f if line.strip()]
    else:
        images = prompt.split("\n")
    print(images)
    # Create images directory if it doesn't exist
    if not os.path.exists("scripts/images"):
        os.makedirs("scripts/images")

    # Delete files in the images directory
    for file in os.listdir("scripts/images"):
        os.remove(os.path.join("scripts/images", file))

    generated_images = []
    width = 288
    height = 512
    model_id = "stabilityai/sdxl-turbo"
    pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
    pipe.to("cuda")
    j = 0
    for i, prompt_text in enumerate(images, 1):
        if not prompt_text:
            continue
        if j >= 20:
            break
        j += 1
        print(f"Generating image {i}/{len(images)}: {prompt_text}")
        positive_description = prompt_text.strip()

        # Define prompt for the diffusion model
        enhanced_prompt = f"Positive:\n{positive_description}\n"

        # Truncate filename to avoid excessively long filenames
        filename = f"image_{i}_{positive_description[:30].replace(' ', '')}.png".replace(":", "")

        # Generate the image
        image = \
        pipe(prompt=enhanced_prompt, num_inference_steps=1, guidance_scale=0.0, width=width, height=height).images[0]

        # Save the generated image
        image_path = os.path.join("scripts/images", f"{j}" + ".png")
        image.save(image_path)

        # Convert image to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        generated_images.append({
            "id": i,
            "description": positive_description[:30],
            "data": f"data:image/png;base64,{img_str}",
            "path": image_path
        })

        print(f"Saved image {i}/{len(images)}: {filename}")

    # Cleanup
    del pipe
    torch.cuda.empty_cache()

    return generated_images
