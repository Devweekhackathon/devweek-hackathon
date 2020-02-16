from flask import Flask, send_file
app = Flask(__name__)


@app.route('/')
def hello_world():
    return send_file('./index.html', 'text/html')
    
    
@app.route('/fish')
def fish():
    return 'You are on the fish endpoint'
