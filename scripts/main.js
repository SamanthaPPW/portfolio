document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('main-nav');
  const heroButtons = document.getElementById('hero-buttons');
  if (!nav || !heroButtons) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.classList.remove('visible');
      } else {
        nav.classList.add('visible');
      }
    });
  }, { threshold: 0.05 });

  io.observe(heroButtons);
  if (!('IntersectionObserver' in window)) {
    window.addEventListener('scroll', () => {
      const rect = heroButtons.getBoundingClientRect();
      if (rect.bottom <= 0) nav.classList.add('visible');
      else nav.classList.remove('visible');
    });
  }
});