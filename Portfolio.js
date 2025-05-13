// Portfolio.js
// Infinite, 3-item looping carousel with centered active card, dynamic indicators, and auto-scroll

window.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.project .carousel');
  const track    = carousel.querySelector('.track');
  const realSlides = Array.from(track.children);
  const realCount = realSlides.length;

  if (!carousel || !track || realCount === 0) return;

  const cloneCount = 3;
  // 1) Clone slides for infinite loop
  const clonesBefore = realSlides.slice(-cloneCount).map(slide => slide.cloneNode(true));
  const clonesAfter  = realSlides.slice(0, cloneCount).map(slide => slide.cloneNode(true));
  clonesBefore.forEach(node => track.insertBefore(node, track.firstChild));
  clonesAfter.forEach(node  => track.appendChild(node));

  // Rebuild full slide list
  const slides = Array.from(track.children);
  let index = cloneCount; // start at first real slide

  // Center slide helper
  function centerSlide(i, animate = true) {
    const slide = slides[i];
    const slideLeft = slide.offsetLeft;
    const slideWidth = slide.clientWidth;
    const containerWidth = carousel.clientWidth;
    const offset = slideLeft - (containerWidth - slideWidth) / 2;
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translateX(${-offset}px)`;
    if (!animate) {
      void track.offsetWidth;
      track.style.transition = '';
    }
  }

  // Initial position
  centerSlide(index, false);

  // 2) Indicators
  const indicatorContainer = document.querySelector('.project .indicators');
  const dots = [];
  indicatorContainer.innerHTML = '';

  function updateDots() {
    const realIndex = ((index - cloneCount) % realCount + realCount) % realCount;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === realIndex));
  }

  for (let i = 0; i < realCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      index = cloneCount + i;
      centerSlide(index);
      updateDots();
    });
    indicatorContainer.append(dot);
    dots.push(dot);
  }

  // 3) Navigation & looping
  function moveTo(newIndex) {
    index = newIndex;
    if (index < cloneCount) index += realCount;
    if (index >= cloneCount + realCount) index -= realCount;
    centerSlide(index);
    updateDots();
  }

  // 4) Drag/Swipe support
  let startX = 0, isDragging = false;
  carousel.addEventListener('pointerdown', e => {
    isDragging = true;
    startX = e.clientX;
    track.style.transition = 'none';
    carousel.setPointerCapture(e.pointerId);
  });
  carousel.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const currentOffset = -(slides[index].offsetLeft - (carousel.clientWidth - slides[index].clientWidth) / 2);
    track.style.transform = `translateX(${currentOffset + dx}px)`;
  });
  carousel.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;
    carousel.releasePointerCapture(e.pointerId);
    const dx = e.clientX - startX;
    if (Math.abs(dx) > slides[index].clientWidth / 4) {
      moveTo(index + (dx < 0 ? 1 : -1));
    } else {
      centerSlide(index);
    }
  });

  // 5) Auto-scroll
  let autoTimer;
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => moveTo(index + 1), 3000);
  }
  function stopAuto() {
    clearInterval(autoTimer);
  }
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  startAuto();

  // 6) Recenter on resize
  window.addEventListener('resize', () => centerSlide(index, false));
});
