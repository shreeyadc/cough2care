# some ai code
import torch
import torchaudio
from torch.utils.data import Dataset
from transformers import ASTFeatureExtractor

class RespiratoryDataset(Dataset):
    def __init__(self, data_list, label_map):
        self.data = data_list
        self.label_map = label_map
        # The AST extractor handles the Fourier Transform + Mel scaling
        self.feature_extractor = ASTFeatureExtractor.from_pretrained(
            "MIT/ast-finetuned-audioset-10-10-0.4593"
        )
        self.keys_map = ['cough', 'cold', 'asthma', 'pneumonia', 'covid']

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        # 1. Get path and label
        item = self.data[idx]
        audio_path = item['path']
        # Get subset of item for label mapping
        ## We want the following keys: cough, cold, asthma, pneumonia, covid
        label = self.label_map[tuple(item[key] for key in self.keys_map)]

        # 2. Load and Pre-process Audio
        waveform, sr = torchaudio.load(audio_path)
        
        # Ensure 16kHz and Mono
        if sr != 16000:
            waveform = torchaudio.transforms.Resample(sr, 16000)(waveform)
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        # 3. Transform to Spectrogram
        # We squeeze to get a 1D array for the extractor
        inputs = self.feature_extractor(
            waveform.squeeze().numpy(), 
            sampling_rate=16000, 
            return_tensors="pt"
        )

        # inputs['input_values'] has shape [1, 1024, 128]
        # We remove the extra batch dimension for the DataLoader
        spectrogram = inputs['input_values'].squeeze(0) 
        
        return spectrogram, torch.tensor(label)