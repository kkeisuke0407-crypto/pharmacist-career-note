'use strict';
(() => {
 const deck=document.querySelector('.deck'),slides=[...document.querySelectorAll('.slide')];
 const previous=document.getElementById('previous'),next=document.getElementById('next');
 const dialog=document.getElementById('text-dialog');
 const reduce=window.matchMedia('(prefers-reduced-motion:reduce)');
 const seen=new Set(),ratios=new Map(),last=slides.length;
 const variant=(new URLSearchParams(location.search).get('cta')||'b').toLowerCase();
 if(/^[abcd]$/.test(variant))document.body.dataset.cta=variant;
 const top=(new URLSearchParams(location.search).get('top')||'').toLowerCase();
 if(/^[abcd]$/.test(top))document.documentElement.dataset.top=top;
 // Images load only for the current slide and its neighbours; the blurred backdrop is added only where the art is narrower than the screen
 function loadSlide(slide){
  const img=slide.querySelector('.art>img');
  if(img.dataset.src){img.srcset=img.dataset.srcset;img.src=img.dataset.src;delete img.dataset.src;delete img.dataset.srcset;}
  if(!slide.querySelector('.backdrop')&&img.parentElement.clientWidth<slide.clientWidth-1){const b=img.cloneNode();b.className='backdrop';b.alt='';b.removeAttribute('fetchpriority');b.setAttribute('aria-hidden','true');slide.prepend(b);}
 }
 let current=1,timer,started=performance.now(),mouseDrag=null;
 function emit(event,extra={}) { const data={lp_id:'pharma-hitori-image-v5',cta_variant:document.body.dataset.cta,step:current,...extra}; if(typeof window.gtag==='function') window.gtag('event',event,data); else {window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...data});} }
 function viewed() { clearTimeout(timer);timer=setTimeout(()=>{if(document.visibilityState!=='visible'||dialog.open||seen.has(current))return;seen.add(current);emit('swipe_view');if(current===last)emit('swipe_complete');},600); }
 function activate(n) {
  if(n!==current){emit('swipe_leave',{visible_ms:Math.round(performance.now()-started)});current=n;started=performance.now();}
  if(n>1)document.body.dataset.moved='true';
  document.body.dataset.step=String(n);
  document.getElementById('page-status').textContent=last+'ページ中'+n+'ページ目';
  document.querySelectorAll('[data-progress]').forEach(el=>{el.dataset.read=String(Number(el.dataset.progress)<=n);});
  previous.disabled=n===1;next.disabled=n===last;
  slides.forEach((slide,i)=>{slide.inert=i!==n-1;});
  slides.slice(Math.max(0,n-2),Math.min(last,n+2)).forEach(loadSlide);
  viewed();
 }
 function goTo(n,smooth=true) {
  n=Math.min(last,Math.max(1,n));
  deck.scrollTo({left:(n-1)*deck.clientWidth,behavior:smooth&&!reduce.matches?'smooth':'instant'});
  // A jump (link #pN, resize) does not wait for the observer, which may not run until the next frame
  if(!smooth)activate(n);
 }
 function go(delta){emit('swipe_navigation',{direction:delta>0?'next':'previous'});goTo(current+delta);}
 previous.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>ratios.set(Number(e.target.dataset.step),e.intersectionRatio));let best=[...ratios].sort((a,b)=>b[1]-a[1])[0];if(best&&best[1]>=.6)activate(best[0]);},{root:deck,threshold:[0,.25,.6,.85,1]});
 slides.forEach(el=>observer.observe(el));
 function alignHash(){const m=location.hash.match(/^#p(\d{1,2})$/);goTo(m?Number(m[1]):1,false);}
 window.addEventListener('hashchange',alignHash);window.addEventListener('pageshow',alignHash);
 let resizeFrame;window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>goTo(current,false));});
 document.addEventListener('keydown',e=>{if(dialog.open||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();go(1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}else if(e.key==='Home'){e.preventDefault();goTo(1);}else if(e.key==='End'){e.preventDefault();goTo(last);}});
 deck.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('a,button'))return;mouseDrag={x:e.clientX,left:deck.scrollLeft,moved:false};deck.setPointerCapture(e.pointerId);});
 deck.addEventListener('pointermove',e=>{if(!mouseDrag)return;const dx=e.clientX-mouseDrag.x;if(Math.abs(dx)>6){mouseDrag.moved=true;deck.classList.add('is-dragging');deck.scrollLeft=mouseDrag.left-dx;}});
 function endDrag(){if(!mouseDrag)return;const moved=mouseDrag.moved;mouseDrag=null;deck.classList.remove('is-dragging');if(moved)goTo(Math.round(Math.abs(deck.scrollLeft)/deck.clientWidth)+1);}
 deck.addEventListener('pointerup',endDrag);deck.addEventListener('pointercancel',endDrag);
 document.querySelectorAll('.open-text').forEach(b=>b.addEventListener('click',()=>{clearTimeout(timer);dialog.showModal();emit('swipe_text_open');}));
 document.getElementById('close-text').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',viewed);
 document.addEventListener('visibilitychange',()=>document.visibilityState==='visible'?viewed():clearTimeout(timer));
 document.querySelectorAll('[data-consult]').forEach(a=>a.addEventListener('click',()=>emit('affiliate_click',{placement:a.dataset.consult,destination:'accesstrade_cta',affiliate_tracking_connected:true})));
 document.querySelector('.official-banner a')?.addEventListener('click',()=>emit('affiliate_click',{placement:'official_banner',destination:'accesstrade_banner',affiliate_tracking_connected:true}));
 document.querySelectorAll('.art>img').forEach(img=>{const fail=()=>{if(img.parentElement.querySelector('.image-error'))return;const box=document.createElement('div');box.className='image-error';box.setAttribute('role','status');const source=img.closest('.slide').querySelector('.slide-copy');[...source.querySelectorAll('h1,h2,p')].forEach(el=>{const p=document.createElement('p');p.textContent=el.textContent;box.appendChild(p);});img.parentElement.appendChild(box);};img.addEventListener('error',fail);if(img.getAttribute('src')&&img.complete&&img.naturalWidth===0)fail();});
 activate(1);
})();
