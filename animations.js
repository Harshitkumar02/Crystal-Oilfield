document.addEventListener('DOMContentLoaded', function(){
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsIO = 'IntersectionObserver' in window;

  // Hover-scale for interactive elements
  var hoverSelectors=['button','a','i.fa','img','.project-card','.image-overlay-icon','.filter-btn'];
  document.querySelectorAll(hoverSelectors.join(',')).forEach(function(el){
    el.classList.add('anim-hover-scale');
  });

  var fadeTargets=document.querySelectorAll('section, .project-card, h1, h2, h3, h4, p, li, img, .grid > div, .rounded-xl, .card');
  var shouldAnimateOnScroll = !prefersReduced && supportsIO;

  if(shouldAnimateOnScroll){
    // Fade-in on scroll for content elements with earlier trigger on mobile
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.1, rootMargin:'0px 0px -10% 0px'});

    fadeTargets.forEach(function(el){
      el.classList.add('fade-in-up');
      io.observe(el);
    });

    // Safety reveal in case an element never intersects (e.g., rare layout edge cases)
    setTimeout(function(){
      fadeTargets.forEach(function(el){
        if(!el.classList.contains('in-view')){
          el.classList.add('in-view');
        }
      });
    },1500);
  } else {
    // When animations are reduced or IO unsupported, show content immediately
    fadeTargets.forEach(function(el){
      el.classList.remove('fade-in-up');
      el.classList.add('in-view');
    });
  }

  if(!prefersReduced){
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
