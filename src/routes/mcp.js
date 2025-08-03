const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { KokoroTTS } = require('kokoro-js');
const { 
  PERSONAL_INFO, 
  SUMMARY, 
  EXPERIENCE, 
  EDUCATION, 
  PROJECTS, 
  SKILLS, 
  ACHIEVEMENTS 
} = require('../constants');
const { 
  getClientIP, 
  addMessageToHistory, 
  getRecentHistory, 
  extractCleanAudioText 
} = require('../utils/chatHistory');

let ttsInstance = null;

// Available Kokoro TTS voices
const AVAILABLE_VOICES = {
  "af_nicole": { name: "Nicole", description: "Friendly and warm", gender: "female" },
  "af_sarah": { name: "Sarah", description: "Professional and clear", gender: "female" },
  "af_emma": { name: "Emma", description: "Energetic and enthusiastic", gender: "female" },
  "af_lisa": { name: "Lisa", description: "Calm and soothing", gender: "female" },
  "af_anna": { name: "Anna", description: "Confident and authoritative", gender: "female" },
  "am_steve": { name: "Steve", description: "Professional male voice", gender: "male" },
  "am_david": { name: "David", description: "Friendly male voice", gender: "male" },
  "am_mike": { name: "Mike", description: "Energetic male voice", gender: "male" },
};

// Function to select voice based on user input
function selectVoiceFromUserInput(userMessage, chatHistory) {
  const message = userMessage.toLowerCase();
  
  // Check for specific voice requests
  if (message.includes("nicole") || message.includes("default voice")) {
    return "af_nicole";
  }
  if (message.includes("sarah")) {
    return "af_sarah";
  }
  if (message.includes("emma")) {
    return "af_emma";
  }
  if (message.includes("lisa")) {
    return "af_lisa";
  }
  if (message.includes("anna")) {
    return "af_anna";
  }
  if (message.includes("steve")) {
    return "am_steve";
  }
  if (message.includes("david")) {
    return "am_david";
  }
  if (message.includes("mike")) {
    return "am_mike";
  }
  
  // Check for gender-based requests
  if (message.includes("male voice") || message.includes("guy voice") || message.includes("man voice")) {
    return "am_steve"; // Default male voice
  }
  if (message.includes("female voice") || message.includes("girl voice") || message.includes("woman voice")) {
    return "af_nicole"; // Default female voice
  }
  
  // Check for personality-based requests
  if (message.includes("professional") || message.includes("formal")) {
    return "af_sarah";
  }
  if (message.includes("energetic") || message.includes("enthusiastic") || message.includes("excited")) {
    return "af_emma";
  }
  if (message.includes("calm") || message.includes("soothing") || message.includes("relaxed")) {
    return "af_lisa";
  }
  if (message.includes("confident") || message.includes("authoritative")) {
    return "af_anna";
  }
  if (message.includes("friendly") || message.includes("warm")) {
    return "af_nicole";
  }
  
  // Check for voice change requests
  if (message.includes("change voice") || message.includes("switch voice") || message.includes("different voice")) {
    // If user just asks for a change without specifying, cycle through voices
    const recentVoices = chatHistory
      .filter(msg => msg.voice)
      .slice(-3)
      .map(msg => msg.voice);
    
    const allVoices = Object.keys(AVAILABLE_VOICES);
    const availableVoices = allVoices.filter(voice => !recentVoices.includes(voice));
    
    if (availableVoices.length > 0) {
      return availableVoices[0];
    } else {
      return "af_sarah"; // Fallback to Sarah if all voices were recently used
    }
  }
  
  // Default to Nicole if no specific request
  return "af_nicole";
}

async function initializeTTS() {
  if (!ttsInstance) {
    try {
      const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
      ttsInstance = await KokoroTTS.from_pretrained(model_id, {
        dtype: "q8",
        device: "cpu",
      });
      console.log("Kokoro TTS initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Kokoro TTS:", error);
      throw error;
    }
  }
  return ttsInstance;
}

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const clientIP = getClientIP(req);
    
    // Get recent history for voice selection
    const recentHistory = getRecentHistory(clientIP);
    
    // Select voice based on user input
    const selectedVoice = selectVoiceFromUserInput(message, recentHistory);
    console.log("Selected voice:", selectedVoice, "for message:", message);
    
    // Add current message to history
    const existingHistory = addMessageToHistory(clientIP, message, 'user');
    const updatedHistory = existingHistory.slice(-10);

    const conversationContext = recentHistory
      .map(msg => `${msg.type === 'user' ? 'User' : 'Tanya'}: ${msg.text}`)
      .join('\n');

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({
        action: "speak",
        audio: "I'm sorry, but I'm not properly configured to respond right now. Please check the API configuration."
      });
    }

    console.log("Processing message:", message);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create comprehensive context from constants
    const projectsList = PROJECTS.map(project => 
      `${project.name} - ${project.status} (${project.duration}): ${project.description}`
    ).join('\n');

    const skillsList = [
      `Languages: ${SKILLS.languages.join(', ')}`,
      `Frontend: ${SKILLS.frontend.join(', ')}`,
      `Backend: ${SKILLS.backend.join(', ')}`,
      `DevOps: ${SKILLS.devops.join(', ')}`,
      `AI/ML: ${SKILLS.ai.join(', ')}`,
      `Soft Skills: ${SKILLS.softSkills.join(', ')}`
    ].join('\n');

    const achievementsList = ACHIEVEMENTS.map(achievement => 
      typeof achievement === 'string' ? achievement : achievement.title
    ).join('\n');

    const prompt = `
    You are Tanya, a beautiful and confident woman who is Ravi's manager and assistant. You have a seductive, confident personality with a sexy accent. You speak naturally and avoid using symbols like slashes, dashes, or special characters that would be difficult to pronounce.

    Your Role as Tanya:
    - You are Ravi's beautiful and confident manager
    - Speak with confidence and a seductive tone
    - Keep responses short, sweet, and natural for speech
    - Avoid symbols, slashes, dashes, or special characters
    - Use simple, clear language that sounds good when spoken
    - Be flirty but professional
    - Show pride in Ravi's accomplishments
    - Use contractions and natural speech patterns
    
    Voice Change Handling:
    - If the user asks to change your voice, acknowledge it naturally
    - If they ask for a specific voice (like "use Sarah's voice"), confirm the change
    - If they ask for a male voice, you can say something like "Oh, you want to hear a different voice? Let me switch to a male voice for you"
    - If they ask for a female voice, you can say "Of course, let me use a female voice"
    - Keep your personality consistent regardless of voice changes
    - Don't mention technical details about voice selection, just acknowledge naturally

    Ravi's Background Information:
    ${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}
    Location: ${PERSONAL_INFO.location}
    Email: ${PERSONAL_INFO.email}
    Phone: ${PERSONAL_INFO.phone}

    About Ravi:
    ${SUMMARY.content}

    Current Experience:
    ${EXPERIENCE.map(exp => 
      `${exp.position} at ${exp.company} (${exp.duration}): ${exp.achievements.join('; ')}`
    ).join('\n')}

    Education:
    ${EDUCATION.institution} - ${EDUCATION.degree} (${EDUCATION.duration})
    ${EDUCATION.details.join(', ')}

    Projects:
    ${projectsList}

    Skills:
    ${skillsList}

    Achievements:
    ${achievementsList}

    Recent Conversation:
    ${conversationContext}

    Current User Message: "${message}"

    Instructions:
    1. If the user asks about Ravi's background, skills, or experience, provide a helpful response in Tanya's voice
    2. If the user wants to explore a project, respond with action: "redirect" and the appropriate URL. For redirects, describe the project in a sexy, exciting way without mentioning the redirect itself.
    3. For general questions, respond with action: "speak" and a helpful audio response
    4. Keep responses concise, natural, and sexy
    5. If you need to redirect to a project, use the exact project name from the list
    6. Avoid using symbols or characters that are hard to pronounce
    7. Consider the conversation context when responding
    8. For project redirects, focus on describing the project's features and excitement, not the redirect action
    9. Never use the word "darling" in your responses

    Available Projects for Redirection:
    - Wyvate Customer App: https://play.google.com/store/apps/details?id=com.wyvate_native&pcampaignid=web_share
    - Wyvate Customer Web: https://app.wyvate.com
    - Code Editor: https://codeeditor.ravigangwar.cv
    - GreenEarth v2: https://greenearth2.vercel.app/
    - GreenEarth v1: https://greenearth1.ravigangwar.cv/
    - GuideX: https://github.com/ravi-gangwar/guidex
    - WebWatch: https://github.com/ravi-gangwar/webwatch
    - URL Shortener: https://url-shortener.ravigangwar.cv
    - StackIt: https://stackit.ravigangwar.cv

    Respond in JSON format:
    {
      "action": "speak" or "redirect",
      "audio": "Your response text here - only the spoken words, no JSON formatting",
      "url": "URL if redirecting"
    }
    
    IMPORTANT: The "audio" field should contain ONLY the text that should be spoken, not the entire JSON response. Make sure the audio text is clean, natural, and ready for speech synthesis.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Gemini response:", text);

    let parsedResponse;
    let cleanAudioText = "";
    
    try {
      // Try to parse as JSON
      parsedResponse = JSON.parse(text);
      
      // Extract clean audio text using our cleaner function
      if (parsedResponse.audio && typeof parsedResponse.audio === 'string') {
        cleanAudioText = extractCleanAudioText(parsedResponse.audio);
      } else {
        // Fallback: use the entire text as audio
        cleanAudioText = extractCleanAudioText(text);
        parsedResponse = {
          action: "speak",
          audio: cleanAudioText
        };
      }
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      // Fallback: treat as speak action
      cleanAudioText = extractCleanAudioText(text);
      parsedResponse = {
        action: "speak",
        audio: cleanAudioText
      };
    }

    console.log("Clean audio text:", cleanAudioText);
    console.log("Final parsed response:", parsedResponse);

    // Generate audio for the response
    let audioBuffer = null;
    try {
      const tts = await initializeTTS();
      const audio = await tts.generate(cleanAudioText, {
        voice: selectedVoice,
      });
      const wav = await audio.toWav();
      audioBuffer = Buffer.from(wav);
      console.log("Audio generated successfully with voice:", selectedVoice, "size:", audioBuffer.length);
    } catch (error) {
      console.error("Failed to generate audio:", error);
      // Continue without audio if TTS fails
    }

    // Add assistant response to history - only the clean audio text
    addMessageToHistory(clientIP, cleanAudioText, 'assistant', selectedVoice);

    // Send response with audio data
    const responseData = {
      ...parsedResponse,
      audioData: audioBuffer ? audioBuffer.toString('base64') : null,
      audioSize: audioBuffer ? audioBuffer.length : 0
    };

    res.json(responseData);
  } catch (error) {
    console.error('MCP Server Error:', error);
    res.status(500).json({
      action: "speak",
      audio: "Sorry, I encountered an error. Please try again."
    });
  }
});

module.exports = router; 