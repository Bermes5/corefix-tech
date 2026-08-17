const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('active');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => revealObserver.observe(el));

const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  const root = document.documentElement;
  const height = root.scrollHeight - root.clientHeight;
  const progress = height > 0 ? (root.scrollTop / height) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
}, { passive: true });

const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('mousemove', event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const servico = document.getElementById('servico').value;
    const mensagem = document.getElementById('mensagem').value.trim();

    const texto = `Olá! Quero solicitar um orçamento para um site.\n\nNome: ${nome}\nEmpresa: ${empresa || 'Não informado'}\nMeu WhatsApp: ${telefone}\nProjeto: ${servico}\nDetalhes: ${mensagem || 'Quero entender qual solução é mais indicada para meu negócio.'}`;
    const url = `https://wa.me/5541998511625?text=${encodeURIComponent(texto.slice(0, 3500))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}
