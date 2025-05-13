// Message.js

window.addEventListener('DOMContentLoaded', () => {
  emailjs.init("qafqUlOnLole15eyh");

  const form = document.getElementById("contact-form");
  const alertContainer = document.getElementById("alert-container");

  // helper to create a toast
  function showAlert(message) {
    const box = document.createElement("div");
    box.className = "alert-box";
    box.textContent = message;
    alertContainer.appendChild(box);

    // remove after animation ends (~4s)
    box.addEventListener("animationend", () => {
      box.remove();
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (document.getElementById("bot-field").value) return; // honeypot

    emailjs
      .sendForm('service_6te2ld9', 'template_m4z5a9s', this)
      .then(() => {
        showAlert("Message sent successfully!");
        form.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        showAlert(" Failed to send message. Please try again.");
      });
  });
});
