// mobile nav
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  navLinks.classList.remove('open'); burger.classList.remove('open');
}));

// active link on scroll
const sections = ['work','stack','contact'].map(id => document.getElementById(id));
const navEls = document.querySelectorAll('.nav-link');
const setActive = () => {
  let current = null;
  sections.forEach(s => { if (s && window.scrollY + 120 >= s.offsetTop) current = s.id; });
  navEls.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', setActive);
setActive();

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// typed cursor line in terminal
const typedLine = document.getElementById('typedLine');
const finalHTML = typedLine.innerHTML;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  typedLine.innerHTML = '<span id="typed-cursor"></span>';
  setTimeout(() => { typedLine.innerHTML = finalHTML; }, 900);
}

// subtle tilt on terminal following pointer
const term = document.getElementById('terminalCard');
if (!reduceMotion && window.matchMedia('(min-width: 881px)').matches) {
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const r = term.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    term.style.transform = `perspective(1000px) rotateY(${(-4 - dx*6).toFixed(2)}deg) rotateX(${(2 - dy*6).toFixed(2)}deg)`;
  });
  document.querySelector('.hero').addEventListener('mouseleave', () => {
    term.style.transform = 'perspective(1000px) rotateY(-4deg) rotateX(2deg)';
  });
}

// copy email
const copyBtn = document.getElementById('copyEmail');
const toast = document.getElementById('toast');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('hello@example.com');
  } catch (e) { /* clipboard may be blocked; still show confirmation */ }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});

// count-up stats
const nums = document.querySelectorAll('.stat .num');
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.trim();
    const isMs = raw.includes('ms');
    const target = parseInt(raw, 10);
    if (reduceMotion) return;
    let cur = 0;
    const step = Math.max(1, Math.round(target/30));
    const tick = () => {
      cur = Math.min(target, cur + step);
      el.textContent = cur + (isMs ? 'ms' : '');
      if (cur < target) requestAnimationFrame(tick);
    };
    el.textContent = '0' + (isMs ? 'ms' : '');
    requestAnimationFrame(tick);
    statIO.unobserve(el);
  });
}, { threshold: 0.6 });
nums.forEach(n => statIO.observe(n));
