/* CoreFix Tech demonstration: fictitious services, no backend or data storage. */
(() => {
  'use strict';
  const params = new URLSearchParams(window.location.hash.replace(/^#/,''));
  const preset = window.__COREFIX_DEMO_CUSTOMIZATION__ || {};
  const palettes = Object.freeze({
    verde: {accent:'#15805a', light:'#e2f6e9', paper:'#f4fbf5'},
    azul: {accent:'#1b65b4', light:'#e2f0ff', paper:'#f4f9ff'},
    laranja: {accent:'#b85720', light:'#fce9d9', paper:'#fff7f0'}
  });
  const rawCompany = typeof preset.company === 'string' ? preset.company : params.get('empresa');
  const company = String(rawCompany || '').trim().slice(0,70);
  const rawColor = typeof preset.color === 'string' ? preset.color : params.get('cor');
  const color = Object.prototype.hasOwnProperty.call(palettes,rawColor) ? rawColor : '';
  if (company) {
    document.querySelectorAll('[data-demo-brand]').forEach(el => {el.textContent = company;});
    const footer = document.querySelector('.demo-footer b');
    if (footer) footer.textContent = company + '.';
    document.title = company + ' - Demonstra\u00e7\u00e3o CoreFix Tech';
  }
  if (color) {
    const css = palettes[color];
    document.body.style.setProperty('--accent', css.accent);
    document.body.style.setProperty('--accent-light', css.light);
    document.body.style.setProperty('--paper', css.paper);
  }
  const form = document.getElementById('demoForm');
  const model = document.body.dataset.demo || 'site';
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('nome') || '').trim().slice(0,80);
    const phone = String(data.get('telefone') || '').trim().slice(0,24);
    const service = String(data.get('servico') || '').trim().slice(0,160);
    const message = [
      'Ol\u00e1! Vi a demonstra\u00e7\u00e3o de ' + model.replace(/-/g,' ') + ' da CoreFix Tech.',
      'Gostaria de um site inspirado neste modelo.',
      company ? 'Nome simulado da empresa: ' + company : '',
      color ? 'Paleta visual escolhida: ' + color : '',
      '', 'Nome: ' + name, 'Meu WhatsApp: ' + phone,
      'Servi\u00e7o de exemplo: ' + service
    ].filter(Boolean).join('\n').slice(0,2500);
    const url = 'https://wa.me/5541998511625?text=' + encodeURIComponent(message);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Abrir conversa com a CoreFix Tech';
    link.className = 'demo-fallback';
    form.querySelector('.demo-fallback')?.remove();
    form.appendChild(link);
    window.open(url,'_blank','noopener,noreferrer');
  });
})();
