// Design.js

// IntersectionObserver for smooth animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    } else {
      entry.target.classList.remove('fade-in');
    }
  });
}, {
  threshold: 0.15
});

// Select sections excluding footer
const sections = document.querySelectorAll('.home, .project, .skills, .fiverr, .contact');

sections.forEach(section => {
  section.classList.add('hidden');
  observer.observe(section);
});
