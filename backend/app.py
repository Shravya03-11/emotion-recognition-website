from flask import Flask, request, jsonify
from flask_cors import CORS
from fer import FER
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

detector = FER(mtcnn=True)

@app.route("/")
def home():
    return {"message": "Backend is working!"}

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    result = detector.detect_emotions(img)

    if not result:
        return jsonify({
            "emotion": "No face detected",
            "confidence": None
        })

    emotions = result[0]["emotions"]
    top_emotion = max(emotions, key=emotions.get)
    confidence = emotions[top_emotion]

    return jsonify({
        "emotion": top_emotion,
        "confidence": round(confidence, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)