// In-memory chat history storage
const chatHistoryStore = new Map();

// Cleanup old chat history - clear after 5 minutes of inactivity
setInterval(() => {
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  chatHistoryStore.forEach((history, ip) => {
    const lastMessageTime = history.length > 0 ? history[history.length - 1].timestamp : 0;
    if (lastMessageTime < fiveMinutesAgo) {
      chatHistoryStore.delete(ip);
      console.log(`Cleared chat history for IP: ${ip} (inactive for 5+ minutes)`);
    }
  });
}, 60000); // Check every minute

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress ||
         'unknown';
}

function addMessageToHistory(ip, message, type, voice = null) {
  const existingHistory = chatHistoryStore.get(ip) || [];
  existingHistory.push({ 
    timestamp: Date.now(), 
    type, 
    text: message,
    voice: voice
  });
  const recentHistory = existingHistory.slice(-10);
  chatHistoryStore.set(ip, recentHistory);
  return recentHistory;
}

function getRecentHistory(ip) {
  return chatHistoryStore.get(ip) || [];
}

function clearHistory(ip) {
  chatHistoryStore.delete(ip);
  return true;
}

function getHistoryStats(ip) {
  const history = chatHistoryStore.get(ip) || [];
  const lastMessageTime = history.length > 0 ? history[history.length - 1].timestamp : null;
  const currentTime = Date.now();
  const fiveMinutesInMs = 5 * 60 * 1000;
  
  let timeUntilClear = null;
  if (lastMessageTime) {
    const timeSinceLastMessage = currentTime - lastMessageTime;
    timeUntilClear = Math.max(0, fiveMinutesInMs - timeSinceLastMessage);
  }
  
  return {
    totalMessages: history.length,
    userMessages: history.filter(msg => msg.type === 'user').length,
    assistantMessages: history.filter(msg => msg.type === 'assistant').length,
    lastMessageTime: lastMessageTime,
    timeUntilAutoClear: timeUntilClear,
    willAutoClearIn: timeUntilClear ? Math.ceil(timeUntilClear / 1000) : null // seconds
  };
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
  clearHistory,
  getHistoryStats,
  extractCleanAudioText
}; 