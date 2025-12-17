document.addEventListener('DOMContentLoaded', function(){
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hover-scale for interactive elements
  var hoverSelectors=['button','a','i.fa','img','.project-card','.image-overlay-icon','.filter-btn'];
  document.querySelectorAll(hoverSelectors.join(',')).forEach(function(el){
    el.classList.add('anim-hover-scale');
  });

  if(!prefersReduced){
    // Fade-in on scroll for content elements
    var fadeTargets=document.querySelectorAll('section, .project-card, h1, h2, h3, h4, p, li, img, .grid > div, .rounded-xl, .card');
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.15});
    fadeTargets.forEach(function(el){
      el.classList.add('fade-in-up');
      io.observe(el);
    });

    // Parallax for hero images
    var heroSections=Array.prototype.slice.call(document.querySelectorAll('section[id*="hero"]'));
    var parallaxImages=[];
    heroSections.forEach(function(sec){
      var img=sec.querySelector('.absolute.inset-0 img, .absolute.inset-0 > img');
      if(img){
        img.classList.add('parallax-target');
        parallaxImages.push(img);
      }
    });
    var applyParallax=function(){
      var scrollY=window.scrollY||window.pageYOffset;
      parallaxImages.forEach(function(img){
        var factor=0.05; // small movement
        var t=Math.max(-20,Math.min(20,scrollY*factor));
        img.style.transform='translateY('+t+'px) scale(1.02)';
      });
    };
    applyParallax();
    window.addEventListener('scroll',applyParallax,{passive:true});
  }
});
