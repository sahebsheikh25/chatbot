import { Groq } from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
      temperature: 0.8,
      max_completion_tokens: 512
    });

    const reply = completion?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(500).json({ error: "Empty response" });
    }

    res.status(200).json({ reply });

  } catch (err) {
    console.error("Groq Error:", err);
    res.status(500).json({ error: "Groq API failed" });
  }
}
