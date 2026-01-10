// Initialize AOS (Animate On Scroll) if available
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true, offset: 100 });
}

// Particle.js initialization only if library is present
if (typeof particlesJS === 'function') {
    try{
        particlesJS('particles-js', {
            particles: { number:{ value:80, density:{ enable:true, value_area:800 } }, color:{ value:'#00FFB2' }, shape:{ type:'circle', stroke:{ width:0, color:'#000000' } }, opacity:{ value:0.5, random:false, anim:{ enable:false } }, size:{ value:3, random:true, anim:{ enable:false } }, line_linked:{ enable:true, distance:150, color:'#00FFB2', opacity:0.4, width:1 }, move:{ enable:true, speed:2, direction:'none', random:false, straight:false, out_mode:'out', bounce:false } },
            interactivity: { detect_on:'canvas', events:{ onhover:{ enable:true, mode:'grab' }, onclick:{ enable:true, mode:'push' }, resize:true }, modes:{ grab:{ distance:140, line_linked:{ opacity:1 } }, push:{ particles_nb:4 } } },
            retina_detect: true
        });
    }catch(e){ /* silent */ }
}

// Typed.js Configuration
document.addEventListener('DOMContentLoaded', function() {
    const typedElement = document.getElementById('typed');
    if (typedElement) {
        new Typed('#typed', {
            strings: [
                'OSINT ^1000',
                'Penetration Testing Tools ^1000',
                'Ethical Hacking Learning ^1000',
                'Cybersecurity Research ^1000',
                'CTF Challenges ^1000'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            showCursor: true,
            cursorChar: '_'
        });
    }
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // update ARIA state for accessibility
        const expanded = navMenu.classList.contains('active');
        try { navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false'); } catch(e){}
        // Animate hamburger
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : '';
        // lock body scroll when menu open
        if (navMenu.classList.contains('active')) {
            document.body.classList.add('nav-open');
        } else {
            document.body.classList.remove('nav-open');
        }
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // allow default navigation to proceed; still close the mobile menu UI
            navMenu.classList.remove('active');
            try { navToggle.setAttribute('aria-expanded', 'false'); } catch(err){}
            const spans = navToggle.querySelectorAll('span');
            if (spans && spans.length >= 3) {
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
            // Do not call e.preventDefault() here so navigation is not blocked.
            // ensure any body lock is removed and menu UI reset in case navigation is prevented
            document.body.classList.remove('nav-open');
        });
    });
}

// Active Navigation Link
const currentLocation = location.pathname.split('/').pop() || 'index.html';
const menuItems = document.querySelectorAll('.nav-link');
menuItems.forEach(item => {
    if (item.getAttribute('href') === currentLocation) {
        item.classList.add('active');
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
});

// Form Validation and Success Popup (for contact page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name && email && subject && message) {
            // Show success popup
            showSuccessPopup();
            
            // Reset form
            contactForm.reset();
        }
    });
}

function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you soon.</p>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        popup.remove();
    }, 5000);
}

// Tool Filter Functionality (for tools and OSINT pages)
function filterTools(category, evt) {
    const tools = document.querySelectorAll('.tool-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    if (evt && evt.target) {
        evt.target.classList.add('active');
    } else {
        const btn = document.querySelector(`.filter-btn[data-cat="${category}"]`);
        if (btn) btn.classList.add('active');
    }
    
    // Filter tools
    tools.forEach(tool => {
        if (category === 'all' || tool.dataset.category === category) {
            tool.style.display = 'block';
            setTimeout(() => {
                tool.style.opacity = '1';
                tool.style.transform = 'scale(1)';
            }, 10);
        } else {
            tool.style.opacity = '0';
            tool.style.transform = 'scale(0.8)';
            setTimeout(() => {
                tool.style.display = 'none';
            }, 300);
        }
    });
}

// Search Functionality (for OSINT tools)
const searchInput = document.getElementById('toolSearch');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const tools = document.querySelectorAll('.tool-card');
        
        tools.forEach(tool => {
            const title = tool.querySelector('h3').textContent.toLowerCase();
            const description = tool.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                tool.style.display = 'block';
            } else {
                tool.style.display = 'none';
            }
        });
    });
}

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Console Easter Egg
console.log('%c🔒 SN Security', 'color: #00FFB2; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(0, 255, 178, 0.5);');
console.log('%cLearn Hacking. Secure Future.', 'color: #00E8FF; font-size: 14px;');
console.log('%cInterested in cybersecurity? Check out our resources!', 'color: #B0C4DE; font-size: 12px;');

// Auto-insert Download and YouTube (TR) buttons for tools page
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.tool-card');
    cards.forEach(card => {
        // remove any legacy duplicate HTML blocks if present
        card.querySelectorAll('.duplicate-buttons').forEach(el => el.remove());
        // skip if actions already injected (prevents duplicates)
        if (card.querySelector('.tool-actions')) return;
        // try to get tool slug from onclick attribute
        let slug = '';
        const onclick = card.getAttribute('onclick') || '';
        const match = onclick.match(/tool=([a-z0-9-]+)/i);
        if (match && match[1]) slug = match[1];
        if (!slug) {
            const titleEl = card.querySelector('h3');
            slug = titleEl ? titleEl.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'tool';
        }

        // create actions container
        const actions = document.createElement('div');
        actions.className = 'tool-actions';

        // download button (redirect to official download pages when available)
        const dl = document.createElement('a');
        dl.className = 'btn btn-download';
        // known mapping of tool slugs to official download pages
        const downloadMap = {
            'nmap': 'https://nmap.org/download.html',
            'metasploit': 'https://www.metasploit.com/download',
            'burpsuite': 'https://portswigger.net/burp',
            'wireshark': 'https://www.wireshark.org/download.html',
            'johntheripper': 'https://www.openwall.com/john/',
            'aircrack': 'https://www.aircrack-ng.org/',
            'sqlmap': 'https://sqlmap.org/',
            'nikto': 'https://cirt.net/Nikto2',
            'hydra': 'https://github.com/vanhauser-thc/thc-hydra',
            'zap': 'https://www.zaproxy.org/download/',
            'nessus': 'https://www.tenable.com/products/nessus/nessus-downloads',
            'hashcat': 'https://hashcat.net/hashcat/',
            'maltego': 'https://www.maltego.com/downloads/',
            'netcat': 'https://nmap.org/ncat/',
            'reconng': 'https://github.com/lanmaster53/recon-ng',
            'beef': 'https://github.com/beefproject/beef',
            'gobuster': 'https://github.com/OJ/gobuster',
            'responder': 'https://github.com/SpiderLabs/Responder',
            'mimikatz': 'https://github.com/gentilkiwi/mimikatz',
            'enum4linux': 'https://github.com/portcullis/enum4linux',
            'amass': 'https://github.com/OWASP/Amass',
            'ghidra': 'https://ghidra-sre.org/',
            'radare2': 'https://rada.re/n/',
            'frida': 'https://frida.re/',
            'trufflehog': 'https://github.com/trufflesecurity/trufflehog'
        };
        const downloadHref = downloadMap[slug] || `downloads/${slug}.zip`;
        dl.href = downloadHref;
        dl.target = '_blank';
        dl.rel = 'noopener noreferrer';
        dl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span>Download</span>';
        // prevent parent onclick from firing when clicking buttons
        dl.addEventListener('click', function(e){ e.stopPropagation(); });

        // youtube (TR) button (search results in Turkish tutorials)
        const yt = document.createElement('a');
        // make YouTube button use same pill shape as download button for consistent UI
        yt.className = 'btn btn-youtube';
        yt.target = '_blank';
        yt.rel = 'noopener noreferrer';
        const query = encodeURIComponent(slug + ' tutorial Türkçe');
        yt.href = `https://www.youtube.com/results?search_query=${query}`;
        yt.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 15l5.19-3L10 9v6z"/></svg><span>Watch Now</span>';
        yt.addEventListener('click', function(e){ e.stopPropagation(); });

        actions.appendChild(dl);
        actions.appendChild(yt);

        // insert actions before the Learn More link if present, else append
        const learnMore = card.querySelector('.tool-link');
        if (learnMore) card.insertBefore(actions, learnMore);
        else card.appendChild(actions);
    });
});

/* ===== Cursor glow: single-element, requestAnimationFrame-based follower =====
   - Creates one `.cursor-glow` element appended to body
   - Uses rAF to smoothly interpolate towards mouse position (lerp)
   - Fades out after `idleFadeMs` of no movement
   - Pointer-events are none so clicks/scroll are unaffected
   - Automatically disabled on touch / coarse-pointer devices
*/
(function(){
    if (typeof window === 'undefined') return;

    // Disable on touch / coarse pointer devices
    if (window.matchMedia && (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(any-pointer: coarse)').matches)) return;

    const idleFadeMs = 400; // fade out after this many ms of no movement
    const lerpFactor = 0.18; // smoothing factor (0..1)

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let visible = false;
    let lastMove = 0;
    let rafId = null;

    // Update target position on pointermove (mouse)
    function onMove(e){
        // Use clientX/clientY for cursor position
        targetX = e.clientX;
        targetY = e.clientY;
        lastMove = performance.now();
        if (!visible) {
            visible = true;
            glow.style.opacity = '1';
        }
    }

    // Hide when leaving viewport
    function onLeave(){
        visible = false;
        glow.style.opacity = '0';
    }

    // Show again on enter
    function onEnter(){
        // keep hidden until movement
    }

    // Stronger glow when hovering interactive elements
    const interactiveSelector = 'a, button, .btn, .card, .intro-card, .event-card, .platform-card, .learn-card, .tool-card';
    function onPointerOver(e){
        const el = e.target.closest && e.target.closest(interactiveSelector);
        if (el) glow.classList.add('cursor-glow--strong');
    }
    function onPointerOut(e){
        const el = e.target.closest && e.target.closest(interactiveSelector);
        if (el) glow.classList.remove('cursor-glow--strong');
    }

    // Throttled animation loop via rAF
    function animate(){
        // Lerp current towards target
        curX += (targetX - curX) * lerpFactor;
        curY += (targetY - curY) * lerpFactor;

        // Apply transform (translate from center)
        glow.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;

        // Fade out when idle
        const now = performance.now();
        if (now - lastMove > idleFadeMs) {
            glow.style.opacity = '0';
            visible = false;
        }

        rafId = requestAnimationFrame(animate);
    }

    // Start the loop
    rafId = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('pointerout', onPointerOut, { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });
    window.addEventListener('mouseenter', onEnter, { passive: true });
    window.addEventListener('blur', onLeave, { passive: true });

    // Clean up on unload
    window.addEventListener('beforeunload', function(){
        cancelAnimationFrame(rafId);
        try{ glow.remove(); }catch(e){}
    });
})();