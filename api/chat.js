// /api/chat.js — SN Security (stable + fallback)
import Groq from "groq-sdk";
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ info: 'POST JSON { messages: [...] }' });
  }

  /* ---------- Parse body (Edge + Node safe) ---------- */
  let body = {};
  try {
    if (typeof req.json === 'function') body = await req.json();
    else if (req.body) body = req.body;
  } catch {}

  const incoming = Array.isArray(body.messages)
    ? body.messages
    : body.message
    ? [{ role: 'user', content: String(body.message) }]
    : [];

  const recent = incoming.slice(-8);

  const system = {
    role: 'system',
    content:
      'You are SN Security, a hacker-style cybersecurity assistant. Focus on ethical hacking, defensive security, awareness, and safe explanations. Never provide illegal instructions.'
  };

  const messages = [system, ...recent];

  /* ---------- Optional: Try Groq SDK (recommended if GROQ_API_KEY set) ---------- */
  try {
    if (process.env.GROQ_API_KEY) {
      const groq = new Groq();
      const groqResp = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      });
      const reply = groqResp?.choices?.[0]?.message?.content;
      if (reply) return res.status(200).json({ reply });
    }
  } catch (err) {
    // Fall through to OpenRouter providers on error
  }

  const OR_KEY = process.env.OPENROUTER_API_KEY;
  if (!OR_KEY) {
    return res.status(200).json({
      reply: 'System: OPENROUTER_API_KEY not configured.'
    });
  }

  /* ---------- MODEL PRIORITY (TOP → FALLBACK) ---------- */
  const MODELS = [
    // ✅ STABLE (PAID – highly recommended)
    'openai/gpt-4o-mini',

    // ⚠️ FREE (unstable – backup only)
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
