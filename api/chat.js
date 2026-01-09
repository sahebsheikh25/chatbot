import { Groq } from "groq-sdk";

export const config = {
  runtime: "edge" // enables fast streaming
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { message } = await req.json();

  const body = await req.json().catch(() => ({}));

  const incoming = Array.isArray(body.messages)
    ? body.messages
    : body.message
    ? [{ role: 'user', content: String(body.message) }]
    : message
    ? [{ role: 'user', content: String(message) }]
    : [];

  if (incoming.length === 0) {
    return new Response(
      JSON.stringify({ error: "Message is required" }),
      { status: 400 }
    );
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: incoming.map(m => ({ role: m.role, content: m.content })),
    temperature: 1,
    max_completion_tokens: 1024,
    stream: true
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content || "";
          if (content) {
            // Emit SSE-style `data: ` frames so the client parser can split on "\n\n"
            controller.enqueue(encoder.encode(`data: ${content}\n\n`));
          }
        }
        // signal done
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      } catch (e) {
        // emit an error frame (clients will typically ignore unknown frames)
        try { controller.enqueue(encoder.encode(`data: [ERROR]\n\n`)); } catch(_){}
      } finally {
        controller.close();
      }
    }
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
