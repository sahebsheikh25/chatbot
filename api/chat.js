// Vercel serverless function - API-agnostic proxy for chat providers
export default async function handler(req, res){
  if(req.method !== 'POST'){
    res.status(200).json({ info: 'POST JSON { messages: [...] } to get a reply' });
    return;
  }

  let body;
  try{ body = await req.json(); }catch(e){ body = {}; }

  const incoming = Array.isArray(body.messages) ? body.messages : (body.message ? [ {role:'user', content: String(body.message) } ] : []);
  const recent = incoming.slice(-10);

  const system = { role: 'system', content: 'You are SN Security, a helpful cybersecurity assistant focused on ethical hacking, defensive techniques, safe tool usage, and awareness. Provide concise, polite, safe guidance. If the user requests illegal or harmful action, refuse and offer high-level defensive guidance.' };
  const messages = [system, ...recent];

  // Provider selection: prefer OpenRouter, then OpenAI. Add others later.
  const OR_KEY = process.env.OPENROUTER_API_KEY;
  const OA_KEY = process.env.OPENAI_API_KEY;

  if(!OR_KEY && !OA_KEY){
    res.status(200).json({ reply: 'System: Chat is not configured. Set OPENROUTER_API_KEY or OPENAI_API_KEY in your environment.' });
    return;
  }

  // Build provider-specific request
  try{
    if(OR_KEY){
      const payload = {
        model: 'meta-llama/llama-3-8b-instruct:free',
        messages,
        temperature: 0.2,
        max_new_tokens: 512
      };
      const r = await fetch('https://api.openrouter.ai/v1/chat/completions', {
        method: 'POST', headers: { 'Authorization': `Bearer ${OR_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const text = await r.text();
      if(!r.ok){
        if(r.status === 429) return res.status(429).json({ error: 'System: Free quota reached or rate limit hit. Try again later.' });
        return res.status(r.status).json({ error: 'System: AI backend error. Please try later.' });
      }
      let json = null; try{ json = JSON.parse(text); }catch(e){}
      const reply = json?.choices?.[0]?.message?.content || json?.output?.[0]?.content || text;
      return res.status(200).json({ reply });
    }

    if(OA_KEY){
      // OpenAI Chat Completions
      const payload = { model: 'gpt-3.5-turbo', messages, temperature: 0.2, max_tokens: 512 };
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { 'Authorization': `Bearer ${OA_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const json = await r.json().catch(()=>null);
      if(!r.ok){
        if(r.status === 429) return res.status(429).json({ error: 'System: Rate limit or quota exceeded. Try again later.' });
        return res.status(r.status).json({ error: 'System: AI backend error. Please try later.' });
      }
      const reply = json?.choices?.[0]?.message?.content || json?.choices?.[0]?.message || JSON.stringify(json);
      return res.status(200).json({ reply });
    }

  }catch(err){
    return res.status(502).json({ error: 'System: Network error contacting AI backend.' });
  }
}
