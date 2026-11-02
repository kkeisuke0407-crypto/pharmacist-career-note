'use strict';
(() => {
  if (window.pharmaGa4Configured || typeof window.gtag !== 'function') return;
  window.pharmaGa4Configured = true;
  const lpId = document.body.dataset.lp || 'pharma-hitori-image-v5';
  const match = lpId.match(/^pharma-v([2-7])-/);
  const variant = match ? `V${match[1]}` : 'V1';
  document.body.dataset.lpVariant = variant;
  const config = {content_group: 'pharma_manga', lp_id: lpId, lp_variant: variant};
  if (new URLSearchParams(location.search).get('ga_debug') === '1') config.debug_mode = true;
  window.gtag('config', 'G-K01M9QD5SW', config);
})();
