// SN Security AI Chatbot - Floating Widget
class SNSecurityChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.systemPrompt =
      "You are an AI security assistant for SN Security, a cybersecurity learning platform. You provide expert guidance on cybersecurity, OSINT, ethical hacking, digital safety, and related security topics. Keep responses concise, technical, and helpful. Format code examples with proper markdown.";
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
  }

  createChatbotHTML() {
    const container = document.createElement("div");
    container.className = "sn-chatbot-container";
    container.innerHTML = `
      <button class="sn-chatbot-button" id="sn-chatbot-toggle" title="Open SN Security Chat">
        SN Chat
      </button>
      
      <div class="sn-chatbot-window" id="sn-chatbot-window">
        <div class="sn-chatbot-header">
          <h3>🔐 SN Security AI</h3>
          <button class="sn-chatbot-close" id="sn-chatbot-close" title="Close chat">✕</button>
        </div>
        <div class="sn-chatbot-messages" id="sn-chatbot-messages"></div>
        <div class="sn-chatbot-input-area">
          <input
            type="text"
            class="sn-chatbot-input"
            id="sn-chatbot-input"
            placeholder="Ask about security, OSINT, hacking..."
            autocomplete="off"
          />
          <button class="sn-chatbot-send" id="sn-chatbot-send">→</button>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById("sn-chatbot-toggle");
    const closeBtn = document.getElementById("sn-chatbot-close");
    const sendBtn = document.getElementById("sn-chatbot-send");
    const input = document.getElementById("sn-chatbot-input");

    toggleBtn.addEventListener("click", () => this.toggleChat());
    closeBtn.addEventListener("click", () => this.closeChat());
    sendBtn.addEventListener("click", () => this.sendMessage());

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    const window = document.getElementById("sn-chatbot-window");
    const button = document.getElementById("sn-chatbot-toggle");
    window.classList.add("open");
    button.classList.add("active");
    document.getElementById("sn-chatbot-input").focus();

    // Greet on first open
    if (this.messages.length === 0) {
      this.addBotMessage(
        "🔐 Welcome to SN Security AI Assistant! I can help you with cybersecurity, OSINT techniques, ethical hacking guidance, and digital safety. What's your question?"
      );
    }
  }

  closeChat() {
    this.isOpen = false;
    const window = document.getElementById("sn-chatbot-window");
    const button = document.getElementById("sn-chatbot-toggle");
    window.classList.remove("open");
    button.classList.remove("active");
  }

  async sendMessage() {
    const input = document.getElementById("sn-chatbot-input");
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addUserMessage(message);
    input.value = "";
    input.focus();

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Call backend API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: this.systemPrompt,
            },
            ...this.messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Remove typing indicator
      this.removeTypingIndicator();

      // Stream response
      await this.streamResponse(response);
    } catch (error) {
      this.removeTypingIndicator();
      console.error("Chatbot error:", error);
      this.addBotMessage(
        "⚠️ Error: Unable to connect to AI service. Please try again."
      );
    }
  }

  async streamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botMessage = "";
    let messageElement = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        botMessage += text;

        // Create or update message element
        if (!messageElement) {
          messageElement = this.createMessageElement(botMessage, "bot");
          const messagesDiv = document.getElementById("sn-chatbot-messages");
          messagesDiv.appendChild(messageElement);
        } else {
          messageElement.textContent = botMessage;
        }

        // Auto-scroll to bottom
        const messagesDiv = document.getElementById("sn-chatbot-messages");
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

      // Add to message history
      if (botMessage) {
        this.messages.push({
          role: "assistant",
          content: botMessage,
        });
      }
    } catch (error) {
      console.error("Stream error:", error);
      this.addBotMessage(
        "⚠️ Connection lost while receiving response. Please try again."
      );
    }
  }

  addUserMessage(text) {
    this.messages.push({
      role: "user",
      content: text,
    });
    const messageElement = this.createMessageElement(text, "user");
    document.getElementById("sn-chatbot-messages").appendChild(messageElement);
    this.scrollToBottom();
  }

  addBotMessage(text) {
    this.messages.push({
      role: "assistant",
      content: text,
    });
    const messageElement = this.createMessageElement(text, "bot");
    document.getElementById("sn-chatbot-messages").appendChild(messageElement);
    this.scrollToBottom();
  }

  createMessageElement(text, role) {
    const div = document.createElement("div");
    div.className = `sn-message ${role}`;
    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.textContent = text;
    div.appendChild(bubble);
    return div;
  }

  showTypingIndicator() {
    const div = document.createElement("div");
    div.className = "sn-message bot";
    div.id = "sn-typing-indicator";
    div.innerHTML = `
      <div class="sn-message-bubble">
        <div class="sn-typing-indicator">
          <div class="sn-typing-dot"></div>
          <div class="sn-typing-dot"></div>
          <div class="sn-typing-dot"></div>
        </div>
      </div>
    `;
    document.getElementById("sn-chatbot-messages").appendChild(div);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById("sn-typing-indicator");
    if (indicator) {
      indicator.remove();
    }
  }

  scrollToBottom() {
    const messagesDiv = document.getElementById("sn-chatbot-messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.snSecurityChatbot = new SNSecurityChatbot();
  });
} else {
  window.snSecurityChatbot = new SNSecurityChatbot();
}
