from flask import Flask, send_file, send_from_directory, request, jsonify
from flask_cors import CORS
from .geo.gems import compute_gems
app = Flask(__name__)
cors = CORS(app)


@app.route('/')
def hello_world():
    return send_file('./index.html', 'text/html')
    
    
@app.route('/gems/<num_gems>', methods=['POST'])
def gems(num_gems):
    return jsonify({
        'data': compute_gems(request.json['data'], num_gems)
    })


@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)
