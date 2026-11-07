/* Atta e rabi Malik | Site scripts
   Libraries: Bootstrap (navbar, accordion), AOS (scroll reveal), Swiper (project slider). */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year on every page */
  const year = new Date().getFullYear();
  document.querySelectorAll(".js-year").forEach((el) => (el.textContent = year));

  /* Header background once the page is scrolled */
  const header = document.getElementById("site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Close the mobile menu after choosing a link */
  const menu = document.getElementById("siteNav");
  document.querySelectorAll("#site-nav .nav-link, #nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      if (menu && menu.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* AOS scroll reveal */
  if (window.AOS && !reduceMotion) {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 80 });
  }

  /* Swiper: selected work */
  if (window.Swiper && document.getElementById("work-swiper")) {
    new Swiper("#work-swiper", {
      slidesPerView: 1.1,
      spaceBetween: 16,
      slidesOffsetBefore: 24,
      slidesOffsetAfter: 24,
      grabCursor: true,
      speed: reduceMotion ? 0 : 650,
      a11y: { enabled: true },
      pagination: { el: "#work-swiper .swiper-pagination", clickable: true },
      navigation: { nextEl: "#work-next", prevEl: "#work-prev" },
      breakpoints: {
        640: { slidesPerView: 1.6, spaceBetween: 20, slidesOffsetBefore: 32, slidesOffsetAfter: 32 },
        992: { slidesPerView: 2.2, spaceBetween: 24, slidesOffsetBefore: 40, slidesOffsetAfter: 40 },
        1280: { slidesPerView: 3, spaceBetween: 24, slidesOffsetBefore: 48, slidesOffsetAfter: 48 },
      },
    });
  }

  /* Cursor spotlight on cards (CSS draws the glow from --mx and --my) */
  if (!window.matchMedia("(hover: none)").matches) {
    document.querySelectorAll("#services .card, #work-swiper .project, #stack-grid .stack-item, #cta-band .cta-inner").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* Case study screenshots: drop any image whose file is missing, and the whole gallery if none are left */
  document.querySelectorAll(".case-gallery img").forEach((img) => {
    const drop = () => {
      const gallery = img.closest(".case-gallery");
      img.closest("figure")?.remove();
      if (gallery && !gallery.querySelector("figure")) gallery.remove();
    };
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener("error", drop, { once: true });
  });

  /* Contact form: validate with Bootstrap styles, then open a prefilled email */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      if (status) { status.textContent = "Please fill in the highlighted fields."; status.className = "small mb-0 text-danger"; }
      return;
    }
    const get = (name) => (form.elements[name].value || "").trim();
    const name = get("name");
    const subject = `Project enquiry: ${get("type")} (${name})`;
    const body = [
      get("message"), "", "---",
      `Name: ${name}`,
      `Email: ${get("email")}`,
      get("company") && `Company or website: ${get("company")}`,
      `Project type: ${get("type")}`,
      `Budget: ${get("budget")}`,
      get("timeline") && `Timeline: ${get("timeline")}`,
      get("source") && `Found me via: ${get("source")}`,
    ].filter(Boolean).join("\n");

    window.location.href =
      `mailto:amalik8989@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) { status.textContent = "Opening your email app. If nothing happens, email amalik8989@gmail.com directly."; status.className = "small mb-0 text-success"; }
  });
})();
