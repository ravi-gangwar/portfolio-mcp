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
  clearHistory,
  getHistoryStats,
  extractCleanAudioText 
} = require('../utils/chatHistory');

let ttsInstance = null;

// Available Kokoro TTS voices (based on actual available voices from Kokoro)
const AVAILABLE_VOICES = {
  "af_nicole": { name: "Nicole", description: "Friendly and warm", gender: "female" },
  "af_sarah": { name: "Sarah", description: "Professional and clear", gender: "female" },
  "af_emma": { name: "Emma", description: "Energetic and enthusiastic", gender: "female" },
  "af_bella": { name: "Bella", description: "Passionate and engaging", gender: "female" },
  "af_heart": { name: "Heart", description: "Warm and caring", gender: "female" },
  "af_alloy": { name: "Alloy", description: "Clear and precise", gender: "female" },
  "af_aoede": { name: "Aoede", description: "Melodic and expressive", gender: "female" },
  "af_jessica": { name: "Jessica", description: "Professional and confident", gender: "female" },
  "af_kore": { name: "Kore", description: "Elegant and sophisticated", gender: "female" },
  "af_nova": { name: "Nova", description: "Dynamic and energetic", gender: "female" },
  "af_river": { name: "River", description: "Smooth and flowing", gender: "female" },
  "af_sky": { name: "Sky", description: "Light and airy", gender: "female" },
  "am_adam": { name: "Adam", description: "Casual and friendly", gender: "male" },
  "am_echo": { name: "Echo", description: "Clear and resonant", gender: "male" },
  "am_eric": { name: "Eric", description: "Professional and reliable", gender: "male" },
  "am_fenrir": { name: "Fenrir", description: "Strong and powerful", gender: "male" },
  "am_liam": { name: "Liam", description: "Warm and approachable", gender: "male" },
  "am_michael": { name: "Michael", description: "Confident and authoritative", gender: "male" },
  "am_onyx": { name: "Onyx", description: "Deep and rich", gender: "male" },
  "am_puck": { name: "Puck", description: "Playful and energetic", gender: "male" },
  "am_santa": { name: "Santa", description: "Jolly and cheerful", gender: "male" },
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
  if (message.includes("bella")) {
    return "af_bella";
  }
  if (message.includes("heart")) {
    return "af_heart";
  }
  if (message.includes("alloy")) {
    return "af_alloy";
  }
  if (message.includes("aoede")) {
    return "af_aoede";
  }
  if (message.includes("jessica")) {
    return "af_jessica";
  }
  if (message.includes("kore")) {
    return "af_kore";
  }
  if (message.includes("nova")) {
    return "af_nova";
  }
  if (message.includes("river")) {
    return "af_river";
  }
  if (message.includes("sky")) {
    return "af_sky";
  }
  if (message.includes("adam")) {
    return "am_adam";
  }
  if (message.includes("echo")) {
    return "am_echo";
  }
  if (message.includes("eric")) {
    return "am_eric";
  }
  if (message.includes("fenrir")) {
    return "am_fenrir";
  }
  if (message.includes("liam")) {
    return "am_liam";
  }
  if (message.includes("michael")) {
    return "am_michael";
  }
  if (message.includes("onyx")) {
    return "am_onyx";
  }
  if (message.includes("puck")) {
    return "am_puck";
  }
  if (message.includes("santa")) {
    return "am_santa";
  }
  
  // Check for gender-based requests
  if (message.includes("male voice") || message.includes("guy voice") || message.includes("man voice") || message.includes("male")) {
    return "am_michael"; // Default male voice
  }
  if (message.includes("female voice") || message.includes("girl voice") || message.includes("woman voice") || message.includes("female")) {
    return "af_nicole"; // Default female voice
  }
  
  // Check for personality-based requests
  if (message.includes("professional") || message.includes("formal")) {
    return "af_sarah";
  }
  if (message.includes("energetic") || message.includes("enthusiastic") || message.includes("excited")) {
    return "af_emma";
  }
  if (message.includes("passionate") || message.includes("engaging")) {
    return "af_bella";
  }
  if (message.includes("warm") || message.includes("caring")) {
    return "af_heart";
  }
  if (message.includes("clear") || message.includes("precise")) {
    return "af_alloy";
  }
  if (message.includes("melodic") || message.includes("expressive")) {
    return "af_aoede";
  }
  if (message.includes("confident") || message.includes("authoritative")) {
    return "am_michael";
  }
  if (message.includes("friendly") || message.includes("approachable")) {
    return "am_liam";
  }
  if (message.includes("strong") || message.includes("powerful")) {
    return "am_fenrir";
  }
  if (message.includes("deep") || message.includes("rich")) {
    return "am_onyx";
  }
  if (message.includes("playful") || message.includes("fun")) {
    return "am_puck";
  }
  if (message.includes("jolly") || message.includes("cheerful")) {
    return "am_santa";
  }
  
  // Check for voice change requests
  if (message.includes("change voice") || message.includes("switch voice") || message.includes("different voice") || message.includes("change the voice")) {
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

// History stats endpoint for debugging
router.get('/history-stats', (req, res) => {
  const clientIP = getClientIP(req);
  const stats = getHistoryStats(clientIP);
  res.json({
    ip: clientIP,
    stats: stats,
    totalActiveSessions: chatHistoryStore.size
  });
});

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

    REDIRECT RULE: When user asks to "show me", "see", "explore", "visit", "open", or "go to" any project, ALWAYS use action: "redirect" with the project URL.

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
    - If the user asks to change your voice, acknowledge it naturally and confirm the change
    - If they ask for a specific voice (like "use Sarah's voice"), say "Of course! Let me switch to Sarah's voice for you"
    - If they ask for a male voice, say "Oh, you want to hear a male voice? Let me switch to a male voice for you"
    - If they ask for a female voice, say "Of course! Let me use a female voice for you"
    - If they just say "change the voice" or "change voice", say "Sure! Let me switch to a different voice for you"
    - Keep your personality consistent regardless of voice changes
    - Always acknowledge the voice change before continuing with your response
    - Don't mention technical details about voice selection, just acknowledge naturally
    
    Project Exploration:
    - If user asks to "show me", "see", "explore", "visit", "open", or "go to" any project, use action: "redirect"
    - If user asks "tell me about" a project, describe it briefly then use action: "redirect"
    - Always include the correct URL in the "url" field when redirecting
    - Keep project descriptions short and exciting
    


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
    2. If user asks to "show me", "see", "explore", "visit", "open", or "go to" any project, use action: "redirect"
    3. If user asks "tell me about" a project, describe it briefly then use action: "redirect"
    4. Always include the correct URL when redirecting
    5. For general questions, respond with action: "speak" and a helpful audio response
    6. Keep responses concise, natural, and sexy
    7. If you need to redirect to a project, use the exact project name from the list
    8. Avoid using symbols or characters that are hard to pronounce
    9. Consider the conversation context when responding
    10. Never use the word "darling" in your responses

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

    REDIRECT EXAMPLES:
    - User: "show me Wyvate app" → action: "redirect", url: "https://play.google.com/store/apps/details?id=com.wyvate_native&pcampaignid=web_share"
    - User: "see the code editor" → action: "redirect", url: "https://codeeditor.ravigangwar.cv"
    - User: "explore GreenEarth" → action: "redirect", url: "https://greenearth2.vercel.app/"
    - User: "visit StackIt" → action: "redirect", url: "https://stackit.ravigangwar.cv"

    CRITICAL REDIRECT RULE:
    - If user asks to "show me", "see", "explore", "visit", "open", or "go to" any project, use action: "redirect"
    - If user asks "tell me about" a project, describe briefly then use action: "redirect"
    - Always include the correct URL in the "url" field when redirecting
    
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