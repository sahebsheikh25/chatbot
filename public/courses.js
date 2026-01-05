/* Udemy Free Courses – SN Security */
const products = [
  {
    id: 1,
    name: "AI Agent Practical Course",
    price: 0,
    category: "ai",
    desc: "7h 46m • ⭐ 4.97 • 1638 students",
    img: "/assets/store/udemy-ai.svg",
    amazonUrl: "https://www.udemy.com/course/complete-ai-agent-practical-course-c-aipc/?couponCode=NEW_YEAR_2026"
  },
  {
    id: 2,
    name: "Ethically Hack the Planet – Part 4",
    price: 0,
    category: "cybersecurity",
    desc: "52m • ⭐ 3.95 • 51,250 students",
    img: "/assets/store/udemy-hacking.svg",
    amazonUrl: "https://www.udemy.com/course/ethically-hack-the-planet-part-4/?couponCode=8C12DB659D1613146683"
  },
  {
    id: 3,
    name: "Ethically Hack the Planet – Part 2",
    price: 0,
    category: "cybersecurity",
    desc: "34m • ⭐ 4.07 • 52,397 students",
    img: "/assets/store/udemy-hacking.svg",
    amazonUrl: "https://www.udemy.com/course/ethically-hack-the-planet-part-2/?couponCode=EFE5F6F953ABC1DD9142"
  },
  {
    id: 4,
    name: "Ethically Hack the Planet – Part 1",
    price: 0,
    category: "cybersecurity",
    desc: "1h 7m • ⭐ 4.04 • 63,606 students",
    img: "/assets/store/udemy-hacking.svg",
    amazonUrl: "https://www.udemy.com/course/ethically-hack-the-planet-part-1/?couponCode=CBCA631965D29EF54854"
  },
  {
    id: 5,
    name: "Complete Java Programming Bootcamp",
    price: 0,
    category: "java",
    desc: "4h 39m • ⭐ 4.1 • 22,138 students",
    img: "/assets/store/udemy-java.svg",
    amazonUrl: "https://www.udemy.com/course/complete-java-programming-bootcamp-learn-to-code-in-java/?couponCode=A2DC16BD316F4F05E2AE"
  },
  {
    id: 6,
    name: "BASE44 Mastery – AI Workflow Automation",
    price: 0,
    category: "ai",
    desc: "7h 11m • ⭐ 4.65 • 3,011 students",
    img: "/assets/store/udemy-ai.svg",
    amazonUrl: "https://www.udemy.com/course/base44-mastery-build-enterprise-ai-workflow-automations/?couponCode=8FE4BBB6DA539C76B223"
  },
  {
    id: 7,
    name: "Complete JavaScript Course",
    price: 0,
    category: "coding",
    desc: "3h 23m • ⭐ 4.33 • 46,816 students",
    img: "/assets/store/udemy-js.svg",
    amazonUrl: "https://www.udemy.com/course/the-complete-javascript-course-from-zero-to-expert-o/?couponCode=00CAEBF36C4332FFA1E7"
  },
  {
    id: 8,
    name: "Fundamentals of Cloud Computing",
    price: 0,
    category: "cloud",
    desc: "4h 3m • ⭐ 4.39 • 54,973 students",
    img: "/assets/store/udemy-cloud.svg",
    amazonUrl: "https://www.udemy.com/course/fundamentals-of-cloud-computing-a/?couponCode=265C6B1DF107AB8B0F71"
  },
  {
    id: 9,
    name: "Mastering Kali Linux for Ethical Hackers",
    price: 0,
    category: "cybersecurity",
    desc: "6h 21m • ⭐ 4.22 • 65,344 students",
    img: "/assets/store/udemy-hacking.svg",
    amazonUrl: "https://www.udemy.com/course/mastering-kali-linux-for-ethical-hackers/?couponCode=D7DB2033853077A62219"
  },
  {
    id: 10,
    name: "Complete Python Bootcamp",
    price: 0,
    category: "python",
    desc: "16h 20m • ⭐ 3.81 • 56,124 students",
    img: "/assets/store/udemy-python.svg",
    amazonUrl: "https://www.udemy.com/course/the-complete-python-bootcamp-from-zero-to-expert/?couponCode=AE3667B2EEADEFEAB7D2"
  }
];


const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
let _previousActive = null;
const filterBtns = document.querySelectorAll('.filter-btn');

function formatPrice(p){
  return p === 0 ? 'FREE' : '$' + p.toFixed(2);
}


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
