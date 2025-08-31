from flask import Flask, request, jsonify
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
from flask_cors import CORS 
from model import SimpleCNN   # import your CNN class

# Initialize Flask
app = Flask(__name__)
CORS(app)

# CIFAR-10 classes
classes = ['airplane', 'automobile', 'bird', 'cat', 'deer',
           'dog', 'frog', 'horse', 'ship', 'truck']

# Load model
model = SimpleCNN(num_classes=10)
model.load_state_dict(torch.load("model.pth", map_location="cpu"))
model.eval()

# Define preprocessing (must match training!)
transform = transforms.Compose([
    transforms.Resize((32, 32)),   # same size used during training
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

@app.route("/upload", methods=["POST"])
def upload():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    img = Image.open(io.BytesIO(file.read())).convert("RGB")

    # Preprocess image
    img_tensor = transform(img).unsqueeze(0)  # add batch dimension

    # Predict
    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted = torch.max(outputs, 1)

    prediction = classes[predicted.item()]

    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True)
