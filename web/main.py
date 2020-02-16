from flask import Flask, send_file, send_from_directory
app = Flask(__name__)


@app.route('/')
def hello_world():
    return send_file('./index.html', 'text/html')
    
    
@app.route('/fish')
def fish():
    return 'You are on the fish endpoint'


@app.route('/static/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/static/css/<path:path>')
def send_js(path):
    return send_from_directory('css', path)
