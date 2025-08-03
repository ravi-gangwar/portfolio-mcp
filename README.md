# Portfolio Voice Assistant Backend

This is the Express.js backend server for the portfolio voice assistant, providing MCP (Model Context Protocol) and TTS (Text-to-Speech) functionality.

## Features

- **MCP (Model Context Protocol)**: Handles voice assistant conversations using Google Gemini AI
- **TTS (Text-to-Speech)**: Converts text to speech using Kokoro TTS with Nicole voice
- **Chat History Management**: In-memory chat history with automatic cleanup
- **Security**: CORS protection, rate limiting, and helmet security headers
- **Performance**: Compression and optimized response handling

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Start the server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### MCP (Voice Assistant)
- **POST** `/api/mcp` - Process voice assistant requests
  - Body: `{ "message": "user message", "chatHistory": [...] }`
  - Response: `{ "action": "speak"|"redirect", "audio": "response text", "url": "redirect url" }`

### TTS (Text-to-Speech)
- **POST** `/api/tts` - Convert text to speech
  - Body: `{ "text": "text to convert" }`
  - Response: Audio WAV file

## Development

The server runs on `http://localhost:5000` by default.

### Project Structure
```
backend/
├── src/
│   ├── routes/
│   │   ├── mcp.js      # Voice assistant endpoint
│   │   └── tts.js      # Text-to-speech endpoint
│   ├── middleware/
│   │   └── cors.js     # CORS configuration
│   ├── utils/
│   │   └── chatHistory.js # Chat history management
│   ├── constants.js    # Portfolio data constants
│   └── server.js       # Main server file
├── package.json
├── env.example
└── README.md
```

## Deployment

### Local Development
1. Start the backend: `npm run dev`
2. Start the Next.js frontend: `cd ../portfolio-resume && npm run dev`
3. The frontend will connect to `http://localhost:5000`

### Production Deployment
1. Set `NODE_ENV=production` in your environment
2. Update `NEXT_PUBLIC_BACKEND_URL` in the frontend to point to your deployed backend
3. Deploy the backend to your preferred hosting service (Railway, Render, Heroku, etc.)
4. Update CORS settings in `src/middleware/cors.js` to allow your frontend domain

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `GEMINI_API_KEY`: Google Gemini API key (required)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Update allowed origins in `src/middleware/cors.js`
2. **TTS Not Working**: Ensure Kokoro TTS model is accessible
3. **MCP Errors**: Verify Google Gemini API key is valid
4. **Memory Issues**: Chat history is automatically cleaned up every minute

### Logs
The server provides detailed console logs for debugging:
- MCP request processing
- TTS generation status
- Error handling
- Server startup information

## Security

- Rate limiting: 100 requests per 15 minutes per IP
- CORS protection with configurable origins
- Helmet security headers
- Input validation and sanitization
- Error handling without exposing sensitive information 