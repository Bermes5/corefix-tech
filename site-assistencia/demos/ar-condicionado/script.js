/* ==========================================================
   CLIMASUL - CONFIGURAÇÃO CENTRAL
   Troque o número abaixo por um WhatsApp real em produção.
   Formato: código do país + DDD + número, somente dígitos.
   ========================================================== */
const SITE_CONFIG = {
  whatsappNumber: '5541998511625',
  companyName: 'ClimaSul Ar Condicionado (demonstração CoreFix)',
  city: 'Curitiba'
};

const createWhatsAppUrl = (message) => {
  const demoContext = 'Estou visualizando o site demonstrativo ClimaSul desenvolvido pela CoreFix.\n\n';
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(demoContext + message)}`;
};

const setupWhatsAppLinks = () => {
  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const service = link.dataset.waService;
    const customMessage = link.dataset.waMessage;

    let message = customMessage || 'Olá! Encontrei vocês pelo site e gostaria de solicitar um orçamento para ar-condicionado.';
    if (service) {
      message = `Olá! Gostaria de solicitar um orçamento para ${service}.`;
    }

    link.href = createWhatsAppUrl(message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
};

const setupMobileMenu = () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };

  toggle.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('a').forEach((item) => item.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
};

const setupQuoteForm = () => {
  const form = document.querySelector('#quote-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();
    const phone = document.querySelector('#phone').value.trim();
    const service = document.querySelector('#service').value;
    const profile = document.querySelector('#profile').value;
    const extraMessage = document.querySelector('#message').value.trim();

    const formattedMessage = [
      `Olá! Encontrei a ${SITE_CONFIG.companyName} pelo site e gostaria de solicitar um orçamento.`,
      '',
      `*Nome:* ${name}`,
      `*Telefone:* ${phone}`,
      `*Serviço:* ${service}`,
      `*Atendimento:* ${profile}`,
      extraMessage ? `*Detalhes:* ${extraMessage}` : null
    ].filter(Boolean).join('\n');

    window.open(createWhatsAppUrl(formattedMessage), '_blank', 'noopener,noreferrer');
  });
};

const setupPhoneMask = () => {
  const phone = document.querySelector('#phone');
  if (!phone) return;

  phone.addEventListener('input', () => {
    let digits = phone.value.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 10) {
      phone.value = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (digits.length > 6) {
      phone.value = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (digits.length > 2) {
      phone.value = digits.replace(/(\d{2})(\d+)/, '($1) $2');
    } else if (digits.length) {
      phone.value = `(${digits}`;
    }
  });
};

const setCurrentYear = () => {
  const target = document.querySelector('#current-year');
  if (target) target.textContent = String(new Date().getFullYear());
};

setupWhatsAppLinks();
setupMobileMenu();
setupQuoteForm();
setupPhoneMask();
setCurrentYear();
