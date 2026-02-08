import os
import torch
import torchaudio
from transformers import ASTFeatureExtractor
from tqdm import tqdm
import pandas as pd

# Setup
df = pd.read_csv('combined_data.csv') # Ensure this matches your filtered DF logic
audio_dir = 'audio_files/'
output_dir = 'processed_tensors/'
os.makedirs(output_dir, exist_ok=True)

feature_extractor = ASTFeatureExtractor.from_pretrained("MIT/ast-finetuned-audioset-10-10-0.4593")
target_sr = 16000

print("Starting offline preprocessing...")

for idx, row in tqdm(df.iterrows(), total=len(df)):
    file_id = row['id']
    audio_path = os.path.join(audio_dir, f"{file_id}.wav")
    save_path = os.path.join(output_dir, f"{file_id}.pt")
    
    # Skip if already exists (resume capability)
    if os.path.exists(save_path):
        continue
        
    try:
        # 1. Load & Resample
        waveform, sr = torchaudio.load(audio_path)
        if sr != target_sr:
            waveform = torchaudio.transforms.Resample(sr, target_sr)(waveform)
        
        # 2. Mix to Mono
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
            
        # 3. Extract Features (The heavy lifting)
        inputs = feature_extractor(
            waveform.squeeze().numpy(), 
            sampling_rate=target_sr, 
            return_tensors="pt"
        )
        spectrogram = inputs['input_values'].squeeze(0) # Shape: [1024, 128]
        
        # 4. Save to disk (Fast I/O)
        torch.save(spectrogram.clone(), save_path)
        
    except Exception as e:
        print(f"Failed {file_id}: {e}")

print("Preprocessing complete.")