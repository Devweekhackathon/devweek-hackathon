from flask import Flask, send_file, send_from_directory, request, jsonify
from flask_cors import CORS
from .geo.gems import compute_gems
from .race.run import wait_on_start, update
app = Flask(__name__)
cors = CORS(app)


@app.route('/')
def hello_world():
    return send_file('./index.html', 'text/html')
    

# Pick locations for gems along path
@app.route('/gems/<num_gems>', methods=['POST'])
def gems(num_gems):
    return jsonify({
        'data': compute_gems(request.json['data'], num_gems)
    })


# Register for race and wait to start
@app.route('/race/register/<actor_key>', methods=['POST'])
def register_race(actor_key):
    return wait_on_start(actor_key)


# Run race
@app.route('/race/update/<actor_key>', methods=['POST'])
def update_race(actor_key):
    return jsonify({
        'data': update(actor_key, request.json['data'])
    })


@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)
