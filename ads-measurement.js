'use strict';
(() => {
  // Count only real visits to the approved affiliate destinations.
  if (window.pharmaMcvInstalled) return;
  window.pharmaMcvInstalled = true;
  const sendTo = 'AW-18548248194/D1N3CKa2xa8dEIKdv4xF';
  const destinations = new Set(['0100fulu00ozyz', '0100msyr00ozyz']);

  function track(event) {
    if (!event.isTrusted || event.defaultPrevented) return;
    if (event.type === 'click' ? event.button !== 0 : event.button !== 1) return;
    const link = event.target.closest?.('a[data-consult], .official-banner a');
    if (!link || link.closest('[inert]') || link.dataset.ctaPending === 'true') return;
    let url;
    try { url = new URL(link.href); } catch { return; }
    if (url.protocol !== 'https:' || url.hostname !== 'h.accesstrade.net' ||
        url.pathname !== '/sp/cc' || !destinations.has(url.searchParams.get('rk'))) return;
    if (typeof window.gtag !== 'function') return;

    // Keep the same-window banner visit intact while the event is dispatched.
    const waitForEvent = event.type === 'click' &&
      (!link.target || link.target === '_self') &&
      !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    let navigate;
    if (waitForEvent) {
      event.preventDefault();
      let navigated = false;
      navigate = () => {
        if (navigated) return;
        navigated = true;
        window.location.assign(url.href);
      };
      window.setTimeout(navigate, 800);
    }
    const data = {send_to: sendTo, value: 0, currency: 'JPY'};
    if (navigate) {
      data.event_callback = navigate;
      data.event_timeout = 800;
    }
    window.gtag('event', 'conversion', data);
  }
  document.addEventListener('click', track);
  document.addEventListener('auxclick', track);
})();
