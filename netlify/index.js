// Firebase Admin SDK to access Firebase services
const admin = require("firebase-admin");
// Firebase Functions SDK to create Cloud Functions
const functions = require("firebase-functions");
// Axios for making HTTP requests to Google APIs
const axios = require("axios");
// CORS for allowing requests from your web app
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();

// --- API Key Management (SERVER-SIDE ONLY) ---
// These keys are now secure on the server and never exposed to the client.
const CHAT_API_KEYS = [
    "AIzaSyBMdu5xEUCs-QE7u49rjHdFZYGeMJMC_Tk", "AIzaSyDngozc3tFYKVZHk3NRNCy4rrl1geEp0n4", "AIzaSyAhE7K0v4R7fzPemP-2FVtK_14N57RaC3g", "AIzaSyA0nv6qsVyLpvUQdytqUjqjGQfj4zGciYk", "AIzaSyD4cnNRkh482o07U3HfoDuYX3A71xkz8z8", "AIzaSyAjS_A3LuFs-1oI255mFDn2rL7Eto5c9I0", "AIzaSyCkBBjXLs-lKAfwbdZcACZJ79C_CNjzENs", "AIzaSyB8Dg7alT2cEWtRCuTj37MkCrqg6f-z9MY", "AIzaSyC1zY8mEfG6wUCBE9MccyA_gtMPQEtenIY", "AIzaSyDno6x2_85j79UnsfjN7AnoaA9uidsjppM", "AIzaSyBtjJO4hWnA-YCmQdaUuqiqLkt18YAL7_I", "AIzaSyA6W2S0e5uJI3Uw5rHQoWjr2i_Qy6YQVzg", "AIzaSyBeivg37E6dehHPWp85SsHtN1N0o-MUB8Q", "AIzaSyDx-f4Ms0J9ZIwUINavmMuIFnBtgi7Bk1E", "AIzaSyDn6aa1RS2gHDwi0tPZZsi4AsJVd3vEW-Y", "AIzaSyBStP5ltrP8k88TyaP8NdV1DRD24byzM8E", "AIzaSyDVFCnfF9se6nE3bwIhIQOu91_HLxpfZDY", "AIzaSyCC7QY0D1mBzMgDymahmqriw_t-Q1RgEUo", "AIzaSyBEj0kvZTSrHPvwZAQLiiio0DQYBoGugVU", "AIzaSyB_mbku4fzxrStOwLdtGDyALYpPmZZz2WE", "AIzaSyDAxnpdAta5N78jy6pQDgsHaE5rjXDfJ4s", "AIzaSyDsL1KCgookMuWlFP1Zk8wf2w91HDo9LzY", "AIzaSyB-ooWktZ4UffBZgl3ScpK50yywdRV5YtU", "AIzaSyC093aL2JapVjTy_09iD7aeVpREoP1Ea1o", "AIzaSyCkuvWA16ky5xNMmZShvIq-EO_zO3_kIy4", "AIzaSyA0PGYnOVunEuUJHIEPcAZoHeszwaYzLBI", "AIzaSyCTtc0P7C5XczrB0u5shYTeK2HfgqMAAiU", "AIzaSyAfche8yDzTKtj92-WQoek_yvpXuTgzMoo", "AIzaSyCJmHFF_jdG-iHDx7T_lcT4a3gg--iQNWA", "AIzaSyA_OorLkiCcBmUEVTg7ArRMFbzNZavblus"
];

const TTS_API_KEYS = [
    "AIzaSyBN3C93CB-Cog1SycjlGoLWgDzN4deYtoI", "AIzaSyD1tOVALG03EH2rj-pB7vP3nnVRd_qvZ3U", "AIzaSyC_7JP4WCxvmBeIuLcNQYg9ZA9Bgp9SiDQ", "AIzaSyB86pxAvG1BXy3g8D3C8oQ7VSivdxS3MbI", "AIzaSyDPGuCiNDbWF8D3rncXwv_EipMTMTcv4-I", "AIzaSyDcaT51JOe-0_4_H41xqSPPviHmWmMfxj8", "AIzaSyDb9V1vqXcilDJx8D2iHk52--sZhioeG2w", "AIzaSyB4-UD8LcVD7WCN_U2F9u4hqHaP_-BGmRk", "AIzaSyCzxAi7UxnvJFollr0lVaQMd8TfwHj__oo", "AIzaSyDl51ZgJjb5K1kzorMkzDu3PLjWMTMR_co", "AIzaSyDinruhBeVGIy_giyRtfyNnZ8fPxdRqpcE", "AIzaSyC1YC5FFYe16W0QpfAA1PCDmwSlULPYwQw", "AIzaSyDs1QUbBaAnuZpNcd20TQGg5imiBMYV5Jo", "AIzaSyCgWiKSkc_bnldCRAy130TXd5jWsg8qKHI", "AIzaSyD-SM2M0jOOP0BnwAJRbGd5HS3irqOFzqc", "AIzaSyAnJicjY8-aorsNe-tnf-sss5ZWT11cPVo", "AIzaSyCSB4fZ9QSURj-xl37HYqeNUSQUeAwdA2g", "AIzaSyDdGWI0svALRkqbZtub9UfBk9vvmF76OrM", "AIzaSyAoxmkZK8aLjNIWDiQczwTVMcEwJ76gxJw", "AIzaSyCceLxDnjyMAOPbo2JicvlD7K9_miPAQfE", "AIzaSyB2IzTFYPHQp0ctEa1iaoU82WbL09mKpvg", "AIzaSyC_FAGDSUL_vnIoprdsgPqvYppuKceJP2w", "AIzaSyDLnCHwiIwD02EHGBy_CLsscZ4dPMCNHwc", "AIzaSyCYo2P_S4qJsMRc0YEARnsxDNNNYze9v5A", "AIzaSyADUyYvlMfp2WxgquGR4AzdmgXbIQDxbE0", "AIzaSyDiHwnKVfAKJWcmsDJCpncJlGe72VOZLuM", "AIzaSyBrQ_CN3zK0hHXnYZri-cWKgnI6kvV_Drk", "AIzaSyC4JYl9BPiZciRiL3dasbJazUYGAw-JVNE", "AIzaSyDYGrljCh01gorEPQk1aXtIRiUnp0EN6fM", "AIzaSyDlLhk2fiU9-aN2SIxgmVWafHF77Z7r_Ec", "AIzaSyD3TFTBZ_tiIj3uHXYlMhERXNRuxRScZ_8", "AIzaSyBbBIzg-tJLRUkIPECvC_Tqe2eOsG2ZTmg"
];

let chatKeyIndex = 0;
let ttsKeyIndex = 0;

const getNextChatKey = () => {
    const key = CHAT_API_KEYS[chatKeyIndex];
    chatKeyIndex = (chatKeyIndex + 1) % CHAT_API_KEYS.length;
    return key;
};

const getNextTtsKey = () => {
    const key = TTS_API_KEYS[ttsKeyIndex];
    ttsKeyIndex = (ttsKeyIndex + 1) % TTS_API_KEYS.length;
    return key;
};

/**
 * Cloud Function to securely call the Gemini Chat API.
 */
exports.callGeminiApi = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }
        
        const { contents, systemInstruction } = req.body;

        if (!contents) {
            return res.status(400).send("Missing 'contents' in request body.");
        }

        const apiKey = getNextChatKey();
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await axios.post(apiUrl, {
                contents,
                systemInstruction,
            });
            res.status(200).json(response.data);
        } catch (error) {
            console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
            res.status(error.response ? error.response.status : 500).send("Error calling Gemini API");
        }
    });
});

/**
 * Cloud Function to securely call the Gemini TTS API.
 */
exports.callTtsApi = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        const { text } = req.body;
        if (!text) {
            return res.status(400).send("Missing 'text' in request body.");
        }
        
        const apiKey = getNextTtsKey();
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: `Say this in an Egyptian Arabic accent: "${text}"` }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
            },
            model: "gemini-2.5-flash-preview-tts"
        };
        
        try {
            const response = await axios.post(apiUrl, payload);
            res.status(200).json(response.data);
        } catch (error) {
            console.error("Error calling TTS API:", error.response ? error.response.data : error.message);
            res.status(error.response ? error.response.status : 500).send("Error calling TTS API");
        }
    });
});
