(function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  function initHeroBg() {
    var slides = document.querySelectorAll(".hero-bg-slide");
    if (slides.length < 2 || prefersReducedMotion) return;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove("is-active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("is-active");
    }, 5000);
  }

  function initReviewCarousel() {
    var track = document.getElementById("review-track");
    var dotsWrap = document.getElementById("review-dots");
    var prevBtn = document.getElementById("review-prev");
    var nextBtn = document.getElementById("review-next");
    var carousel = document.getElementById("review-carousel");
    if (!track || !dotsWrap) return;
    var slides = Array.prototype.slice.call(track.querySelectorAll(".review-slide"));
    if (slides.length === 0) return;
    var current = 0;
    var timer = null;

    slides.forEach(function (slide, i) {
      var dot = document.createElement("button");
      dot.className = "review-dot";
      dot.setAttribute("aria-label", "Show review " + (i + 1));
      dot.addEventListener("click", function () { show(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".review-dot"));

    function show(index) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    }
    function next() { show(current + 1); }
    function prev() { show(current - 1); }
    function startTimer() {
      if (prefersReducedMotion) return;
      timer = setInterval(next, 6000);
    }
    function resetTimer() {
      if (timer) clearInterval(timer);
      startTimer();
    }

    show(0);
    startTimer();

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); resetTimer(); });
    if (carousel) {
      carousel.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
      carousel.addEventListener("mouseleave", startTimer);
      carousel.addEventListener("focusin", function () { if (timer) clearInterval(timer); });
      carousel.addEventListener("focusout", startTimer);
    }
  }

  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    var imgEl = document.getElementById("lightbox-img");
    var captionEl = document.getElementById("lightbox-caption");
    var closeBtn = document.getElementById("lightbox-close");
    var prevBtn = document.getElementById("lightbox-prev");
    var nextBtn = document.getElementById("lightbox-next");
    var tiles = Array.prototype.slice.call(document.querySelectorAll(".photo-tile"));
    if (tiles.length === 0) return;
    var currentIndex = 0;

    function show(index) {
      currentIndex = (index + tiles.length) % tiles.length;
      var tile = tiles[currentIndex];
      var img = tile.querySelector("img");
      imgEl.src = img.currentSrc || img.src;
      imgEl.alt = img.alt || "";
      captionEl.textContent = tile.getAttribute("data-caption") || "";
    }
    function open(index) {
      show(index);
      lightbox.hidden = false;
      requestAnimationFrame(function () { lightbox.classList.add("is-open"); });
      document.body.classList.add("nav-locked");
    }
    function close() {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("nav-locked");
      setTimeout(function () { lightbox.hidden = true; }, 240);
    }
    tiles.forEach(function (tile, i) {
      tile.addEventListener("click", function () { open(i); });
    });
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    prevBtn.addEventListener("click", function () { show(currentIndex - 1); });
    nextBtn.addEventListener("click", function () { show(currentIndex + 1); });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(currentIndex - 1);
      if (e.key === "ArrowRight") show(currentIndex + 1);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initHeaderScroll();
    initHeroBg();
    initReviewCarousel();
    initLightbox();

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
