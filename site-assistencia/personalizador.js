/* CoreFix Tech V2.2 - live visual preview; no server or storage. */
(() => {
  'use strict';
  const form = document.getElementById('customizer-form');
  const display = document.getElementById('customizer-display');
  if (!form || !display) return;
  const $ = id => document.getElementById(id);
  const models = Object.freeze({
    oficina: {
      label: 'Oficina mec\u00e2nica', company: 'Oficina Silva', tag: 'OFICINA MEC\u00c2NICA',
      title: 'Seu carro em boas m\u00e3os.',
      description: 'Revis\u00e3o, manuten\u00e7\u00e3o e atendimento com mais confian\u00e7a.',
      image: 'assets/hero-oficina.svg', url: 'demos/oficina-mecanica/'
    },
    clima: {
      label: 'Climatiza\u00e7\u00e3o', company: 'ClimaSul', tag: 'CLIMATIZA\u00c7\u00c3O',
      title: 'Mais conforto para cada ambiente.',
      description: 'Instala\u00e7\u00e3o, limpeza e manuten\u00e7\u00e3o com atendimento profissional.',
      image: 'assets/hero-clima.svg', url: 'demos/ar-condicionado/'
    },
    eletrica: {
      label: 'Servi\u00e7os el\u00e9tricos', company: 'Voltz', tag: 'SERVI\u00c7OS EL\u00c9TRICOS',
      title: 'Seguran\u00e7a em cada instala\u00e7\u00e3o.',
      description: 'Solu\u00e7\u00f5es el\u00e9tricas para empresas e resid\u00eancias.',
      image: 'assets/hero-eletrica.svg', url: 'demos/eletricista/'
    }
  });
  const paletteLabels = Object.freeze({verde: 'Verde', azul: 'Azul', laranja: 'Laranja'});
  const companyInput = $('custom-company');
  let touchedCompany = false;
  let active = false;
  const selected = key => form.querySelector(`input[name="${key}"]:checked`)?.value || '';
  const getCustomization = () => {
    const segment = selected('custom-model');
    const color = selected('custom-color');
    return {
      segment,
      label: models[segment]?.label || models.oficina.label,
      color: paletteLabels[color] ? color : 'verde',
      colorLabel: paletteLabels[color] || paletteLabels.verde,
      company: companyInput.value.trim().slice(0, 70),
      active
    };
  };
  let previousSegment = selected('custom-model');

  function render() {
    const data = getCustomization();
    const model = models[data.segment] || models.oficina;
    display.dataset.theme = data.color;
    $('custom-site-company').textContent = data.company || 'Sua Empresa';
    $('custom-site-company').title = data.company || 'Sua Empresa';
    $('custom-site-tag').textContent = model.tag;
    $('custom-site-title').textContent = model.title;
    $('custom-site-description').textContent = model.description;
    $('custom-site-image').src = model.image;
    $('custom-site-image').alt = 'Ilustra\u00e7\u00e3o do modelo de ' + model.label;
    $('custom-browser-url').textContent = 'pr\u00e9via do seu site';
    const query = new URLSearchParams({cor: data.color});
    if (data.company) query.set('empresa', data.company);
    $('custom-open-demo').href = model.url + '#' + query.toString();
    $('custom-open-demo').setAttribute('aria-label', 'Abrir demonstra\u00e7\u00e3o personalizada de ' + model.label);
  }

  form.addEventListener('change', () => {
    active = true;
    const model = selected('custom-model');
    if (model !== previousSegment && !touchedCompany) companyInput.value = models[model].company;
    previousSegment = model;
    render();
  });
  companyInput.addEventListener('input', () => {
    active = true;
    touchedCompany = true;
    render();
  });

  for (const button of document.querySelectorAll('[data-custom-device]')) {
    button.addEventListener('click', () => {
      const device = button.dataset.customDevice;
      display.dataset.device = device === 'mobile' ? 'mobile' : 'desktop';
      for (const control of document.querySelectorAll('[data-custom-device]')) {
        const current = control.dataset.customDevice === display.dataset.device;
        control.classList.toggle('is-current', current);
        control.setAttribute('aria-pressed', String(current));
      }
    });
  }

  $('custom-use-simulator').addEventListener('click', () => {
    active = true;
    const data = getCustomization();
    const simulator = $('simulator-form');
    if (!simulator) return;
    const segmentInput = simulator.querySelector(`input[name="segmento"][value="${data.segment}"]`);
    if (segmentInput) segmentInput.checked = true;
    const companyField = simulator.querySelector('input[name="empresa"]');
    if (companyField) companyField.value = data.company;
    simulator.dispatchEvent(new Event('change', {bubbles: true}));
    $('simulador').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    $('sim-feedback').textContent = 'Nome e segmento adicionados ao briefing. Voc\u00ea j\u00e1 pode gerar o PDF ou continuar no WhatsApp.';
  });

  window.CoreFixCustomizer = Object.freeze({read: getCustomization});
  render();
})();
