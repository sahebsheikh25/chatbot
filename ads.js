/* ads.js — safe ad injector
   - Injects Vignette immediately into documentElement/head
   - Injects Tag script after 800ms into document.body
   - Skips about.html, contact.html, legal.html
   - Uses createElement('script') only (no HTML nesting)
   - Idempotent via `window.__sn_ads_injected` guard and duplicate checks
*/
(function(){
  if (typeof window === 'undefined') return;
  if (window.__sn_ads_injected) return; // ensure only one injection per page load
  window.__sn_ads_injected = true;

  var VIGNETTE_ZONE = '10444997';
  var VIGNETTE_SRC = 'https://gizokraijaw.net/vignette.min.js';

  var TAG_ZONE = '10444983';
  var TAG_SRC = 'https://al5sm.com/tag.min.js';

  function isExcluded(path) {
    return /(^|\/)about\.html$/.test(path)
        || /(^|\/)contact\.html$/.test(path)
        || /(^|\/)legal\.html$/.test(path);
  }

  function alreadyHasScript(matchSrcOrZone) {
    try {
      var sel = 'script[src*="' + matchSrcOrZone + '"]';
      if (document.querySelector(sel)) return true;
      // also check data-zone attribute
      var zoneSel = 'script[data-zone="' + matchSrcOrZone + '"]';
      return !!document.querySelector(zoneSel);
    } catch (e) { return false; }
  }

  function injectScriptInto(targetEl, src, zone) {
    try {
      if (!targetEl) return null;
      var s = document.createElement('script');
      s.async = true;
      if (zone) s.setAttribute('data-zone', zone);
      s.src = src;
      targetEl.appendChild(s);
      return s;
    } catch (e) { console.warn('ads: failed to append script', src, e); return null; }
  }

  document.addEventListener('DOMContentLoaded', function(){
    try {
      var path = (location.pathname.split('/').pop() || 'index.html');
      if (isExcluded(path)) return; // Do not load ads on excluded pages

      // Load Vignette immediately into documentElement/head
      if (!alreadyHasScript(VIGNETTE_SRC) && !alreadyHasScript(VIGNETTE_ZONE)) {
        var target = document.documentElement || document.head || document;
        injectScriptInto(target, VIGNETTE_SRC, VIGNETTE_ZONE);
        console.debug('ads: vignette injected');
      } else {
        console.debug('ads: vignette already present, skipping');
      }

      // Load Tag script after 800ms into body
      setTimeout(function(){
        try {
          if (!alreadyHasScript(TAG_SRC) && !alreadyHasScript(TAG_ZONE)) {
            var bodyTarget = document.body || document.documentElement || document.head || document;
            injectScriptInto(bodyTarget, TAG_SRC, TAG_ZONE);
            console.debug('ads: tag script injected');
          } else {
            console.debug('ads: tag script already present, skipping');
          }
        } catch (err) { console.warn('ads: delayed tag injection failed', err); }
      }, 800);

    } catch (err) {
      console.warn('ads: initialization failed', err);
    }
  });

})();
