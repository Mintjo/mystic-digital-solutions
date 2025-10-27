/* script.js
 - Simple JS for:
   * navigation toggle
   * fade-in when elements scroll into view
   * lazy loading images (data-src -> src)
*/

document.addEventListener('DOMContentLoaded', function () {
  // Nav toggle for small screens
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('#main-menu');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      navList.classList.toggle('show');
    });
  }

  // IntersectionObserver for fade-in elements
  const fades = document.querySelectorAll('.fade-in');
  const lazyImages = document.querySelectorAll('img.lazy');

  const ioOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // if image with data-src inside, swap it
        if (entry.target.tagName === 'IMG') {
          loadImage(entry.target);
        } else {
          const imgs = entry.target.querySelectorAll('img.lazy');
          imgs.forEach(img => loadImage(img));
        }
        obs.unobserve(entry.target);
      }
    });
  }, ioOptions);

  fades.forEach(el => observer.observe(el));
  lazyImages.forEach(img => observer.observe(img));

  function loadImage(img){
    const src = img.dataset.src;
    if (!src) return;
    img.src = src;
    img.classList.remove('lazy');
    img.removeAttribute('data-src');
  }

  // For browsers without IntersectionObserver fallback - immediate show
  if (!('IntersectionObserver' in window)) {
    fades.forEach(el => el.classList.add('visible'));
    lazyImages.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
    });
  }

  // Optional: add hover subtle shadow to cards (progressive enhancement)
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('mouseenter', () => c.classList.add('hovered'));
    c.addEventListener('mouseleave', () => c.classList.remove('hovered'));
  });
});
