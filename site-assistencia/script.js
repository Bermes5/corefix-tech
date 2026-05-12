/* =========================
   MENU MOBILE
========================= */

const menuToggle =
document.querySelector('.menu-toggle');

const menu =
document.querySelector('.menu');

menuToggle.addEventListener('click', () => {

  menu.classList.toggle('active');

  menuToggle.classList.toggle('active');

});

/* ================================= */
/* SCROLL REVEAL */
/* ================================= */

const reveals = document.querySelectorAll('.reveal');

function revealOnScroll(){

  reveals.forEach((element) => {

    const windowHeight = window.innerHeight;

    const revealTop =
    element.getBoundingClientRect().top;

    if(revealTop < windowHeight - 100){

      element.classList.add('active');

    }

  });

}

window.addEventListener('scroll', revealOnScroll);

revealOnScroll();

/* ================================= */
/* PARTICLES */
/* ================================= */

tsParticles.load("particles-js", {

  background:{
    color:"transparent"
  },

  particles:{

    number:{
      value:50
    },

    color:{
      value:"#18b4ff"
    },

    links:{
      enable:true,
      color:"#18b4ff",
      distance:150,
      opacity:0.15
    },

    move:{
      enable:true,
      speed:1
    },

    opacity:{
      value:0.3
    },

    size:{
      value:{
        min:1,
        max:3
      }
    }

  }

});

/* ================================= */
/* COUNTER ANIMATION */
/* ================================= */

const counters =
document.querySelectorAll('.counter');

const statsSection =
document.querySelector('.stats');

function startCounters(){

  counters.forEach(counter => {

    const target =
    +counter.getAttribute('data-target');

    let count = 0;

    const increment = target / 100;

    function updateCounter(){

      count += increment;

      if(count < target){

        counter.innerText =
        Math.ceil(count);

        requestAnimationFrame(updateCounter);

      }else{

        counter.innerText = target;

      }

    }

    updateCounter();

  });

}

if(statsSection){

  const observer =
  new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        startCounters();

        observer.unobserve(statsSection);

      }

    });

  });

  observer.observe(statsSection);

}

/* ================================= */
/* CONTACT FORM */
/* ================================= */

const contactForm =
document.getElementById('contactForm');

if(contactForm){

  contactForm.addEventListener('submit', function(e){

    e.preventDefault();

    const nome =
    document.getElementById('nome').value;

    const telefone =
    document.getElementById('telefone').value;

    const servico =
    document.getElementById('servico').value;

    const mensagem =
    document.getElementById('mensagem').value;

    const texto = `
Olá, me chamo ${nome}!

📱 WhatsApp:
${telefone}

💻 Serviço:
${servico}

📝 Detalhes:
${mensagem}
`;

    const url =
    `https://wa.me/5541998511625?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank');

  });

}
/* ================================= */
/* 3D CARDS */
/* ================================= */

const interactiveCards = document.querySelectorAll(
  '.card, .review-card, .project-card, .stat-box, .info-card'
);

interactiveCards.forEach(card => {

  card.addEventListener('mousemove', (e) => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / 18) * -1;
    const rotateY = (x - centerX) / 18;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
    `;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);

  });

  card.addEventListener('mouseleave', () => {

    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;

  });

});
/* ================================= */
/* CURSOR GLOW */
/* ================================= */

const cursorGlow =
document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {

  cursorGlow.style.left =
  `${e.clientX}px`;

  cursorGlow.style.top =
  `${e.clientY}px`;

});
/* =========================
   LOADER
========================= */

window.addEventListener('load', () => {

  const loader =
  document.querySelector('.loader');

  setTimeout(() => {

    loader.classList.add('hide');

  }, 1800);

});
/* SCROLL PROGRESS */

const progressBar =
document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {

  const scrollTop =
  document.documentElement.scrollTop;

  const scrollHeight =
  document.documentElement.scrollHeight -
  document.documentElement.clientHeight;

  const progress =
  (scrollTop / scrollHeight) * 100;

  progressBar.style.width =
  `${progress}%`;

});