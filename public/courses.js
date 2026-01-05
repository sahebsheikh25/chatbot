/* Udemy Free Courses – SN Security */
const products = [
  {
    id: 1,
    name: "Complete AI Agent Practical Course",
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
    id: 10,
    name: "Mastering Kali Linux for Ethical Hackers",
    price: 0,
    category: "cybersecurity",
    desc: "6h 21m • ⭐ 4.22 • 65,344 students",
    img: "/assets/store/udemy-hacking.svg",
    amazonUrl: "https://www.udemy.com/course/mastering-kali-linux-for-ethical-hackers/?couponCode=D7DB2033853077A62219"
  },
  {
    id: 11,
    name: "Complete Python Bootcamp",
    price: 0,
    category: "python",
    desc: "16h 20m • ⭐ 3.81 • 56,124 students",
    img: "/assets/store/udemy-python.svg",
    amazonUrl: "https://www.udemy.com/course/the-complete-python-bootcamp-from-zero-to-expert/?couponCode=AE3667B2EEADEFEAB7D2"
  },
{
  id:12,
  name:'AI in HR – Master 100+ AI Tools',
  price:0,
  category:'beginner',
  desc:'6h 42m | ⭐ 3.84 | 16,766 students',
  img:'assets/store/course-ai.svg',
  amazonUrl:'https://www.udemy.com/course/ai-hr-become-master-of-ai-in-hr-world-learn-100-ai-tools/?couponCode=PAPAHR_JAN_03'
},
{
  id:13,
  name:'Professional Diploma in Branding',
  price:0,
  category:'beginner',
  desc:'1h 46m | ⭐ 4.46 | 36,292 students',
  img:'assets/store/course-branding.svg',
  amazonUrl:'https://www.udemy.com/course/professional-diploma-in-branding-and-brand-management/?couponCode=3CFA01CC7E83825998A5'
},
{
  id:14,
  name:'ETABS From Zero to Hero',
  price:0,
  category:'intermediate',
  desc:'5h 22m | ⭐ 4.41 | 24,473 students',
  img:'assets/store/course-etabs.svg',
  amazonUrl:'https://www.udemy.com/course/etabs-from-zero-to-hero/?couponCode=AFF4FFE3E6BFD09CD993'
},
{
  id:15,
  name:'Python Development – First Steps',
  price:0,
  category:'beginner',
  desc:'1h | ⭐ 4.19 | 39,092 students',
  img:'assets/store/course-python.svg',
  amazonUrl:'https://www.udemy.com/course/python-development-first-steps-and-development-ide-platform/?couponCode=645A7E2B0A39083F062E'
},
{
  id:16,
  name:'AI Cyber Security Mastery',
  price:0,
  category:'advanced',
  desc:'3h 11m | ⭐ 4.55 | 12,355 students',
  img:'assets/store/course-cyber-ai.svg',
  amazonUrl:'https://www.udemy.com/course/ai-cyber-security-mastery/?couponCode=D242CEBFF78671B71FA1'
},
{
  id:17,
  name:'AutoCAD 2D Complete Course',
  price:0,
  category:'beginner',
  desc:'12h 53m | ⭐ 4.28 | 53,212 students',
  img:'assets/store/course-autocad.svg',
  amazonUrl:'https://www.udemy.com/course/learn-autocad-2d/?couponCode=37E398B0419B8D2816DF'
},
{
  id:18,
  name:'Become Expert in Python by Projects',
  price:0,
  category:'intermediate',
  desc:'10h 36m | ⭐ 4.29 | 13,945 students',
  img:'assets/store/course-python-adv.svg',
  amazonUrl:'https://www.udemy.com/course/become-experts-in-python-by-exercises-by-projects/?couponCode=4561FE1C0FB347A1471E'
},
{
  id:19,
  name:'PHP & MySQL – Build Travel Website',
  price:0,
  category:'intermediate',
  desc:'7h 39m | ⭐ 4.4 | 33,236 students',
  img:'assets/store/course-php.svg',
  amazonUrl:'https://www.udemy.com/course/php-with-mysql-2023-build-complete-tours-and-travel-website/?couponCode=PHPTOURS59'
},
{
  id:20,
  name:'Machine Learning Foundations',
  price:0,
  category:'advanced',
  desc:'17h 29m | ⭐ 4.73 | 4,377 students',
  img:'assets/store/course-ml.svg',
  amazonUrl:'https://www.udemy.com/course/machine-learning-foundations-build-expert-level-ai-models/?couponCode=1EBC7A3AF2ECC74B225C'
},
{
  id:21,
  name:'Ultimate Coding Mega Course',
  price:0,
  category:'beginner',
  desc:'129h 50m | ⭐ 3.95 | 81,745 students',
  img:'assets/store/course-mega.svg',
  amazonUrl:'https://www.udemy.com/course/top-course/?couponCode=E2BF09F1EEAED022FC7A'
},
{
  id:22,
  name:'Business English for Leadership',
  price:0,
  category:'beginner',
  desc:'⭐ English for management & leadership',
  img:'assets/store/course-english.svg',
  amazonUrl:'https://www.udemy.com/course/business-english-for-management-and-leadership/?couponCode=F5E62CFFC2996E47407F'
},
{
  id:23,
  name:'JavaScript Bootcamp – 11 Apps',
  price:0,
  category:'intermediate',
  desc:'⭐ Build 11 JS apps (web)',
  img:'assets/store/course-js.svg',
  amazonUrl:'https://www.udemy.com/course/build-11-javascript-application-and-web-javascript-bootcamp/?couponCode=EDD7CD82F922864A4A81'
},
{
  id: 24,
  name: "ABC of Ear, Nose and Throat (ENT) Disorders",
  price: 0,
  category: "health",
  desc: "Detailed ENT disorders course • Free Udemy coupon",
  img: "assets/store/udemy-health.svg",
  amazonUrl: "https://www.udemy.com/course/abc-of-ear-nose-and-throat-ent-disorders/?couponCode=91F40117EC0C1BE7806F"
},
{
  id: 25,
  name: "General Bacteriology – A Concise Course",
  price: 0,
  category: "health",
  desc: "Bacteriology fundamentals • Free Udemy coupon",
  img: "assets/store/udemy-health.svg",
  amazonUrl: "https://www.udemy.com/course/general-bacteriology-a-concise-course/?couponCode=6687D9F5452887962F23"
},
{
  id: 26,
  name: "Web Hacking for Beginners",
  price: 0,
  category: "cybersecurity",
  desc: "Intro to ethical hacking and web security • Free Udemy coupon",
  img: "assets/store/udemy-hacking.svg",
  amazonUrl: "https://www.udemy.com/course/web-hacking-for-beginners/?couponCode=D1EF67C09FC14339A85A"
},
{
  id: 27,
  name: "Beginner’s Guide to Bash Scripting & Automation",
  price: 0,
  category: "coding",
  desc: "Learn Bash scripting basics • Free Udemy coupon",
  img: "assets/store/udemy-coding.svg",
  amazonUrl: "https://www.udemy.com/course/the-beginners-guide-to-bash-scripting-and-automation/?couponCode=A94B59B1CEA833CD2B96"
},
{
  id: 28,
  name: "SQLMap From Scratch for Ethical Hackers",
  price: 0,
  category: "cybersecurity",
  desc: "Hands-on SQLMap for pentesting • Free Udemy coupon",
  img: "assets/store/udemy-hacking.svg",
  amazonUrl: "https://www.udemy.com/course/sqlmap-from-scratch-for-ethical-hackers/?couponCode=012C7BE7904C05349B4A"
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
