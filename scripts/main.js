document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('main-nav');
  const heroButtons = document.getElementById('hero-buttons');
  if (nav && heroButtons) {
    if ('IntersectionObserver' in window) {
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
    } else {
      const onScroll = () => {
        const rect = heroButtons.getBoundingClientRect();
        if (rect.bottom <= 0) nav.classList.add('visible');
        else nav.classList.remove('visible');
      };
      window.addEventListener('scroll', onScroll);
      onScroll();
    }
  }

  // Smooth scroll for internal anchors. Skip anchors with href="#" or invalid targets.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      if (!href || href === '#') return; // nothing to scroll to
      try {
        const target = document.querySelector(href);
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        // If selector is invalid, ignore rather than breaking other scripts
        console.warn('Smooth scroll: invalid selector', href, err);
      }
    });
  });
});