# backend/app.py
from flask import Flask, request, jsonify
from models.generate_beats import forBeats
from models.generate_story import generate_story, generate_voice_over_text, generate_images_prompts
from models.generate_images import generate_images
from models.generate_voice import generate_voice
from models.create_slideshow import create_slideshow

app = Flask(__name__)


@app.route('/generate_story', methods=['POST'])
def story():
    prompt = request.json.get('prompt')
    print(prompt)
    story = generate_story(prompt)
    return jsonify({'story': story})


@app.route('/get_reel', methods=['POST'])
def get_reel():
    prompt = request.json.get('prompt')
    print(prompt)
    voice, images = generate_story(prompt)
    images = generate_images(images)
    voice_file = generate_voice(voice)
    video_file = create_slideshow()
    return jsonify({'final video': video_file})


@app.route('/generate_images', methods=['POST'])
def images():
    images_prompt = request.json.get('images_guide')
    generated_images = generate_images(images_prompt)

    # Prepare the response data
    response_data = []
    for img in generated_images:
        response_data.append({
            'id': img['id'],
            'description': img['description'],
            'data': img['data']
        })

    return jsonify({'images': response_data})


@app.route('/generate_voice_over_script', methods=['POST'])
def gen_vo():
    voice_prompt = request.json.get('prompt')
    voice = generate_voice_over_text(voice_prompt)
    return jsonify({'voice-over': voice})


@app.route('/generate_image_description', methods=['POST'])
def gen_id():
    images_guide = request.json.get('voice-over')
    image_description = generate_images_prompts(images_guide)
    return jsonify({'images_guide': image_description})


@app.route('/generate_voice', methods=['POST'])
def voice():
    text = request.json.get('voice_over_text')
    voice_data = generate_voice(text)
    if voice_data:
        return jsonify(voice_data)
    else:
        return jsonify({'error': 'Failed to generate voice-over'}), 500


@app.route('/generate_beats', methods=['POST'])
def beats():
    text = request.json.get('prompt')
    args = forBeats(text)
    return jsonify({'args': args})


@app.route('/create_slideshow', methods=['POST'])
def slideshow():
    video_file = create_slideshow()
    return jsonify({'video_url': video_file})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

