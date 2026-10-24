import fs from "fs";
import { encodeWAV } from "../src/services/gnaniService.js";

const apiKey = "vach_1ytE2CY5X2OtlnsfUU7svHoNhJtO0JQi3mRqA4m2DF87aee3esafAlOzHiBbd4mmWIDb5hJvj9yA9qqJs6GgAMTqoBkdyq7Z_7b608b5e1b95871558faa2c082a5a44f";

async function testPrismaSTTLive() {
  console.log("=== Testing Gnani Prisma STT with provided key ===");
  
  // Generate 1.5 seconds of 16kHz PCM audio
  const sampleRate = 16000;
  const numSamples = sampleRate * 1.5;
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    // 440 Hz soft test tone
    samples[i] = Math.sin(2 * Math.PI * 440 * (i / sampleRate)) * 0.2;
  }
  const wavBuffer = encodeWAV(samples, sampleRate);
  const blob = new Blob([wavBuffer], { type: "audio/wav" });

  const formData = new FormData();
  formData.append("audio_file", blob, "test_speech.wav");
  formData.append("language_code", "hi-IN");
  formData.append("format", "transcribe");

  const res = await fetch("https://api.vachana.ai/stt/v3", {
    method: "POST",
    headers: {
      "X-API-Key-ID": apiKey
    },
    body: formData
  });

  console.log(`STT Status: ${res.status} ${res.statusText}`);
  const text = await res.text();
  console.log(`STT Response:`, text);
}

testPrismaSTTLive();
