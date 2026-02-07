from sklearn.model_selection import StratifiedKFold
from torch.utils.data import DataLoader, Subset
import numpy as np

# 1. Setup Labels for Stratification
# We need the labels in a simple list to calculate the splits
labels = [label_map[item['diagnosis']] for item in data_list]
file_paths = np.array([item['path'] for item in data_list])

# 2. Initialize Stratified K-Fold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

fold_results = []

for fold, (train_idx, val_idx) in enumerate(skf.split(file_paths, labels)):
    print(f"--- Fold {fold+1} ---")
    
    # 3. Create Subsets for this fold
    train_subset = Subset(full_dataset, train_idx)
    val_subset = Subset(full_dataset, val_idx)
    
    train_loader = DataLoader(train_subset, batch_size=8, shuffle=True)
    val_loader = DataLoader(val_subset, batch_size=8, shuffle=False)
    
    # 4. RE-INITIALIZE MODEL
    # This prevents weight leakage between folds
    model = ASTForAudioClassification.from_pretrained(
        "MIT/ast-finetuned-audioset-10-10-0.4593", 
        num_labels=len(label_map),
        ignore_mismatched_sizes=True
    ).to(device)
    
    # FREEZE BACKBONE (Keep the head trainable)
    for param in model.audio_spectrogram_transformer.parameters():
        param.requires_grad = False
        
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    criterion = torch.nn.CrossEntropyLoss()

    # 5. Training Loop for this Fold
    for epoch in range(num_epochs):
        train_one_epoch(model, train_loader, optimizer, criterion)
    
    # 6. Evaluate on the Validation Fold
    accuracy = evaluate(model, val_loader)
    fold_results.append(accuracy)
    print(f"Fold {fold+1} Accuracy: {accuracy:.2f}%")

# 7. Final Result
print(f"Average Accuracy across all folds: {np.mean(fold_results):.2f}%")