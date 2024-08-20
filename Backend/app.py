import time
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import queue
import threading
from models.generate_beats import forBeats
from models.generate_story import generate_story, generate_voice_over_text, generate_images_prompts
from models.generate_images import generate_images
from models.generate_voice import generate_voice
from models.create_slideshow import create_slideshow

app = Flask(__name__)
CORS(app)

# Create a queue for SSE messages
message_queue = queue.Queue()

def send_webhook_notification(step, data):
    # Convert non-serializable types to serializable types
    if isinstance(data, set):
        data = list(data)
    message_queue.put({"step": step, "data": data})

@app.route('/generate_story', methods=['POST'])
def story():
    prompt = request.json.get('prompt')
    print(prompt)
    story = generate_story(prompt)
    send_webhook_notification("story_generation", {'story': story})
    return jsonify({'story': story})

@app.route('/get_reel', methods=['POST'])
def get_reel():
    prompt = request.json.get('prompt')
    print(prompt)
    voice, images = generate_story(prompt)
    send_webhook_notification("story_generation", {'voice': voice, 'images': images})

    generated_images = generate_images(images)
    send_webhook_notification("images_generation", {'images': generated_images})

    voice_file = generate_voice(voice)
    send_webhook_notification("voice_generation", {'voice_file': voice_file})

    video_file = create_slideshow()
    send_webhook_notification("video_creation", {'video_file': video_file})

    return jsonify({'final video': video_file})

@app.route('/generate_images', methods=['POST'])
def images():
    images_prompt = request.json.get('images_guide')
    send_webhook_notification("images_generation", {"Generating images..."})
    generated_images = generate_images(images_prompt)

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
    send_webhook_notification("voice_over_script", {"Generating voice-over script..."})
    voice = generate_voice_over_text(voice_prompt)
    return jsonify({'voice-over': voice})

@app.route('/generate_image_description', methods=['POST'])
def gen_id():
    images_guide = request.json.get('voice-over')
    send_webhook_notification("image_description", {"Generating image descriptions..."})
    image_description = generate_images_prompts(images_guide)
    return jsonify({'images_guide': image_description})

@app.route('/generate_voice', methods=['POST'])
def voice():
    text = request.json.get('voice_over_text')
    send_webhook_notification("voice_generation", "Generating voice-over...")
    voice_data = generate_voice(text)
    if voice_data:
        return jsonify(voice_data)
    else:
        return jsonify({'error': 'Failed to generate voice-over'}), 500

@app.route('/generate_beats', methods=['POST'])
def beats():
    text = request.json.get('prompt')
    args = forBeats(text)
    send_webhook_notification("beats_generation", {'args': args})
    return jsonify({'args': args})

@app.route('/create_slideshow', methods=['POST'])
def slideshow():
    send_webhook_notification("video_creation", {'video_file': "Creating slideshow..."})
    video_file = create_slideshow()
    return jsonify({'video_file': video_file})

@app.route('/sse')
def sse():
    def event_stream():
        last_message_time = time.time()
        while True:
            if not message_queue.empty():
                message = message_queue.get()
                # Ensure the message data is serializable
                if isinstance(message['data'], set):
                    message['data'] = list(message['data'])
                yield f"data: {json.dumps(message)}\n\n"
                last_message_time = time.time()
            else:
                # Send heartbeat only if no new message has been processed for a while
                if time.time() - last_message_time > 1:  # Adjust the duration as needed
                    yield f"data: {json.dumps({'step': 'heartbeat'})}\n\n"
                time.sleep(1)  # Adjust the sleep time as needed

    return Response(event_stream(), mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
