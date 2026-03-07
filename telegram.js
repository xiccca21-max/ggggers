// ═══════════════════════════════════════════════════════════════════
// GERS — Telegram Integration (via secure proxy)
// Tokens are hidden on the server (Cloudflare Worker)
// ═══════════════════════════════════════════════════════════════════

const GERS_API = 'https://gers-api.kronlead.workers.dev';

// ── Send message via secure proxy ──
function sendToTelegram(type, message) {
    return fetch(GERS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message })
    }).catch(() => {});
}

// ═══════════════════════════════════════════════════════════════════
// 1. ORDERS — Send form data to Telegram
// ═══════════════════════════════════════════════════════════════════

function sendOrderToTelegram(data) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit', minute: '2-digit'
    });

    const budgetMap = {
        '30': 'До 50 000 ₽',
        '50': '50 000 – 100 000 ₽',
        '100': '100 000 – 300 000 ₽',
        '300': '300 000+ ₽'
    };

    const projectMap = {
        'site': 'Сайт',
        'webapp': 'Веб-приложение',
        'mobile': 'Мобильное приложение',
        'platform': 'Комплексная платформа',
        'other': 'Другое'
    };

    const msg = `📩 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name || '—'}
📧 <b>Email:</b> ${data.email || '—'}
💬 <b>Telegram:</b> ${data.telegram || '—'}
📁 <b>Тип проекта:</b> ${projectMap[data.projectType] || data.projectType || '—'}
💰 <b>Бюджет:</b> ${budgetMap[data.budget] || data.budget || '—'}
📝 <b>Описание:</b> ${data.description || '—'}

🕐 ${dateStr}, ${timeStr}
🌐 Страница: ${location.pathname}`;

    return sendToTelegram('orders', msg);
}

// ═══════════════════════════════════════════════════════════════════
// 2. ANALYTICS — Track page visits
// ═══════════════════════════════════════════════════════════════════

(function trackVisit() {
    // Don't track localhost in development
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    // Detect device
    const ua = navigator.userAgent;
    let device = '🖥 Desktop';
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) device = '📱 Mobile';
    else if (/Tablet|iPad/i.test(ua)) device = '📱 Tablet';

    // OS detection
    let os = 'Unknown';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad/i.test(ua)) os = 'iOS';

    // Browser detection
    let browser = 'Unknown';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua)) browser = 'Safari';
    else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

    const referrer = document.referrer || 'Прямой переход';
    const page = location.pathname || '/';
    const pageTitle = document.title || page;

    // Get IP via free API
    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(data => {
            const msg = `👁 <b>Посещение сайта</b>

📄 <b>Страница:</b> ${pageTitle}
🔗 <b>URL:</b> ${page}
↩️ <b>Откуда:</b> ${referrer}
${device}, ${os}
🌐 <b>Браузер:</b> ${browser}
🔒 <b>IP:</b> ${data.ip}
🕐 ${dateStr}, ${timeStr}`;

            sendToTelegram('analytics', msg);
        })
        .catch(() => {
            // If IP API fails, send without IP
            const msg = `👁 <b>Посещение сайта</b>

📄 <b>Страница:</b> ${pageTitle}
🔗 <b>URL:</b> ${page}
↩️ <b>Откуда:</b> ${referrer}
${device}, ${os}
🌐 <b>Браузер:</b> ${browser}
🕐 ${dateStr}, ${timeStr}`;

            sendToTelegram('analytics', msg);
        });
})();
