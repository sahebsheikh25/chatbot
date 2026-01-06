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

    // Try multiple OpenRouter endpoints with a small retry/backoff for robustness
    const endpoints = [
      'https://api.openrouter.ai/v1/chat/completions',
      'https://openrouter.ai/api/v1/chat/completions'
    ];
    let lastErr = null;
    let r = null;
    let text = '';

    for (let i = 0; i < endpoints.length; i++) {
      const url = endpoints[i];
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        // include Accept and a minimal User-Agent for some hosts
        const reqHeaders = Object.assign({ Accept: 'application/json', 'User-Agent': 'snsecurity-chatbot/1.0' }, headers);

        r = await fetch(url, {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeout);
        text = await r.text();
        // parse and break if we got a response (even non-OK we'll handle below)
        break;
      } catch (e) {
        lastErr = e;
        console.error(`OpenRouter request to ${url} failed:`, e && e.message ? e.message : e);
        // small backoff before next try
        await new Promise((res) => setTimeout(res, 250 + i * 150));
      }
    }

    // If we never got a response object, fail
    if (!r) {
      const errMsg = lastErr && lastErr.name === 'AbortError' ? 'Request timed out to AI backend.' : (lastErr && lastErr.message ? lastErr.message : 'fetch failed');
      console.error('All OpenRouter endpoints failed:', errMsg);
      return res.status(502).json({ error: `System: ${errMsg}` });
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      // not JSON
    }
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
