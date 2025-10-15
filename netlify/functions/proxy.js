const axios = require('axios');

// Read keys from environment variables (comma-separated)
const CHAT_API_KEYS = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(Boolean) : [];
const TTS_API_KEYS = process.env.TTS_API_KEYS ? process.env.TTS_API_KEYS.split(',').map(k => k.trim()).filter(Boolean) : [];

let chatKeyIndex = 0;
let ttsKeyIndex = 0;

const getNextKey = (type) => {
  if (type === 'chat') {
    if (CHAT_API_KEYS.length === 0) return null;
    const k = CHAT_API_KEYS[chatKeyIndex];
    chatKeyIndex = (chatKeyIndex + 1) % CHAT_API_KEYS.length;
    return k;
  } else {
    if (TTS_API_KEYS.length === 0) return null;
    const k = TTS_API_KEYS[ttsKeyIndex];
    ttsKeyIndex = (ttsKeyIndex + 1) % TTS_API_KEYS.length;
    return k;
  }
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify(body)
});

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  try {
    const parsed = JSON.parse(event.body || '{}');
    const { type, payload } = parsed;

    if (!type) return jsonResponse(400, { error: 'Missing "type" in request body' });

    let apiKey, apiUrl, apiPayload;

    if (type === 'chat') {
      apiKey = getNextKey('chat');
      if (!apiKey) return jsonResponse(500, { error: 'Chat API keys not configured on server' });

      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      apiPayload = payload;

    } else if (type === 'tts') {
      apiKey = getNextKey('tts');
      if (!apiKey) return jsonResponse(500, { error: 'TTS API keys not configured on server' });

      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
      apiPayload = {
        contents: [{ parts: [{ text: `Say this in an Egyptian Arabic accent: "${payload && payload.text ? payload.text : ''}"` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
        },
        model: "gemini-2.5-flash-preview-tts"
      };
    } else {
      return jsonResponse(400, { error: 'Invalid request type' });
    }

    const response = await axios.post(apiUrl, apiPayload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json',
      timeout: 30000
    });

    return jsonResponse(200, response.data);

  } catch (err) {
    console.error('Serverless function error:', err && (err.response ? err.response.data : err.message));
    return jsonResponse(500, { error: err.message || 'Unknown server error' });
  }
};
