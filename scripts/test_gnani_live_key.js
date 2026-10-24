const apiKey = "vach_1ytE2CY5X2OtlnsfUU7svHoNhJtO0JQi3mRqA4m2DF87aee3esafAlOzHiBbd4mmWIDb5hJvj9yA9qqJs6GgAMTqoBkdyq7Z_7b608b5e1b95871558faa2c082a5a44f";

async function testTTSWithModel() {
  console.log("=== Testing Gnani Timbre TTS with model: timbre-v2.5 ===");
  const url = "https://api.vachana.ai/api/v1/tts/inference";
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key-ID": apiKey
  };

  const body = JSON.stringify({
    text: "Namaste, main Symvella hoon. Aapki health companion.",
    voice: "Nalini",
    model: "timbre-v2.5",
    language: "hi-IN",
    speed: 1.0,
    audio_format: "wav"
  });

  const res = await fetch(url, { method: "POST", headers, body });
  console.log(`Status: ${res.status} ${res.statusText}`);
  console.log(`Content-Type: ${res.headers.get("content-type")}`);
  
  if (res.ok) {
    const buffer = await res.arrayBuffer();
    console.log(`🎉 SUCCESS! Received Gnani Timbre Audio Bytes: ${buffer.byteLength}`);
  } else {
    const errText = await res.text();
    console.log(`Error Response:`, errText);
  }
}

testTTSWithModel();
