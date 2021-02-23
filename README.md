# face_animation
A webapp for making synthetic videos based from [First Order Motion Model for Image Animation](https://github.com/AliaksandrSiarohin/first-order-model)

## How to use:
1. Install the dependencies found in `requirements.txt`
2. Create a `checkpoint` folder then download the model checkpoints from [Google drive](https://drive.google.com/drive/folders/1PyQJmkdCsAkOYwUyaj_l-l0as-iLDgeH) and save it here
3. Run `app.py`
4. Upload source image. Uploaded image will be stored in `static/uploads/images/` directory
5. Upload target video. Uploaded video will be stored in `static/uploads/videos/` directory
6. Animate source image. Synthesized video will be stored in `static/output/` directory

* `autocrop` was added in order to automatically detect the face from the input image and crop it to the desired dimensions

