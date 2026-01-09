(function () {
  const btn = document.getElementById("sn-chat-button");
  const panel = document.getElementById("sn-chat-panel");
  const closeBtn = document.getElementById("sn-chat-close");
  const minBtn = document.getElementById("sn-chat-minimize");
  const form = document.getElementById("sn-chat-form");
  const input = document.getElementById("sn-chat-input");
  const messagesEl = document.getElementById("sn-chat-messages");
  const typingEl = document.getElementById("sn-chat-typing");
  const statusEl = document.getElementById("sn-chat-status");

  let messages = [];

  function setStatus(t) {
    statusEl.textContent = t;
  }

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = "sn-msg " + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  btn.onclick = () => {
    panel.style.display = "flex";
  };
  closeBtn.onclick = minBtn.onclick = () => {
    panel.style.display = "none";
  };

  addMessage("sn-bot", "Hi 👋 Ask me anything!");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    addMessage("sn-user", text);
    typingEl.classList.remove("hidden");
    setStatus("[connecting]");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) throw new Error("server error");

      const data = await res.json();
      if (!data.reply) throw new Error("empty");

      addMessage("sn-bot", data.reply);
      setStatus("[connected]");

    } catch (err) {
      console.error(err);
      addMessage(
        "sn-error",
        "[SYSTEM ALERT] System: Assistant unavailable. Try again later."
      );
      setStatus("[retrying]");
    } finally {
      typingEl.classList.add("hidden");
    }
  });
})();
