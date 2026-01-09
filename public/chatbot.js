// SN Security AI Chatbot - Floating Widget with Drag Support
class SNSecurityChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.systemPrompt =
      "You are an AI security assistant for SN Security, a cybersecurity learning platform. You provide expert guidance on cybersecurity, OSINT, ethical hacking, digital safety, and related security topics. Keep responses concise, technical, and helpful. Format code examples with proper markdown.";
    
    // Mobile detection
    this.isMobile = this.detectMobile();
    
    // Drag state for button
    this.buttonDragging = false;
    this.buttonStartX = 0;
    this.buttonStartY = 0;
    this.buttonOffsetX = 0;
    this.buttonOffsetY = 0;
    
    // Drag state for window
    this.windowDragging = false;
    this.windowStartX = 0;
    this.windowStartY = 0;
    this.windowOffsetX = 0;
    this.windowOffsetY = 0;
    
    // Mobile keyboard state
    this.keyboardVisible = false;
    this.initialViewportHeight = window.innerHeight;
    
    this.init();
  }

  detectMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
    const isSmallScreen = window.innerWidth <= 480;
    return isMobileDevice || isSmallScreen;
  }

  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
    this.setupDragListeners();
    this.setupMobileKeyboardDetection();
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
    
    // Add mobile class on mobile devices
    if (this.isMobile) {
      window.classList.add("mobile");
      document.body.classList.add("sn-chatbot-active");
      document.body.style.overflow = "hidden";
    }
    
    window.classList.add("open");
    button.classList.add("active");
    
    // Delay focus to allow keyboard animation
    setTimeout(() => {
      const input = document.getElementById("sn-chatbot-input");
      input.focus();
    }, 100);

    // Greet on first open
    if (this.messages.length === 0) {
      this.addBotMessage(
        "🔐 Welcome to SN Security AI Assistant! I can help you with cybersecurity, OSINT techniques, ethical hacking guidance, and digital safety. What's your question?"
      );
    }
    
    // Auto-scroll after animations complete
    setTimeout(() => {
      this.scrollToBottom();
    }, 150);
  }

  closeChat() {
    this.isOpen = false;
    const window = document.getElementById("sn-chatbot-window");
    const button = document.getElementById("sn-chatbot-toggle");
    
    if (this.isMobile) {
      window.classList.remove("mobile");
      document.body.classList.remove("sn-chatbot-active");
      document.body.style.overflow = "";
    }
    
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

  setupDragListeners() {
    // Don't setup dragging on mobile (full-screen mode)
    if (this.isMobile) return;

    const button = document.getElementById("sn-chatbot-toggle");
    const header = document.querySelector(".sn-chatbot-header");

    // Button drag - Mouse events
    button.addEventListener("mousedown", (e) => this.startDragButton(e));
    
    // Button drag - Touch events
    button.addEventListener("touchstart", (e) => this.startDragButton(e));

    // Window drag by header - Mouse events
    header.addEventListener("mousedown", (e) => {
      if (e.target === button || button.contains(e.target)) return;
      this.startDragWindow(e);
    });

    // Window drag by header - Touch events
    header.addEventListener("touchstart", (e) => {
      if (e.target === button || button.contains(e.target)) return;
      this.startDragWindow(e);
    });

    // Global drag movement
    document.addEventListener("mousemove", (e) => this.dragMove(e));
    document.addEventListener("touchmove", (e) => this.dragMove(e), { passive: false });

    // Global drag end
    document.addEventListener("mouseup", () => this.endDrag());
    document.addEventListener("touchend", () => this.endDrag());
  }

  startDragButton(e) {
    const button = document.getElementById("sn-chatbot-toggle");
    const rect = button.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    this.buttonDragging = true;
    this.buttonStartX = clientX;
    this.buttonStartY = clientY;
    
    const computedStyle = window.getComputedStyle(button);
    const transform = computedStyle.transform;
    if (transform && transform !== "none") {
      const matrix = transform.match(/^matrix\((.+)\)$/);
      if (matrix) {
        const values = matrix[1].split(", ");
        this.buttonOffsetX = parseFloat(values[4]) || 0;
        this.buttonOffsetY = parseFloat(values[5]) || 0;
      }
    } else {
      this.buttonOffsetX = 0;
      this.buttonOffsetY = 0;
    }

    button.style.cursor = "grabbing";
    if (e.touches) e.preventDefault();
  }

  startDragWindow(e) {
    const window = document.getElementById("sn-chatbot-window");
    if (!window.classList.contains("open")) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    this.windowDragging = true;
    this.windowStartX = clientX;
    this.windowStartY = clientY;

    const computedStyle = window.getComputedStyle(window);
    const transform = computedStyle.transform;
    if (transform && transform !== "none") {
      const matrix = transform.match(/^matrix\((.+)\)$/);
      if (matrix) {
        const values = matrix[1].split(", ");
        this.windowOffsetX = parseFloat(values[4]) || 0;
        this.windowOffsetY = parseFloat(values[5]) || 0;
      }
    } else {
      this.windowOffsetX = 0;
      this.windowOffsetY = 0;
    }

    window.style.cursor = "grabbing";
    if (e.touches) e.preventDefault();
  }

  dragMove(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Drag button
    if (this.buttonDragging) {
      const button = document.getElementById("sn-chatbot-toggle");
      const deltaX = clientX - this.buttonStartX;
      const deltaY = clientY - this.buttonStartY;

      const newX = this.buttonOffsetX + deltaX;
      const newY = this.buttonOffsetY + deltaY;

      button.style.transform = `translate(${newX}px, ${newY}px)`;
    }

    // Drag window
    if (this.windowDragging) {
      const window = document.getElementById("sn-chatbot-window");
      const deltaX = clientX - this.windowStartX;
      const deltaY = clientY - this.windowStartY;

      const newX = this.windowOffsetX + deltaX;
      const newY = this.windowOffsetY + deltaY;

      window.style.transform = `translate(${newX}px, ${newY}px)`;
    }

    if (e.touches && (this.buttonDragging || this.windowDragging)) {
      e.preventDefault();
    }
  }

  endDrag() {
    const button = document.getElementById("sn-chatbot-toggle");
    const window = document.getElementById("sn-chatbot-window");

    if (this.buttonDragging) {
      button.style.cursor = "pointer";
    }
    if (this.windowDragging) {
      window.style.cursor = "default";
    }

    this.buttonDragging = false;
    this.windowDragging = false;
  }

  setupMobileKeyboardDetection() {
    if (!this.isMobile) return;

    const input = document.getElementById("sn-chatbot-input");
    const window = document.getElementById("sn-chatbot-window");

    input.addEventListener("focus", () => {
      // Ensure window stays on screen
      setTimeout(() => {
        window.scrollIntoView({ behavior: "smooth", block: "start" });
        this.scrollToBottom();
      }, 300);
    });

    // Viewport resize detection for keyboard
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const currentHeight = window.innerHeight;
        const heightDifference = this.initialViewportHeight - currentHeight;

        if (heightDifference > 100 && !this.keyboardVisible) {
          this.keyboardVisible = true;
          this.handleKeyboardOpened();
        } else if (heightDifference <= 100 && this.keyboardVisible) {
          this.keyboardVisible = false;
          this.handleKeyboardClosed();
        }
      }, 100);
    });

    // Use visualViewport for more reliable keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        if (this.isOpen && input === document.activeElement) {
          this.scrollToBottom();
        }
      });
    }
  }

  handleKeyboardOpened() {
    if (!this.isMobile) return;

    const window = document.getElementById("sn-chatbot-window");
    const input = document.getElementById("sn-chatbot-input");

    // Scroll to input field
    setTimeout(() => {
      input.scrollIntoView({ behavior: "smooth", block: "nearest" });
      this.scrollToBottom();
    }, 100);
  }

  handleKeyboardClosed() {
    if (!this.isMobile) return;

    const window = document.getElementById("sn-chatbot-window");

    // Ensure messages are visible
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
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
