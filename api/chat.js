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
    import Groq from "groq-sdk";

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    export default async function handler(req, res) {
      try {
        const { message } = req.body;

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are SN Security terminal AI." },
            { role: "user", content: message }
          ],
        });

        res.status(200).json({
          reply: completion.choices[0].message.content,
        });

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Assistant unavailable" });
      }
    }
        temperature: 0.2,
