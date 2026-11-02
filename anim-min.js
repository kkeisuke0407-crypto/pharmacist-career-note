'use strict';
// Play a slide's marks when it becomes the current slide; reset them once it leaves the screen so they play again.
(() => {
  const slides = [...document.querySelectorAll('.has-fx')];
  if (!slides.length) return;

  function play(n) {
    const slide = slides.find(s => Number(s.dataset.step) === n);
    if (!slide || slide.classList.contains('play')) return;
    void slide.offsetWidth;
    slide.classList.add('play');
  }

  const offscreen = new IntersectionObserver(entries => {
    entries.forEach(e => { if (!e.isIntersecting) e.target.classList.remove('play'); });
  }, {root: document.querySelector('.deck'), threshold: 0});
  slides.forEach(s => offscreen.observe(s));

  new MutationObserver(() => play(Number(document.body.dataset.step)))
    .observe(document.body, {attributes: true, attributeFilter: ['data-step']});
  play(Number(document.body.dataset.step) || 1);
})();
