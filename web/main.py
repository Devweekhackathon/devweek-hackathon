from flask import Flask, send_file, send_from_directory
app = Flask(__name__)


@app.route('/')
def hello_world():
    return send_file('./index.html', 'text/html')
    
    
@app.route('/fish')
def fish():
    return 'You are on the fish endpoint'


@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)
