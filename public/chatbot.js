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
  let messages = JSON.parse(sessionStorage.getItem('sn_chat_messages')||'[]');
  const MAX_HISTORY = 12;

  function setStatus(text, cls){
    const el = document.getElementById('sn-chat-status');
    if(!el) return;
    el.textContent = text;
    el.className = 'sn-chat-status ' + (cls || '');
  }

  function revealText(el, text){
    // simple typewriter reveal
    el.textContent = '';
    let i = 0;
    function step(){
      i += 1;
      el.textContent = text.slice(0, i);
      if(i < text.length) requestAnimationFrame(step);
      else el.classList.add('show');
    }
    requestAnimationFrame(step);
  }

  function renderMessages(){
    messagesEl.innerHTML = '';
    messages.forEach((m, idx)=>{
      const d = document.createElement('div');
      d.className = 'sn-msg ' + (m.role === 'system' ? 'system' : (m.role === 'user' ? 'user' : 'bot'));

      if(m.role === 'bot'){
        const pfx = document.createElement('span'); pfx.className = 'terminal-prefix'; pfx.textContent = '>';
        const text = document.createElement('span'); text.className = 'terminal-text';
        // if last message, animate reveal slightly
        if(idx === messages.length - 1){
          d.classList.add('revealing');
          // append prefix and placeholder, then reveal
          d.appendChild(pfx);
          d.appendChild(text);
          messagesEl.appendChild(d);
          // small delay to allow layout
          setTimeout(()=>{ revealText(text, String(m.content)); d.classList.remove('revealing'); }, 40);
          return;
        } else {
          text.textContent = m.content;
          d.appendChild(pfx);
          d.appendChild(text);
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
    sessionStorage.setItem('sn_chat_messages', JSON.stringify(messages));
    renderMessages();
  }

  function pushSystem(text){ pushMessage('system', text); }

  function setTyping(on){ typingEl.classList.toggle('hidden', !on); scrollToBottom(); }

  function scrollToBottom(){ requestAnimationFrame(()=>{ messagesEl.scrollTop = messagesEl.scrollHeight; }); }

  // open/close logic with mobile-safe body scroll disabling
  let isOpen = false;
  function openChat(){ panel.classList.add('open'); panel.classList.remove('closed'); panel.setAttribute('aria-hidden','false');
    if(window.matchMedia('(max-width:700px)').matches) document.body.style.overflow = 'hidden';
    setTimeout(()=> input.focus(), 180); isOpen = true; }
  function closeChat(){ panel.classList.remove('open'); panel.classList.add('closed'); panel.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; isOpen = false; }
  function minimize(){ panel.classList.remove('open'); panel.classList.add('closed'); panel.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

  // submit
  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const text = input.value.trim(); if(!text) return; input.value = '';
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
        const reply = j && (j.reply || j.output) ? (j.reply || j.output) : 'System: No reply from AI.';
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

  // pointer drag for button (mouse + touch)
  let dragging=false, startX=0, startY=0, btnEl = button;
  const computed = window.getComputedStyle(btnEl); btnEl.style.right = (parseFloat(computed.right)||18)+'px'; btnEl.style.bottom = (parseFloat(computed.bottom)||22)+'px';

  function onPointerDown(e){ startX = e.clientX; startY = e.clientY; dragging = false; btnEl.setPointerCapture && btnEl.setPointerCapture(e.pointerId); window.addEventListener('pointermove', onPointerMove, {passive:false}); window.addEventListener('pointerup', onPointerUp); }
  function onPointerMove(e){ const dx=Math.abs(e.clientX-startX), dy=Math.abs(e.clientY-startY); if(!dragging && (dx>6||dy>6)) dragging=true; if(dragging){ e.preventDefault(); const vw=window.innerWidth, vh=window.innerHeight; let nr = vw - e.clientX - (btnEl.offsetWidth/2); let nb = vh - e.clientY - (btnEl.offsetHeight/2); const margin=8; nr = Math.max(margin, Math.min(vw - btnEl.offsetWidth - margin, nr)); nb = Math.max(margin, Math.min(vh - btnEl.offsetHeight - margin, nb)); btnEl.style.right = nr+'px'; btnEl.style.bottom = nb+'px'; wasDragging = true; } }
  function onPointerUp(e){ window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerup', onPointerUp); if(dragging){ const vw=window.innerWidth; const bx = btnEl.getBoundingClientRect().left + btnEl.offsetWidth/2; const snapRight = (bx > vw/2); const margin=12; if(snapRight) btnEl.style.right = margin+'px'; else btnEl.style.right = (vw - btnEl.offsetWidth - margin)+'px'; setTimeout(()=>{ wasDragging = false; }, 220); } dragging=false; try{ btnEl.releasePointerCapture && btnEl.releasePointerCapture(e.pointerId); }catch(e){} }
  btnEl.addEventListener('pointerdown', onPointerDown, {passive:true});

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
  // fallback
  window.addEventListener('resize', onViewportChange, {passive:true});

  // when input focuses, some browsers change visualViewport after slight delay
  input && input.addEventListener('focus', ()=>{ setTimeout(onViewportChange, 50); });
  input && input.addEventListener('blur', ()=>{ setTimeout(onViewportChange, 50); });

  // auto-scroll on new messages
  const mo = new MutationObserver(scrollToBottom); mo.observe(messagesEl, { childList:true, subtree:true });

  // initial state
  panel.classList.add('closed');
  setStatus('[connected]', 'connected');
})();
