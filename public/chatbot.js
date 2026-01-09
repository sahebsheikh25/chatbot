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
        SN Chat
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
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
    }
    
    window.classList.add("open");
    button.classList.add("active");
    
    // Run boot sequence only once
    if (!this.booted) {
      this.runBootSequence();
      this.booted = true;
    }
    
    // Delay focus to allow animation and mobile keyboards to work properly
    setTimeout(() => {
      const input = document.getElementById("sn-chatbot-input");
      if (this.isMobile) {
        // On mobile, give extra time for layout to settle
        input.focus({ preventScroll: false });
      } else {
        input.focus();
      }
    }, 350);

    // Auto-scroll after animations complete
    setTimeout(() => {
      this.scrollToBottom();
    }, 400);
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

    const messageLine = document.createElement("div");
    messageLine.className = "sn-message-line";

    const prefix = document.createElement("span");
    prefix.className = "sn-message-prefix";
    prefix.textContent = "snsecurity@terminal:~$ ";

    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";
    bubble.style.padding = "0";

    messageLine.appendChild(prefix);
    messageLine.appendChild(bubble);
    lineDiv.appendChild(messageLine);
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

    const messageLine = document.createElement("div");
    messageLine.className = "sn-message-line";

    const prefix = document.createElement("span");
    prefix.className = "sn-message-prefix";
    prefix.textContent = "snsecurity@terminal:~$ ";

    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";
    bubble.textContent = text;

    messageLine.appendChild(prefix);
    messageLine.appendChild(bubble);
    lineDiv.appendChild(messageLine);
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
    let messageLine = null;
    let prefixElement = null;
    let bubbleElement = null;

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

          messageLine = document.createElement("div");
          messageLine.className = "sn-message-line";

          prefixElement = document.createElement("span");
          prefixElement.className = "sn-message-prefix";
          prefixElement.textContent = "snsecurity@terminal:~$ ";

          bubbleElement = document.createElement("div");
          bubbleElement.className = "sn-message-bubble";
          bubbleElement.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";
          bubbleElement.textContent = botMessage;

          messageLine.appendChild(prefixElement);
          messageLine.appendChild(bubbleElement);
          messageElement.appendChild(messageLine);
          const messagesDiv = document.getElementById("sn-chatbot-messages");
          messagesDiv.appendChild(messageElement);
        } else {
          bubbleElement.textContent = botMessage;
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

    const messageLine = document.createElement("div");
    messageLine.className = "sn-message-line";

    const prefix = document.createElement("span");
    prefix.className = "sn-message-prefix";
    prefix.textContent = "snsecurity@user:~$ ";

    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.textContent = text;
    bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";

    messageLine.appendChild(prefix);
    messageLine.appendChild(bubble);
    lineDiv.appendChild(messageLine);
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

    const messageLine = document.createElement("div");
    messageLine.className = "sn-message-line";

    const prefix = document.createElement("span");
    prefix.className = "sn-message-prefix";
    prefix.textContent = "snsecurity@terminal:~$ ";

    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.textContent = text;
    bubble.style.fontFamily = "'Courier New', 'Share Tech Mono', monospace";

    messageLine.appendChild(prefix);
    messageLine.appendChild(bubble);
    lineDiv.appendChild(messageLine);
    messagesDiv.appendChild(lineDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const messagesDiv = document.getElementById("sn-chatbot-messages");
    const div = document.createElement("div");
    div.className = "sn-message bot";
    div.id = "sn-typing-indicator";
    
    const messageLine = document.createElement("div");
    messageLine.className = "sn-message-line";

    const prefix = document.createElement("span");
    prefix.className = "sn-message-prefix";
    prefix.textContent = "snsecurity@terminal:~$ ";
    
    const bubble = document.createElement("div");
    bubble.className = "sn-message-bubble";
    bubble.innerHTML = `
      <div class="sn-typing-indicator">
        <div class="sn-typing-dot"></div>
        <div class="sn-typing-dot"></div>
        <div class="sn-typing-dot"></div>
      </div><span class="sn-terminal-cursor"></span>
    `;
    
    messageLine.appendChild(prefix);
    messageLine.appendChild(bubble);
    div.appendChild(messageLine);
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
    const chatWindow = document.getElementById("sn-chatbot-window");
    const messagesDiv = document.getElementById("sn-chatbot-messages");
    const inputArea = document.querySelector(".sn-chatbot-input-area");
    const header = document.querySelector(".sn-chatbot-header");

    let prevViewportHeight = window.visualViewport?.height || window.innerHeight;
    let keyboardOpen = false;

    const updateMessagesHeight = () => {
      if (!chatWindow.classList.contains("open")) return;
      
      try {
        const vv = window.visualViewport;
        const currentHeight = vv?.height || window.innerHeight;
        const headerH = header ? header.getBoundingClientRect().height : 60;
        const inputH = inputArea ? inputArea.getBoundingClientRect().height : 70;
        
        // Calculate available height accounting for safe areas
        const safeAreaTop = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') || '0'
        );
        const safeAreaBottom = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)') || '0'
        );
        
        const availableHeight = Math.max(0, currentHeight - headerH - inputH);
        
        // Apply height constraint (no max-height, let flex handle it)
        messagesDiv.style.flex = "1";
        messagesDiv.style.minHeight = "0";
        messagesDiv.style.maxHeight = "none";
        
        // Check if keyboard is visible by comparing viewport heights
        const viewportHeightDiff = prevViewportHeight - currentHeight;
        if (viewportHeightDiff > 50) {
          keyboardOpen = true;
        } else if (viewportHeightDiff < -50) {
          keyboardOpen = false;
        }
        
      } catch (err) {
        console.warn("Height update error:", err);
        messagesDiv.style.flex = "1";
        messagesDiv.style.minHeight = "0";
      }
    };

    // VisualViewport API - most reliable for keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        const currentHeight = window.visualViewport.height;
        prevViewportHeight = currentHeight;
        
        if (this.isOpen && chatWindow.classList.contains("mobile")) {
          updateMessagesHeight();
          // Auto-scroll to input when keyboard opens
          if (input === document.activeElement && keyboardOpen) {
            setTimeout(() => {
              input.scrollIntoView({ behavior: "smooth", block: "nearest" });
              this.scrollToBottom();
            }, 50);
          }
        }
      });

      // Handle viewport scroll events (keyboard transitions)
      window.visualViewport.addEventListener("scroll", () => {
        if (this.isOpen && chatWindow.classList.contains("mobile")) {
          updateMessagesHeight();
          if (input === document.activeElement) {
            this.scrollToBottom();
          }
        }
      });
    }

    // Input focus - keyboard opening
    input.addEventListener("focus", () => {
      if (chatWindow.classList.contains("mobile")) {
        document.documentElement.classList.add("sn-keyboard-open");
        document.body.classList.add("sn-keyboard-open");
        keyboardOpen = true;
      }
      setTimeout(() => {
        updateMessagesHeight();
        this.scrollToBottom();
        // Ensure input stays visible
        input.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    });

    // Input blur - keyboard closing
    input.addEventListener("blur", () => {
      keyboardOpen = false;
      document.documentElement.classList.remove("sn-keyboard-open");
      document.body.classList.remove("sn-keyboard-open");
      // Clear explicit sizing to use flexbox naturally
      messagesDiv.style.flex = "1";
      messagesDiv.style.minHeight = "0";
      messagesDiv.style.maxHeight = "none";
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });

    // Window resize event (fallback for older devices)
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (this.isOpen && chatWindow.classList.contains("mobile")) {
          updateMessagesHeight();
          if (input === document.activeElement) {
            this.scrollToBottom();
          }
        }
      }, 80);
    });

    // Initial sizing when chat opens
    const observer = new MutationObserver(() => {
      if (chatWindow.classList.contains("open") && chatWindow.classList.contains("mobile")) {
        setTimeout(() => {
          updateMessagesHeight();
          this.scrollToBottom();
        }, 50);
        observer.disconnect();
      }
    });
    observer.observe(chatWindow, { attributes: true, attributeFilter: ["class"] });
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

// 🔥 VisualViewport fix - Main WhatsApp-style keyboard handling
(function(){
  const win = document.querySelector(".sn-chatbot-window");
  const inputBar = document.querySelector(".sn-chatbot-input-area");
  const input = document.querySelector(".sn-chatbot-input");

  if(!win || !inputBar) return;

  function applyViewportFix(){
    if(!window.visualViewport) return;

    const vv = window.visualViewport;

    // ✅ dynamic viewport height set
    document.documentElement.style.setProperty("--vvh", vv.height + "px");

    // ✅ keyboard height detection
    const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);

    // ✅ lift input UP (negative translate)
    document.documentElement.style.setProperty("--kbd", keyboardHeight ? `-${keyboardHeight}px` : "0px");
  }

  // ✅ Prevent browser auto scroll jump on focus
  function preventFocusJump(){
    setTimeout(() => {
      window.scrollTo(0, 0);
      applyViewportFix();
      // message area ko bottom pe le jao
      const msg = document.querySelector(".sn-chatbot-messages");
      if(msg) msg.scrollTop = msg.scrollHeight;
    }, 50);
  }

  if(window.visualViewport){
    window.visualViewport.addEventListener("resize", applyViewportFix);
    window.visualViewport.addEventListener("scroll", applyViewportFix);
  }

  window.addEventListener("orientationchange", () => {
    setTimeout(applyViewportFix, 200);
  });

  input?.addEventListener("focus", preventFocusJump);
  input?.addEventListener("click", preventFocusJump);

  applyViewportFix();
})();

/* ✅ DRAG FUNCTIONALITY FOR CHAT BUTTON */
(function () {
  const btn = document.querySelector(".sn-chatbot-button");
  const container = document.querySelector(".sn-chatbot-container");

  if (!btn || !container) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let initialLeft = 0, initialTop = 0;

  function ensurePosition() {
    const rect = container.getBoundingClientRect();
    container.style.left = rect.left + "px";
    container.style.top = rect.top + "px";
    container.style.right = "auto";
    container.style.bottom = "auto";
    container.style.position = "fixed";
  }

  ensurePosition();

  function onStart(clientX, clientY) {
    isDragging = true;
    ensurePosition();
    const rect = container.getBoundingClientRect();
    startX = clientX;
    startY = clientY;
    initialLeft = rect.left;
    initialTop = rect.top;
    document.body.classList.add("sn-dragging");
  }

  function onMove(clientX, clientY) {
    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;
    const maxLeft = window.innerWidth - container.offsetWidth;
    const maxTop = window.innerHeight - container.offsetHeight;
    newLeft = Math.max(8, Math.min(maxLeft - 8, newLeft));
    newTop = Math.max(8, Math.min(maxTop - 8, newTop));
    container.style.left = newLeft + "px";
    container.style.top = newTop + "px";
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove("sn-dragging");
  }

  btn.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
  }, { passive: false });

  window.addEventListener("touchend", onEnd);
  btn.addEventListener("mousedown", (e) => {
    onStart(e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    onMove(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", onEnd);
})();
