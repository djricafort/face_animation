# from __future__ import division, print_function
# coding=utf-8
import sys
import os
import glob
import re
import numpy as np

from akira import Akira

# Flask utils
from flask import Flask, redirect, url_for, request, render_template, jsonify
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

from PIL import Image
from autocrop import Cropper
import cv2
from os.path import isfile, join

import subprocess
import shutil

# Define a flask app
app = Flask(__name__)

image_path = ""
video_path = ""

if not os.path.exists('static/uploads/images/'):
    os.makedirs('static/uploads/images/')

if not os.path.exists('static/uploads/videos/'):
    os.makedirs('static/uploads/videos/')

if not os.path.exists('static/output/'):
    os.makedirs('static/output/')

    

@app.route('/', methods=['GET', 'POST'])
def index():
    # Main page
    return render_template('index.html')

@app.route('/pictures', methods=['GET', 'POST'])
def pictures():
    return render_template('pictures.html')

@app.route('/videos', methods=['GET', 'POST'])
def videos():
    return render_template('videos.html')

@app.route('/synthetic_videos', methods=['GET', 'POST'])
def synthetic_videos():
    return render_template('synthetic_videos.html')


@app.route('/upload_image', methods=['GET', 'POST'])
def upload_image():
    global image_path
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'static/uploads/images', secure_filename(f.filename))
        f.save(file_path)

        cropper = Cropper(width=256, height=256)
        cropped_array = cropper.crop(file_path)
        cropped_image = Image.fromarray(cropped_array)
        cropped_image.save(file_path)

        image_path = file_path

        result = 'static/uploads/images/' + secure_filename(f.filename)
        return result
    return None

@app.route('/upload_video', methods=['GET', 'POST'])
def upload_video():
    global video_path
    if request.method == 'POST':
        # Get the file
        f = request.files['file']

        # Save the file
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'static/uploads/videos', secure_filename(f.filename))
        f.save(file_path)
        video_path = file_path

        result = 'static/uploads/videos/' + secure_filename(f.filename)
        return result
    return None

@app.route('/generate', methods=['GET', 'POST'])
def generate_video():
    if request.method == 'POST':
        filenames = request.get_json()

        image_path = filenames[0].replace("%20", " ")
        video_path = filenames[1].replace("%20", " ")

        basepath = os.path.dirname(__file__)
        image_path = str(basepath) + "/static/uploads/images/" + str(image_path)
        video_path = str(basepath) + "/static/uploads/videos/" + str(video_path)

        filename = Akira.generate_video(video_path,image_path)
        result = jsonify({'filename': filename})
        return result
    return None

@app.route('/filenames_images', methods=['GET', 'POST'])
def filenames_images():
    filenames = []
    if request.method == 'POST':
        for root, dirs, files in os.walk("static/uploads/images/"):
            for filename in files:
                filenames.append("static/uploads/images/"+filename)

        result = jsonify({'filenames': filenames})
        return result
    return None

@app.route('/filenames_videos', methods=['GET', 'POST'])
def filenames_videos():
    filenames = []
    if request.method == 'POST':
        for root, dirs, files in os.walk("static/uploads/videos/"):
            for filename in files:
                filenames.append("static/uploads/videos/"+filename)

        result = jsonify({'filenames': filenames})
        return result
    return None

@app.route('/filenames_deepfakes', methods=['GET', 'POST'])
def filenames_deepfakes():
    filenames = []
    if request.method == 'POST':
        for root, dirs, files in os.walk("static/output/"):
            for filename in files:
                filenames.append("static/output/"+filename)

        result = jsonify({'filenames': filenames})
        return result
    return None

@app.route('/delete_images', methods=['GET', 'POST'])
def delete_images():
    
    if request.method == 'POST':
        filename = request.get_json()
        filename = filename.replace("%20", " ")

        basepath = os.path.dirname(__file__)
        file_path = str(basepath) + "/static/uploads/images/" + str(filename)
        os.remove(file_path)
        result = "Success"
        return result
    return None

@app.route('/delete_video', methods=['GET', 'POST'])
def delete_video():
    
    if request.method == 'POST':
        filename = request.get_json()
        filename = filename.replace("%20", " ")

        basepath = os.path.dirname(__file__)
        file_path = str(basepath) + "/static/uploads/videos/" + str(filename)
        os.remove(file_path)
        result = "Success"
        return result
    return None

@app.route('/delete_fake', methods=['GET', 'POST'])
def delete_fake():
    
    if request.method == 'POST':
        filename = request.get_json()
        filename = filename.replace("%20", " ")

        basepath = os.path.dirname(__file__)
        file_path = str(basepath) + "/static/output/" + str(filename)
        os.remove(file_path)
        result = "Success"
        return result
    return None

@app.route('/increase_res', methods=['GET', 'POST'])
def increase_res():
    
    if request.method == 'POST':
        filename = request.get_json()
        filename = filename.replace("%20", " ")
        output_filename = filename.replace(".", "_HD.")

        basepath = os.path.dirname(__file__)
        file_path = str(basepath) + "/static/output/" + str(filename)
        output_path = str(basepath) + "/static/output/" + str(output_filename)
        # os.remove(file_path)
        High_Res.main(file_path, output_path)
        result = "Success"
        return result
    return None


if __name__ == '__main__':
    # app.run(debug=True, ssl_context=('cert.pem', 'key.pem'))
    app.run(debug=True,host='0.0.0.0')
