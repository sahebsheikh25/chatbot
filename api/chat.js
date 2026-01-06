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

    const r = await fetch(
      'https://api.openrouter.ai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OR_KEY}`,
          'Content-Type': 'application/json',
          // REQUIRED by OpenRouter (very important)
          'HTTP-Referer': 'https://snsecurity.in', // change to your domain
          'X-Title': 'SN Security Chatbot'
        },
        body: JSON.stringify(payload)
      }
    );

    const text = await r.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {}

    if (!r.ok) {
      const msg =
        json?.error?.message ||
        `System: AI backend error (${r.status})`;
      return res.status(r.status).json({ error: msg });
    }

    const reply =
      json?.choices?.[0]?.message?.content ||
      'System: No response from AI.';

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(502).json({
      error: 'System: Network error contacting AI backend.'
    });
  }
}
