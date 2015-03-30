from flask import Flask, render_template, request
import json


app = Flask(__name__)

@app.route('/')
def index(): 
    return render_template('index.html')


if __name__== '__main__':
    app.debug = True
    app.run(host='127.0.0.1', port=8000)
    