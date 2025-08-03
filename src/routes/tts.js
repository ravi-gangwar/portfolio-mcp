const express = require('express');
const { KokoroTTS } = require('kokoro-js');

const router = express.Router();

let ttsInstance = null;

async function initializeTTS() {
  if (!ttsInstance) {
    try {
      const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
      ttsInstance = await KokoroTTS.from_pretrained(model_id, {
        dtype: "q8", // or "fp32" for higher quality
        device: "cpu", // Use "cpu" for Node.js server
      });
      console.log("Kokoro TTS initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Kokoro TTS:", error);
      throw error;
    }
  }
  return ttsInstance;
}

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log("Generating speech for text:", text);

    const tts = await initializeTTS();
    
    // Generate speech with Nicole voice
    const audio = await tts.generate(text, {
      voice: "af_nicole", // Use the correct voice ID
    });

    // Get audio as WAV Uint8Array and convert to Buffer
    const wav = await audio.toWav();
    const buffer = Buffer.from(wav);

    console.log("Audio generated successfully, size:", buffer.length);

    res.set({
      'Content-Type': 'audio/wav',
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=3600',
    });

    res.send(buffer);
  } catch (error) {
    console.error('TTS Server Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

module.exports = router; 