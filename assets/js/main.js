/* =========================================================
   Atta e rabi Malik | Site scripts
   Vanilla JS. Vendor libraries load before this file.
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, scope = document) => scope.querySelector(sel);

  /* ---------- Footer year (every page) ---------- */
  const year = new Date().getFullYear();
  document.querySelectorAll(".js-year").forEach((el) => (el.textContent = year));

  /* ---------- Header state on scroll ---------- */
  const header = $(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Same-page anchors: smooth scroll, focus the target ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* Close the mobile menu after choosing a link */
  const navCollapse = document.getElementById("siteNav");
  document.querySelectorAll("#siteNav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse && navCollapse.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  /* ---------- AOS scroll reveal ---------- */
  if (window.AOS && !reduceMotion) {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: false, offset: 80 });
  }

  /* ---------- Swiper: selected work (home page) ---------- */
  if (window.Swiper && document.querySelector(".work-swiper")) {
    new Swiper(".work-swiper", {
      slidesPerView: 1.1,
      spaceBetween: 20,
      grabCursor: true,
      loop: true,
      speed: reduceMotion ? 0 : 650,
      a11y: { enabled: true },
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: "#work-next", prevEl: "#work-prev" },
      breakpoints: {
        640: { slidesPerView: 1.6, spaceBetween: 20 },
        992: { slidesPerView: 2.2, spaceBetween: 24 },
        1280: { slidesPerView: 3, spaceBetween: 24 },
      },
    });
  }

  /* ---------- Contact form: builds a prefilled email, no backend needed ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");

  function setStatus(text, cls) {
    if (!status) return;
    status.textContent = text;
    status.classList.remove("is-error", "is-ok");
    if (cls) status.classList.add(cls);
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus("Please fill in the highlighted fields.", "is-error");
        return;
      }

      const data = new FormData(form);
      const get = (key) => (data.get(key) || "").toString().trim();

      const name = get("name");
      const email = get("email");
      const subject = `Project enquiry: ${get("type")} (${name})`;
      const body = [
        get("message"),
        "",
        "---",
        `Name: ${name}`,
        `Email: ${email}`,
        get("company") && `Company or website: ${get("company")}`,
        `Project type: ${get("type")}`,
        `Budget: ${get("budget")}`,
        get("timeline") && `Timeline: ${get("timeline")}`,
        get("source") && `Found me via: ${get("source")}`,
      ].filter(Boolean).join("\n");

      window.location.href =
        `mailto:amalik8989@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      setStatus("Opening your email app. If nothing happens, email amalik8989@gmail.com directly.", "is-ok");
    });
  }
})();