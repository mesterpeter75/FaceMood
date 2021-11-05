import sys
import os
import numpy as np
from deepface import DeepFace
from flask import Flask, render_template, request
import json
from PIL import Image


app = Flask(__name__)
app.config['SECRET_KEY'] = 'a secret key'
app.config['UPLOAD_FOLDER'] = 'static/uploads/'



@app.route('/', methods = ['GET', 'POST'])
def index():
    return render_template('camera.html')

@app.route('/get_analysis', methods = ['POST'])
def get_analysis():
    if request.method == 'POST':
        # Process and upload received image file to the server
        result = request.files['image']
        img = Image.open(result.stream)
        MYDIR = os.path.dirname(__file__)
        imgPath = os.path.join(MYDIR, app.config['UPLOAD_FOLDER'])
        imgPath = os.path.join(MYDIR, result.filename + '.png')
        img.save(imgPath)       
        
        # Here I use DeepFace library to help with the face analysis
        # Source: https://github.com/serengil/deepface
        analysis = DeepFace.analyze(img_path = imgPath, actions = ['age', 'gender', 'race', 'emotion'], enforce_detection = False)

        # Delete image
        os.remove(imgPath)

    return json.dumps({'Age': analysis['age'], 'Gender': analysis['gender'], 'Race': analysis['dominant_race'],
               'Emotion': analysis['dominant_emotion']})
    

if __name__ == '__main__':
    app.run()
