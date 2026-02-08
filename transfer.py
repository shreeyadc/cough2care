import os
import shutil

def transfer_audio_files():
    # Define the root paths
    # Assumes script is running one level above 'audio_files'
    base_dir = "audio_files" 
    source_dir = os.path.join("Extracted_data")
    target_filename = "cough-heavy.wav"

    # Verify source directory exists
    if not os.path.exists(source_dir):
        print(f"Error: The directory '{source_dir}' does not exist.")
        return

    print("Starting transfer process...")
    count = 0

    # 1. Loop through date folders (e.g., 20200413)
    for date_folder in os.listdir(source_dir):
        date_path = os.path.join(source_dir, date_folder)

        # Skip if it's not a directory
        if not os.path.isdir(date_path):
            continue

        # 2. Loop through patient ID folders (e.g., 0Rlzhiz...)
        for patient_id in os.listdir(date_path):
            patient_path = os.path.join(date_path, patient_id)

            if not os.path.isdir(patient_path):
                continue

            # Construct the full path to the specific source file
            src_file_path = os.path.join(patient_path, target_filename)

            # 3. Check if 'cough-heavy.wav' exists for this patient
            if os.path.exists(src_file_path):
                # Construct destination path: audio_files/<patient_id>.wav
                dst_filename = f"{patient_id}.wav"
                dst_file_path = os.path.join(base_dir, dst_filename)

                try:
                    shutil.copy2(src_file_path, dst_file_path)
                    print(f"Copied: {dst_filename}")
                    count += 1
                except Exception as e:
                    print(f"Error copying {patient_id}: {e}")

    print(f"--- Process Complete. Transferred {count} files. ---")

if __name__ == "__main__":
    transfer_audio_files()