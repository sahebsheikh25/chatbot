// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({
      info: 'POST JSON { messages: [...] }'
    });
  }

  /* ---------- Parse body safely (Edge + Node) ---------- */
  let body = {};
  try {
    if (typeof req.json === 'function') {
      body = await req.json();
    } else if (req.body) {
      body = req.body;
    }
  } catch (e) {
    body = {};
  }

  const incoming = Array.isArray(body.messages)
    ? body.messages
    : body.message
    ? [{ role: 'user', content: String(body.message) }]
    : [];

  const recent = incoming.slice(-8); // keep context light

  const system = {
    role: 'system',
    content:
      'You are SN Security, a cybersecurity assistant with a hacker-terminal tone. Focus on ethical hacking, defensive security, awareness, and safe explanations. Never provide illegal instructions.'
  };

  const messages = [system, ...recent];

  const OR_KEY = process.env.OPENROUTER_API_KEY;
  if (!OR_KEY) {
    return res.status(200).json({
      reply: 'System: OPENROUTER_API_KEY not configured.'
    });
  }

  /* ---------- Model fallback list (most stable → least) ---------- */
  const MODELS = [
    'xiaomi/mimo-v2-flash:free',
    'meta-llama/llama-3-8b-instruct:free',
    'mistralai/devstral-2512:free'
  ];

  const headers = {
    Authorization: `Bearer ${OR_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'snsecurity-chatbot/1.0'
  };

  if (process.env.SITE_URL) headers.Referer = process.env.SITE_URL;
  if (process.env.SITE_TITLE) headers['X-Title'] = process.env.SITE_TITLE;

  const endpoint = 'https://api.openrouter.ai/v1/chat/completions';

  let lastError = null;

  /* ---------- Try models one by one ---------- */
  for (const model of MODELS) {
    try {
      const payload = {
        model,
        messages,
        temperature: 0.2,
        max_tokens: 512
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const r = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      const text = await r.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        lastError = 'Invalid JSON from provider';
        continue;
      }

      if (!r.ok) {
        lastError =
          json?.error?.message ||
          json?.message ||
          `Provider error (${r.status})`;
        continue;
      }

      const reply = json?.choices?.[0]?.message?.content;
      if (reply) {
        return res.status(200).json({ reply });
      }

      lastError = 'Empty response from provider';
    } catch (err) {
      lastError =
        err?.name === 'AbortError'
          ? 'Timeout contacting AI backend'
          : err?.message || 'Network error';
    }
  }

  /* ---------- All providers failed ---------- */
  return res.status(200).json({
    reply:
      'System: AI nodes busy or offline. Secure channel retry recommended.'
  });
}
