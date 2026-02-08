"use client";

import { useRef, useState, useEffect } from "react";

type CoughRecorderProps = {
  onRecordingComplete: (audioFile: File) => void; // Callback when recording stops
};

const NUM_BARS = 12;

const CoughRecorder: React.FC<CoughRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Ready to record");
  const [barHeights, setBarHeights] = useState<number[]>(Array(NUM_BARS).fill(20));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationRef = useRef<number | null>(null); // ✅ Type-safe

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e: BlobEvent) => audioChunksRef.current.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const file = new File([blob], "cough.wav", { type: "audio/wav" });
        setStatus("Analysis complete");

        // Stop animation
        if (animationRef.current) cancelAnimationFrame(animationRef.current);

        // Send file to parent
        onRecordingComplete(file);
      };

      recorder.start();
      setIsRecording(true);
      setStatus("Recording audio...");
      animateBars();
    } catch (err) {
      console.error(err);
      setStatus("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setStatus("Analyzing...");
  };

  // Animate waveform bars
  const animateBars = () => {
    setBarHeights((prev) => prev.map(() => 20 + Math.random() * 40));
    animationRef.current = requestAnimationFrame(animateBars);
  };

  // Stop animation if component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      className="card"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
      }}
    >
      {/* LEFT TEXT */}
      <div>
        <h2 style={{ marginBottom: "8px" }}>Record Your Cough</h2>
        <p style={{ marginTop: "12px", fontWeight: 600 }}>{status}</p>
      </div>

      {/* CENTER WAVEFORM */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          height: "60px",
        }}
      >
        {barHeights.map((h, i) => (
          <span
            key={i}
            style={{
              width: "6px",
              height: `${h}px`,
              background: "#4fd1c5",
              borderRadius: "4px",
              transition: "0.1s",
            }}
          />
        ))}
      </div>

      {/* RIGHT BUTTON */}
      <button
        className="btn primary"
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          minWidth: "160px",
          height: "56px",
          fontSize: "16px",
        }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default CoughRecorder;
