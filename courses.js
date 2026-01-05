/* Courses data + UI interactions (mirrors store.js behavior) */
const products = [
    {id:1,name:'AI Agent Practical Course',price: FREE,category:'beginner',desc:'Foundations of web application security with hands-on labs.',img:'assets/store/course-web-hacking.svg', amazonUrl:'https://example.com/courses/intro-web'},
    {id:2,name:'Pentesting Lab',price:99.00,category:'intermediate',desc:'Practical network pentesting with lab exercises and exploits.',img:'assets/store/course-network-lab.svg', amazonUrl:'https://example.com/courses/network-lab'},
    {id:3,name:'Payloads & Exploitation',price:79.00,category:'intermediate',desc:'Crafting payloads, exploit development basics and mitigation bypasses.',img:'assets/store/course-payloads.svg', amazonUrl:'https://example.com/courses/payloads'},
    {id:4,name:'Hacking Basics',price:59.00,category:'beginner',desc:'Intro to hardware hacking: GPIO, serial, and firmware analysis.',img:'assets/store/course-hardware.svg', amazonUrl:'https://example.com/courses/hardware'},
    {id:5,name:'Advanced Red Team Ops',price:249.00,category:'advanced',desc:'Adversary simulation, persistence, lateral movement and OPSEC.',img:'assets/store/course-red-team.svg', amazonUrl:'https://example.com/courses/red-team'},
    {id:6,name:'Cloud Security Workshop',price:129.00,category:'advanced',desc:'Cloud misconfigurations, IAM risks and hands-on remediation labs.',img:'assets/store/course-cloud.svg', amazonUrl:'https://example.com/courses/cloud-workshop'},
    {id:7,name:'DEFCON CTF Prep',price:39.00,category:'beginner',desc:'Capture The Flag warmups and common challenge patterns.',img:'assets/store/course-ctf-prep.svg', amazonUrl:'https://example.com/courses/ctf-prep'},
    {id:8,name:'Forensics & Incident Response',price:149.00,category:'advanced',desc:'Live incident triage, memory forensics and timeline reconstruction.',img:'assets/store/course-incident.svg', amazonUrl:'https://example.com/courses/forensics'}
];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
let _previousActive = null;
const filterBtns = document.querySelectorAll('.filter-btn');

function formatPrice(p){return '$' + p.toFixed(2)}

function renderProducts(){
    const q = (searchInput.value||'').trim().toLowerCase();
    const activeCat = document.querySelector('.filter-btn.active')?.dataset.cat || 'all';
    productGrid.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesCat = activeCat === 'all' || p.category === activeCat;
        const matchesQuery = q === '' || (p.name + ' ' + p.desc + ' ' + p.category).toLowerCase().includes(q);
        return matchesCat && matchesQuery;
    });

    if(filtered.length === 0){
        productGrid.innerHTML = '<div class="muted">No courses found.</div>';
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-media"><img loading="lazy" src="${p.img}" alt="${p.name}"></div>
            <div>
                <h3>${p.name}</h3>
                <div class="muted">${p.desc}</div>
            </div>
            <div class="card-footer">
                <div>
                    <div class="label">${p.category.toUpperCase()}</div>
                </div>
                <div style="text-align:right">
                    <div class="price">${formatPrice(p.price)}</div>
                    <div style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end">
                        <button class="btn ghost details" data-id="${p.id}">Details</button>
                        <button class="btn neon buy" data-id="${p.id}" data-amazon="${p.amazonUrl}">Enroll</button>
                    </div>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });

    document.querySelectorAll('.details').forEach(btn => btn.addEventListener('click', e => openModal(Number(e.currentTarget.dataset.id))));
    document.querySelectorAll('.buy').forEach(btn => btn.addEventListener('click', e => buyProduct(Number(e.currentTarget.dataset.id))));
}

function openModal(id){
    const p = products.find(x=>x.id===id); if(!p) return;
    const modal = document.getElementById('productModal');
    _previousActive = document.activeElement;
    modal.querySelector('#modalImg').src = p.img;
    modal.querySelector('#modalImg').setAttribute('loading','eager');
    modal.querySelector('#modalTitle').textContent = p.name;
    modal.querySelector('#modalCategory').textContent = p.category.toUpperCase();
    modal.querySelector('#modalDesc').textContent = p.desc + ' — Price: ' + formatPrice(p.price);
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';

    setTimeout(()=>{
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if(focusable) focusable.focus();
    },60);

    modal.querySelector('.modal-close').onclick = closeModal;
    modal.querySelector('#modalClose').onclick = closeModal;
    modal.querySelector('#modalBuy').onclick = () => { buyProduct(p.id); closeModal(); };
}

function closeModal(){
    const modal = document.getElementById('productModal');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if(_previousActive) try{ _previousActive.focus(); }catch(e){}
}

function buyProduct(id){
    const p = products.find(x=>x.id===id); if(!p) return;
    if(p.amazonUrl && p.amazonUrl.trim().length > 0){
        window.open(p.amazonUrl, '_blank', 'noopener');
        showToast(`Opening link for ${p.name}`);
    } else {
        showToast(`Enrolled in ${p.name} — ${formatPrice(p.price)}`);
    }
}

function showToast(msg,timeout=2800){
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show'); t.setAttribute('aria-hidden','false');
    clearTimeout(t._h);
    t._h = setTimeout(()=>{ t.classList.remove('show'); t.setAttribute('aria-hidden','true'); }, timeout);
}

searchInput.addEventListener('input',()=>{ renderProducts(); updateClear(); });
clearSearch.addEventListener('click',()=>{searchInput.value='';renderProducts();searchInput.focus();updateClear();});

function updateClear(){ clearSearch.style.display = (searchInput.value && searchInput.value.length>0) ? 'block' : 'none'; }

document.getElementById('productModal').addEventListener('click', (e)=>{ if(e.target && e.target.id === 'productModal') closeModal(); });

filterBtns.forEach(b=>b.addEventListener('click', e=>{
    filterBtns.forEach(x=>x.classList.remove('active'));
    e.currentTarget.classList.add('active');
    renderProducts();
}));

document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

document.addEventListener('DOMContentLoaded',()=>{
    renderProducts();
    try{ updateClear(); }catch(e){}
});

// on Enter: if query non-empty and no results, redirect to 404
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
        const q = (searchInput.value||'').trim().toLowerCase();
        if(!q) return;
        const activeCat = document.querySelector('.filter-btn.active')?.dataset.cat || 'all';
        const matches = products.filter(p => {
            const matchesCat = activeCat === 'all' || p.category === activeCat;
            const matchesQuery = q === '' || (p.name + ' ' + p.desc + ' ' + p.category).toLowerCase().includes(q);
            return matchesCat && matchesQuery;
        });
        if(matches.length === 0){
            window.location.href = '/404.html';
        }
    }
});
