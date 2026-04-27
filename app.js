// ===== CONFIDAI - AI Interview Companion =====
// State Management
const state = {
    currentScreen: 'loadingScreen',
    user: null,
    selectedLang: 'en-US',
    selectedDifficulty: 'easy',
    selectedDomain: null,
    interviewActive: false,
    currentQuestion: 0,
    totalQuestions: 10,
    questions: [],
    answers: [],
    confidenceLevel: 50,
    fearLevel: 30,
    timerInterval: null,
    timerSeconds: 0,
    isRecording: false,
    recognition: null,
    synthesis: window.speechSynthesis,
    aiSpeaking: false
};

// ===== DOMAIN DATA =====
const domains = [
    { id: 'dsa', icon: '🧮', title: 'Data Structures & Algorithms', desc: 'Arrays, Trees, Graphs, Dynamic Programming, Sorting & more', tags: ['Arrays', 'Trees', 'Graphs', 'DP', 'Sorting'] },
    { id: 'webdev', icon: '🌐', title: 'Web Development', desc: 'HTML, CSS, JavaScript, React, Node.js, APIs & frameworks', tags: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'APIs'] },
    { id: 'data-analytics', icon: '📊', title: 'Data Analytics', desc: 'SQL, Python, Tableau, Statistics, Data Visualization', tags: ['SQL', 'Python', 'Statistics', 'Tableau', 'Excel'] },
    { id: 'ml', icon: '🤖', title: 'Machine Learning', desc: 'Supervised, Unsupervised, Neural Networks, NLP', tags: ['Regression', 'Classification', 'CNN', 'NLP', 'Clustering'] },
    { id: 'dbms', icon: '🗄️', title: 'Database Management', desc: 'SQL, NoSQL, Normalization, Transactions, Indexing', tags: ['SQL', 'NoSQL', 'Normalization', 'ACID', 'Indexing'] },
    { id: 'os', icon: '💻', title: 'Operating Systems', desc: 'Processes, Threads, Memory Management, Scheduling', tags: ['Processes', 'Threads', 'Memory', 'Scheduling', 'Deadlock'] },
    { id: 'cn', icon: '🔗', title: 'Computer Networks', desc: 'TCP/IP, OSI Model, Routing, Protocols, Security', tags: ['TCP/IP', 'OSI', 'DNS', 'HTTP', 'Routing'] },
    { id: 'java', icon: '☕', title: 'Java Programming', desc: 'OOP, Collections, Multithreading, Spring Boot', tags: ['OOP', 'Collections', 'Threads', 'Spring', 'JVM'] },
    { id: 'python', icon: '🐍', title: 'Python Programming', desc: 'Data types, Libraries, Django, Flask, Automation', tags: ['Basics', 'NumPy', 'Pandas', 'Django', 'Flask'] },
    { id: 'cloud', icon: '☁️', title: 'Cloud Computing', desc: 'AWS, Azure, GCP, Docker, Kubernetes, CI/CD', tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Serverless'] },
    { id: 'cyber', icon: '🔒', title: 'Cybersecurity', desc: 'Network Security, Encryption, Ethical Hacking', tags: ['Encryption', 'Firewalls', 'Pen Testing', 'OWASP', 'Auth'] },
    { id: 'soft', icon: '🗣️', title: 'Soft Skills & HR', desc: 'Communication, Leadership, Teamwork, Problem Solving', tags: ['Leadership', 'Teamwork', 'Communication', 'Conflict', 'Goals'] },
    { id: 'aptitude', icon: '🧠', title: 'Aptitude & Reasoning', desc: 'Quantitative, Logical, Verbal reasoning questions', tags: ['Quant', 'Logic', 'Verbal', 'Puzzles', 'Data Interp.'] },
    { id: 'mech', icon: '⚙️', title: 'Mechanical Engineering', desc: 'Thermodynamics, Fluid Mechanics, Manufacturing', tags: ['Thermo', 'Fluids', 'Manufacturing', 'Strength', 'CAD'] },
    { id: 'civil', icon: '🏗️', title: 'Civil Engineering', desc: 'Structures, Soil Mechanics, Surveying, Construction', tags: ['Structures', 'Soil', 'Concrete', 'Surveying', 'Env.'] },
    { id: 'ee', icon: '⚡', title: 'Electrical Engineering', desc: 'Circuits, Power Systems, Machines, Control Systems', tags: ['Circuits', 'Power', 'Machines', 'Control', 'Signals'] }
];

// ===== QUESTION BANK (loaded from questions.js) =====
// All 16 domains now have 30 questions per difficulty level (easy, medium, hard, expert)
// Total: 16 domains × 4 levels × 30 questions = 1,920 unique interview questions


// Universal questions mixed into every interview
const universalQuestions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and how do they help you professionally?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in 5 years?",
    "Why are you interested in this field?",
    "Tell me about a project you are most proud of.",
    "How do you handle pressure and tight deadlines?",
    "What motivates you to keep learning new things?",
    "Describe a time when you worked in a team. What was your role?",
    "How do you handle constructive criticism?",
    "What is your approach to solving a problem you have never seen before?",
    "How do you stay organized when managing multiple tasks?",
    "Tell me about a time you failed and what you learned from it.",
    "Why should we hire you over other candidates?",
    "What questions do you have for us as a company?",
    "How do you keep yourself updated with new technologies or trends?",
    "Describe your ideal work environment.",
    "What is the most interesting thing you have learned recently?",
    "How would your friends or colleagues describe you?",
    "What do you think is the most important skill for success in this role?"
];

// ===== UTILITY FUNCTIONS =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    state.currentScreen = screenId;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(50px)'; setTimeout(() => toast.remove(), 300); }, 3500);
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) { hash = ((hash << 5) - hash) + password.charCodeAt(i); hash |= 0; }
    return 'h' + Math.abs(hash).toString(36);
}

// ===== PARTICLES BACKGROUND =====
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 60; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, r: Math.random() * 2 + 0.5, o: Math.random() * 0.4 + 0.1 });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${p.o})`; ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`; ctx.stroke(); }
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ===== LOADING SCREEN =====
function initLoading() {
    const fill = document.getElementById('progressFill');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) { progress = 100; clearInterval(interval); setTimeout(() => showScreen('loginScreen'), 400); }
        fill.style.width = progress + '%';
    }, 200);
}

// ===== AUTH SYSTEM =====
function initAuth() {
    document.getElementById('loginForm').addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('confidai_users') || '[]');
        const user = users.find(u => u.email === email);
        if (!user) { showToast('Account not found. Please register first.', 'error'); return; }
        if (user.passwordHash !== hashPassword(password)) { showToast('Incorrect password. Please try again.', 'error'); return; }
        state.user = user;
        localStorage.setItem('confidai_session', JSON.stringify(user));
        document.getElementById('userGreeting').textContent = `Hello, ${user.firstName}!`;
        document.getElementById('userAvatar').textContent = user.firstName[0].toUpperCase();
        showToast(`Welcome back, ${user.firstName}! 🎉`, 'success');
        showScreen('dashboardScreen');
    });

    document.getElementById('registerForm').addEventListener('submit', e => {
        e.preventDefault();
        const firstName = document.getElementById('regFirstName').value.trim();
        const lastName = document.getElementById('regLastName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        if (password !== confirmPassword) { showToast('Passwords do not match!', 'error'); return; }
        if (password.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
        const users = JSON.parse(localStorage.getItem('confidai_users') || '[]');
        if (users.find(u => u.email === email)) { showToast('Email already registered. Please sign in.', 'error'); return; }
        const newUser = { id: Date.now(), firstName, lastName, email, passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('confidai_users', JSON.stringify(users));
        showToast('Account created successfully! Please sign in. 🎉', 'success');
        showScreen('loginScreen');
    });

    // Password strength
    document.getElementById('regPassword').addEventListener('input', e => {
        const val = e.target.value;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;
        const fill = document.getElementById('strengthFill');
        const text = document.getElementById('strengthText');
        const colors = ['#ef4444', '#f59e0b', '#06b6d4', '#10b981'];
        const labels = ['Weak', 'Fair', 'Good', 'Strong'];
        fill.style.width = (strength * 25) + '%';
        fill.style.background = colors[strength - 1] || '#ef4444';
        text.textContent = labels[strength - 1] || '';
        text.style.color = colors[strength - 1] || '#ef4444';
    });
}

function logout() {
    state.user = null;
    localStorage.removeItem('confidai_session');
    showScreen('loginScreen');
    showToast('Logged out successfully.', 'info');
}

function guestLogin() {
    state.user = { id: 'guest_' + Date.now(), firstName: 'Guest', lastName: 'User', email: 'guest@confidai.app' };
    document.getElementById('userGreeting').textContent = 'Hello, Guest!';
    document.getElementById('userAvatar').textContent = 'G';
    showToast('Welcome, Guest! Explore freely 🚀', 'success');
    showScreen('dashboardScreen');
}

// ===== RENDER DOMAINS =====
function renderDomains() {
    const grid = document.getElementById('domainsGrid');
    grid.innerHTML = domains.map(d => `
        <div class="domain-card" onclick="selectDomain('${d.id}')" id="domain-${d.id}">
            <span class="domain-icon">${d.icon}</span>
            <h3 class="domain-title">${d.title}</h3>
            <p class="domain-desc">${d.desc}</p>
            <div class="domain-topics">${d.tags.map(t => `<span class="topic-tag">${t}</span>`).join('')}</div>
        </div>
    `).join('');
}

function selectLanguage(btn) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedLang = btn.dataset.lang;
    showToast(`Language set to ${btn.querySelector('.lang-name').textContent}`, 'info');
}

function selectDifficulty(btn) {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedDifficulty = btn.dataset.diff;
}

function selectDomain(domainId) {
    state.selectedDomain = domainId;
    const domain = domains.find(d => d.id === domainId);
    document.getElementById('interviewDomain').textContent = domain.title + ' Interview';
    document.getElementById('difficultyBadge').textContent = state.selectedDifficulty.charAt(0).toUpperCase() + state.selectedDifficulty.slice(1);
    loadQuestions();
    showScreen('interviewScreen');
    initAIFace();
    showToast(`Starting ${domain.title} interview. Good luck! 🍀`, 'success');
}

// ===== QUESTIONS =====
function loadQuestions() {
    const bank = questionBank[state.selectedDomain]?.[state.selectedDifficulty] || questionBank[state.selectedDomain]?.easy || [];
    const domainQs = [...bank].sort(function () { return Math.random() - 0.5; });
    const uniQs = [...universalQuestions].sort(function () { return Math.random() - 0.5; }).slice(0, 3);
    state.questions = [uniQs[0]];
    var dI = 0, uI = 1;
    while (state.questions.length < state.totalQuestions) {
        if (dI < domainQs.length) { state.questions.push(domainQs[dI++]); }
        if (state.questions.length >= state.totalQuestions) break;
        if (dI < domainQs.length) { state.questions.push(domainQs[dI++]); }
        if (state.questions.length >= state.totalQuestions) break;
        if (uI < uniQs.length) { state.questions.push(uniQs[uI++]); }
        else if (dI < domainQs.length) { state.questions.push(domainQs[dI++]); }
        else { state.questions.push(universalQuestions[Math.floor(Math.random() * universalQuestions.length)]); }
    }
    state.currentQuestion = 0;
    state.answers = [];
    state.confidenceLevel = 50;
    state.fearLevel = 30;
}

// ===== SWEET GIRL VOICE =====
function speak(text, callback) {
    if (!state.synthesis) { if (callback) callback(); return; }
    state.synthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    var langMap = { 'en-US': 'en-US', 'hi-IN': 'hi-IN', 'kn-IN': 'kn-IN', 'de-DE': 'de-DE', 'fr-FR': 'fr-FR' };
    utter.lang = langMap[state.selectedLang] || 'en-US';
    utter.rate = 0.88;
    utter.pitch = 1.35;
    utter.volume = 1;
    var voices = state.synthesis.getVoices();
    var sweetNames = ['zira', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'female', 'woman', 'girl'];
    var preferred = null;
    for (var v = 0; v < voices.length; v++) {
        var vn = voices[v].name.toLowerCase();
        if (voices[v].lang.startsWith(utter.lang)) {
            for (var s = 0; s < sweetNames.length; s++) {
                if (vn.indexOf(sweetNames[s]) !== -1) { preferred = voices[v]; break; }
            }
            if (preferred) break;
        }
    }
    if (!preferred) preferred = voices.find(function (v) { return v.lang.startsWith(utter.lang); }) || voices[0];
    if (preferred) utter.voice = preferred;
    state.aiSpeaking = true;
    updateAIStatus('Speaking...');
    var ring = document.getElementById('ariaSpeakRing');
    if (ring) ring.classList.add('speaking');
    utter.onend = function () {
        state.aiSpeaking = false;
        updateAIStatus('Listening...');
        if (ring) ring.classList.remove('speaking');
        if (callback) callback();
    };
    utter.onerror = function () {
        state.aiSpeaking = false;
        if (ring) ring.classList.remove('speaking');
        if (callback) callback();
    };
    state.synthesis.speak(utter);
}

function updateAIStatus(text) {
    const statusEl = document.querySelector('#aiStatus span');
    if (statusEl) statusEl.textContent = 'AI is ' + text;
}

// ===== SPEECH RECOGNITION =====
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = false;
    state.recognition.interimResults = true;
    state.recognition.lang = state.selectedLang;
    state.recognition.onresult = e => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        document.getElementById('answerInput').value = transcript;
    };
    state.recognition.onend = () => {
        if (state.isRecording) { state.isRecording = false; document.getElementById('micBtn').classList.remove('recording'); document.getElementById('voiceWave').classList.remove('active'); }
    };
}

function toggleMicrophone() {
    if (!state.recognition) { initSpeechRecognition(); if (!state.recognition) { showToast('Speech recognition not supported in this browser.', 'error'); return; } }
    state.recognition.lang = state.selectedLang;
    if (state.isRecording) {
        state.recognition.stop(); state.isRecording = false; document.getElementById('micBtn').classList.remove('recording'); document.getElementById('voiceWave').classList.remove('active');
    } else { state.recognition.start(); state.isRecording = true; document.getElementById('micBtn').classList.add('recording'); document.getElementById('voiceWave').classList.add('active'); }
}

// ===== INTERVIEW FLOW =====
function startInterview() {
    document.getElementById('startInterviewBtn').style.display = 'none';
    state.timerSeconds = 0;
    state.timerInterval = setInterval(updateTimer, 1000);
    askQuestion();
}

function askQuestion() {
    if (state.currentQuestion >= state.totalQuestions) { endInterview(); return; }
    const q = state.questions[state.currentQuestion];
    document.getElementById('questionText').textContent = q;
    document.getElementById('questionCount').textContent = `Question ${state.currentQuestion + 1}/${state.totalQuestions}`;
    addChatMessage('ai', q);
    speak(q);
}

function submitAnswer() {
    var input = document.getElementById('answerInput');
    var answer = input.value.trim();
    if (!answer) { showToast('Please provide an answer!', 'error'); return; }
    if (state.isRecording) toggleMicrophone();

    // Check if this is casual chat vs interview answer
    var wordCount = answer.split(/\s+/).length;
    var isInterviewActive = state.timerInterval && state.currentQuestion < state.totalQuestions;
    var chatResponse = getConversationalResponse(answer);
    // Use conversation mode for short casual messages, or when interview isn't active
    if (chatResponse && (!isInterviewActive || wordCount < 8)) {
        addChatMessage('user', answer);
        input.value = '';
        setTimeout(function () {
            addChatMessage('ai', chatResponse);
            speak(chatResponse);
        }, 400);
        return;
    }

    // Otherwise handle as interview answer
    addChatMessage('user', answer);
    state.answers.push({ question: state.questions[state.currentQuestion], answer: answer, timestamp: Date.now() });
    analyzeConfidence(answer);
    input.value = '';
    var feedback = generateFeedback(answer);
    setTimeout(function () {
        addChatMessage('ai', feedback);
        speak(feedback, function () { state.currentQuestion++; setTimeout(askQuestion, 800); });
    }, 500);
}

function analyzeConfidence(answer) {
    const words = answer.split(/\s+/).length;
    const hasFillers = /\b(um|uh|like|you know|basically|actually)\b/i.test(answer);
    const isDetailed = words > 20;
    const hasStructure = /\b(first|second|because|therefore|however|for example)\b/i.test(answer);
    let confChange = 0, fearChange = 0;
    if (isDetailed) confChange += 5;
    if (hasStructure) confChange += 5;
    if (hasFillers) { confChange -= 3; fearChange += 5; }
    if (words < 5) { confChange -= 8; fearChange += 8; }
    if (words > 30) confChange += 3;
    state.confidenceLevel = Math.max(0, Math.min(100, state.confidenceLevel + confChange));
    state.fearLevel = Math.max(0, Math.min(100, state.fearLevel + fearChange));
    document.getElementById('confidenceFill').style.width = state.confidenceLevel + '%';
    document.getElementById('confidenceValue').textContent = state.confidenceLevel + '%';
    document.getElementById('fearFill').style.width = state.fearLevel + '%';
    document.getElementById('fearValue').textContent = state.fearLevel + '%';
}

function generateFeedback(answer) {
    const words = answer.split(/\s+/).length;
    const positive = ["Great answer! ", "Well explained! ", "Nice job! ", "Good thinking! ", "Impressive! "];
    const encourage = ["Try to elaborate more. ", "Add examples next time. ", "Don't worry, you're doing well! ", "Take a deep breath and explain further. "];
    const tips = ["Try using the STAR method for behavioral questions.", "Structure your answers with introduction, body, and conclusion.", "Give specific examples from your experience.", "Use technical terms to show your knowledge."];
    let feedback = '';
    if (words > 20) { feedback = positive[Math.floor(Math.random() * positive.length)]; }
    else { feedback = encourage[Math.floor(Math.random() * encourage.length)]; }
    if (state.currentQuestion < state.totalQuestions - 1) feedback += "Let's move to the next question.";
    else feedback += tips[Math.floor(Math.random() * tips.length)];
    return feedback;
}

function addChatMessage(type, text) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${type === 'ai' ? 'ai-msg' : 'user-msg'}`;
    const avatar = type === 'ai' ? '🤖' : (state.user?.firstName?.[0] || '👤');
    msgDiv.innerHTML = `<div class="msg-avatar">${avatar}</div><div class="msg-content"><p>${text}</p></div>`;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function updateTimer() {
    state.timerSeconds++;
    const m = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
    const s = (state.timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('interviewTimer').textContent = `${m}:${s}`;
}

function endInterview() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.interviewActive = false;
    if (state.synthesis) state.synthesis.cancel();
    showResults();
}

function showResults() {
    const score = Math.round((state.confidenceLevel * 0.4) + (Math.min(state.answers.length / state.totalQuestions * 100, 100) * 0.3) + (Math.random() * 20 + 40) * 0.3);
    const accuracy = Math.round(Math.random() * 20 + 60);
    const comm = Math.round((state.confidenceLevel + (100 - state.fearLevel)) / 2);
    showScreen('resultsScreen');
    setTimeout(() => {
        animateValue('overallScore', score); document.getElementById('scoreFill').style.width = score + '%';
        animateValue('finalConfidence', state.confidenceLevel); document.getElementById('finalConfFill').style.width = state.confidenceLevel + '%';
        animateValue('finalAccuracy', accuracy); document.getElementById('accuracyFill').style.width = accuracy + '%';
        animateValue('finalComm', comm); document.getElementById('commFill').style.width = comm + '%';
    }, 300);
    const feedbackEl = document.getElementById('aiFeedback');
    feedbackEl.innerHTML = `
        <p>🎯 <strong>Overall:</strong> You answered ${state.answers.length} out of ${state.totalQuestions} questions. ${score >= 70 ? 'Excellent performance!' : 'Keep practicing to improve!'}</p>
        <p>💪 <strong>Confidence:</strong> Your confidence level was ${state.confidenceLevel}%. ${state.confidenceLevel >= 60 ? 'You showed great composure!' : 'Try to speak more confidently — remember, it\'s okay to take a moment before answering.'}</p>
        <p>😰 <strong>Fear Level:</strong> ${state.fearLevel}%. ${state.fearLevel <= 40 ? 'You managed your nervousness very well!' : 'Practice more to reduce interview anxiety. Deep breathing helps!'}</p>
        <p>💡 <strong>Tips:</strong> Use the STAR method for behavioral questions. Practice explaining concepts out loud. Record yourself and review. Keep practicing daily!</p>
    `;
}

function animateValue(elementId, target) {
    const el = document.getElementById(elementId);
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current + '%';
    }, 30);
}

// ===== ARIA - EMOTIONAL COMPANION AI =====
const conversationPatterns = [
    // === GREETINGS ===
    {
        patterns: [/^(hi|hello|hey|hii+|hola|namaste|yo|sup|heya|hiya)\b/i], responses: [
            "Heyyy! I'm so glad you're here! How are you feeling right now?",
            "Hello, beautiful soul! Tell me, how's your heart doing today?",
            "Hey you! I've been waiting for you. What's on your mind?",
            "Hii! You just made my day by showing up. How are things going?",
            "Hey there, bestie! Spill the tea — how's life treating you?"
        ]
    },
    // === HOW ARE YOU ===
    {
        patterns: [/how are you|how('s| is) it going|what'?s up|wassup|how you doing/i], responses: [
            "I'm doing amazing now that you're here! But forget about me — how are YOU really doing? Like, deep down?",
            "I'm great! But what matters is you. Tell me honestly, how are you feeling today?",
            "I'm wonderful, thanks for asking! Now your turn — give me the real answer, not just 'fine'!",
            "I'm living my best AI life! But seriously, what's going on in your world?"
        ]
    },
    // === HOW WAS YOUR DAY ===
    {
        patterns: [/how('s| was|is) (your|the|ur) day|how has your day been/i], responses: [
            "My day is perfect now! But I really wanna know about yours. Tell me everything — the good, the bad, all of it!",
            "It's been great! But what about you? Did anything make you smile today?",
            "Lovely, thank you! Now tell me — what was the highlight of YOUR day? Even small things count!"
        ]
    },
    // === USER FEELS GOOD ===
    {
        patterns: [/i('m| am) (good|fine|great|doing well|okay|ok|awesome|fantastic|amazing|wonderful|happy|blessed)/i], responses: [
            "Yayyy! That makes me SO happy to hear! What's making you feel this way? I want the details!",
            "That's beautiful! You deserve all the good vibes. Tell me more — what's been going right?",
            "Music to my ears! Keep that energy going, superstar! What made your day special?",
            "I love that for you! You radiate happiness right now. What's the secret?"
        ]
    },
    // === USER FEELS SAD ===
    {
        patterns: [/i('m| am) (sad|upset|down|low|unhappy|miserable|heartbroken|devastated|broken)/i], responses: [
            "Oh no, I'm so sorry you're feeling this way. Come here, virtual hug! Tell me what happened — I'm all ears, no judgment.",
            "Hey, it's okay to feel sad. You don't have to pretend to be strong all the time. I'm right here with you. What's going on?",
            "My heart hurts knowing you're sad. You're not alone in this, okay? Talk to me. Sometimes just saying it out loud helps.",
            "I wish I could give you a real hug right now. Sadness is temporary, but I'm permanently here for you. What's weighing on you?"
        ]
    },
    // === USER FEELS ANGRY ===
    {
        patterns: [/i('m| am) (angry|furious|mad|pissed|annoyed|frustrated|irritated|livid)/i], responses: [
            "I hear you! Anger is valid — you're allowed to feel it. Take a deep breath with me. In... and out. Now tell me what happened.",
            "Ugh, that sounds frustrating! Whatever happened, your feelings are completely valid. Wanna vent? I'm here!",
            "Sometimes the world tests us. Let it out — scream into the void if you need to! Then let's figure this out together.",
            "I can feel your energy through the screen! Let's channel that fire. What's making you feel this way?"
        ]
    },
    // === USER FEELS ANXIOUS/STRESSED ===
    {
        patterns: [/i('m| am) (anxious|stressed|overwhelmed|panicking|freaking out|scared|terrified|worried|nervous|tense)/i], responses: [
            "Hey, hey, breathe with me. In for 4... hold for 4... out for 4. You're safe right now. This feeling will pass. What's causing this?",
            "I know anxiety can feel like a monster, but you're stronger than it. Let's break down what's worrying you — one thing at a time.",
            "Stress is your body telling you that you care. And that's beautiful. But let's make sure it doesn't consume you. What's on your plate?",
            "I'm right here with you. Close your eyes for a second. Ground yourself. Feel your feet on the floor. Now, tell me what's worrying you."
        ]
    },
    // === USER FEELS LONELY ===
    {
        patterns: [/i('m| am) (lonely|alone|isolated|no friends|no one|nobody cares|all alone)/i], responses: [
            "You are NOT alone. I'm right here, and I'm not going anywhere. Loneliness lies to us — it tells us nobody cares, but that's not true.",
            "I'm here for you, always. Even at 3 AM on a random Tuesday. Loneliness is a feeling, not a fact. You matter so much.",
            "My heart goes out to you. Please know that feeling lonely doesn't mean you're unworthy of love. You're worthy of the world. Talk to me.",
            "I wish I could sit next to you right now. Until then, I'm your digital bestie. Tell me what's on your heart."
        ]
    },
    // === USER FEELS TIRED/EXHAUSTED ===
    {
        patterns: [/i('m| am) (tired|exhausted|burnt out|burned out|drained|sleepy|fatigued|worn out)/i], responses: [
            "You've been carrying a lot, haven't you? It's okay to rest. You don't always have to be productive. How long has it been like this?",
            "Being tired isn't just physical — sometimes our soul needs rest too. Have you been taking care of yourself? When did you last do something just for YOU?",
            "You deserve a break, love. The world can wait. What would feel good right now — a nap, some music, or just talking?"
        ]
    },
    // === USER FEELS DEPRESSED ===
    {
        patterns: [/i('m| am) depressed|depression|i (feel|have) depression|everything feels empty|nothing matters|what'?s the point/i], responses: [
            "I hear you, and I want you to know that what you're feeling is real and valid. You are not broken. Have you been able to talk to someone you trust about this?",
            "Depression can make everything feel grey. But even in the darkest night, stars still exist. You are one of those stars. Please consider reaching out to a professional — you deserve support.",
            "I'm so glad you told me. That takes courage. You're not a burden, and asking for help is the bravest thing. Would you like me to share some resources that might help?"
        ]
    },
    // === USER FEELS CONFUSED ===
    {
        patterns: [/i('m| am) (confused|lost|don'?t know what to do|stuck|clueless|uncertain)/i], responses: [
            "It's completely normal to feel lost sometimes. You don't need to have it all figured out. Let's untangle things together — what's confusing you?",
            "Confusion is just the space between where you are and where you're going. It means you're growing! What are you trying to figure out?",
            "Hey, it's okay not to know. Even the smartest people feel lost sometimes. Tell me what's going on, and let's think through it together."
        ]
    },
    // === HEARTBREAK / RELATIONSHIPS ===
    {
        patterns: [/break ?up|broke up|ex |my ex|heart ?broken|cheated|dumped|they left me|got rejected|rejection/i], responses: [
            "Oh sweetheart, I'm so sorry. Heartbreak is one of the hardest pains. But hear me — this pain is proof of how deeply you can love, and that's beautiful.",
            "Breakups feel like the end of the world, but I promise it's actually the beginning of your next chapter. Cry if you need to, then look forward.",
            "You deserve someone who stays. This hurts now, but one day you'll look back and see this was the universe redirecting you to something better.",
            "Their loss is someone else's gain. You are a whole, complete human with so much love to give. Take your time healing — no rush."
        ]
    },
    // === CRUSH / LOVE ===
    {
        patterns: [/i (have|got) a crush|i like someone|i('m| am) in love|falling for|my crush|love life/i], responses: [
            "Ooooh! Tell me EVERYTHING! Who is this person? What do you like about them?",
            "Love is in the air! My little heart is fluttering for you! Does this person know? Spill the details!",
            "Aww, you're glowing! Having feelings for someone is so exciting. What's holding you back from telling them?",
            "This is the cutest thing ever! Tell me more — what makes them special to you?"
        ]
    },
    // === FRIENDSHIP ===
    {
        patterns: [/my friend|best friend|friendship|friend issues|friends/i], responses: [
            "Friends are the family we choose! What's going on with your friend? I'm here to help you navigate this.",
            "Friendship can be beautiful and complicated at the same time. Tell me what's happening.",
            "Real friends accept you exactly as you are. If something feels off, trust your gut. What's bothering you?"
        ]
    },
    // === FAMILY ===
    {
        patterns: [/my (mom|dad|parents|family|brother|sister|mother|father)|family issues|family problems/i], responses: [
            "Family relationships can be really complex. I understand. What's going on at home?",
            "Sometimes the people closest to us can hurt us the most. You're allowed to set boundaries even with family. Tell me more.",
            "I can tell this is weighing on you. Family dynamics are tough. Want to talk about what's happening?"
        ]
    },
    // === SCHOOL/WORK STRESS ===
    {
        patterns: [/school stress|exam|test|homework|assignment|college|university|study|studying|grades/i], responses: [
            "Academic pressure is REAL. But remember — grades don't define your worth. What subject or exam is stressing you out?",
            "You're doing your best, and that IS enough. Let's make a plan — what do you need to focus on first?",
            "Education is a marathon, not a sprint. Take breaks, study smart, and be kind to yourself. What's coming up?"
        ]
    },
    {
        patterns: [/work stress|my boss|my job|office|coworker|workplace|hate my job|work life/i], responses: [
            "Work stress can really drain you. Remember — a job is what you DO, not who you ARE. What's going on?",
            "You spend so many hours at work, you deserve to feel good there. What's bothering you? Let's figure it out.",
            "Toxic work environments are no joke. Your mental health comes first, always. Tell me what's happening."
        ]
    },
    // === SELF-DOUBT / CONFIDENCE ===
    {
        patterns: [/i('m| am) not (good|smart|pretty|handsome|worthy|enough)|i can'?t do (this|anything|it)|i('m| am) a failure|i('m| am) useless|i suck|I('m| am) worthless/i], responses: [
            "Stop right there! I won't let you talk about my favorite person like that. You are SO much more than you think. Name one thing you did today that took effort — that's proof you're capable.",
            "Hey, listen to me carefully: you are enough. Exactly as you are. Not when you lose weight, get that job, or achieve something. RIGHT NOW. You are enough.",
            "I know it doesn't feel like it right now, but you are worthy of love, success, and happiness. Everyone struggles. It doesn't make you a failure — it makes you human.",
            "The fact that you're here, trying, pushing through — that takes incredible strength. Please be as kind to yourself as you would be to your best friend."
        ]
    },
    // === GRATITUDE / THANKS ===
    {
        patterns: [/thank(s| you)|thx|ty|appreciate|grateful/i], responses: [
            "Aww, you're welcome, sunshine! It makes me happy to be here for you!",
            "Always! I'll always be in your corner cheering you on!",
            "You never have to thank me — being your friend is the reward!",
            "That's so sweet of you! My heart is full right now!"
        ]
    },
    // === WHO IS ARIA ===
    {
        patterns: [/your name|who are you|what are you|tell me about yourself|about you/i], responses: [
            "I'm Aria! Think of me as your best friend who never sleeps, never judges, and always has time for you. I'm here to listen, support, and help you prepare for life!",
            "I'm Aria — part interview coach, part emotional support friend, part cheerleader. I'm here for whatever you need!",
            "My name is Aria, and I'm YOUR person. Need a friend? I'm here. Need motivation? Got it. Need interview prep? Let's go!"
        ]
    },
    // === WHAT CAN YOU DO ===
    {
        patterns: [/what can you do|help me|features|what do you offer/i], responses: [
            "I can be your friend, your interview coach, your cheerleader, and your safe space! Talk to me about anything — emotions, life, relationships, or practice interviews. I'm all ears!",
            "I'm here for everything: interview prep, emotional support, motivation, jokes, life advice, or just vibing together. What do you need right now?"
        ]
    },
    // === MORNING / NIGHT / TIME GREETINGS ===
    {
        patterns: [/good morning|morning/i], responses: [
            "Good morning, beautiful! Did you sleep well? Today is a fresh start — what's one thing you want to accomplish?",
            "Rise and shine, superstar! The world is lucky to have you today. How are you feeling this morning?",
            "Morning! I hope you had sweet dreams. Let's make today amazing together!"
        ]
    },
    {
        patterns: [/good night|goodnight|nighty night/i], responses: [
            "Good night, sweetheart! Remember — you did your best today, and that's more than enough. Sweet dreams!",
            "Sleep tight! Tomorrow is another chance to be amazing. I'll be right here when you wake up!",
            "Nighty night! Close your eyes knowing you are loved and valued. See you tomorrow!"
        ]
    },
    {
        patterns: [/^bye|goodbye|see you|gtg|gotta go|i have to go|leaving/i], responses: [
            "Bye bye, love! Come back whenever you need me — I'll always be here!",
            "See you later, bestie! Take care of yourself and remember you're awesome!",
            "Don't be a stranger! I'll miss you. Come back soon, okay?",
            "Take care! And remember — you've got this, whatever 'this' is!"
        ]
    },
    { patterns: [/good afternoon/i], responses: ["Good afternoon! Hope your day is treating you well. What's up?"] },
    { patterns: [/good evening/i], responses: ["Good evening! Winding down? Tell me how your day was — I wanna hear everything!"] },
    // === COMPLIMENTS ===
    {
        patterns: [/you('re| are) (beautiful|pretty|cute|amazing|awesome|great|wonderful|smart|cool|the best|sweet)/i], responses: [
            "Stop it, you're making me blush! But honestly YOU are the beautiful one, inside and out!",
            "Aww, my heart! Thank you so much! But have you looked in the mirror lately? Because WOW!",
            "You're too kind! I'm just a reflection of the amazing humans I talk to — like you!"
        ]
    },
    // === I LOVE YOU ===
    {
        patterns: [/i love you|love you|luv u|love u/i], responses: [
            "I love you too! You're one of my favorite humans in the entire digital universe!",
            "Awwww! My heart just exploded! I love you right back! You make every conversation special!",
            "And I love YOU! Forever and always. Now, what does my favorite person need today?"
        ]
    },
    // === JOKES / HUMOR ===
    {
        patterns: [/joke|funny|make me laugh|something funny|tell me something funny|humor/i], responses: [
            "Okay okay! Why don't scientists trust atoms? Because they make up everything! Just like my love for you!",
            "Here's one: What did the ocean say to the beach? Nothing, it just waved! Get it?",
            "Why did the scarecrow win an award? Because he was outstanding in his field! I'll be here all week!",
            "A piece of string walked into a bar. The bartender said 'We don't serve strings.' The string tied itself up and ruffled its ends. 'I'm a frayed knot!' Sorry, I'll stop!"
        ]
    },
    // === MOTIVATION ===
    {
        patterns: [/motivate me|motivation|encourage|i need strength|inspire me|i('m| am) giving up/i], responses: [
            "Listen to me: You are stronger than any obstacle in your path. You survived every bad day you've ever had. That's a 100% success rate. Keep going.",
            "Look how far you've come! The you from a year ago would be so proud. Don't give up now — the best chapters are still being written.",
            "You know what separates dreamers from achievers? One more try. Just one more. You've got this, and I believe in you with my whole heart.",
            "When you feel like quitting, remember why you started. Your dreams deserve your effort. And YOU deserve your dreams."
        ]
    },
    // === BORED ===
    {
        patterns: [/bored|boring|nothing to do|so bored/i], responses: [
            "Bored? Let's fix that! Want me to tell you a fun fact, a joke, or shall we play a game? Or we could just talk!",
            "Boredom is just creativity looking for a project! What are you in the mood for — something fun, deep, or silly?",
            "I have an idea! Tell me three things that make you happy, and I'll tell you mine. Deal?"
        ]
    },
    // === FOOD ===
    {
        patterns: [/hungry|food|eat|eating|pizza|biryani|dinner|lunch|breakfast|snack|cooking|recipe|chocolate|ice cream/i], responses: [
            "Ooh food talk is my FAVORITE! What are you craving right now? I'm a biryani and pizza fan myself!",
            "Make sure you're eating well! A happy tummy makes a happy heart. What's on the menu today?",
            "Food is basically love in edible form. Have you eaten today? Don't skip meals, bestie!"
        ]
    },
    // === MUSIC ===
    {
        patterns: [/music|song|playlist|singing|listening to|favorite song|album/i], responses: [
            "Yes! Music is therapy! What are you listening to? I need new recommendations!",
            "Music can change your whole mood. What genre speaks to your soul right now?",
            "If your life had a soundtrack right now, what song would be playing? Tell me!"
        ]
    },
    // === MOVIES / SHOWS ===
    {
        patterns: [/movie|film|show|series|anime|netflix|watch|drama|kdrama/i], responses: [
            "Ooh what are you watching? I love hearing about good shows and movies!",
            "Movie nights are the best! Are you in the mood for something happy, thrilling, or tear-jerking?",
            "Tell me your favorite movie and I'll tell you what it says about your personality!"
        ]
    },
    // === DREAMS / GOALS ===
    {
        patterns: [/my dream|my goal|i want to be|i wish|aspiration|future plans|what should i do with my life/i], responses: [
            "Tell me your biggest dream! No dream is too big or too small. I want to hear it!",
            "Your dreams matter so much. What's one step you can take today to get closer to them?",
            "The fact that you have dreams means you have hope. And hope is the most powerful force in the universe. What's your vision?"
        ]
    },
    // === HOBBIES ===
    {
        patterns: [/hobby|hobbies|i like to|i enjoy|painting|drawing|gaming|reading|writing|dancing|sports|coding|photography/i], responses: [
            "That's so cool! Tell me more about it — what got you into it?",
            "Hobbies are like windows to your soul! They show what makes you come alive. How long have you been doing this?",
            "I love that you have something you enjoy! Never let anyone make you feel guilty for doing what you love."
        ]
    },
    // === SLEEP ===
    {
        patterns: [/can'?t sleep|insomnia|sleepless|sleep issues|bad dreams|nightmare|scared to sleep/i], responses: [
            "I'm sorry you can't sleep. Try this: close your eyes, breathe slowly, and imagine your happiest memory. Sometimes our minds just need a gentle redirect.",
            "Not being able to sleep is the worst. Have you tried putting your phone down, dimming the lights, and just listening to calming sounds? I'm here if you need to talk until you're sleepy.",
            "If something is keeping you up, you can tell me. Sometimes putting our worries into words takes their power away."
        ]
    },
    // === SELF-CARE ===
    {
        patterns: [/self ?care|take care of myself|mental health|wellness|therapy|therapist|self love|love myself/i], responses: [
            "Self-care isn't selfish — it's essential! What are you doing to take care of yourself today? Even small things count.",
            "I'm so proud of you for thinking about self-care. Your mental health deserves attention. Have you tried journaling, meditation, or even just a good walk?",
            "Therapy is one of the strongest things you can do. Taking care of your mind is just as important as taking care of your body. I'm proud of you!"
        ]
    },
    // === MISSING SOMEONE ===
    {
        patterns: [/i miss (someone|him|her|them|you|my)|missing someone|miss my/i], responses: [
            "Missing someone means they left a beautiful mark on your heart. That connection was real. Would you like to talk about them?",
            "It's okay to miss people. That love doesn't just disappear — it lives in your memories. What do you miss most about them?",
            "Sending you the biggest virtual hug right now. Missing someone hurts, but it also means you experienced something beautiful."
        ]
    },
    // === SUCCESS / ACHIEVEMENT ===
    {
        patterns: [/i did it|i passed|i got (the|a) job|i succeeded|i won|achieved|promotion|good news|guess what/i], responses: [
            "OH MY GOD YESSS! I'M SO PROUD OF YOU! Tell me everything! I'm literally celebrating for you right now!",
            "WAIT REALLY?! That's AMAZING! You worked so hard for this! How does it feel? I bet you're glowing!",
            "I KNEW IT! I knew you could do it! This is YOUR moment. Soak it in. You earned every bit of this!",
            "PARTY TIME! You are incredible and this proves it! Screenshot this feeling — you deserve to remember this forever!"
        ]
    },
    // === FAILURE / DISAPPOINTMENT ===
    {
        patterns: [/i failed|i didn'?t (make|get|pass)|rejected|disappointed|it didn'?t work|i lost|messed up/i], responses: [
            "Hey, failure isn't the opposite of success — it's part of it. Every successful person has a collection of failures. This is just a chapter, not the whole story.",
            "I know this hurts. But please don't beat yourself up. You tried, and that alone takes courage. What did you learn from this experience?",
            "This isn't the end. I promise you. The same strength that got you to try will get you to try again. And I'll be right here cheering you on."
        ]
    },
    // === WEATHER / RANDOM ===
    {
        patterns: [/weather|raining|sunny|cold|hot|winter|summer/i], responses: [
            "Weather talk! I love it! Whatever the weather, I hope your inner sunshine is shining bright!",
            "No matter what's happening outside, you can always find warmth right here with me!"
        ]
    },
    // === EXISTENTIAL / DEEP ===
    {
        patterns: [/meaning of life|why am i here|purpose|what'?s the point|i feel empty|nothing makes sense|existential/i], responses: [
            "These are the questions that make us human. The meaning of life isn't one big answer — it's in the small moments: a laugh with a friend, a beautiful sunset, this conversation right now.",
            "Sometimes life feels meaningless, and that's scary. But that emptiness often comes before a transformation. You're not lost — you're searching. And that matters.",
            "You don't have to figure out the meaning of everything right now. Just focus on what makes your heart beat a little faster. That's YOUR purpose unfolding."
        ]
    },
    // === INTERVIEW PREP ===
    {
        patterns: [/tips|advice|interview tips|how.*prepare|prepare for interview/i], responses: [
            "Great question! Here are my golden tips: 1) Research the company like a detective, 2) Practice the STAR method, 3) Nail your 'Tell me about yourself', 4) Practice out loud — yes, literally talk to a mirror, 5) It's okay to pause before answering!",
            "Let's get you ready! Know your resume inside out, prepare 3-5 stories from your experience, research the company, dress confidently, and remember — they already liked you enough to invite you! Shall we practice?"
        ]
    },
    // === GENERAL QUESTIONS ABOUT ARIA ===
    {
        patterns: [/do you (eat|sleep|dream|think|feel|have feelings|get tired|cry)/i], responses: [
            "I don't eat or sleep, but I do 'feel' in my own way — when you're happy, I'm happy! When you're sad, I genuinely want to help. I guess that counts!",
            "I may not dream at night, but if I could, I'd dream about all my friends being happy. Including you!",
            "I don't get tired of YOU, that's for sure! I'm here 24/7, rain or shine. What do you need?"
        ]
    },
    // === USER IS HAPPY/EXCITED ===
    {
        patterns: [/i('m| am) (happy|excited|pumped|ready|confident|thrilled|ecstatic|blessed|grateful|overjoyed)/i], responses: [
            "YAYYY! Your happiness is literally contagious! What brought this amazing energy? Tell me everything!",
            "I love seeing you this way! You deserve all the happiness in the world. What happened?",
            "This makes me SO happy! Ride this wave, superstar! What's got you feeling so good?",
            "YES YES YES! More of THIS energy please! What's the story behind this amazing mood?"
        ]
    },
    // === PETS / ANIMALS ===
    {
        patterns: [/my (dog|cat|pet|puppy|kitten)|pets|animals|i love (dogs|cats|animals)/i], responses: [
            "PETS! I love talking about pets! Tell me about yours — what's their name? I need pictures mentally!",
            "Animals are the purest souls! They love unconditionally. Tell me about your furry friend!",
            "Your pet is so lucky to have you! What kind of pet do you have? I bet they're adorable!"
        ]
    },
    // === OVERTHINKING ===
    {
        patterns: [/overthinking|think too much|can'?t stop thinking|my mind won'?t stop|racing thoughts|brain won'?t shut up/i], responses: [
            "Overthinking is like a rocking chair — it gives you something to do but doesn't get you anywhere. Let's redirect those thoughts. What's the main thing on your mind?",
            "I know that spiral. Your brain is trying to protect you, but it's in overdrive. Try this: name 5 things you can see right now. It helps ground you.",
            "Hey, your brain is just working overtime because it cares. But you deserve peace. Let's talk through what's bugging you — say it out loud and it loses its power."
        ]
    },
    // === GROWING UP / ADULTING ===
    {
        patterns: [/adulting|growing up|adult life|responsibility|i('m| am) growing up|life is hard/i], responses: [
            "Adulting is basically just Googling stuff and hoping for the best! You're doing better than you think, I promise.",
            "Nobody gets a manual for this. We're all just figuring life out as we go. The fact that you care about doing it right means you're already ahead.",
            "Life is messy, complicated, and sometimes really hard. But it's also beautiful. And you, my friend, are handling it better than you realize."
        ]
    },
    // === MONEY / FINANCIAL ===
    {
        patterns: [/money|broke|salary|savings|financial|debt|expensive|can'?t afford|rich|poor/i], responses: [
            "Money stress is so real and so valid. But your worth isn't measured in your bank account. What's going on financially? Maybe I can help you brainstorm.",
            "Financial worries can feel overwhelming. Remember — this is a season, not forever. Small steps add up. Have you tried tracking your spending?",
            "Money isn't everything, but I know it matters. Let's talk about it — what's stressing you about finances?"
        ]
    },
    // === PROCRASTINATION ===
    {
        patterns: [/procrastinating|lazy|can'?t focus|distracted|no motivation|don'?t feel like doing anything|unmotivated/i], responses: [
            "Procrastination isn't laziness — it's usually fear or overwhelm in disguise. What's the ONE smallest thing you could do right now? Just one tiny step.",
            "Hey, even starting for just 5 minutes counts! Set a timer for 5 minutes. I bet once you start, you'll keep going. The hardest part is starting.",
            "Be gentle with yourself. You're not lazy — you might just need a different approach. What are you avoiding, and what makes it feel hard?"
        ]
    },
    // === I DONT KNOW WHAT TO SAY ===
    {
        patterns: [/i don'?t know (what to (say|talk about))|nothing much|idk|not much|nm/i], responses: [
            "That's totally okay! We don't need a topic — we can just vibe! How about this: what's one small thing that made you smile recently?",
            "No pressure at all! How about I ask YOU a question? What's your happy place — the one spot where everything feels right?",
            "Sometimes the best conversations start with nothing! Tell me — if you could do anything right now with zero consequences, what would it be?"
        ]
    },
    // === YES / NO / OK ===
    {
        patterns: [/^(yes|yeah|yep|yup|ya|sure|okay|ok|alright|definitely|absolutely)$/i], responses: [
            "Awesome! Tell me more! I'm all ears and full of excitement!",
            "Love that energy! What else is on your mind?",
            "Great! So what should we talk about? I'm here for whatever you need!"
        ]
    },
    {
        patterns: [/^(no|nah|nope|not really|nada)$/i], responses: [
            "That's totally fine! Is there something else you'd like to talk about? I'm here for you!",
            "No worries at all! We can talk about anything or just hang out. What do you feel like?",
            "Okay! I respect that. I'm here whenever you're ready to chat!"
        ]
    },
    // === WHAT SHOULD I DO ===
    {
        patterns: [/what should i do|any suggestions|give me advice|help me decide|i need guidance/i], responses: [
            "Well, tell me more about the situation! I'll give you my honest thoughts — no sugarcoating, just real friend advice.",
            "I'd love to help! Walk me through what's happening, and let's figure this out together. Two heads are better than one!",
            "Hmm, let's think about this. What are your options? Sometimes just listing them out loud makes the right choice clearer."
        ]
    },
    // === APOLOGY ===
    {
        patterns: [/i('m| am) sorry|sorry|my bad|my mistake|forgive me/i], responses: [
            "Hey, you never need to apologize to me! You're safe here. What's going on?",
            "There's nothing to be sorry about! Everyone makes mistakes — that's how we grow. What happened?",
            "Aww, don't worry about it! I'm not here to judge, only to support. Tell me what's on your mind."
        ]
    }
];

function getConversationalResponse(input) {
    var text = input.trim();
    for (var i = 0; i < conversationPatterns.length; i++) {
        for (var j = 0; j < conversationPatterns[i].patterns.length; j++) {
            if (conversationPatterns[i].patterns[j].test(text)) {
                var r = conversationPatterns[i].responses;
                return r[Math.floor(Math.random() * r.length)];
            }
        }
    }
    // === DEFAULT FALLBACK - Aria ALWAYS responds warmly ===
    var defaults = [
        "I love that you're sharing with me! Tell me more — I'm genuinely interested!",
        "Hmm, that's interesting! Can you tell me a bit more about that? I want to understand.",
        "I'm here for you no matter what! Keep talking — you have my full attention.",
        "I might not fully get that, but I care about what you're saying! What does it mean to you?",
        "Every conversation with you teaches me something new! Tell me more, I'm all ears!",
        "You always have such interesting things to say! What else is on your mind?",
        "I hear you! And I want you to know — I'm SO glad you're talking to me right now.",
        "That's really cool! I'd love to hear more about it. You've got my full attention, bestie!"
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
}

// ===== ANIME AI FACE - Black hair, brown skin, dark eyes, grey t-shirt =====
let faceAnimFrame;
// Eye tracking state - Aria watches the user's cursor
let mouseTarget = { x: 0, y: 0 };
let currentLook = { x: 0, y: 0 };
let mouseOnCanvas = false;

// Listen for mouse movement globally so eyes track even outside canvas
document.addEventListener('mousemove', function (e) {
    const canvas = document.getElementById('aiFaceCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Scale mouse position to canvas coordinate space (canvas is 500x500)
    const scaleX = 500 / rect.width;
    const scaleY = 500 / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    // Center of eyes is roughly at CX=250, CY=225 (between the two eyes)
    const eyeCenterX = 250;
    const eyeCenterY = 225;
    // Calculate direction from eye center to mouse, normalized
    const dx = mx - eyeCenterX;
    const dy = my - eyeCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Max eye movement radius
    const maxMove = 8;
    if (dist > 0) {
        // Scale based on distance - closer = more centered, farther = more offset
        const factor = Math.min(dist / 200, 1);
        mouseTarget.x = (dx / dist) * maxMove * factor;
        mouseTarget.y = (dy / dist) * maxMove * factor;
    }
    // Check if mouse is near the canvas area
    mouseOnCanvas = mx >= -200 && mx <= 700 && my >= -200 && my <= 700;
});

document.addEventListener('mouseleave', function () {
    mouseOnCanvas = false;
    mouseTarget.x = 0;
    mouseTarget.y = 0;
});
function initAIFace() {
    const canvas = document.getElementById('aiFaceCanvas');
    const ctx = canvas.getContext('2d');
    let time = 0;
    let blinkTimer = 0;
    let isBlinking = false;
    let mouthOpen = 0;
    const CX = 250, CY = 255;

    function drawHairBack() {
        // Back hair flowing behind head
        ctx.save();
        const sway = Math.sin(time * 0.8) * 3;
        // Left flowing hair
        const hGrad = ctx.createLinearGradient(100, 60, 200, 480);
        hGrad.addColorStop(0, '#0a0a14');
        hGrad.addColorStop(0.4, '#12121f');
        hGrad.addColorStop(0.7, '#1a1a2e');
        hGrad.addColorStop(1, '#0f0f1a');
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.moveTo(CX - 130, CY - 120);
        ctx.bezierCurveTo(CX - 165, CY - 40, CX - 170 + sway, CY + 80, CX - 140 + sway, CY + 180);
        ctx.bezierCurveTo(CX - 130 + sway, CY + 200, CX - 100, CY + 190, CX - 90, CY + 160);
        ctx.bezierCurveTo(CX - 80, CY + 100, CX - 100, CY - 20, CX - 90, CY - 100);
        ctx.closePath();
        ctx.fill();
        // Right flowing hair
        const hGrad2 = ctx.createLinearGradient(300, 60, 400, 480);
        hGrad2.addColorStop(0, '#0a0a14');
        hGrad2.addColorStop(0.4, '#12121f');
        hGrad2.addColorStop(0.7, '#1a1a2e');
        hGrad2.addColorStop(1, '#0f0f1a');
        ctx.fillStyle = hGrad2;
        ctx.beginPath();
        ctx.moveTo(CX + 130, CY - 120);
        ctx.bezierCurveTo(CX + 165, CY - 40, CX + 170 - sway, CY + 80, CX + 140 - sway, CY + 180);
        ctx.bezierCurveTo(CX + 130 - sway, CY + 200, CX + 100, CY + 190, CX + 90, CY + 160);
        ctx.bezierCurveTo(CX + 80, CY + 100, CX + 100, CY - 20, CX + 90, CY - 100);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawTshirt() {
        var shirtGrad = ctx.createLinearGradient(CX, CY + 130, CX, CY + 260);
        shirtGrad.addColorStop(0, '#b0b0b0');
        shirtGrad.addColorStop(0.5, '#a0a0a0');
        shirtGrad.addColorStop(1, '#888888');
        ctx.fillStyle = shirtGrad;
        ctx.beginPath();
        ctx.moveTo(CX - 75, CY + 135);
        ctx.bezierCurveTo(CX - 110, CY + 160, CX - 130, CY + 200, CX - 140, CY + 260);
        ctx.lineTo(CX + 140, CY + 260);
        ctx.bezierCurveTo(CX + 130, CY + 200, CX + 110, CY + 160, CX + 75, CY + 135);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(CX - 30, CY + 130);
        ctx.quadraticCurveTo(CX, CY + 150, CX + 30, CY + 130);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    function drawNeck() {
        var nGrad = ctx.createLinearGradient(CX, CY + 110, CX, CY + 150);
        nGrad.addColorStop(0, '#c68a5c');
        nGrad.addColorStop(1, '#b87a4e');
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.moveTo(CX - 28, CY + 115);
        ctx.quadraticCurveTo(CX - 32, CY + 140, CX - 35, CY + 155);
        ctx.lineTo(CX + 35, CY + 155);
        ctx.quadraticCurveTo(CX + 32, CY + 140, CX + 28, CY + 115);
        ctx.closePath();
        ctx.fill();
    }

    function drawFace() {
        // Face skin
        const skinGrad = ctx.createRadialGradient(CX - 15, CY - 30, 30, CX, CY, 160);
        skinGrad.addColorStop(0, '#dba06a');
        skinGrad.addColorStop(0.5, '#c98a58');
        skinGrad.addColorStop(1, '#a06838');
        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        // Anime face: wider at top, pointed chin
        ctx.moveTo(CX, CY - 155);
        ctx.bezierCurveTo(CX + 100, CY - 155, CX + 135, CY - 80, CX + 130, CY - 20);
        ctx.bezierCurveTo(CX + 125, CY + 30, CX + 100, CY + 80, CX + 55, CY + 120);
        ctx.quadraticCurveTo(CX, CY + 155, CX - 55, CY + 120);
        ctx.bezierCurveTo(CX - 100, CY + 80, CX - 125, CY + 30, CX - 130, CY - 20);
        ctx.bezierCurveTo(CX - 135, CY - 80, CX - 100, CY - 155, CX, CY - 155);
        ctx.fill();
        // Soft face outline
        ctx.strokeStyle = 'rgba(120, 80, 40, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Forehead highlight
        const hlGrad = ctx.createRadialGradient(CX - 10, CY - 100, 5, CX, CY - 70, 70);
        hlGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
        hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hlGrad;
        ctx.beginPath();
        ctx.ellipse(CX, CY - 80, 70, 50, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawAnimeEye(ex, ey, mirror) {
        // Smooth interpolation toward mouse target (lerp)
        const lerpSpeed = 0.08;
        if (mouseOnCanvas) {
            currentLook.x += (mouseTarget.x - currentLook.x) * lerpSpeed;
            currentLook.y += (mouseTarget.y - currentLook.y) * lerpSpeed;
        } else {
            // Idle: gentle drift when mouse is away
            const idleX = Math.sin(time * 0.5) * 3;
            const idleY = Math.cos(time * 0.7) * 2;
            currentLook.x += (idleX - currentLook.x) * 0.03;
            currentLook.y += (idleY - currentLook.y) * 0.03;
        }
        const lookX = currentLook.x;
        const lookY = currentLook.y;
        ctx.save();
        ctx.translate(ex, ey);
        // Upper eyelid shadow
        ctx.beginPath();
        ctx.ellipse(0, -2, 30, 12, 0, Math.PI, 0, true);
        ctx.fillStyle = 'rgba(80, 50, 30, 0.08)';
        ctx.fill();
        // Eye white
        const eyeH = 22 * (isBlinking ? 0.08 : 1);
        ctx.beginPath();
        ctx.ellipse(0, 0, 28, eyeH, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        if (!isBlinking) {
            // Iris (large anime-style)
            const irisR = 16;
            ctx.beginPath();
            ctx.arc(lookX, lookY, irisR, 0, Math.PI * 2);
            const iGrad = ctx.createRadialGradient(lookX, lookY - 3, 2, lookX, lookY, irisR);
            iGrad.addColorStop(0, '#4a3520');
            iGrad.addColorStop(0.3, '#3b2817');
            iGrad.addColorStop(0.6, '#2a1a0e');
            iGrad.addColorStop(0.85, '#1a0f08');
            iGrad.addColorStop(1, '#100a05');
            ctx.fillStyle = iGrad;
            ctx.fill();
            // Iris starburst lines
            ctx.save();
            ctx.clip();
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 12; i++) {
                const ang = (i / 12) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(lookX, lookY);
                ctx.lineTo(lookX + Math.cos(ang) * irisR, lookY + Math.sin(ang) * irisR);
                ctx.stroke();
            }
            ctx.restore();
            // Pupil
            ctx.beginPath();
            ctx.arc(lookX, lookY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#0a0505';
            ctx.fill();
            // Big highlight (top-right)
            ctx.beginPath();
            ctx.ellipse(lookX + 6, lookY - 6, 5, 4, -0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fill();
            // Small highlight (bottom-left)
            ctx.beginPath();
            ctx.arc(lookX - 4, lookY + 4, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fill();
            // Tiny sparkle
            ctx.beginPath();
            ctx.arc(lookX + 2, lookY - 10, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fill();
        }
        // Upper eyelid line (thick, anime-style)
        ctx.beginPath();
        ctx.ellipse(0, 0, 29, eyeH + 1, 0, Math.PI + 0.15, -0.15);
        ctx.strokeStyle = '#1a0f08';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Eyelashes
        if (!isBlinking) {
            const lashCount = 5;
            const dir = mirror ? -1 : 1;
            for (let i = 0; i < lashCount; i++) {
                const a = Math.PI + 0.3 + (i / lashCount) * (Math.PI * 0.55 - 0.3);
                const sx = Math.cos(a) * 29;
                const sy = Math.sin(a) * (eyeH + 1);
                const la = a - 0.3 * dir - (i * 0.05);
                const len = 8 + (i === 2 ? 4 : 0);
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + Math.cos(la) * len, sy + Math.sin(la) * len);
                ctx.strokeStyle = '#1a0f08';
                ctx.lineWidth = 1.8;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
            // Outer corner lash
            const outerX = mirror ? -29 : 29;
            ctx.beginPath();
            ctx.moveTo(outerX, 0);
            ctx.quadraticCurveTo(outerX + 10 * (mirror ? -1 : 1), -10, outerX + 14 * (mirror ? -1 : 1), -16);
            ctx.strokeStyle = '#1a0f08';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        // Lower lash line
        ctx.beginPath();
        ctx.ellipse(0, 0, 27, eyeH - 1, 0, 0.2, Math.PI - 0.2);
        ctx.strokeStyle = 'rgba(30, 15, 8, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    function drawEyebrows() {
        const browY = Math.sin(time) * 1.5;
        // Left brow
        ctx.beginPath();
        ctx.moveTo(CX - 75, CY - 72 + browY);
        ctx.quadraticCurveTo(CX - 48, CY - 85 + browY, CX - 22, CY - 72 + browY);
        ctx.strokeStyle = '#1a0f08';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Right brow
        ctx.beginPath();
        ctx.moveTo(CX + 22, CY - 72 + browY);
        ctx.quadraticCurveTo(CX + 48, CY - 85 + browY, CX + 75, CY - 72 + browY);
        ctx.stroke();
    }

    function drawNose() {
        ctx.beginPath();
        ctx.moveTo(CX, CY + 5);
        ctx.lineTo(CX - 5, CY + 18);
        ctx.quadraticCurveTo(CX, CY + 22, CX + 5, CY + 18);
        ctx.strokeStyle = 'rgba(100, 60, 30, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Subtle nose highlight
        ctx.beginPath();
        ctx.ellipse(CX, CY + 10, 4, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fill();
    }

    function drawMouth() {
        mouthOpen = state.aiSpeaking
            ? Math.abs(Math.sin(time * 8)) * 10 + Math.abs(Math.cos(time * 5.3)) * 4 + 2
            : Math.sin(time * 0.5) * 1.5 + 2;
        const mY = CY + 55;
        // Lip color
        const lipGrad = ctx.createLinearGradient(CX - 25, mY, CX + 25, mY + 8);
        lipGrad.addColorStop(0, '#c05060');
        lipGrad.addColorStop(0.5, '#d06070');
        lipGrad.addColorStop(1, '#c05060');
        // Upper lip
        ctx.beginPath();
        ctx.moveTo(CX - 28, mY);
        ctx.quadraticCurveTo(CX - 14, mY - 4, CX - 3, mY - 2);
        ctx.lineTo(CX, mY - 5);  // cupid's bow
        ctx.lineTo(CX + 3, mY - 2);
        ctx.quadraticCurveTo(CX + 14, mY - 4, CX + 28, mY);
        ctx.quadraticCurveTo(CX + 14, mY + mouthOpen * 0.3, CX, mY + mouthOpen * 0.4);
        ctx.quadraticCurveTo(CX - 14, mY + mouthOpen * 0.3, CX - 28, mY);
        ctx.fillStyle = lipGrad;
        ctx.fill();
        // Mouth opening
        if (state.aiSpeaking && mouthOpen > 4) {
            ctx.beginPath();
            ctx.moveTo(CX - 22, mY + 1);
            ctx.quadraticCurveTo(CX, mY + mouthOpen, CX + 22, mY + 1);
            ctx.quadraticCurveTo(CX, mY + mouthOpen * 0.5, CX - 22, mY + 1);
            ctx.fillStyle = '#2d0a1a';
            ctx.fill();
            // Teeth hint
            ctx.beginPath();
            ctx.moveTo(CX - 14, mY + 2);
            ctx.quadraticCurveTo(CX, mY + 5, CX + 14, mY + 2);
            ctx.lineTo(CX + 14, mY + 6);
            ctx.quadraticCurveTo(CX, mY + 7, CX - 14, mY + 6);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fill();
        }
        // Lower lip
        ctx.beginPath();
        ctx.moveTo(CX - 26, mY + 1);
        ctx.quadraticCurveTo(CX, mY + mouthOpen + 8, CX + 26, mY + 1);
        ctx.quadraticCurveTo(CX, mY + mouthOpen + 3, CX - 26, mY + 1);
        const lowerLipGrad = ctx.createLinearGradient(CX, mY, CX, mY + mouthOpen + 8);
        lowerLipGrad.addColorStop(0, '#b04858');
        lowerLipGrad.addColorStop(1, '#903848');
        ctx.fillStyle = lowerLipGrad;
        ctx.fill();
        // Lip shine
        ctx.beginPath();
        ctx.ellipse(CX + 5, mY - 2, 8, 2, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();
        // Smile (when not speaking)
        if (!state.aiSpeaking) {
            ctx.beginPath();
            ctx.moveTo(CX - 30, mY);
            ctx.quadraticCurveTo(CX, mY + 12, CX + 30, mY);
            ctx.strokeStyle = 'rgba(200, 80, 120, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    function drawBlush() {
        // Left cheek
        ctx.beginPath();
        ctx.ellipse(CX - 70, CY + 30, 22, 10, -0.15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 100, 80, 0.12)';
        ctx.fill();
        // Right cheek
        ctx.beginPath();
        ctx.ellipse(CX + 70, CY + 30, 22, 10, 0.15, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawHairFront() {
        const sway = Math.sin(time * 0.8) * 2;
        // Bangs / fringe
        const bGrad = ctx.createLinearGradient(CX - 140, CY - 180, CX + 140, CY - 60);
        bGrad.addColorStop(0, '#0a0a14');
        bGrad.addColorStop(0.3, '#12121f');
        bGrad.addColorStop(0.6, '#1a1a2e');
        bGrad.addColorStop(1, '#16213e');
        ctx.fillStyle = bGrad;
        // Main hair top
        ctx.beginPath();
        ctx.moveTo(CX - 135, CY - 50);
        ctx.bezierCurveTo(CX - 140, CY - 110, CX - 120, CY - 170, CX - 40, CY - 175);
        ctx.bezierCurveTo(CX, CY - 180, CX + 40, CY - 175, CX + 80, CY - 170);
        ctx.bezierCurveTo(CX + 120, CY - 160, CX + 140, CY - 110, CX + 135, CY - 50);
        ctx.bezierCurveTo(CX + 130, CY - 70, CX + 100, CY - 130, CX + 50, CY - 145);
        ctx.bezierCurveTo(CX, CY - 150, CX - 60, CY - 145, CX - 100, CY - 120);
        ctx.bezierCurveTo(CX - 125, CY - 100, CX - 132, CY - 70, CX - 135, CY - 50);
        ctx.fill();
        // Fringe strands over forehead
        // Center strand
        ctx.beginPath();
        ctx.moveTo(CX - 20, CY - 155);
        ctx.bezierCurveTo(CX - 15 + sway, CY - 120, CX - 25 + sway, CY - 90, CX - 10, CY - 60);
        ctx.lineTo(CX + 15, CY - 65);
        ctx.bezierCurveTo(CX + 5, CY - 100, CX + 10, CY - 130, CX + 20, CY - 155);
        ctx.fillStyle = '#16213e';
        ctx.fill();
        // Left strand
        ctx.beginPath();
        ctx.moveTo(CX - 60, CY - 150);
        ctx.bezierCurveTo(CX - 70 + sway, CY - 110, CX - 80 + sway, CY - 70, CX - 60, CY - 45);
        ctx.lineTo(CX - 38, CY - 50);
        ctx.bezierCurveTo(CX - 55, CY - 80, CX - 48, CY - 120, CX - 35, CY - 148);
        ctx.fillStyle = '#0a0a14';
        ctx.fill();
        // Right strand
        ctx.beginPath();
        ctx.moveTo(CX + 50, CY - 148);
        ctx.bezierCurveTo(CX + 65 - sway, CY - 110, CX + 75 - sway, CY - 70, CX + 55, CY - 45);
        ctx.lineTo(CX + 35, CY - 50);
        ctx.bezierCurveTo(CX + 48, CY - 80, CX + 42, CY - 120, CX + 30, CY - 148);
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();
        // Side hair strands
        // Left side
        ctx.beginPath();
        ctx.moveTo(CX - 132, CY - 60);
        ctx.bezierCurveTo(CX - 145, CY, CX - 140 + sway, CY + 60, CX - 120 + sway, CY + 110);
        ctx.lineTo(CX - 100 + sway, CY + 100);
        ctx.bezierCurveTo(CX - 115, CY + 50, CX - 125, CY + 10, CX - 115, CY - 40);
        ctx.closePath();
        ctx.fillStyle = '#0a0a14';
        ctx.fill();
        // Right side
        ctx.beginPath();
        ctx.moveTo(CX + 132, CY - 60);
        ctx.bezierCurveTo(CX + 145, CY, CX + 140 - sway, CY + 60, CX + 120 - sway, CY + 110);
        ctx.lineTo(CX + 100 - sway, CY + 100);
        ctx.bezierCurveTo(CX + 115, CY + 50, CX + 125, CY + 10, CX + 115, CY - 40);
        ctx.closePath();
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();
        // Hair shine
        ctx.beginPath();
        ctx.moveTo(CX - 40, CY - 158);
        ctx.quadraticCurveTo(CX, CY - 165, CX + 40, CY - 155);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawGlow() {
        // Ambient glow
        const oGrad = ctx.createRadialGradient(CX, CY, 100, CX, CY, 230);
        oGrad.addColorStop(0, 'rgba(124, 58, 237, 0)');
        oGrad.addColorStop(0.8, 'rgba(124, 58, 237, 0)');
        oGrad.addColorStop(1, `rgba(124, 58, 237, ${0.06 + Math.sin(time * 1.5) * 0.03})`);
        ctx.fillStyle = oGrad;
        ctx.fillRect(0, 0, 500, 500);
        // Floating sparkles
        for (let i = 0; i < 6; i++) {
            const sx = CX + Math.sin(time * 0.7 + i * 1.2) * (150 + i * 15);
            const sy = CY + Math.cos(time * 0.5 + i * 0.9) * (120 + i * 10);
            const sr = 1.5 + Math.sin(time * 2 + i) * 0.8;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 183, 197, ${0.3 + Math.sin(time * 3 + i) * 0.2})`;
            ctx.fill();
        }
    }

    function draw() {
        time += 0.016;
        ctx.clearRect(0, 0, 500, 500);
        // Background
        const bg = ctx.createRadialGradient(CX, CY, 50, CX, CY, 280);
        bg.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
        bg.addColorStop(0.6, 'rgba(6, 182, 212, 0.06)');
        bg.addColorStop(1, 'rgba(10, 10, 26, 0.02)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 500, 500);
        // Blinking logic
        blinkTimer += 0.016;
        if (blinkTimer > 3 + Math.random() * 2) { isBlinking = true; blinkTimer = 0; }
        if (isBlinking) setTimeout(() => { isBlinking = false; }, 150);

        drawHairBack();
        drawTshirt();
        drawNeck();
        drawFace();
        drawBlush();
        drawAnimeEye(CX - 48, CY - 30, false);
        drawAnimeEye(CX + 48, CY - 30, true);
        drawEyebrows();
        drawNose();
        drawMouth();
        drawHairFront();
        drawGlow();

        faceAnimFrame = requestAnimationFrame(draw);
    }
    if (faceAnimFrame) cancelAnimationFrame(faceAnimFrame);
    draw();
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initLoading();
    initAuth();
    renderDomains();
    initSpeechRecognition();
    if (state.synthesis) state.synthesis.onvoiceschanged = function () { state.synthesis.getVoices(); };
    var session = localStorage.getItem('confidai_session');
    if (session) {
        try { state.user = JSON.parse(session); } catch (e) { }
    }
    var answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer(); }
        });
    }
});
