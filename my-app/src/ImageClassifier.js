import React, { useState } from "react";
import axios from "axios";

export default function ImageClassifier() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPrediction(res.data.prediction);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Something went wrong. Check Flask server.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Image Classifier (Flask + React)</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ margin: "20px" }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: "200px", borderRadius: "10px" }}
          />
        </div>
      )}

      <button onClick={handleUpload} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Upload & Predict
      </button>

      {prediction && (
        <h3 style={{ marginTop: "20px" }}>
          Prediction: <span style={{ color: "green" }}>{prediction}</span>
        </h3>
      )}
    </div>
  );
}
