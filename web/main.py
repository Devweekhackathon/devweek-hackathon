from flask import Flask
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, World!'
    
    
@app.route('/fish')
def fish():
    return 'You are on the fish endpoint'