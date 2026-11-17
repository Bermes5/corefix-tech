/* CoreFix Tech V2.1 — Simulador de briefing. Sem backend e sem preços adicionais inventados. */
(() => {
  'use strict';

  const form = document.getElementById('simulator-form');
  if (!form) return;

  const get = id => document.getElementById(id);
  const segmentLabels = Object.freeze({
    oficina: 'Oficina mecânica',
    clima: 'Climatização',
    eletrica: 'Serviços elétricos',
    estetica: 'Estética e beleza',
    outro: 'Outro segmento'
  });
  const plans = Object.freeze({
    landing: { label: 'Landing Page', price: 790 },
    profissional: { label: 'Site Profissional', price: 1490 },
    personalizado: { label: 'Projeto personalizado', price: null }
  });
  const featureLabels = Object.freeze({
    formulario: 'Formulário de contato',
    galeria: 'Galeria de trabalhos',
    agendamento: 'Agendamento online'
  });
  const demos = Object.freeze({
    oficina: { url: 'demos/oficina-mecanica/', label: 'Ver exemplo de oficina mecânica' },
    clima: { url: 'demos/ar-condicionado/', label: 'Ver exemplo de climatização' },
    eletrica: { url: 'demos/eletricista/', label: 'Ver exemplo de serviços elétricos' }
  });

  const formFeature = form.querySelector('input[name="funcionalidade"][value="formulario"]');
  const features = [...form.querySelectorAll('input[name="funcionalidade"]:not(:disabled)')];
  const whatsappLink = get('sim-send');
  const copyButton = get('sim-copy');
  const feedback = get('sim-feedback');
  const formTag = get('sim-form-tag');
  const otherWrap = get('sim-other-wrap');
  const otherInput = get('sim-other-segment');
  let manualFormPreference = false;
  let currentBriefing = '';

  const selected = name => form.querySelector(`input[name="${name}"]:checked`)?.value ?? '';
  const readValue = name => String(new FormData(form).get(name) || '').trim();
  const currency = num => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(num);

  function getDetails() {
    const segment = selected('segmento');
    const plan = selected('plano');
    const includesForm = plan === 'profissional';
    const requested = features.filter(el => el.checked && !el.disabled).map(el => el.value);
    const included = ['WhatsApp integrado'];
    if (includesForm) included.push('Formulário de contato');
    const extras = requested.filter(id => !(id === 'formulario' && includesForm)).map(id => featureLabels[id]);
    const customSegment = readValue('outro_segmento').slice(0, 90);
    return {
      segment,
      segmentLabel: segment === 'outro' && customSegment
        ? customSegment
        : segmentLabels[segment] || 'A definir',
      plan,
      planLabel: plans[plan]?.label || 'A definir',
      price: plans[plan]?.price ?? null,
      included,
      extras,
      company: readValue('empresa').slice(0, 100),
      city: readValue('cidade').slice(0, 70),
      name: readValue('nome').slice(0, 80),
      phone: readValue('telefone').slice(0, 25),
      appearance: (() => { const custom = window.CoreFixCustomizer?.read(); return custom && custom.active && custom.segment === segment ? custom.colorLabel : ''; })()
    };
  }

  function buildBriefing(details) {
    const lines = [
      'Olá! Quero solicitar um pré-orçamento para um site com a CoreFix Tech.',
      '',
      'BRIEFING INICIAL',
      `Segmento: ${details.segmentLabel}`,
      `Tipo de site: ${details.planLabel}`,
      `Preço inicial de referência: ${details.price === null ? 'Sob consulta' : 'A partir de ' + currency(details.price)}`,
      `Incluído no formato escolhido: ${details.included.join(', ')}`,
      `Funcionalidades adicionais para avaliar: ${details.extras.length ? details.extras.join(', ') : 'Nenhuma'}`
    ];
    if (details.company) lines.push(`Empresa: ${details.company}`);
    if (details.appearance) lines.push(`Paleta sugerida: ${details.appearance} (sem acr\u00e9scimo estimado)`);
    if (details.city) lines.push(`Cidade: ${details.city}`);
    if (details.name) lines.push(`Nome: ${details.name}`);
    if (details.phone) lines.push(`Meu WhatsApp: ${details.phone}`);
    lines.push('', 'Entendo que os valores são iniciais e que o orçamento final depende do escopo. Domínio, hospedagem e manutenção são tratados separadamente.', '', 'Podemos conversar sobre o projeto?');
    return lines.join('\n').slice(0, 2600);
  }

  function render() {
    const plan = selected('plano');
    const segment = selected('segmento');
    const professional = plan === 'profissional';

    if (professional) {
      if (!formFeature.disabled) manualFormPreference = formFeature.checked;
      formFeature.checked = true;
      formFeature.disabled = true;
      formTag.textContent = 'INCLUÍDO';
    } else {
      if (formFeature.disabled) {
        formFeature.disabled = false;
        formFeature.checked = manualFormPreference;
      }
      formTag.textContent = 'SOB CONSULTA';
    }

    otherWrap.hidden = segment !== 'outro';
    otherInput.disabled = segment !== 'outro';

    const details = getDetails();
    get('sim-summary-segment').textContent = details.segmentLabel;
    get('sim-summary-plan').textContent = details.planLabel;
    get('sim-summary-price').textContent = details.price === null ? 'Sob consulta' : currency(details.price);
    get('sim-summary-price-note').textContent = details.price === null
      ? 'A proposta é definida após entender as suas necessidades.'
      : 'A partir desse valor, sujeito ao escopo final.';
    get('sim-summary-extras').hidden = details.extras.length === 0;
    get('sim-summary-extras').textContent = details.extras.length
      ? `${details.extras.length} ${details.extras.length === 1 ? 'funcionalidade adicional' : 'funcionalidades adicionais'} sob consulta. Nenhum preço extra foi calculado.`
      : '';

    const list = get('sim-summary-list');
    list.replaceChildren();
    for (const included of details.included) {
      const li = document.createElement('li');
      li.textContent = included + ' — incluído';
      list.append(li);
    }
    for (const extra of details.extras) {
      const li = document.createElement('li');
      li.className = 'sim-added';
      li.textContent = extra + ' — sob consulta';
      list.append(li);
    }

    const demo = demos[segment];
    const demoLink = get('sim-demo-link');
    demoLink.hidden = !demo;
    if (demo) {
      demoLink.href = demo.url;
      demoLink.firstChild.textContent = demo.label + ' ';
    }

    currentBriefing = buildBriefing(details);
    whatsappLink.href = 'https://wa.me/5541998511625?text=' + encodeURIComponent(currentBriefing);
    whatsappLink.setAttribute('aria-label', 'Abrir WhatsApp com seu briefing de ' + details.planLabel);
  }

  // Atualiza imediatamente as escolhas e os links, sem registrar dados em servidores.
  form.addEventListener('change', event => {
    if (event.target === formFeature && !formFeature.disabled) manualFormPreference = formFeature.checked;
    feedback.textContent = '';
    render();
  });
  form.addEventListener('input', () => {
    feedback.textContent = '';
    render();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    whatsappLink.click();
  });

  get('sim-example').addEventListener('click', () => {
    form.querySelector('input[name="segmento"][value="oficina"]').checked = true;
    form.querySelector('input[name="plano"][value="landing"]').checked = true;
    manualFormPreference = false;
    for (const feature of features) {
      feature.checked = false;
      feature.disabled = false;
    }
    for (const field of form.querySelectorAll('input[type="text"], input[type="tel"]')) field.value = '';
    feedback.textContent = 'Exemplo carregado: oficina mecânica, Landing Page e WhatsApp integrado.';
    render();
    get('simulador').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  for (const link of document.querySelectorAll('[data-sim-segment]')) {
    link.addEventListener('click', () => {
      const target = form.querySelector(`input[name="segmento"][value="${link.dataset.simSegment}"]`);
      if (target) target.checked = true;
      feedback.textContent = '';
      render();
    });
  }

  copyButton.addEventListener('click', async () => {
    const message = currentBriefing;
    let done = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
        done = true;
      }
    } catch (_) { /* Fallback quando o navegador não permite Clipboard API. */ }
    if (!done) {
      const field = document.createElement('textarea');
      field.value = message;
      field.setAttribute('aria-label', 'Briefing para copiar');
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      document.body.append(field);
      field.focus();
      field.select();
      try { done = document.execCommand('copy'); } catch (_) { done = false; }
      field.remove();
    }
    if (!done) {
      const old = get('sim-manual-copy');
      if (old) old.remove();
      const field = document.createElement('textarea');
      field.id = 'sim-manual-copy';
      field.className = 'sim-manual-copy';
      field.readOnly = true;
      field.value = message;
      field.setAttribute('aria-label', 'Selecione e copie seu briefing');
      feedback.after(field);
      field.focus();
      field.select();
      feedback.textContent = 'Selecione e copie o texto exibido logo abaixo.';
    } else {
      get('sim-manual-copy')?.remove();
      feedback.textContent = 'Briefing copiado. Agora você pode colar onde preferir.';
    }
  });

  window.CoreFixTechBriefing = Object.freeze({getDetails,buildBriefing});

  // Um link externo normal é mais confiável do que window.open(..., 'noopener') e permite ao visitante revisar a mensagem.
  render();
})();
