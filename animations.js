(function(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15, rootMargin: '0px 0px -40px 0px'});

  const autoTargets = document.querySelectorAll(
    'section, header, footer, .prose, .project-card, .card, .grid > div, img, h1, h2, h3, p, .counter'
  );
  autoTargets.forEach(el => {
    // Skip elements that are already visible above the fold
    const rect = el.getBoundingClientRect();
    const aboveFold = rect.top < (window.innerHeight * 0.85);
    el.classList.add('reveal');
    if(aboveFold){
      // Allow quick reveal after load for above-the-fold content
      setTimeout(()=> el.classList.add('reveal-visible'), 50);
    } else {
      observer.observe(el);
    }
  });

  // Subtle parallax for hero images/backgrounds
  const parallaxEls = document.querySelectorAll('.parallax');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    parallaxEls.forEach(el => {
      el.style.transform = `translateY(${y * 0.05}px)`;
    });
  });

  // Add motion-hover to buttons/links
  document.querySelectorAll('a, button').forEach(el => {
    el.classList.add('motion-hover');
  });

  // Mobile menu slide already present; enhance with reveal on open
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  if(mobileMenuBtn && mobileMenu){
    mobileMenu.classList.add('reveal');
    [mobileMenuBtn, mobileMenuClose].forEach(btn => btn && btn.addEventListener('click', ()=>{
      setTimeout(()=> mobileMenu.classList.add('reveal-visible'), 10);
    }));
  }
})();
