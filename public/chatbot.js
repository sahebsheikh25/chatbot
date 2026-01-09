// SN Security AI Terminal - Hacker Interface with Boot Sequence
class SNSecurityChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.booted = false;
    this.isTyping = false;
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
      <button class="sn-chatbot-button" id="sn-chatbot-toggle" title="Open SN Security Terminal">
        > TERMINAL
      </button>
      
      <div class="sn-chatbot-window" id="sn-chatbot-window">
        <div class="sn-chatbot-header">
          <h3>root@snsecurity:~$</h3>
          <button class="sn-chatbot-close" id="sn-chatbot-close" title="Close terminal">✕</button>
        </div>
        <div class="sn-chatbot-messages" id="sn-chatbot-messages"></div>
        <div class="sn-chatbot-input-area">
          <span style="color: #00ff00; margin-right: 4px; white-space: nowrap; text-shadow: 0 0 4px rgba(0, 255, 0, 0.4);">snsecurity@user:~$</span>
          <input
            type="text"
            class="sn-chatbot-input"
            id="sn-chatbot-input"
            placeholder="type command..."
            autocomplete="off"
            style="flex: 1; background: #000000; border: 1px solid rgba(0, 255, 0, 0.4);"
          />
          <button class="sn-chatbot-send" id="sn-chatbot-send">SEND</button>
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
      document.documentElement.classList.add("sn-chatbot-active");
      document.body.classList.add("sn-chatbot-active");
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
    
    window.classList.add("open");
    button.classList.add("active");
    
    // Run boot sequence only once
    if (!this.booted) {
      this.runBootSequence();
      this.booted = true;
    }
    
    // Delay focus to allow animation
    setTimeout(() => {
      const input = document.getElementById("sn-chatbot-input");
      input.focus();
    }, 100);

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
      document.documentElement.classList.remove("sn-chatbot-active");
      document.body.classList.remove("sn-chatbot-active");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.classList.remove("sn-keyboard-open");
    }
    
    window.classList.remove("open");
    button.classList.remove("active");
  }

  async runBootSequence() {
    const bootLines = [
      "> snsecurity@root:~$ initializing secure channel...",
      "> loading encryption modules [████████] 100%",
      "> verifying identity...",
      "> access granted [OK]",
      "> secure terminal ready.",
      "",
    ];

    for (const line of bootLines) {
      if (line === "") {
        // Add empty line
        this.addSystemMessage("");
        await this.sleep(200);
      } else {
        // Type out the line character by character
        await this.typeOutLine(line);
        await this.sleep(400);
      }
    }
  }

  async typeOutLine(text) {
    const messagesDiv = document.getElementById("sn-chatbot-messages");
    const lineDiv = document.createElement("div");
    lineDiv.className = "sn-message bot";
    lineDiv.style.color = "#00ff00";
    lineDiv.style.textShadow = "0 0 4px rgba(0, 255, 0, 0.4)";

    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";
    bubble.style.padding = "0";

    lineDiv.appendChild(bubble);
    messagesDiv.appendChild(lineDiv);

    // Type out each character
    for (let i = 0; i < text.length; i++) {
      bubble.textContent = text.substring(0, i + 1);
      this.scrollToBottom();
      await this.sleep(20); // Delay between characters
    }
  }

  async addSystemMessage(text) {
    const messagesDiv = document.getElementById("sn-chatbot-messages");
    const lineDiv = document.createElement("div");
    lineDiv.className = "sn-message bot";
    lineDiv.style.color = "#00ff00";
    lineDiv.style.textShadow = "0 0 4px rgba(0, 255, 0, 0.4)";

    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";
    bubble.textContent = text;

    lineDiv.appendChild(bubble);
    messagesDiv.appendChild(lineDiv);
    this.scrollToBottom();
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendMessage() {
    const input = document.getElementById("sn-chatbot-input");
    const message = input.value.trim();

    if (!message || this.isTyping) return;

    // Add user command to terminal
    this.addUserCommand(message);
    input.value = "";
    input.focus();

    // Show system processing
    this.isTyping = true;
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
      console.error("Terminal error:", error);
      this.addSystemOutput(
        "error: unable to connect to AI service. please try again."
      );
    } finally {
      this.isTyping = false;
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
          messageElement = document.createElement("div");
          messageElement.className = "sn-message bot";
          messageElement.style.color = "#00ff00";
          messageElement.style.textShadow = "0 0 4px rgba(0, 255, 0, 0.4)";

          const bubble = document.createElement("div");
          bubble.className = "sn-message-bubble";
          bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";
          bubble.textContent = botMessage;

          messageElement.appendChild(bubble);
          const messagesDiv = document.getElementById("sn-chatbot-messages");
          messagesDiv.appendChild(messageElement);
        } else {
          messageElement.querySelector(".sn-message-bubble").textContent = botMessage;
        }

        // Auto-scroll to bottom
        this.scrollToBottom();
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
      this.addSystemOutput(
        "error: connection lost while receiving response. please try again."
      );
    }
  }

  addUserCommand(text) {
    this.messages.push({
      role: "user",
      content: text,
    });
    const messagesDiv = document.getElementById("sn-chatbot-messages");
    const lineDiv = document.createElement("div");
    lineDiv.className = "sn-message user";
    lineDiv.style.color = "#00ff00";
    lineDiv.style.textShadow = "0 0 4px rgba(0, 255, 0, 0.4)";

    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.textContent = text;
    bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";

    lineDiv.appendChild(bubble);
    messagesDiv.appendChild(lineDiv);
    this.scrollToBottom();
  }

  addSystemOutput(text) {
    this.messages.push({
      role: "assistant",
      content: text,
    });
    const messagesDiv = document.getElementById("sn-chatbot-messages");
    const lineDiv = document.createElement("div");
    lineDiv.className = "sn-message bot";
    lineDiv.style.color = "#00ff00";
    lineDiv.style.textShadow = "0 0 4px rgba(0, 255, 0, 0.4)";

    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.textContent = text;
    bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";

    lineDiv.appendChild(bubble);
    messagesDiv.appendChild(lineDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const messagesDiv = document.getElementById("sn-chatbot-messages");
    const div = document.createElement("div");
    div.className = "sn-message bot";
    div.id = "sn-typing-indicator";
    div.style.color = "#00ff00";
    div.style.textShadow = "0 0 4px rgba(0, 255, 0, 0.4)";
    
    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.innerHTML = `
      <div class="sn-typing-indicator">
        <div class="sn-typing-dot"></div>
        <div class="sn-typing-dot"></div>
        <div class="sn-typing-dot"></div>
      </div>
    `;
    div.appendChild(bubble);
    messagesDiv.appendChild(div);
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
    const messagesDiv = document.getElementById("sn-chatbot-messages");

    // Prevent layout shift by locking position during keyboard interaction
    input.addEventListener("focus", () => {
      if (window.classList.contains("mobile")) {
        document.documentElement.classList.add("sn-keyboard-open");
      }
      
      setTimeout(() => {
        input.scrollIntoView({ behavior: "smooth", block: "nearest" });
        this.scrollToBottom();
      }, 300);
    });

    input.addEventListener("blur", () => {
      document.documentElement.classList.remove("sn-keyboard-open");
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });

    // Viewport resize detection for keyboard
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (this.isOpen && input === document.activeElement) {
          this.scrollToBottom();
        }
      }, 100);
    });

    // Use visualViewport for more reliable keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        if (this.isOpen && input === document.activeElement) {
          // Don't scroll during active typing - let browser handle it
          this.scrollToBottom();
        }
      });
    }
  }

  handleKeyboardOpened() {
    if (!this.isMobile) return;

    const input = document.getElementById("sn-chatbot-input");

    // Ensure input field is visible and focused
    setTimeout(() => {
      input.scrollIntoView({ behavior: "smooth", block: "nearest" });
      this.scrollToBottom();
    }, 100);
  }

  handleKeyboardClosed() {
    if (!this.isMobile) return;

    // Ensure messages are visible when keyboard closes
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
