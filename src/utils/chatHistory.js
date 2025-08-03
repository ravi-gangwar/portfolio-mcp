// In-memory chat history storage
const chatHistoryStore = new Map();

// Cleanup old chat history
setInterval(() => {
  const threeMinutesAgo = Date.now() - (3 * 60 * 1000);
  chatHistoryStore.forEach((history, ip) => {
    const filteredHistory = history.filter((msg) => msg.timestamp > threeMinutesAgo);
    if (filteredHistory.length === 0) {
      chatHistoryStore.delete(ip);
    } else {
      chatHistoryStore.set(ip, filteredHistory);
    }
  });
}, 60000);

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress ||
         'unknown';
}

function addMessageToHistory(ip, message, type) {
  const existingHistory = chatHistoryStore.get(ip) || [];
  existingHistory.push({ 
    timestamp: Date.now(), 
    type, 
    text: message 
  });
  const recentHistory = existingHistory.slice(-10);
  chatHistoryStore.set(ip, recentHistory);
  return recentHistory;
}

function getRecentHistory(ip) {
  return chatHistoryStore.get(ip) || [];
}

function extractCleanAudioText(text) {
  // If the text contains JSON structure, extract only the audio field
  if (text.includes('"audio"') && text.includes('"action"')) {
    try {
      // Try to parse as JSON first
      const jsonMatch = text.match(/"audio"\s*:\s*"([^"]*)"/);
      if (jsonMatch) {
        return jsonMatch[1];
      }
    } catch (e) {
      // If JSON parsing fails, continue with other methods
    }
  }
  
  // If it's wrapped in code blocks, extract the content
  if (text.includes('```')) {
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      const codeContent = codeBlockMatch[1];
      // Try to extract audio from the code content
      const audioMatch = codeContent.match(/"audio"\s*:\s*"([^"]*)"/);
      if (audioMatch) {
        return audioMatch[1];
      }
      return codeContent;
    }
  }
  
  // If no special formatting, return the text as is
  return text.trim();
}

module.exports = {
  getClientIP,
  addMessageToHistory,
  getRecentHistory,
  extractCleanAudioText
}; 