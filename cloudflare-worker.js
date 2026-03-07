// ═══════════════════════════════════════════════════════════════════
// GERS API Proxy — Cloudflare Worker
// Hides Telegram bot tokens from the frontend
// ═══════════════════════════════════════════════════════════════════

const BOTS = {
    orders: {
        token: '8634895672:AAGQrtgbfj6K2yza-26Z9-53pjDqr8w8f-0',
        chatId: '-1003707995958'
    },
    analytics: {
        token: '8752359181:AAGI18WNi1uircMR47A2O76utmZBgNM8Hnw',
        chatId: '-1003839451185'
    }
};

// Allowed origins
const ALLOWED_ORIGINS = [
    'https://gers.agency',
    'http://gers.agency',
    'https://kronlead.github.io'
];

function corsHeaders(origin) {
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
}

export default {
    async fetch(request, env, ctx) {
        const origin = request.headers.get('Origin') || '';

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(origin) });
        }

        // Only POST allowed
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: corsHeaders(origin)
            });
        }

        // Check origin
        if (!ALLOWED_ORIGINS.includes(origin)) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), {
                status: 403,
                headers: corsHeaders(origin)
            });
        }

        try {
            const body = await request.json();
            const { type, message } = body;

            // Validate bot type
            if (!type || !BOTS[type]) {
                return new Response(JSON.stringify({ error: 'Invalid bot type' }), {
                    status: 400,
                    headers: corsHeaders(origin)
                });
            }

            // Validate message
            if (!message || typeof message !== 'string' || message.length > 4000) {
                return new Response(JSON.stringify({ error: 'Invalid message' }), {
                    status: 400,
                    headers: corsHeaders(origin)
                });
            }

            // Rate limiting: simple per-IP (Cloudflare Workers have built-in limits)
            const bot = BOTS[type];
            const tgUrl = `https://api.telegram.org/bot${bot.token}/sendMessage`;

            const tgResponse = await fetch(tgUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: bot.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const tgData = await tgResponse.json();

            return new Response(JSON.stringify({ ok: tgData.ok }), {
                status: tgData.ok ? 200 : 500,
                headers: corsHeaders(origin)
            });

        } catch (err) {
            return new Response(JSON.stringify({ error: 'Server error' }), {
                status: 500,
                headers: corsHeaders(origin)
            });
        }
    }
};
