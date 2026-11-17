(() => {
  'use strict';
  const toggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const header = document.querySelector('.site-header');
  // Sticky header clearance also covers browser back/forward and hash links.
  const updateNavClearance = () => {
    const height = header ? Math.ceil(header.getBoundingClientRect().height) : 91;
    document.documentElement.style.setProperty('--nav-clearance', `${height + 30}px`);
  };
  updateNavClearance();
  window.addEventListener('resize', updateNavClearance, { passive: true });
  const closeMenu = () => {
    if (!mobileNav || !toggle) return;
    mobileNav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
  };
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const willOpen = mobileNav.hidden;
      mobileNav.hidden = !willOpen;
      toggle.setAttribute('aria-expanded', String(willOpen));
      toggle.setAttribute('aria-label', willOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (mobileNav.hidden || header.contains(event.target)) return;
      closeMenu();
    });
  }
  document.getElementById('year').textContent = new Date().getFullYear();
  const quote = document.getElementById('quote-form');
  if (quote) {
    quote.addEventListener('submit', event => {
      event.preventDefault();
      if (!quote.reportValidity()) return;
      const data = new FormData(quote);
      const clean = key => String(data.get(key) || '').trim().slice(0, 1200);
      const nome = clean('nome');
      const telefone = clean('telefone');
      const empresa = clean('empresa');
      const servico = clean('servico');
      const mensagem = clean('mensagem');
      const conteudo = [
        'Olá! Quero solicitar um orçamento para meu site.', '',
        `Nome: ${nome}`,
        `WhatsApp: ${telefone}`,
        `Empresa: ${empresa || 'Não informado'}`,
        `Tipo de projeto: ${servico}`,
        `Minha ideia: ${mensagem || 'Gostaria de conversar sobre as possibilidades.'}`
      ].join('\n');
      const url = `https://wa.me/5541998511625?text=${encodeURIComponent(conteudo.slice(0, 2800))}`;
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      // Alguns navegadores bloqueiam abas novas; preserve sempre uma forma de continuar.
      if (!newWindow) {
        const existing = document.getElementById('whatsapp-fallback');
        if (existing) existing.remove();
        const link = document.createElement('a');
        link.id = 'whatsapp-fallback';
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Se a conversa não abriu, clique aqui para continuar no WhatsApp';
        link.className = 'form-fallback';
        quote.appendChild(link);
        link.focus();
      }
    });
  }
})();


// V2.2.4: selecao acessivel de demonstracoes reais no topo da pagina.
(() => {
  'use strict';
  const group = document.querySelector('.showcase-tabs');
  if (!group) return;
  const config = {
    clima: { title: 'ClimaSul', detail: 'Climatização', description: 'Uma página clara para serviços de instalação e manutenção.', caption: 'Prévia • Climatização', link: 'demos/ar-condicionado/', index: '01' },
    oficina: { title: 'Torque', detail: 'Oficina mecânica', description: 'Visual marcante para reparos, revisões e agendamentos.', caption: 'Prévia • Oficina mecânica', link: 'demos/oficina-mecanica/', index: '02' },
    eletrica: { title: 'Voltz', detail: 'Serviços elétricos', description: 'Uma vitrine direta para serviços residenciais e comerciais.', caption: 'Prévia • Serviços elétricos', link: 'demos/eletricista/', index: '03' }
  };
  const buttons = Array.from(group.querySelectorAll('[data-showcase]'));
  const shots = Array.from(document.querySelectorAll('[data-showcase-shot]'));
  const counter = document.getElementById('showcase-index');
  const caption = document.getElementById('showcase-browser-caption');
  const name = document.getElementById('showcase-name');
  const desc = document.getElementById('showcase-description');
  const visualLink = document.getElementById('showcase-screen-link');
  const openLink = document.getElementById('showcase-open');
  const select = key => {
    const item = config[key];
    if (!item) return;
    buttons.forEach(button => {
      const selected = button.dataset.showcase === key;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-selected', selected);
    });
    shots.forEach(img => { img.hidden = img.dataset.showcaseShot !== key; });
    counter.textContent = item.index;
    caption.textContent = item.caption;
    name.textContent = item.title + ' · ' + item.detail;
    desc.textContent = item.description;
    visualLink.href = item.link;
    visualLink.setAttribute('aria-label', 'Abrir demonstração completa: ' + item.title);
    openLink.href = item.link;
  };
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.showcase)));
})();
