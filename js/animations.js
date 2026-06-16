(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateHero() {
    if (prefersReducedMotion || typeof anime === 'undefined') return;

    anime({
      targets: '.hero-word',
      translateY: [24, 0],
      opacity: [0, 1],
      delay: anime.stagger(80, { start: 200 }),
      duration: 700,
      easing: 'easeOutCubic',
    });

    anime({
      targets: '.hero-subtitle, .hero-summary, .hero-cta',
      translateY: [18, 0],
      opacity: [0, 1],
      delay: anime.stagger(120, { start: 500 }),
      duration: 650,
      easing: 'easeOutCubic',
    });

    anime({
      targets: '.hero-photo',
      scale: [0.92, 1],
      opacity: [0, 1],
      duration: 900,
      delay: 350,
      easing: 'easeOutCubic',
    });
  }

  function animateCounters() {
    if (prefersReducedMotion || typeof anime === 'undefined') return;

    document.querySelectorAll('[data-counter]').forEach((element) => {
      const target = parseFloat(element.dataset.counter);
      const decimals = parseInt(element.dataset.decimals || '0', 10);
      const suffix = element.dataset.suffix || '';
      const counter = { value: 0 };

      anime({
        targets: counter,
        value: target,
        round: decimals === 0 ? 1 : Math.pow(10, decimals),
        duration: 1400,
        easing: 'easeOutExpo',
        update: () => {
          element.textContent = `${counter.value.toFixed(decimals)}${suffix}`;
        },
      });
    });
  }

  function initScrollReveals() {
    const items = document.querySelectorAll('.reveal-item');
    if (prefersReducedMotion) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');

          if (typeof anime !== 'undefined') {
            anime({
              targets: entry.target,
              translateY: [24, 0],
              opacity: [0, 1],
              duration: 650,
              easing: 'easeOutCubic',
            });
          }

          if (entry.target.matches('#about')) {
            animateCounters();
          }

          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function init() {
    animateHero();
    initScrollReveals();
  }

  window.PortfolioAnimations = { init, animateHero, animateCounters, initScrollReveals };
})();
