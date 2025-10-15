import { db, auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, getDocs, query, orderBy, limit, doc, onSnapshot, runTransaction, addDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { systemPrompt, getSystemPrompt } from './system-prompt.js';
import { suggestedQuestions } from './suggested-questions.js';
import { getStudentLeadersInfo } from './manager.js';

// --- عناصر واجهة المستخدم الرئيسية ---
const chatContainer = document.getElementById('chat-container');
const suggestionsContainer = document.getElementById('suggestions-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const darkToggle = document.getElementById('dark-mode-toggle');
const uploadImgBtn = document.getElementById('upload-img-btn');
const imageUploadInput = document.getElementById('image-upload-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const messageCounter = document.getElementById('message-counter-number');
const audioCounter = document.getElementById('audio-counter-number');
const savePdfBtn = document.getElementById('save-chat-pdf-btn');

// --- عنوان URL الخاص بوظيفة Netlify الآمنة ---
const SECURE_API_PROXY_URL = '/.netlify/functions/proxy';

// --- عناصر لوحة التحكم للمسؤول ---
const adminPanelBtn = document.getElementById('admin-panel-btn');
const adminModal = document.getElementById('admin-modal');
const closeAdminModalBtn = document.getElementById('close-admin-modal');
const logsLoader = document.getElementById('logs-loader');
const logsTableBody = document.querySelector('#logs-table tbody');
const adminTabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const downloadLogsPdfBtn = document.getElementById('download-logs-pdf-btn');
const tempDataInput = document.getElementById('temp-data-input');
const saveTempDataBtn = document.getElementById('save-temp-data-btn');
const clearTempDataBtn = document.getElementById('clear-temp-data-btn');
const tempDataStatus = document.getElementById('temp-data-status');

// --- متغيرات الحالة والأمان ---
let isAdmin = false;
const ADMIN_EMAIL = 'nadembadrs2@gmail.com';
let fetchedLogs = [];
let temporaryData = ''; 
let chatHistory = [];
let logoBase64 = '';
let fontLoaded = false;
let embeddedVfsName = 'Amiri-Regular.ttf';
let ALL_SUGGESTED_QUESTIONS = [];
let typingIndicatorElement = null;
let currentAudio = null;
let uploadedImageBase64 = null;
const ttsCache = new Map();
const chatResponseCache = new Map();
const studentLeadersData = getStudentLeadersInfo();
let allPeople = [];

// --- مراجع وثائق Firestore ---
const statsRef = doc(db, "stats", "counters");
const tempDataRef = doc(db, "app_config", "temporaryData");

// --- دالة تسجيل الدخول للمسؤول ---
async function signInAdmin() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Admin sign-in failed", error);
        alert("فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.");
    }
}

// --- دالة جلب وعرض سجلات المحادثات ---
async function fetchAndDisplayChatLogs() {
    if (!isAdmin) {
        console.error("Security Alert: Non-admin trying to fetch logs.");
        logsTableBody.innerHTML = '<tr><td colspan="2">ليس لديك الصلاحية لعرض هذه البيانات.</td></tr>';
        return;
    }

    logsLoader.classList.remove('hidden');
    logsTableBody.innerHTML = '';

    try {
        const logsQuery = query(collection(db, "chatLogs"), orderBy("timestamp", "desc"), limit(100));
        const querySnapshot = await getDocs(logsQuery);
        
        fetchedLogs = []; // مسح السجلات القديمة المحفوظة
        if (querySnapshot.empty) {
            logsTableBody.innerHTML = '<tr><td colspan="2">لا توجد سجلات محادثات حتى الآن.</td></tr>';
        } else {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                fetchedLogs.push(data); // حفظ السجلات للتحميل
                const row = logsTableBody.insertRow();
                const questionCell = row.insertCell(0);
                const answerCell = row.insertCell(1);
                
                questionCell.textContent = data.question || "سؤال غير مسجل";
                answerCell.textContent = data.answer || "إجابة غير مسجلة";
            });
        }
    } catch (error) {
        console.error("Error fetching chat logs: ", error);
        logsTableBody.innerHTML = `<tr><td colspan="2">حدث خطأ: ${error.message}</td></tr>`;
    } finally {
        logsLoader.classList.add('hidden');
    }
}

// --- ربط الأحداث بلوحة التحكم ---
adminPanelBtn.addEventListener('click', () => {
    if (isAdmin) {
        adminModal.classList.remove('hidden');
        tempDataInput.value = temporaryData;
        fetchAndDisplayChatLogs(); 
    } else {
        signInAdmin();
    }
});

closeAdminModalBtn.addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

// --- مراقبة حالة المصادقة ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.isAnonymous) {
            isAdmin = false;
            adminPanelBtn.style.color = 'white';
        } else if (user.email && user.email.toLowerCase() === ADMIN_EMAIL) {
            isAdmin = true;
            console.log("Admin authenticated successfully.");
            adminPanelBtn.style.color = '#68D391';
        } else {
            isAdmin = false;
            console.warn("Non-admin user signed in:", user.email);
            alert("هذا الحساب غير مصرح له بالوصول. سيتم تسجيل خروجك.");
            auth.signOut().then(() => signInAnonymously(auth));
        }
    } else {
        isAdmin = false;
        signInAnonymously(auth).catch(err => console.error("Initial anonymous login failed:", err));
    }
});

function saveChatHistory() {
    try {
        sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } catch (e) {
        console.error('Failed to save chat history:', e);
    }
}

function loadChatHistory() {
    try {
        const savedHistory = sessionStorage.getItem('chatHistory');
        if (savedHistory) {
            const parsedHistory = JSON.parse(savedHistory);
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                chatHistory = parsedHistory;
                chatContainer.innerHTML = '';
                chatHistory.forEach(message => {
                    const isUser = message.role === 'user';
                    const text = message.parts.find(p => p.text)?.text || '';
                    const imagePart = message.parts.find(p => p.inlineData);
                    const imageSrc = imagePart ? `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` : null;
                    addMessage(text, isUser, imageSrc, false);
                });
                setTimeout(() => {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    const lastMessage = chatHistory[chatHistory.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                        updateSuggestions(lastMessage.parts[0]?.text || '');
                    } else {
                        updateSuggestions();
                    }
                }, 100);
            } else {
                showWelcome();
            }
        } else {
            showWelcome();
        }
    } catch (e) {
        console.error('Failed to load chat history:', e);
        showWelcome();
    }
}

function flattenPeopleData(dataObject) {
    for (const key in dataObject) {
        const item = dataObject[key];
        if (item && typeof item === 'object') {
            if (item.name && (item.title || item.details || item.departmentName)) {
                allPeople.push({
                    name: item.name,
                    images: item.images || []
                });
            }
            flattenPeopleData(item);
        }
    }
}

flattenPeopleData(studentLeadersData);

function showTypingIndicator() {
    if (typingIndicatorElement) return;
    const row = document.createElement('div');
    row.className = 'msg-row bot';
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = `<img src="logo.png" alt="bot avatar" class="w-full h-full rounded-full object-cover">`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble bot';
    bubble.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;

    row.appendChild(avatar);
    row.appendChild(bubble);

    typingIndicatorElement = row;
    chatContainer.appendChild(typingIndicatorElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
    if (typingIndicatorElement) {
        typingIndicatorElement.remove();
        typingIndicatorElement = null;
    }
}

function parseAllSuggestions() {
    if (ALL_SUGGESTED_QUESTIONS.length > 0) return ALL_SUGGESTED_QUESTIONS;
    const questions = [];
    const lines = suggestedQuestions.split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
            questions.push(trimmed.substring(2).trim());
        }
    });
    ALL_SUGGESTED_QUESTIONS = questions.filter(q => q && !q.includes('---'));
    return ALL_SUGGESTED_QUESTIONS;
}

async function loadLogo() {
    return new Promise((resolve) => {
        fetch('logo.png')
            .then(res => {
                if (!res.ok) throw new Error('Logo not found for PDF');
                return res.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    logoBase64 = reader.result;
                    resolve();
                };
                reader.onerror = resolve; 
                reader.readAsDataURL(blob);
            })
            .catch(e => {
                console.warn('Base64 logo load failed:', e);
                resolve(); 
            });
    });
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, "&#039;");
}

function markdownTableToHtml(markdown) {
    const rows = markdown.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()));
    if (rows.length < 2) return markdown;
    const headers = rows[0].filter(h => h);
    const bodyRows = rows.slice(2);
    let tableHtml = '<table><thead><tr>';
    headers.forEach(header => { tableHtml += `<th>${header}</th>`; });
    tableHtml += '</tr></thead><tbody>';
    bodyRows.forEach(row => {
        tableHtml += '<tr>';
        const cells = row.filter((c, i) => i > 0 && i < row.length - 1);
        cells.forEach(cell => { tableHtml += `<td>${cell}</td>`; });
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    return tableHtml;
}

function formatBotMessage(message) {
    const isCourseList = (message.includes('**---') || message.includes('مرحلة')) && message.includes('**-') && message.includes('- ');
    if (isCourseList) {
        return formatCourseListToHtml(message);
    }

    const parts = message.split(/(```[\s\S]*?```)/g);
    let finalHtml = '';

    for (const part of parts) {
        if (!part.trim()) continue;

        if (part.startsWith('```')) {
            const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/;
            const match = part.match(codeBlockRegex);
            if (match) {
                const lang = match[1] || 'plaintext';
                const code = escapeHtml(match[2].trim());
                
                finalHtml += `
                    <div class="code-block-wrapper">
                        <div class="code-block-header">
                            <span class="code-lang">${lang}</span>
                            <button class="copy-code-btn" title="نسخ الكود">
                               <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                <span class="copy-text">نسخ</span>
                            </button>
                        </div>
                        <pre><code class="language-${lang}">${code}</code></pre>
                    </div>`;
            } else {
                 finalHtml += `<pre><code>${escapeHtml(part)}</code></pre>`;
            }
        } else {
            const blocks = part.trim().split(/\n\s*\n/);
            for (const block of blocks) {
                if (!block.trim()) continue;
                 if (block.includes('|') && block.includes('-')) {
                    finalHtml += `<div class="table-wrapper">${markdownTableToHtml(block)}</div>`;
                } else {
                    let textBlock = block.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
                    textBlock = textBlock.replace(/(?<![("]|href=")(https?:\/\/[^\s<]+)/g, '<a href="$&" target="_blank" rel="noopener noreferrer">$&</a>');
                    textBlock = textBlock.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    
                    const keywords = ["الذكاء الاصطناعي", "الأمن السيبراني", "علوم البيانات", "الميكاترونكس", "الأوتوترونكس", "الملابس الجاهزة", "التحكم الصناعي", "بكالوريوس", "دبلوم", "جامعة حلوان", "نديم بدر"];
                    const regex = new RegExp(`(${keywords.join('|')})`, 'g');
                    if (!textBlock.startsWith('<a')) {
                        textBlock = textBlock.replace(regex, '<span class="highlight-text">$1</span>');
                    }
                    finalHtml += `<p>${textBlock.replace(/\n/g, '<br>')}</p>`;
                }
            }
        }
    }

    for (const person of allPeople) {
        if (message.includes(person.name) && person.images.length > 0) {
            const randomImage = person.images[Math.floor(Math.random() * person.images.length)];
            finalHtml += `<img src="${randomImage}" alt="صورة ${person.name}" class="rounded-lg mt-4 w-full max-w-xs block mx-auto">`;
            break;
        }
    }
    
    const suggestionRegex = /<p>-\s*(.*?)\?<\/p>/g;
    finalHtml = finalHtml.replace(suggestionRegex, (match, questionText) => {
        const fullQuestion = questionText + '?';
        return `<button class="suggest-btn-inline" data-question="${escapeHtml(fullQuestion)}">${escapeHtml(fullQuestion)}</button>`;
    });

    const phoneRegex = /(\+20\s?\d{10,11})(?!<\/a>)/g;
    finalHtml = finalHtml.replace(phoneRegex, (match) => {
        const cleanPhone = match.replace(/\s/g, '');
        const whatsappPhone = cleanPhone.replace('+', '');
        return `<div class="phone-container">
                    <a href="#" class="phone-link" data-phone="${cleanPhone}">${match}</a>
                    <div class="phone-actions-popup">
                        <a href="tel:${cleanPhone}" class="action-btn call" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            اتصال
                        </a>
                        <a href="[https://wa.me/$](https://wa.me/$){whatsappPhone}" class="action-btn whatsapp" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            واتساب
                        </a>
                    </div>
                </div>`;
    });

    return finalHtml;
}

function parseCourseList(text) {
    const stages = [];
    let currentStage = null;
    let currentTerm = null;
    const lines = text.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('**---')) {
            if (currentStage) {
                if (currentTerm) currentStage.terms.push(currentTerm);
                stages.push(currentStage);
            }
            currentStage = { stageTitle: trimmedLine.replace(/\*|-/g, '').trim(), terms: [] };
            currentTerm = null;
        } else if (trimmedLine.startsWith('**-') && (trimmedLine.endsWith(':**') || trimmedLine.endsWith(':'))) {
            if (currentTerm && currentStage) {
                currentStage.terms.push(currentTerm);
            }
            currentTerm = { termTitle: trimmedLine.replace(/\*\*-|:\*\*|\*|:/g, '').trim(), courses: [] };
        } else if (trimmedLine.startsWith('- ')) {
            if (currentTerm) {
                currentTerm.courses.push(trimmedLine.substring(2).trim());
            }
        }
    }
    if (currentTerm && currentStage) currentStage.terms.push(currentTerm);
    if (currentStage) stages.push(currentStage);
    return stages;
}

function formatCourseListToHtml(text) {
    const introText = text.split('**---')[0].trim();
    let html = introText ? `<p>${escapeHtml(introText).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>` : '';
    const stages = parseCourseList(text);

    stages.forEach(stage => {
        html += `<p class="course-stage-title">${escapeHtml(stage.stageTitle)}</p>`;
        stage.terms.forEach(term => {
            if (!term.courses.length) return;
            html += `<p class="course-term-title">${escapeHtml(term.termTitle)}</p>`;
            html += '<div class="table-wrapper"><table><thead><tr><th>المادة الدراسية</th></tr></thead><tbody>';
            term.courses.forEach(course => {
                html += `<tr><td>${escapeHtml(course)}</td></tr>`;
            });
            html += '</tbody></table></div>';
        });
    });
    return html;
}

async function updateSuggestions(contextText = '') {
    suggestionsContainer.innerHTML = '';
    const allQs = parseAllSuggestions();
    let finalSuggestions = new Set();

    if (contextText) {
        const contextWords = new Set(contextText.substring(0, 250).split(/[\s،.]+/));
        for (const q of allQs) {
            if (finalSuggestions.size >= 2) break;
            const questionWords = q.split(' ');
            if (questionWords.some(qw => contextWords.has(qw) && qw.length > 2)) {
                finalSuggestions.add(q);
            }
        }
    }

    const shuffled = [...allQs].sort(() => 0.5 - Math.random());
    for (const q of shuffled) {
        if (finalSuggestions.size >= 4) break;
        finalSuggestions.add(q);
    }
    
    if (finalSuggestions.size === 0) {
        shuffled.slice(0, 4).forEach(q => finalSuggestions.add(q));
    }

    Array.from(finalSuggestions).slice(0, 5).forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'suggest-btn';
        btn.textContent = text;
        btn.addEventListener('click', () => {
            userInput.value = text;
            sendMessage();
        });
        suggestionsContainer.appendChild(btn);
    });
}

function addMessage(message, isUser = false, imageSrc = null, shouldScroll = true) {
    const row = document.createElement('div');
    row.className = 'msg-row ' + (isUser ? 'user' : 'bot');

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    if (isUser) {
        avatar.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    } else {
        avatar.innerHTML = `<img src="logo.png" alt="bot avatar" class="w-full h-full rounded-full object-cover">`;
    }

    if (isUser) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble user';
        let contentHTML = '';
        if(imageSrc) {
            contentHTML += `<img src="${imageSrc}" class="rounded-lg mb-2 max-w-full h-auto" style="max-height: 200px;" alt="User uploaded image">`;
        }
        if(message) {
            contentHTML += `<div>${escapeHtml(message)}</div>`;
        }
        bubble.innerHTML = contentHTML;
        row.appendChild(bubble);
        row.appendChild(avatar);
    } else {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        const bubble = document.createElement('div');
        bubble.className = 'bubble bot';
        bubble.innerHTML = formatBotMessage(message.replace(/^- .+/gm, '').trim());
        messageContainer.appendChild(bubble);
        
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'message-actions';
        const textToSpeak = cleanTextForSpeech(message);
        const ttsBtn = document.createElement('button');
        ttsBtn.className = 'icon-action-btn';
        ttsBtn.title = 'تشغيل الصوت';
        ttsBtn.innerHTML = `<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span><span class="loader"></span>`;
        ttsBtn.addEventListener('click', () => speakText(textToSpeak, ttsBtn));
        const copyBtn = document.createElement('button');
        copyBtn.className = 'icon-action-btn';
        copyBtn.title = 'نسخ النص';
        copyBtn.innerHTML = `<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span>`;
        copyBtn.addEventListener('click', () => copyTextToClipboard(textToSpeak, copyBtn));
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'icon-action-btn';
        downloadBtn.title = 'تحميل الصوت';
        downloadBtn.innerHTML = `<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span><span class="loader"></span>`;
        downloadBtn.addEventListener('click', () => downloadAudio(textToSpeak, downloadBtn));
        actionsContainer.appendChild(ttsBtn);
        actionsContainer.appendChild(copyBtn);
        actionsContainer.appendChild(downloadBtn);
        messageContainer.appendChild(actionsContainer);
        const isCourseList = (message.includes('**---') || message.includes('مرحلة')) && message.includes('**-') && message.includes('- ');
        if (message.includes('|') || isCourseList) {
            try {
                const pdfBtn = document.createElement('button');
                pdfBtn.className = 'pdf-download-btn';
                pdfBtn.textContent = 'تحميل المحتوى بصيغة PDF';
                const fileName = deriveFilenameFromMarkdown(message);
                pdfBtn.addEventListener('click', () => {
                    generatePdfFromContent(message, fileName)
                });
                messageContainer.appendChild(pdfBtn);
            } catch (e) { console.warn('append pdf button failed', e); }
        }
        row.appendChild(avatar);
        row.appendChild(messageContainer);
    }

    row.classList.add('message-fade-in');
    chatContainer.appendChild(row);

    if (!isUser) {
        row.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        row.querySelectorAll('.copy-code-btn').forEach(button => {
            button.addEventListener('click', () => {
                const codeElement = button.closest('.code-block-wrapper').querySelector('code');
                const textToCopy = codeElement.innerText;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    const copyTextSpan = button.querySelector('.copy-text');
                    if (copyTextSpan) {
                        const originalText = copyTextSpan.textContent;
                        copyTextSpan.textContent = 'تم النسخ!';
                        button.classList.add('copied');
                        setTimeout(() => {
                            copyTextSpan.textContent = originalText;
                            button.classList.remove('copied');
                        }, 2000);
                    }
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        });
    }
    
    if (shouldScroll) {
        if (isUser) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
            const userMessages = chatContainer.querySelectorAll('.msg-row.user');
            if (userMessages.length > 0) {
                const lastUserMessage = userMessages[userMessages.length - 1];
                setTimeout(() => {
                     lastUserMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }

    if (!isUser) {
        updateSuggestions(message.replace(/^- .+/gm, '').trim());
    }
}

function deriveFilenameFromMarkdown(markdown) {
    try {
        const lines = markdown.split('\n').map(l => l.trim()).filter(Boolean);
        let potentialTitle = '';
        const titleLine = lines.find(l => l.includes('بالتفصيل') || l.includes('خطة دراسة') || l.includes('المقررات الدراسية'));
        if (titleLine) {
            potentialTitle = titleLine.replace(/[*:]/g, '').trim();
        }

        const headerLine = lines.find(l => l.includes('|') && !l.startsWith('|-'));
        if (headerLine) {
            const parts = headerLine.split('|').map(p => p.trim()).filter(Boolean);
            if (parts.length) {
                const titleToUse = potentialTitle || parts[0];
                const safe = titleToUse.replace(/[^\u0600-\u06FF\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 40);
                return safe || ('table_' + Date.now());
            }
        }

        if (potentialTitle) {
            const safe = potentialTitle.replace(/[^\u0600-\u06FF\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 40);
            return safe || ('table_' + Date.now());
        }
    } catch (e) { console.warn('Error deriving filename:', e); }
    return 'table_' + Date.now();
}

async function logConversation(question, answer) {
    if (!question || !answer) return;
    try {
        await addDoc(collection(db, "chatLogs"), {
            question: question,
            answer: answer,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Error adding document to chatLogs: ", e);
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

async function tryLoadFontToDoc(doc) {
    const candidates = ['./fonts/Amiri-Regular.ttf', 'fonts/Amiri-Regular.ttf', './Amiri-Regular.ttf', '/fonts/Amiri-Regular.ttf'];
    for (const url of candidates) {
        try {
            const r = await fetch(url);
            if (!r.ok) throw new Error('not ok ' + r.status);
            const ab = await r.arrayBuffer();
            const b64 = arrayBufferToBase64(ab);
            doc.addFileToVFS(embeddedVfsName, b64);
            doc.addFont(embeddedVfsName, 'Amiri', 'normal');
            doc.setFont('Amiri');
            fontLoaded = true;
            return true;
        } catch (e) {
            console.warn('font fetch failed', url, e);
        }
    }
    fontLoaded = false;
    return false;
}

async function generatePdfFromContent(text, fileName) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    try { await tryLoadFontToDoc(doc); } catch (e) { console.warn(e); }

    if (logoBase64) {
        try { doc.addImage(logoBase64, 'PNG', 15, 10, 30, 30); } catch (e) { console.warn(e); }
    }
    doc.setFontSize(16);
    doc.text("المساعد الذكي لجامعة حلوان التكنولوجية", 200, 25, { align: 'right' });
    doc.setFontSize(12);
    doc.text(fileName.replace(/_/g, ' '), 200, 35, { align: 'right' });

    let lastY = 45;

    const isCourseList = (text.includes('**---') || text.includes('مرحلة')) && text.includes('**-') && text.includes('- ');

    if (isCourseList) {
        const stages = parseCourseList(text);

        stages.forEach(stage => {
            if (lastY > 250) { doc.addPage(); lastY = 20; }
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(stage.stageTitle, 200, lastY, { align: 'right' });
            lastY += 10;
            doc.setFont(undefined, 'normal');

            stage.terms.forEach(term => {
                if (!term.courses.length) return;

                doc.setFontSize(12);
                const termTitleHeight = doc.getTextDimensions(term.termTitle).h;
                if (lastY + termTitleHeight > doc.internal.pageSize.height - 30) {
                    doc.addPage();
                    lastY = 20;
                }
                doc.text(term.termTitle, 200, lastY, { align: 'right' });
                lastY += 8;

                const head = [['المادة الدراسية']];
                const body = term.courses.map(course => [course]);

                doc.autoTable({
                    head, body, startY: lastY,
                    styles: { font: fontLoaded ? 'Amiri' : undefined, halign: 'right' },
                    headStyles: { fillColor: [37, 99, 235] }
                });
                lastY = doc.previousAutoTable.finalY + 10;
            });
        });
    } else {
        const tableLines = text.trim().split('\n').filter(line => line.trim().startsWith('|'));
        if (tableLines.length >= 2) {
            const head = [tableLines[0].split('|').slice(1, -1).map(h => h.trim())];
            const body = tableLines.slice(2).map(row => row.split('|').slice(1, -1).map(c => c.trim()));
            doc.autoTable({
                head, body, startY: lastY,
                styles: { font: fontLoaded ? 'Amiri' : undefined, halign: 'right' },
                headStyles: { fillColor: [37, 99, 235] }
            });
        }
    }
    doc.save(`${fileName}.pdf`);
}

async function generateChatPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    await tryLoadFontToDoc(doc);

    // Header
    if (logoBase64) {
        try { doc.addImage(logoBase64, 'PNG', 10, 10, 20, 20); } catch (e) { console.warn(e); }
    }
    doc.setFontSize(16);
    doc.text("سجل المحادثة مع المساعد الذكي", 200, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(new Date().toLocaleString('ar-EG'), 200, 28, { align: 'right' });
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);

    let y = 45;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const maxWidth = 180;

    for (const message of chatHistory) {
        const isUser = message.role === 'user';
        const textContent = message.parts.find(p => p.text)?.text || '';
        const cleanText = textContent.replace(/<[^>]*>/g, '').replace(/\*\*/g, '');

        if (!cleanText) continue;

        doc.setFontSize(11);
        const lines = doc.splitTextToSize(cleanText, maxWidth);
        const textHeight = doc.getTextDimensions(lines).h;

        if (y + textHeight > pageHeight - margin) {
            doc.addPage();
            y = margin + 10;
        }

        if (isUser) {
            doc.setTextColor(0, 0, 150); 
            doc.setFont(undefined, 'bold');
            doc.text("أنت:", 200, y, { align: 'right' });
            y += 7;
        } else {
            doc.setTextColor(0, 100, 0); 
            doc.setFont(undefined, 'bold');
            doc.text("المساعد:", 200, y, { align: 'right' });
            y += 7;
        }
        
        doc.setTextColor(40);
        doc.setFont(undefined, 'normal');
        doc.text(lines, 200, y, { align: 'right' });

        y += textHeight + 10;
    }

    doc.save(`سجل_المحادثة_${new Date().toISOString().slice(0,10)}.pdf`);
}


function cleanTextForSpeech(markdownText) {
    return markdownText
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/\|/g, ', ')
        .replace(/---|--/g, '')
        .replace(/#/g, '')
        .replace(/\n/g, ' ')
        .trim();
}

function copyTextToClipboard(text, buttonElement) {
    const originalIcon = buttonElement.innerHTML;
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    buttonElement.innerHTML = `<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`;
    setTimeout(() => {
        buttonElement.innerHTML = originalIcon;
    }, 2000);
}


function pcmToWav(pcmData, sampleRate) {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    const pcm16 = new Int16Array(pcmData);

    view.setUint32(0, 0x52494646, false); 
    view.setUint32(4, 36 + pcm16.byteLength, true);
    view.setUint32(8, 0x57415645, false);
    view.setUint32(12, 0x666d7420, false);
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x64617461, false);
    view.setUint32(40, pcm16.byteLength, true);

    return new Blob([header, pcm16], { type: 'audio/wav' });
}

async function fetchOrGetCachedAudio(text, buttonElement) {
    if (ttsCache.has(text)) {
        return ttsCache.get(text);
    }
    
    buttonElement.classList.add('loading');
    buttonElement.disabled = true;

    const maxRetries = 4;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
            const response = await fetch(SECURE_API_PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'tts', payload: { text } })
            });

            if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const message = errorData?.error?.message || `API error: ${response.status}`;
                    const error = new Error(message);
                    error.status = response.status;
                    throw error;
            }
            
            const result = await response.json();
            const part = result?.candidates?.[0]?.content?.parts?.[0];
            const audioData = part?.inlineData?.data;
            const mimeType = part?.inlineData?.mimeType;

            if (audioData && mimeType && mimeType.startsWith("audio/")) {
                const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
                const pcmData = Uint8Array.from(atob(audioData), c => c.charCodeAt(0)).buffer;
                const wavBlob = pcmToWav(pcmData, sampleRate);
                const audioUrl = URL.createObjectURL(wavBlob);
                
                ttsCache.set(text, audioUrl);
                
                buttonElement.classList.remove('loading');
                buttonElement.disabled = false;
                return audioUrl;
            } else {
                throw new Error("Invalid audio data in response.");
            }

        } catch (error) {
            lastError = error;
            console.error(`Audio Fetch Error (Attempt ${attempt + 1}/${maxRetries}):`, error.message);
            if (error.status === 429 && attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else if (attempt < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
        console.error("Audio Fetch failed after all retries:", lastError);
        buttonElement.classList.remove('loading');
        buttonElement.disabled = false;
        return null;
}

async function speakText(text, buttonElement) {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentAudio.buttonElement) {
            currentAudio.buttonElement.innerHTML = `<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span><span class="loader"></span>`;
        }
        if (currentAudio.buttonElement === buttonElement) {
            currentAudio = null;
            return;
        }
    }
    
    const audioUrl = await fetchOrGetCachedAudio(text, buttonElement);
    if(audioUrl) {
        playAudio(audioUrl, buttonElement);
    }
}

async function downloadAudio(text, buttonElement) {
    const audioUrl = await fetchOrGetCachedAudio(text, buttonElement);
    if (audioUrl) {
        triggerDownload(audioUrl, text);
    }
}

async function playAudio(audioUrl, buttonElement) {
        currentAudio = new Audio(audioUrl);
        currentAudio.buttonElement = buttonElement;

        buttonElement.innerHTML = `<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12"></rect></svg></span><span class="loader"></span>`;
        
        currentAudio.play();
        
        try {
            await runTransaction(db, async (transaction) => {
                const statsDoc = await transaction.get(statsRef);
                if (!statsDoc.exists()) {
                    transaction.set(statsRef, { audioCount: 1 });
                } else {
                    const newCount = (statsDoc.data().audioCount || 0) + 1;
                    transaction.update(statsRef, { audioCount: newCount });
                }
            });
        } catch (e) {
            console.error("Failed to update audio count: ", e);
        }
        
        currentAudio.onended = () => {
        buttonElement.innerHTML = `<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span><span class="loader"></span>`;
        currentAudio = null;
        };
}

function triggerDownload(audioUrl, text) {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${text.substring(0, 25).replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 512;
            const MAX_HEIGHT = 512;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const dataUrl = canvas.toDataURL('image/jpeg');
            uploadedImageBase64 = dataUrl.split(',')[1];

            displayImagePreview(dataUrl);
            sendBtn.disabled = false;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayImagePreview(imageSrc) {
    imagePreviewContainer.innerHTML = `
        <div class="preview-wrapper">
            <img src="${imageSrc}" class="preview-image">
            <button class="remove-image-btn">&times;</button>
        </div>
    `;
    imagePreviewContainer.querySelector('.remove-image-btn').addEventListener('click', clearImagePreview);
}

function clearImagePreview() {
    uploadedImageBase64 = null;
    imagePreviewContainer.innerHTML = '';
    imageUploadInput.value = ''; // Reset file input
    sendBtn.disabled = userInput.value.trim() === '';
}

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage && !uploadedImageBase64) return;
    
    const imageToSend = uploadedImageBase64;
    const imageSrcForDisplay = imageToSend ? `data:image/jpeg;base64,${imageToSend}` : null;
    
    addMessage(userMessage, true, imageSrcForDisplay);
    
    try {
        await runTransaction(db, async (transaction) => {
            const statsDoc = await transaction.get(statsRef);
            if (!statsDoc.exists()) {
                transaction.set(statsRef, { messageCount: 1 });
            } else {
                const newCount = (statsDoc.data().messageCount || 0) + 1;
                transaction.update(statsRef, { messageCount: newCount });
            }
        });
    } catch (e) {
        console.error("Failed to update message count: ", e);
    }
    
    userInput.value = '';
    sendBtn.disabled = true;
    suggestionsContainer.innerHTML = '';
    clearImagePreview();

    if (chatResponseCache.has(userMessage) && !imageToSend) {
        const cachedResponse = chatResponseCache.get(userMessage);
        addMessage(cachedResponse, false);
        return;
    }

    showTypingIndicator();
    
    const parts = [];
    if(userMessage) parts.push({ text: userMessage });
    if(imageToSend) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageToSend } });

    const userObj = { role: 'user', parts: parts };
    const conversation = [...chatHistory, userObj];
    
    const finalSystemPrompt = getSystemPrompt(temporaryData);

    try {
        const res = await fetch(SECURE_API_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type: 'chat',
                payload: {
                    contents: conversation, 
                    systemInstruction: { parts: [{ text: finalSystemPrompt }] } 
                }
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: { message: `Proxy error! status: ${res.status}` } }));
            throw new Error(errorData.error.message);
        }

        const data = await res.json();
        const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (botMessage) {
            if (!imageToSend) {
                chatResponseCache.set(userMessage, botMessage);
            }
            addMessage(botMessage, false);
            chatHistory.push(userObj, { role: 'model', parts: [{ text: botMessage }] });
            saveChatHistory();
            logConversation(userMessage, botMessage);
        } else {
            throw new Error("Proxy returned no message.");
        }
    } catch (err) {
        console.error(`Error calling secure proxy:`, err);
        addMessage('عفواً، حدث خطأ أثناء الاتصال بالخادم الوسيط. يرجى المحاولة مرة أخرى لاحقاً.', false);
    }

    hideTypingIndicator();
    sendBtn.disabled = userInput.value.trim() !== '' || uploadedImageBase64 !== null;
    userInput.focus();
}

function initDarkMode() {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') document.documentElement.classList.add('dark');
    darkToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    });
}

function showWelcome() {
    const welcomeMessage = `أهلاً بك في **المساعد الذكي** لـ <span class="highlight-text">جامعة حلوان التكنولوجية</span>! كيف يمكنني خدمتك اليوم?`;
    addMessage(welcomeMessage, false);
    chatHistory.push({ role: 'model', parts: [{ text: welcomeMessage }] });
    saveChatHistory();
}

userInput.addEventListener('input', () => {
    sendBtn.disabled = userInput.value.trim() === '' && !uploadedImageBase64;
});
userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
sendBtn.addEventListener('click', sendMessage);

uploadImgBtn.addEventListener('click', () => imageUploadInput.click());
imageUploadInput.addEventListener('change', handleImageUpload);

async function generateLogsPdf() {
    if (fetchedLogs.length === 0) {
        alert('لا توجد سجلات لتحميلها.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    await tryLoadFontToDoc(doc);
    doc.setFont('Amiri');

    doc.setFontSize(18);
    doc.text("سجل محادثات المساعد الذكي", 200, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(new Date().toLocaleString('ar-EG'), 200, 28, { align: 'right' });

    const head = [['الإجابة', 'السؤال']];
    const body = fetchedLogs.map(log => [log.answer, log.question]);

    doc.autoTable({
        head: head,
        body: body,
        startY: 35,
        styles: { font: 'Amiri', halign: 'right' },
        headStyles: { fillColor: [37, 99, 235] },
        columnStyles: {
            0: { halign: 'right' },
            1: { halign: 'right' }
        }
    });

    doc.save(`سجل_المحادثات_${new Date().toISOString().slice(0,10)}.pdf`);
}

saveTempDataBtn.addEventListener('click', async () => {
    const dataToSave = tempDataInput.value.trim();
    try {
        await setDoc(tempDataRef, { 
            content: dataToSave,
            lastUpdated: serverTimestamp() 
        });
        tempDataStatus.textContent = 'تم حفظ البيانات بنجاح! سيستخدمها المساعد الآن.';
        tempDataStatus.classList.add('success');
        tempDataStatus.classList.remove('info', 'hidden');
    } catch (e) {
        console.error("Error saving temp data: ", e);
        tempDataStatus.textContent = 'حدث خطأ أثناء الحفظ.';
        tempDataStatus.classList.add('error');
        tempDataStatus.classList.remove('success', 'info', 'hidden');
    } finally {
        setTimeout(() => {
            tempDataStatus.classList.add('hidden');
        }, 4000);
    }
});

clearTempDataBtn.addEventListener('click', async () => {
    try {
        await setDoc(tempDataRef, { 
            content: "",
            lastUpdated: serverTimestamp()
        });
        tempDataInput.value = '';
        tempDataStatus.textContent = 'تم حذف البيانات المؤقتة بنجاح.';
        tempDataStatus.classList.add('info');
        tempDataStatus.classList.remove('success', 'hidden');
    } catch (e) {
        console.error("Error clearing temp data: ", e);
         tempDataStatus.textContent = 'حدث خطأ أثناء الحذف.';
        tempDataStatus.classList.add('error');
        tempDataStatus.classList.remove('success', 'info', 'hidden');
    } finally {
        setTimeout(() => {
            tempDataStatus.classList.add('hidden');
        }, 4000);
    }
});

downloadLogsPdfBtn.addEventListener('click', generateLogsPdf);

adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        adminTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tabId = tab.dataset.tab;
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', async () => {
    initDarkMode();
    parseAllSuggestions();
    await loadLogo();

    savePdfBtn.addEventListener('click', generateChatPdf);

    onSnapshot(statsRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            messageCounter.textContent = data.messageCount || 0;
            audioCounter.textContent = data.audioCount || 0;
        } else {
            messageCounter.textContent = 0;
            audioCounter.textContent = 0;
        }
    });

    onSnapshot(tempDataRef, (docSnap) => {
        if (docSnap.exists()) {
            temporaryData = docSnap.data().content || "";
            console.log("Updated temporary data from Firestore.");
        } else {
            temporaryData = "";
            console.log("No temporary data found in Firestore.");
        }
    });

    loadChatHistory();
});

document.addEventListener('click', function(e) {
    const clickedPhoneLink = e.target.closest('.phone-link');

    if (!clickedPhoneLink && !e.target.closest('.phone-actions-popup')) {
        document.querySelectorAll('.phone-actions-popup.show').forEach(popup => {
            popup.classList.remove('show');
        });
        return; 
    }

    if (clickedPhoneLink) {
        e.preventDefault(); 
        const currentPopup = clickedPhoneLink.nextElementSibling;
        
        const isAlreadyShown = currentPopup.classList.contains('show');

        document.querySelectorAll('.phone-actions-popup.show').forEach(popup => {
            if (popup !== currentPopup) {
                popup.classList.remove('show');
            }
        });

        if (isAlreadyShown) {
            currentPopup.classList.remove('show');
        } else {
            currentPopup.classList.add('show');
        }
    }
});

chatContainer.addEventListener('click', e => {
    if (e.target.matches('.suggest-btn-inline')) {
        const question = e.target.dataset.question;
        if (question) {
            userInput.value = question;
            sendMessage();
        }
    }
});

