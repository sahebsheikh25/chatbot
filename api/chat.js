// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({
      info: 'POST JSON { messages: [...] }'
    });
  }

  let body = {};
  try {
    body = await req.json();
  } catch (e) {}

  const incoming = Array.isArray(body.messages)
    ? body.messages
    : body.message
    ? [{ role: 'user', content: String(body.message) }]
    : [];

  const recent = incoming.slice(-10);

  const system = {
    role: 'system',
    content:
      'You are SN Security, a cybersecurity assistant with a hacker-terminal tone. Focus on ethical hacking, defensive security, awareness, and safe explanations. Never provide illegal instructions.'
  };

  const messages = [system, ...recent];

  const OR_KEY = process.env.OPENROUTER_API_KEY;

  if (!OR_KEY) {
    return res.status(200).json({
      reply:
        'System: Chat is not configured. Please set OPENROUTER_API_KEY in Vercel.'
    });
  }

  try {
    const payload = {
      model: 'deepseek/deepseek-r1-0528:free',
      messages,
      temperature: 0.2
    };
    // Build headers; avoid hardcoding Referer — use env if provided
    const headers = {
      Authorization: `Bearer ${OR_KEY}`,
      'Content-Type': 'application/json'
    };
    if (process.env.SITE_URL) headers.Referer = process.env.SITE_URL;
    if (process.env.SITE_TITLE) headers['X-Title'] = process.env.SITE_TITLE;

    // Use a timeout to avoid long hangs
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const r = await fetch('https://api.openrouter.ai/v1/chat/completions', {
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
    } catch (e) {
      // not JSON
    }

    if (!r.ok) {
      const errMsg = json?.error?.message || json?.message || text || `AI backend error (${r.status})`;
      console.error('OpenRouter error:', r.status, errMsg);
      return res.status(r.status).json({ error: `System: AI backend error: ${errMsg}` });
    }

    const reply = json?.choices?.[0]?.message?.content || json?.reply || 'System: No response from AI.';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Network error contacting AI backend:', err && err.message ? err.message : err);
    const message = err && err.name === 'AbortError' ? 'Request timed out to AI backend.' : (err && err.message ? err.message : 'Network error contacting AI backend.');
    return res.status(502).json({ error: `System: ${message}` });
  }
}
