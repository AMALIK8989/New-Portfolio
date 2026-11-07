/* Atta e rabi Malik | Lead tracking
   Sends GA4 events through gtag (which also feeds the GTM dataLayer):
   - email_click, phone_click, whatsapp_click on every mailto:, tel: and WhatsApp link
   - generate_lead when the contact form is submitted with valid fields
   Personal details (name, email, phone, message) are never sent. */
(() => {
  "use strict";

  const send = (name, params) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, Object.assign({ transport_type: "beacon" }, params));
  };

  const pageName = () => location.pathname.split("/").pop() || "index.html";

  const placeOf = (el) => {
    if (el.closest("#wa-widget")) return "whatsapp_widget";
    if (el.closest("#contact-form")) return "contact_form";
    if (el.closest("header")) return "header";
    if (el.closest("footer")) return "footer";
    if (el.closest("#services")) return "services";
    if (el.closest("#home-pricing, #price-websites, #price-custom, #price-ongoing, #price-bundles")) return "pricing";
    return "page";
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    const base = {
      link_url: a.href,
      link_text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
      page_name: pageName(),
      click_location: placeOf(a),
    };
    if (href.startsWith("mailto:")) {
      send("email_click", base);
    } else if (href.startsWith("tel:")) {
      send("phone_click", base);
    } else if (/wa\.me|api\.whatsapp\.com/.test(href)) {
      const type = a.classList.contains("buy-btn") ? "buy_now"
        : a.id === "wa-widget" ? "floating_widget" : "link";
      send("whatsapp_click", Object.assign(base, {
        button_type: type,
        service_name: a.dataset.waName || "",
        service_price_usd: a.dataset.waUsd || "",
        currency: document.documentElement.dataset.currency || "USD",
      }));
    }
  }, { capture: true });

  /* Lead: valid contact form submission. Runs before main.js handles the submit. */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", () => {
      if (!form.checkValidity()) return;
      send("generate_lead", {
        form_id: "contact-form",
        lead_method: "email_form",
        project_type: form.elements.type ? form.elements.type.value : "",
        budget_range: form.elements.budget ? form.elements.budget.value : "",
        page_name: pageName(),
        currency: document.documentElement.dataset.currency || "USD",
      });
    });
  }
})();
