/**
 * ==========================================================================
 * LÓGICA INTERATIVA - ESPAÇO NATÁLIA MORAES
 * Desenvolvido por: Rafael Alves
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Menu Mobile (Abrir e Fechar)
  // --------------------------------------------------------------------------
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Animação Suave dos Contadores Numéricos (Intersection Observer)
  // --------------------------------------------------------------------------
  const counters = document.querySelectorAll('.counter');
  const floatCounters = document.querySelectorAll('.counter-float');
  let animated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeProgress * (target - start) + start);

        if (target >= 1000) {
          counter.innerText = currentVal.toLocaleString('pt-BR');
        } else {
          counter.innerText = currentVal;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.innerText = target >= 1000 ? target.toLocaleString('pt-BR') : target;
        }
      }

      requestAnimationFrame(update);
    });

    floatCounters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 1800;
      const startTime = performance.now();

      function updateFloat(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = (easeProgress * target).toFixed(1);

        counter.innerText = currentVal.replace('.', ',');

        if (progress < 1) {
          requestAnimationFrame(updateFloat);
        } else {
          counter.innerText = target.toFixed(1).replace('.', ',');
        }
      }

      requestAnimationFrame(updateFloat);
    });
  }

  const statsSection = document.getElementById('estatisticas');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 3. Modal Lightbox (Visualização das Fotos em Ecrã Inteiro)
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  function openLightbox(src, captionText) {
    if (lightboxModal && lightboxImage) {
      lightboxImage.src = src;
      if (lightboxCaption) {
        lightboxCaption.innerText = captionText || '';
      }
      lightboxModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Impede o scroll da página enquanto aberto
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.add('hidden');
      document.body.style.overflow = ''; // Restaura a rolagem da página
    }
  }

  // Registar clique em todas as imagens com a classe .lightbox-trigger
  triggers.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      const caption = img.getAttribute('data-caption') || img.getAttribute('alt');
      openLightbox(src, caption);
    });
  });

  // Fechar no botão X
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Fechar ao clicar no fundo escuro fora da imagem
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Fechar ao pressionar a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && !lightboxModal.classList.contains('hidden')) {
      closeLightbox();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Envio do Formulário para a API do WhatsApp
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const interest = document.getElementById('userInterest').value;
      const message = document.getElementById('userMessage').value.trim();

      let text = `*Olá, Natália Moraes! Gostaria de um atendimento:*\n\n`;
      text += `👤 *Nome:* ${name}\n`;
      text += `📱 *Telefone:* ${phone}\n`;
      text += `✨ *Interesse:* ${interest}\n`;
      if (message) {
        text += `💬 *Mensagem:* ${message}\n`;
      }
      text += `\n_Mensagem enviada através da Landing Page oficial._`;

      const encodedText = encodeURIComponent(text);
      const whatsappURL = `https://wa.me/5521969277003?text=${encodedText}`;

      if (formFeedback) {
        formFeedback.classList.remove('hidden');
      }

      setTimeout(() => {
        window.open(whatsappURL, '_blank');
        contactForm.reset();
        if (formFeedback) {
          setTimeout(() => formFeedback.classList.add('hidden'), 4000);
        }
      }, 400);
    });
  }

});