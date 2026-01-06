// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({
      info: 'POST JSON { messages: [...] }'
    });
  }

  // Parse incoming JSON body in multiple runtime environments
  let body = {};
  try {
    if (typeof req.json === 'function') {
      body = await req.json();
    } else if (req.body) {
      body = req.body;
    } else {
      // Node.js raw stream fallback
      body = await new Promise((resolve) => {
        let data = '';
        req.on && req.on('data', (chunk) => (data += chunk));
        req.on && req.on('end', () => {
          try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); }
        });
        // timeout fallback
        setTimeout(() => resolve({}), 50);
      });
    }
  } catch (e) {
    console.error('Error parsing request body:', e && e.message ? e.message : e);
    body = {};
  }

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
    const modelName = (body && body.model) ? String(body.model) : 'mistralai/devstral-2512:free';
    const payload = {
      model: modelName,
      messages,
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.2,
      max_tokens: 512
    };

    // headers to send to OpenRouter
    const baseHeaders = {
      Authorization: `Bearer ${OR_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'snsecurity-chatbot/1.0'
    };
    if (process.env.SITE_URL) baseHeaders.Referer = process.env.SITE_URL;
    if (process.env.SITE_TITLE) baseHeaders['X-Title'] = process.env.SITE_TITLE;

    const endpoints = [
      'https://api.openrouter.ai/v1/chat/completions',
      'https://openrouter.ai/api/v1/chat/completions'
    ];

    let lastError = null;
    let r = null;
    let text = '';

    for (let i = 0; i < endpoints.length; i++) {
      const url = endpoints[i];
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        r = await fetch(url, {
          method: 'POST',
          headers: baseHeaders,
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeout);
        text = await r.text();
        // break on any response (we'll handle non-OK below)
        break;
      } catch (e) {
        lastError = e;
        console.error(`Request to ${url} failed:`, e && e.message ? e.message : e);
        // small backoff before next attempt
        await new Promise((res) => setTimeout(res, 200 * (i + 1)));
      }
    }

    if (!r) {
      const msg = lastError && lastError.name === 'AbortError' ? 'Request timed out to AI backend.' : (lastError && lastError.message ? lastError.message : 'fetch failed');
      console.error('All OpenRouter endpoints failed:', msg);
      return res.status(502).json({ error: `System: ${msg}` });
    }

    let json = null;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON from OpenRouter:', text);
      return res.status(502).json({ error: 'System: Invalid response from AI backend.' });
    }

    if (!r.ok) {
      const errMsg = json?.error?.message || json?.message || `AI backend error (${r.status})`;
      console.error('OpenRouter error:', errMsg);
      return res.status(r.status).json({ error: `System: ${errMsg}` });
    }

    const reply = json?.choices?.[0]?.message?.content || json?.reply || 'System: No response from AI.';
    return res.status(200).json({ reply });
  } catch (err) {
    const msg =
      err?.name === 'AbortError'
        ? 'Request timed out to AI backend.'
        : err?.message || 'Network error contacting AI backend.';

    console.error('Chat API error:', msg);

    return res.status(502).json({
      error: `System: ${msg}`
    });
  }
}
