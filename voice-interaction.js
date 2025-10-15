// --- [ملف جديد] voice-interaction.js ---
// هذا الملف يدير كل ما يتعلق بالمحادثات الصوتية والتعرف على الكلام.

// استيراد الدوال اللازمة من الملف الرئيسي (سيتم تعديله لاحقًا لتمكين هذا)
import { sendMessageToBot, speakText, getApiKey, getSystemPromptWithContext } from './main.js';

// تهيئة واجهة برمجة تطبيقات التعرف على الكلام بالمتصفح
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false; // التوقف عن الاستماع بعد انتهاء الكلام
    recognition.lang = 'ar-EG'; // اللغة الافتراضية هي العربية المصرية
    recognition.interimResults = true; // عرض النتائج الأولية أثناء التحدث
}

// متغيرات لإدارة حالة المحادثة الصوتية
let isVoiceCallActive = false;
let isEnglishTeacherMode = false;
let isBotSpeaking = false;
let stopListeningTimeout;

// عناصر الواجهة الرسومية التي سيتم التحكم بها
const callBtn = document.getElementById('voice-call-btn');
const callStatusModal = document.getElementById('call-status-modal');
const callStatusText = document.getElementById('call-status-text');
const micVisualizer = document.getElementById('mic-visualizer');
const englishTeacherToggle = document.getElementById('english-teacher-toggle');

/**
 * دالة لبدء أو إنهاء المحادثة الصوتية.
 */
function toggleVoiceCall() {
    if (!SpeechRecognition) {
        alert("متصفحك لا يدعم ميزة التعرف على الصوت.");
        return;
    }

    isVoiceCallActive = !isVoiceCallActive;
    if (isVoiceCallActive) {
        startVoiceCall();
    } else {
        endVoiceCall();
    }
}

/**
 * تبدأ جلسة المحادثة الصوتية.
 */
function startVoiceCall() {
    callBtn.classList.add('active');
    callStatusModal.classList.remove('hidden');
    updateCallStatus('اضغط على المايكروفون لبدء التحدث...', 'idle');
    // لا تبدأ الاستماع تلقائيًا، انتظر المستخدم ليبدأ
}

/**
 * تنهي جلسة المحادثة الصوتية.
 */
function endVoiceCall() {
    isVoiceCallActive = false;
    recognition.stop();
    callBtn.classList.remove('active');
    callStatusModal.classList.add('hidden');
    clearTimeout(stopListeningTimeout);
}

/**
 * تحديث حالة وواجهة نافذة المحادثة الصوتية.
 * @param {string} text - النص الذي سيُعرض.
 * @param {string} state - الحالة الحالية ('idle', 'listening', 'processing', 'speaking').
 */
function updateCallStatus(text, state) {
    callStatusText.textContent = text;
    micVisualizer.className = `mic-visualizer ${state}`;
}

/**
 * تبدأ عملية الاستماع لصوت المستخدم.
 */
function startListening() {
    if (!isVoiceCallActive || recognition.isListening) return;

    isBotSpeaking = false; // إيقاف أي حديث للبوت
    recognition.lang = isEnglishTeacherMode ? 'en-US' : 'ar-EG';
    updateCallStatus('...يتم الاستماع الآن', 'listening');
    recognition.start();

    // إضافة مؤقت لإيقاف الاستماع بعد فترة من الصمت
    clearTimeout(stopListeningTimeout);
    stopListeningTimeout = setTimeout(() => {
        if (recognition.isListening) {
            recognition.stop();
        }
    }, 5000); // 5 ثوانٍ من الصمت
}

/**
 * معالجة الكلام الذي تم التعرف عليه.
 * @param {string} transcript - النص المحول من كلام المستخدم.
 */
async function handleTranscription(transcript) {
    updateCallStatus('...جاري معالجة طلبك', 'processing');
    
    let responseText;

    if (isEnglishTeacherMode) {
        // إذا كان وضع معلم الإنجليزية مفعل، أرسل النص مع طلب التصحيح
        const englishTeacherPrompt = `
            You are an expert English teacher. The user will provide a sentence in English. Your task is to:
            1.  Identify any grammatical errors, awkward phrasing, or mispronunciations (based on the text).
            2.  Provide the corrected sentence in English.
            3.  Briefly explain the corrections in Arabic.
            4.  Provide the full corrected sentence again in English at the end.
            User's sentence: "${transcript}"
        `;
        // استخدم دالة خاصة لإرسال هذا الطلب للحصول على استجابة مباشرة
        responseText = await getDirectBotResponse(englishTeacherPrompt);

    } else {
        // في الوضع العادي، أرسل النص كرسالة عادية
        responseText = await sendMessageToBot(transcript);
    }

    if (responseText) {
        isBotSpeaking = true;
        updateCallStatus('...يتحدث المساعد الآن', 'speaking');
        // استخدم دالة التحدث الموجودة في main.js
        const audio = await speakText(responseText); 
        if (audio) {
            audio.onended = () => {
                isBotSpeaking = false;
                if (isVoiceCallActive) {
                    // العودة إلى وضع الاستعداد بعد انتهاء البوت من الكلام
                    updateCallStatus('اضغط على المايكروفون للتحدث', 'idle');
                }
            };
        }
    } else {
         updateCallStatus('حدث خطأ، حاول مرة أخرى', 'idle');
    }
}

/**
 * دالة مساعدة للحصول على رد مباشر من Gemini لمهمة معينة (مثل تصحيح الإنجليزية).
 * @param {string} prompt - الموجه الذي سيتم إرساله.
 * @returns {Promise<string|null>}
 */
async function getDirectBotResponse(prompt) {
     try {
        const apiKey = getApiKey('chat'); // احصل على مفتاح API من main.js
        const finalSystemPrompt = getSystemPromptWithContext('');

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: finalSystemPrompt }] }
            })
        });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
        console.error("Direct bot response error:", err);
        return "عفواً، حدث خطأ أثناء محاولة تصحيح الجملة.";
    }
}


// --- ربط الأحداث ---

if (SpeechRecognition) {
    // عند الحصول على نتيجة نهائية من التعرف على الكلام
    recognition.onresult = (event) => {
        clearTimeout(stopListeningTimeout); // ألغِ مؤقت الصمت
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        
        if (transcript.trim()) {
            handleTranscription(transcript.trim());
        }
    };
    
    // عرض النص المؤقت أثناء تحدث المستخدم
    recognition.onaudiostart = () => {
        recognition.isListening = true;
    };
    
    recognition.onaudioend = () => {
        recognition.isListening = false;
        if(micVisualizer.classList.contains('listening')) {
           updateCallStatus('...لحظة من فضلك', 'processing');
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        updateCallStatus('لم أتمكن من سماعك، حاول مرة أخرى', 'idle');
    };
}

// تبديل وضع معلم اللغة الإنجليزية
englishTeacherToggle.addEventListener('change', (e) => {
    isEnglishTeacherMode = e.target.checked;
    const statusLabel = document.getElementById('english-teacher-status');
    if (isEnglishTeacherMode) {
        statusLabel.textContent = 'مُفعّل';
        updateCallStatus('English Teacher mode is ON. Tap the mic to speak.', 'idle');
    } else {
        statusLabel.textContent = 'غير مُفعّل';
        updateCallStatus('اضغط على المايكروفون للتحدث', 'idle');
    }
});

// زر الميكروفون داخل نافذة المحادثة
micVisualizer.addEventListener('click', () => {
    if (!micVisualizer.classList.contains('listening')) {
        startListening();
    }
});

// زر بدء/إنهاء المكالمة الرئيسي
callBtn.addEventListener('click', toggleVoiceCall);

// إغلاق النافذة عند الضغط على زر الإغلاق
document.getElementById('close-call-modal').addEventListener('click', endVoiceCall);
