import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction(null);
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Pointing to localhost:8000 because VS Code will forward this port
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPrediction(response.data.predictions);
      // The backend sends a base64 string, we prefix it to make it displayable
      setImage(response.data.image); 
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error connecting to backend");
    }
    setLoading(false);
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>COVID-19 Audio Diagnosis</h1>

      <input type="file" accept=".wav" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={!file || loading} style={{ marginLeft: "10px" }}>
        {loading ? "Analyzing..." : "Analyze Audio"}
      </button>

      {image && (
        <div style={{ marginTop: "20px" }}>
          <h3>Spectrogram Analysis</h3>
          <img src={image} alt="Spectrogram" style={{ maxWidth: "100%", borderRadius: "8px" }} />
        </div>
      )}

      {prediction && (
        <div style={{ marginTop: "20px" }}>
          <h3>Prediction Results</h3>
          {Object.entries(prediction).map(([label, score]) => (
            <div key={label} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
              <span style={{ width: "100px", fontWeight: "bold" }}>{label}</span>
              <div style={{ flex: 1, background: "#eee", height: "20px", borderRadius: "10px", margin: "0 10px" }}>
                <div 
                  style={{ 
                    width: `${score * 100}%`, 
                    background: score > 0.5 ? "red" : "green", 
                    height: "100%", 
                    borderRadius: "10px" 
                  }} 
                />
              </div>
              <span>{(score * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;