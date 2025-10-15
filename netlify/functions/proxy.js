// --- API Key Management (SERVER-SIDE & SECURE) ---
// These keys are now stored as environment variables in Netlify, not in the code.
const CHAT_API_KEYS = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];
const TTS_API_KEYS = process.env.TTS_API_KEYS ? process.env.TTS_API_KEYS.split(',') : [];

let chatKeyIndex = 0;
let ttsKeyIndex = 0;

const getNextKey = (type) => {
    if (type === 'chat') {
        if (CHAT_API_KEYS.length === 0) return null;
        const key = CHAT_API_KEYS[chatKeyIndex];
        chatKeyIndex = (chatKeyIndex + 1) % CHAT_API_KEYS.length;
        return key;
    } else {
        if (TTS_API_KEYS.length === 0) return null;
        const key = TTS_API_KEYS[ttsKeyIndex];
        ttsKeyIndex = (ttsKeyIndex + 1) % TTS_API_KEYS.length;
        return key;
    }
};

// Main handler for all API requests
exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { type, payload } = JSON.parse(event.body);
        let apiUrl, apiKey, apiPayload;

        if (type === 'chat') {
            apiKey = getNextKey('chat');
            if (!apiKey) throw new Error("Chat API keys are not configured on the server.");
            
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            apiPayload = payload;

        } else if (type === 'tts') {
            apiKey = getNextKey('tts');
            if (!apiKey) throw new Error("TTS API keys are not configured on the server.");

            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
            apiPayload = {
                contents: [{ parts: [{ text: `Say this in an Egyptian Arabic accent: "${payload.text}"` }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
                },
                model: "gemini-2.5-flash-preview-tts"
            };
        } else {
            return { statusCode: 400, body: 'Invalid request type' };
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiPayload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Google API Error: ${response.status}`, errorBody);
            return { statusCode: response.status, body: `Error from Google API: ${errorBody}` };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Serverless function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
