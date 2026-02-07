"use client";

import { useState, useRef } from "react";

const CoughRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Ready");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        setStatus("Analysis complete (demo)");
        console.log(
          "Recorded cough blob:",
          new Blob(audioChunksRef.current, { type: "audio/webm" })
        );
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("Recording cough...");
    } catch (error) {
      console.error(error);
      setStatus("Microphone access denied");
    }
  };

  const stopRecording = (): void => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setStatus("Analyzing...");
  };

  return (
    <div className="card">
      <h3 className="section-title">Cough Recording</h3>

      {!isRecording ? (
        <button onClick={startRecording} className="btn btn-primary">
          Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} className="btn">
          Stop Recording
        </button>
      )}

      <p className="muted" style={{ marginTop: "12px" }}>
        {status}
      </p>
    </div>
  );
};

export default CoughRecorder;