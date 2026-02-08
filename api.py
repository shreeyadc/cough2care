import torch
import io
import base64
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import ASTFeatureExtractor
import torchaudio
import torchaudio.functional as F
from PIL import Image
import torch.nn as nn
from transformers import ASTModel
import matplotlib.pyplot as plt

# --- 1. PASTE YOUR MODEL CLASS HERE ---
class CovidAudioClassifier(nn.Module):
    def __init__(self, num_labels=5):
        super(CovidAudioClassifier, self).__init__()
        self.ast = ASTModel.from_pretrained("MIT/ast-finetuned-audioset-10-10-0.4593")
        self.classifier = nn.Sequential(
            nn.Linear(768, 256),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(256, 5)
        )

    def forward(self, x):
        outputs = self.ast(x)
        pooled_output = outputs.last_hidden_state[:, 0, :]
        logits = self.classifier(pooled_output)
        return logits

# --- 2. INITIALIZE APP & MODEL ---
app = FastAPI()

# Allow your local webapp (frontend) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Loading model on {device}...")

# Load Model ONCE globally so we don't reload it for every user request
model = CovidAudioClassifier(num_labels=5)
# Ensure 'hinge.pth' is in the same folder
model.load_state_dict(torch.load('hinge.pth', map_location=device))
model.to(device)
model.eval()

# Load Extractor ONCE
feature_extractor = ASTFeatureExtractor.from_pretrained("MIT/ast-finetuned-audioset-10-10-0.4593")

import noisereduce as nr

# --- 3. DEFINE THE INFERENCE LOGIC ---
# We slightly modify your function to handle 'bytes' from the web upload instead of a 'file path'
def run_inference(audio_bytes, target_sr=16000):
    try:
        # Load audio from bytes
        waveform, sr = torchaudio.load(io.BytesIO(audio_bytes))
        
        # Resample
        if sr != target_sr:
            waveform = F.resample(waveform, sr, target_sr)
        
        # Mix to Mono
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        audio_np = waveform.squeeze().numpy()
        
        # Apply stationary noise reduction
        # prop_decrease=1.0: Aggressiveness (0.0 to 1.0). 0.8 is a safe sweet spot.
        # stationary=True: Assumes noise (hiss/hum) is constant (fans, AC, static).
        reduced_noise_audio = nr.reduce_noise(y=audio_np, sr=target_sr, stationary=True, prop_decrease=0.8)

        # Extract Features
        inputs = feature_extractor(
            reduced_noise_audio, 
            sampling_rate=target_sr, 
            return_tensors="pt"
        )
        spectrogram_tensor = inputs['input_values'].squeeze(0)

        # --- Generate Image ---
        spec_np = spectrogram_tensor.numpy().T
        plt.figure(figsize=(10, 4))
        plt.imshow(spec_np, aspect='auto', origin='lower', cmap='inferno')
        plt.axis('off')
        plt.tight_layout()
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
        plt.close()
        buf.seek(0)
        
        # Encode image to Base64 string so we can send it as JSON text
        img_str = base64.b64encode(buf.getvalue()).decode("utf-8")

        # --- Prediction ---
        spectrogram_input = spectrogram_tensor.to(device)
        with torch.no_grad():
            logits = model(spectrogram_input.unsqueeze(0))
            probs = torch.sigmoid(logits).cpu().numpy()[0]

        label_map = ['cough', 'cold', 'asthma', 'pneumonia', 'covid']
        results = {label_map[i]: float(probs[i]) for i in range(len(probs))}
        
        return results, img_str

    except Exception as e:
        print(f"Error: {e}")
        return None, None

# --- 4. CREATE THE API ENDPOINT ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read the uploaded file
    audio_bytes = await file.read()
    
    # Run inference
    predictions, img_b64 = run_inference(audio_bytes)
    
    if predictions is None:
        return {"error": "Processing failed"}
    
    return {
        "predictions": predictions,
        "image": f"data:image/png;base64,{img_b64}"
    }

# Run this file with: uvicorn api:app --reload