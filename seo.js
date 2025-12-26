(function(){
  function ensureCanonical(){
    var link = document.querySelector('link[rel="canonical"]');
    if(!link){
      link = document.createElement('link');
      link.setAttribute('rel','canonical');
      document.head.appendChild(link);
    }
    var href = window.location.origin + window.location.pathname;
    link.setAttribute('href', href);
  }

  function setMeta(selector, value){
    var el = document.querySelector(selector);
    if(!el){
      // Create if missing for common tags
      if(selector.includes('meta[')){
        var m = document.createElement('meta');
        var match = selector.match(/\[(.*?)\]/);
        if(match){
          var parts = match[1].split('=');
          m.setAttribute(parts[0], parts[1].replace(/"/g,''));
        }
        document.head.appendChild(m);
        el = m;
      }
    }
    if(el && typeof value === 'string' && value.length){
      el.setAttribute('content', value);
    }
  }

  function currentImage(){
    var icon = document.querySelector('link[rel="icon"]');
    if(icon && icon.href) return icon.href;
    try {
      return new URL('CO_Logo2.svg', window.location.href).href;
    } catch(e){
      return window.location.origin + '/CO_Logo2.svg';
    }
  }

  function updateSEO(lang){
    ensureCanonical();
    var t = (window.translations && window.translations[lang]) || {};
    var pageTitle = t.pageTitle || document.title || 'Crystal Oilfield Services';
    var desc = t.metaDescription || t.heroDescription || 'Crystal Oilfield provides EPC and engineering services across the GCC.';
    var url = window.location.origin + window.location.pathname;
    var image = currentImage();
    var locale = (lang === 'ar') ? 'ar_QA' : 'en_US';

    // Standard meta
    setMeta('meta[name="description"]', desc);

    // Open Graph
    setMeta('meta[property="og:title"]', pageTitle);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:type"]', 'website');
    var ogLocale = document.querySelector('meta[property="og:locale"]');
    if(!ogLocale){
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property','og:locale');
      document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute('content', locale);

    // Twitter
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', pageTitle);
    setMeta('meta[name="twitter:description"]', desc);
    setMeta('meta[name="twitter:image"]', image);
  }

  function injectJSONLD(lang, pageType, pageName){
    // Remove previous JSON-LD blocks we manage
    var old = document.querySelectorAll('script[data-managed-jsonld="1"]');
    old.forEach(function(s){ s.remove(); });

    var origin = window.location.origin;
    var url = origin + window.location.pathname;
    var name = pageName || (window.translations && window.translations[lang] && window.translations[lang].pageTitle) || document.title;

    var org = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Crystal Oilfield Services',
      'url': origin,
      'logo': currentImage(),
      'email': 'info@crystaloilfield.qa',
      'telephone': '+974-40120736',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Excellence Tower, West Bay',
        'addressLocality': 'Doha',
        'addressCountry': 'QA',
        'postalCode': '80025'
      }
    };

    var breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin + '/index.html' },
        { '@type': 'ListItem', 'position': 2, 'name': name, 'item': url }
      ]
    };

    var webPage = {
      '@context': 'https://schema.org',
      '@type': pageType || 'WebPage',
      'name': name,
      'url': url,
      'isPartOf': { '@type': 'WebSite', 'name': 'Crystal Oilfield Services', 'url': origin }
    };

    [org, breadcrumb, webPage].forEach(function(data){
      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-managed-jsonld','1');
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);
    });
  }

  window.updateSEO = updateSEO;
  window.injectJSONLD = injectJSONLD;

  // Initial run after DOM ready in case no language set yet
  document.addEventListener('DOMContentLoaded', function(){
    var lang = (window.localStorage && localStorage.getItem('crystalOilfieldLang')) || document.documentElement.getAttribute('lang') || 'en';
    updateSEO(lang);
    injectJSONLD(lang, 'WebPage');
  });
})();
