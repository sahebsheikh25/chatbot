// /api/chat.js — SN Security (Groq streaming handler)
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ info: 'POST JSON { message: "...", stream?: true }' });
  }

  // Parse body (Edge + Node safe)
  let body = {};
  try {
    if (typeof req.json === 'function') body = await req.json();
    else if (req.body) body = req.body;
  } catch (e) {
    body = {};
  }

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

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  const model = body.model || 'llama-3.3-70b-versatile';

  try {
    // Streaming path
    if (body.stream) {
      const completion = await groq.chat.completions.create({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
        temperature: body.temperature ?? 1,
        max_completion_tokens: body.max_completion_tokens ?? 1024,
        top_p: body.top_p ?? 1,
      });

      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      });

      req.on('close', () => {
        try { res.end(); } catch (e) {}
      });

      for await (const chunk of completion) {
        const delta = chunk.choices?.[0]?.delta?.content || '';
        if (delta) {
          // SSE data frame
          res.write(`data: ${delta}\n\n`);
        }
      }

      // Stream finished
      res.write('event: done\ndata: [DONE]\n\n');
      res.end();
      return;
    }

    // Non-streaming path
    const completion = await groq.chat.completions.create({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: body.temperature ?? 1,
      max_completion_tokens: body.max_completion_tokens ?? 1024,
      top_p: body.top_p ?? 1,
      stream: false
    });

    const reply = completion.choices?.[0]?.message?.content || '';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Groq handler error:', err?.message || err);
    return res.status(500).json({ error: 'Assistant unavailable' });
  }
}
