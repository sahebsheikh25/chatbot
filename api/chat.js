import { Groq } from "groq-sdk";

export const config = {
  runtime: "edge" // enables fast streaming
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { message } = await req.json();

  if (!message) {
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
    messages: [
      { role: "user", content: message }
    ],
    temperature: 1,
    max_completion_tokens: 1024,
    stream: true
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(content));
      }
      controller.close();
    }
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
