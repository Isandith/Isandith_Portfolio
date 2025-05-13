// Portfolio2.js
window.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.fiverr .carousel');
  const track    = carousel?.querySelector('.track');
  const realSlides = track ? Array.from(track.children) : [];
  const realCount = realSlides.length;
  if (!carousel || !track || realCount === 0) return;

  const cloneCount = 3;
  // 1) Clone slides for infinite loop
  const clonesBefore = realSlides.slice(-cloneCount).map(n => n.cloneNode(true));
  const clonesAfter  = realSlides.slice(0, cloneCount).map(n => n.cloneNode(true));
  clonesBefore.forEach(n => track.insertBefore(n, track.firstChild));
  clonesAfter.forEach(n  => track.appendChild(n));

  const slides = Array.from(track.children);
  let index = cloneCount;

  // Center helper
  function centerSlide(i, animate = true) {
    const s      = slides[i];
    const left   = s.offsetLeft;
    const width  = s.clientWidth;
    const cWidth = carousel.clientWidth;
    const offset = left - (cWidth - width) / 2;

    if (!animate) {
      // Instant reposition without transition
      track.style.transition = 'none';
      track.style.transform = `translateX(${-offset}px) translateZ(0)`;
      void track.offsetWidth;       // force layout reflow
      track.style.transition = '';  // restore transition
    } else {
      // Smooth animated reposition
      track.offsetHeight; // force layout reflow for GPU
      track.style.transform = `translateX(${-offset}px) translateZ(0)`;
    }
  }

  // Initial position
  centerSlide(index, false);

  // Build dots _inside_ the carousel
  const dotContainer = carousel.querySelector('.indicators');
  const dots = [];
  dotContainer.innerHTML = '';

  function updateDots() {
    const realIndex = ((index - cloneCount) % realCount + realCount) % realCount;
    dots.forEach((dot,i) => dot.classList.toggle('active', i === realIndex));
  }

  for (let i = 0; i < realCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      moveTo(cloneCount + i);
    });
    dotContainer.append(dot);
    dots.push(dot);
  }

  // Core looping nav
  function moveTo(newIndex) {
    index = newIndex;
    if (index < cloneCount)               index += realCount;
    if (index >= cloneCount + realCount)  index -= realCount;
    centerSlide(index);
    updateDots();
  }

  // Drag/swipe support
  let startX = 0, dragging = false;

  carousel.addEventListener('pointerdown', e => {
    if (e.target.closest('.indicators')) return; // ignore dot clicks
    dragging = true;
    startX = e.clientX;
    track.style.transition = 'none';
    carousel.setPointerCapture(e.pointerId);
  });

  carousel.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx   = e.clientX - startX;
    const base = -(slides[index].offsetLeft - (carousel.clientWidth - slides[index].clientWidth) / 2);
    track.style.transform = `translateX(${base + dx}px) translateZ(0)`;
  });

  carousel.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    carousel.releasePointerCapture(e.pointerId);
    const dx = e.clientX - startX;
    if (Math.abs(dx) > slides[index].clientWidth / 4) {
      moveTo(index + (dx < 0 ? 1 : -1));
    } else {
      centerSlide(index);
    }
  });

  // Auto-scroll
  let autoTimer;
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => moveTo(index + 1), 3000);
  }
  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', startAuto);
  startAuto();

  // Debounced recenter on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => centerSlide(index, false), 150);
  });
});
