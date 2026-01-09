(function () {
  const toggleBtn = document.getElementById("chat-toggle");
  const chatbot = document.getElementById("chatbot");
  const minimizeBtn = document.getElementById("minimize");
  const sendBtn = document.getElementById("send-btn");
  const input = document.getElementById("user-input");
  const chatBody = document.getElementById("chat-body");

  if (!toggleBtn || !chatbot || !minimizeBtn || !sendBtn || !input || !chatBody) {
    return;
  }

  toggleBtn.onclick = () => {
    chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
  };

  minimizeBtn.onclick = () => {
    chatbot.style.display = "none";
  };

  sendBtn.onclick = sendMessage;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "message " + type;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const botMsg = addMessage("", "bot");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, stream: true })
    });

    if (!res.body) {
      const json = await res.json().catch(() => null);
      if (json?.reply) botMsg.textContent = json.reply;
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      botMsg.textContent += decoder.decode(value);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
})();
