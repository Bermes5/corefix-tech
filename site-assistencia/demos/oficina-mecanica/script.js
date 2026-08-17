const SITE_CONFIG = {
  companyName: 'Prime Auto Center',
  whatsappNumber: '5541999990000',
  phone: '(41) 99999-0000',
  city: 'Curitiba',
  state: 'PR',
  email: 'contato@primeautocenter.com.br',
  address: 'Curitiba - PR',
  corefixWhatsapp: '5541998511625'
};
const waUrl = (number, message) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
document.querySelectorAll('.whatsapp-link').forEach(link => {
  link.href = waUrl(SITE_CONFIG.whatsappNumber, link.dataset.message || 'Olá! Gostaria de solicitar um orçamento.');
  link.target = '_blank'; link.rel = 'noopener noreferrer';
});
document.getElementById('corefixCta').href = waUrl(SITE_CONFIG.corefixWhatsapp, 'Olá! Vi a demonstração de oficina mecânica da CoreFix e gostaria de saber como funcionaria um site como esse para minha empresa.');
document.getElementById('corefixCta').target = '_blank';
document.querySelectorAll('[data-config]').forEach(el => { el.textContent = SITE_CONFIG[el.dataset.config] || ''; });
document.getElementById('year').textContent = new Date().getFullYear();
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-menu');
menuToggle.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); });
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); }));
document.getElementById('quoteForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const message = `Olá! Meu nome é ${data.name}.\n\nVeículo: ${data.brand} ${data.model}\nAno: ${data.year || 'Não informado'}\n\nServiço: ${data.service}\n\nProblema:\n${data.problem}\n\nMeu WhatsApp: ${data.phone}\n\nGostaria de solicitar uma avaliação.`;
  window.open(waUrl(SITE_CONFIG.whatsappNumber, message), '_blank', 'noopener,noreferrer');
});
