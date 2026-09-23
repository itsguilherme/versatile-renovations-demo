(function () {
  function initMobileNav() {
    var hamburger = document.getElementById("hamburger-btn");
    var nav = document.getElementById("main-nav");
    var overlay = document.getElementById("nav-overlay");
    var closeBtn = document.getElementById("nav-close");
    if (!hamburger || !nav || !overlay) return;

    function openNav() {
      nav.classList.add("is-open");
      overlay.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-locked");
    }
    function closeNav() {
      nav.classList.remove("is-open");
      overlay.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-locked");
    }
    hamburger.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      if (isOpen) { closeNav(); } else { openNav(); }
    });
    overlay.addEventListener("click", closeNav);
    if (closeBtn) closeBtn.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    nav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();

    var contactForm = document.getElementById("contact-form");
    var formConfirmation = document.getElementById("form-confirmation");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        contactForm.hidden = true;
        if (formConfirmation) formConfirmation.hidden = false;
      });
    }

    var backToTop = document.getElementById("back-to-top");
    if (backToTop) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 500) {
          backToTop.classList.add("is-visible");
        } else {
          backToTop.classList.remove("is-visible");
        }
      }, { passive: true });
      backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealEls = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  });
})();
