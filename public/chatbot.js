// SN Security Chatbot - hacker/cyberpunk UI behaviour
(function(){
  const button = document.getElementById('sn-chat-button');
  const panel = document.getElementById('sn-chat-panel');
  const closeBtn = document.getElementById('sn-chat-close');
  const minBtn = document.getElementById('sn-chat-minimize');
  const form = document.getElementById('sn-chat-form');
  const input = document.getElementById('sn-chat-input');
  const messagesEl = document.getElementById('sn-chat-messages');
  const typingEl = document.getElementById('sn-chat-typing');

  if(!button || !panel) return;

  // session memory only
  let messages = [];
  try{ messages = JSON.parse(sessionStorage.getItem('sn_chat_messages')||'[]'); }catch(e){ messages = []; }
  const MAX_HISTORY = 12;

  function setStatus(text, cls){
    const el = document.getElementById('sn-chat-status');
    if(!el) return;
    el.textContent = text;
    el.className = 'sn-chat-status ' + (cls || '');
  }

  function scrollToBottom(){
    requestAnimationFrame(()=>{ if(messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight; });
  }

  function revealText(el, text, speed=18){
    return new Promise((resolve)=>{
      if(!el) return resolve();
      el.textContent = '';
      const cursor = document.createElement('span'); cursor.className = 'typing-cursor'; cursor.textContent = '_';
      el.appendChild(cursor);
      let i = 0;
      const step = ()=>{
        if(i < text.length){
          cursor.insertAdjacentText('beforebegin', text.charAt(i));
          i++;
          scrollToBottom();
          setTimeout(step, speed + Math.random()*10);
        } else {
          // blink cursor a few times then remove
          let blinks = 0;
          const blinkI = setInterval(()=>{
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            blinks++;
            if(blinks > 4){ clearInterval(blinkI); cursor.remove(); resolve(); }
          }, 120);
        }
      };
      step();
    });
  }

  function renderMessages(){
    if(!messagesEl) return;
    messagesEl.innerHTML = '';
    messages.forEach((m, idx)=>{
      const d = document.createElement('div');
      d.className = 'sn-msg ' + (m.role === 'system' ? 'system' : (m.role === 'user' ? 'user' : 'bot'));

      if(m.role === 'bot'){
        const pfx = document.createElement('span'); pfx.className = 'terminal-prefix'; pfx.textContent = (m.prefix || '>');
        const text = document.createElement('span'); text.className = 'terminal-text';
        if(idx === messages.length - 1){
          d.classList.add('revealing');
          d.appendChild(pfx); d.appendChild(text);
          messagesEl.appendChild(d);
          // reveal asynchronously
          setTimeout(()=>{ revealText(text, String(m.content), 18).then(()=>{ d.classList.remove('revealing'); }); }, 40);
          return;
        } else {
          text.textContent = m.content;
          d.appendChild(pfx); d.appendChild(text);
        }
      } else if(m.role === 'user'){
        d.textContent = m.content;
      } else { // system
        const label = document.createElement('span'); label.className = 'sys-label'; label.textContent = '[SYSTEM ALERT]';
        const t = document.createElement('span'); t.textContent = ' ' + m.content;
        d.appendChild(label); d.appendChild(t);
      }

      messagesEl.appendChild(d);
    });
    scrollToBottom();
  }

  renderMessages();

  function pushMessage(role, text){
    messages.push({role, content: String(text)});
    if(messages.length>MAX_HISTORY) messages = messages.slice(-MAX_HISTORY);
    try{ sessionStorage.setItem('sn_chat_messages', JSON.stringify(messages)); }catch(e){}
    renderMessages();
  }

  function pushSystem(text){ pushMessage('system', text); }

  function setTyping(on){ if(typingEl) typingEl.classList.toggle('hidden', !on); scrollToBottom(); }

  // open/close logic with mobile-safe body scroll disabling
  let isOpen = false;
  function openChat(){ panel.classList.add('open'); panel.classList.remove('closed'); panel.setAttribute('aria-hidden','false');
    if(window.matchMedia('(max-width:700px)').matches) document.body.style.overflow = 'hidden';
    setTimeout(()=>{ input && input.focus(); runWelcomeSequence(); }, 180); isOpen = true; }
  function closeChat(){ panel.classList.remove('open'); panel.classList.add('closed'); panel.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; isOpen = false; }
  function minimize(){ panel.classList.remove('open'); panel.classList.add('closed'); panel.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

  // submit
  form && form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const text = (input && input.value || '').trim(); if(!text) return; if(input) input.value = '';
    pushMessage('user', text);
    setTyping(true);
    setStatus('[connecting]', 'connecting');
    try{
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages }) });
      if(!res.ok){
        const j = await res.json().catch(()=>null);
        const friendly = j && j.error ? j.error : 'System: Assistant unavailable. Try again later.';
        pushSystem(friendly);
        setStatus('[retrying]', 'retrying');
      } else {
        const j = await res.json().catch(()=>null);
        const reply = j && (j.reply || j.output || j.message) ? (j.reply || j.output || j.message) : 'System: No reply from AI.';
        pushMessage('bot', reply);
        setStatus('[connected]', 'connected');
      }
    }catch(e){
      pushSystem('Network: could not reach AI backend.');
      setStatus('[offline]', 'offline');
    }finally{ setTyping(false); }
  });

  // open/close handlers
  let wasDragging = false;
  button.addEventListener('click', ()=>{ if(!wasDragging) { if(!isOpen) openChat(); else closeChat(); } });
  closeBtn && closeBtn.addEventListener('click', ()=>{ if(isOpen) closeChat(); });
  minBtn && minBtn.addEventListener('click', ()=>{ minimize(); });

  // pointer drag for floating button (mouse + touch)
  (function enableButtonDrag(){
    const btnEl = button;
    if(!btnEl) return;
    let dragging=false, startX=0, startY=0;
    const computed = window.getComputedStyle(btnEl);
    try{ btnEl.style.right = (parseFloat(computed.right)||18)+'px'; btnEl.style.bottom = (parseFloat(computed.bottom)||22)+'px'; }catch(e){}

    function onPointerDown(e){ startX = e.clientX; startY = e.clientY; dragging = false; btnEl.setPointerCapture && btnEl.setPointerCapture(e.pointerId); window.addEventListener('pointermove', onPointerMove, {passive:false}); window.addEventListener('pointerup', onPointerUp); }
    function onPointerMove(e){ const dx=Math.abs(e.clientX-startX), dy=Math.abs(e.clientY-startY); if(!dragging && (dx>6||dy>6)) dragging=true; if(dragging){ e.preventDefault(); const vw=window.innerWidth, vh=window.innerHeight; let nr = vw - e.clientX - (btnEl.offsetWidth/2); let nb = vh - e.clientY - (btnEl.offsetHeight/2); const margin=8; nr = Math.max(margin, Math.min(vw - btnEl.offsetWidth - margin, nr)); nb = Math.max(margin, Math.min(vh - btnEl.offsetHeight - margin, nb)); btnEl.style.right = nr+'px'; btnEl.style.bottom = nb+'px'; wasDragging = true; } }
    function onPointerUp(e){ window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerup', onPointerUp); if(dragging){ const vw=window.innerWidth; const bx = btnEl.getBoundingClientRect().left + btnEl.offsetWidth/2; const snapRight = (bx > vw/2); const margin=12; if(snapRight) btnEl.style.right = margin+'px'; else btnEl.style.right = (vw - btnEl.offsetWidth - margin)+'px'; setTimeout(()=>{ wasDragging = false; }, 220); } dragging=false; try{ btnEl.releasePointerCapture && btnEl.releasePointerCapture(e.pointerId); }catch(e){} }
    btnEl.addEventListener('pointerdown', onPointerDown, {passive:true});
  })();

  // Desktop-only: make the chat panel draggable by its header
  (function enableHeaderDrag(){
    if(!panel) return;
    const header = panel.querySelector('.sn-chat-header');
    if(!header) return;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const isSmallScreen = window.matchMedia('(max-width:700px)').matches;
    if(isTouch || isSmallScreen) return; // disable on touch/mobile

    let isDraggingHeader = false;
    let startX = 0, startY = 0;
    let panelLeft = 0, panelTop = 0;
    let suppressClick = false;

    function onMouseDown(e){
      if(e.button !== 0) return; // left button only
      e.preventDefault();
      const rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      panel.style.transform = 'none';
      panel.style.transition = 'none';

      startX = e.clientX; startY = e.clientY;
      panelLeft = rect.left; panelTop = rect.top;

      document.addEventListener('mousemove', onMouseMove, {passive:false});
      document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e){
      const dx = e.clientX - startX; const dy = e.clientY - startY;
      if(!isDraggingHeader){
        if(Math.hypot(dx, dy) < 6) return;
        isDraggingHeader = true;
        document.body.style.userSelect = 'none';
      }
      e.preventDefault();
      const vw = window.innerWidth; const vh = window.innerHeight; const margin = 8;
      const width = panel.offsetWidth; const height = panel.offsetHeight;
      let nl = panelLeft + dx; let nt = panelTop + dy;
      nl = Math.max(margin, Math.min(vw - width - margin, nl));
      nt = Math.max(margin, Math.min(vh - height - margin, nt));
      panel.style.left = nl + 'px';
      panel.style.top = nt + 'px';
    }

    function onMouseUp(){
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
      panel.style.transition = '';
      if(isDraggingHeader){
        suppressClick = true;
        setTimeout(()=>{ suppressClick = false; }, 200);
      }
      isDraggingHeader = false;
    }

    header.addEventListener('click', function(ev){ if(suppressClick){ ev.stopImmediatePropagation(); ev.preventDefault(); } }, true);
    header.addEventListener('mousedown', onMouseDown);
    window.addEventListener('resize', ()=>{ if(window.matchMedia('(max-width:700px)').matches){ header.removeEventListener('mousedown', onMouseDown); } });
  })();

  // VisualViewport to avoid jump on mobile keyboard and maintain --app-height
  function updateAppHeight(){
    try{
      const vv = window.visualViewport;
      const h = (vv && vv.height) ? vv.height : window.innerHeight;
      document.documentElement.style.setProperty('--app-height', h + 'px');
    }catch(e){ /* ignore */ }
  }

  // keep chat scrolled to bottom when viewport changes
  function onViewportChange(){ updateAppHeight(); scrollToBottom(); }

  // initialize
  updateAppHeight();
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', onViewportChange, {passive:true});
    window.visualViewport.addEventListener('scroll', onViewportChange, {passive:true});
  }
  window.addEventListener('resize', onViewportChange, {passive:true});

  // when input focuses, some browsers change visualViewport after slight delay
  input && input.addEventListener('focus', ()=>{ setTimeout(onViewportChange, 50); });
  input && input.addEventListener('blur', ()=>{ setTimeout(onViewportChange, 50); });

  // auto-scroll on new messages
  try{ if(messagesEl){ const mo = new MutationObserver(scrollToBottom); mo.observe(messagesEl, { childList:true, subtree:true }); } }catch(e){}

  // initial state
  panel.classList.add('closed');
  setStatus('[connected]', 'connected');

  // Hacker-style boot/welcome sequence (session-only)
  async function runWelcomeSequence(){
    try{
      if(sessionStorage.getItem('sn_welcome_shown')) return;
      const lines = [];
      const hour = new Date().getHours();
      let greeting = 'Good evening';
      if(hour >= 5 && hour < 12) greeting = 'Good morning';
      else if(hour >= 12 && hour < 17) greeting = 'Good afternoon';
      else if(hour >= 17 && hour < 21) greeting = 'Good evening';
      else greeting = 'Good night';

      lines.push('snsecurity@terminal:~$ initializing secure channel...');
      lines.push('snsecurity@terminal:~$ access granted \u2714');
      lines.push(`snsecurity@terminal:~$ ${greeting}, operative.`);
      lines.push('snsecurity@terminal:~$ secure channel established.');

      for(const ln of lines){
        if(!messagesEl) break;
        const d = document.createElement('div'); d.className = 'sn-msg bot revealing';
        const pfx = document.createElement('span'); pfx.className = 'terminal-prefix'; pfx.textContent = '>';
        const text = document.createElement('span'); text.className = 'terminal-text';
        d.appendChild(pfx); d.appendChild(text);
        messagesEl.appendChild(d);
        scrollToBottom();
        await revealText(text, ln, 16);
        d.classList.remove('revealing');
        await new Promise(r=>setTimeout(r, 220 + Math.random()*240));
      }
      sessionStorage.setItem('sn_welcome_shown', '1');
    }catch(e){ console.error('welcome seq error', e); }
  }

})();
