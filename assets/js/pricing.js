/* Atta e rabi Malik | Pricing and currency
   One price list in USD. Every price on the site is converted to the visitor's
   currency. Edit RATES (1 USD = x local) and the PRICING list, then publish.
   Rates are approximate estimates: check current rates before you publish. */
(() => {
  "use strict";

  const KEY = "pricing-currency";

  const CURRENCIES = {
    USD: { label: "US Dollar", country: "United States", rate: 1 },
    PKR: { label: "Pakistani Rupee", country: "Pakistan", rate: 280 },
    GBP: { label: "British Pound", country: "United Kingdom", rate: 0.79 },
    EUR: { label: "Euro", country: "Europe (euro area)", rate: 0.92 },
    AED: { label: "UAE Dirham", country: "UAE", rate: 3.6725 },
    SAR: { label: "Saudi Riyal", country: "Saudi Arabia", rate: 3.75 },
    QAR: { label: "Qatari Riyal", country: "Qatar", rate: 3.64 },
    KWD: { label: "Kuwaiti Dinar", country: "Kuwait", rate: 0.31 },
    OMR: { label: "Omani Rial", country: "Oman", rate: 0.385 },
    BHD: { label: "Bahraini Dinar", country: "Bahrain", rate: 0.377 },
    EGP: { label: "Egyptian Pound", country: "Egypt", rate: 50 },
  };

  const COUNTRY_CURRENCY = {
    US: "USD", PK: "PKR", GB: "GBP", AE: "AED", SA: "SAR",
    QA: "QAR", KW: "KWD", OM: "OMR", BH: "BHD", EG: "EGP",
  };
  const EURO_COUNTRIES = ["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"];
  const TZ_COUNTRY = {
    "Asia/Karachi": "PK", "Europe/London": "GB", "Asia/Dubai": "AE", "Asia/Riyadh": "SA",
    "Asia/Qatar": "QA", "Asia/Kuwait": "KW", "Asia/Muscat": "OM", "Asia/Bahrain": "BH",
    "Africa/Cairo": "EG", "Europe/Paris": "FR", "Europe/Berlin": "DE", "Europe/Madrid": "ES",
    "Europe/Rome": "IT", "Europe/Amsterdam": "NL", "Europe/Brussels": "BE", "Europe/Vienna": "AT",
    "Europe/Dublin": "IE", "Europe/Lisbon": "PT", "Europe/Athens": "GR", "Europe/Helsinki": "FI",
  };

  /* ---- The price list (USD). Edit here; the site renders from this. ---- */
  const PRICING = {
    websites: [
      { name: "Landing page", price: 120, desc: "One focused page built for one action: a call, a quote or a sign-up.",
        items: ["Mobile-first layout", "Contact or booking form", "Basic on-page SEO"] },
      { name: "Starter website", price: 170, desc: "A simple, fast WordPress site to get your business online.",
        items: ["Up to 5 pages", "Copy included", "Basic SEO setup"], featured: true },
      { name: "Business website", price: 450, desc: "A custom layout for a business that needs more pages and forms.",
        items: ["Up to 10 pages", "Custom layout and forms", "Speed optimisation"] },
      { name: "E-commerce store", price: 750, desc: "A WooCommerce store with products, checkout and payments set up.",
        items: ["Up to 30 products", "Payment gateway setup", "Product SEO basics"] },
    ],
    custom: [
      { name: "Custom front end or app UI", price: 600, from: true, desc: "Responsive interfaces in HTML, CSS, JavaScript or React." },
      { name: "Node.js API or admin panel", price: 800, from: true, desc: "REST APIs, dashboards and backend pipelines with Express." },
      { name: "Data and media integrations", price: 200, from: true, desc: "Supabase for data and auth, Cloudinary for images, wired into your site." },
      { name: "Speed and SEO audit", price: 150, desc: "A written audit of what is slowing your site or keeping it off search, with a prioritised fix list." },
    ],
    ongoing: [
      { name: "Monthly SEO", price: 300, unit: "/month", desc: "Keyword research, on-page updates, technical checks and a monthly report." },
      { name: "Content writing", price: 60, unit: " per article", desc: "SEO-led articles of about 1,000 words, written for your keywords and audience." },
      { name: "Social media marketing", price: 250, unit: "/month", desc: "12 posts a month with captions, designed to match your site." },
      { name: "Maintenance and support", price: 60, unit: "/month", desc: "Updates, backups, fixes and small changes after launch." },
    ],
    bundles: [
      { id: "launch", name: "Launch", tagline: "Get online and start getting found.",
        setup: 550, monthly: null, saveUsd: 130, saveText: "One-time bundle. You save",
        items: ["Starter website, up to 5 pages", "SEO foundation and speed check", "4 blog articles for your keywords", "12 social posts to kick off"] },
      { id: "growth", name: "Growth", tagline: "A business website with SEO, content and social working together.",
        setup: 450, monthly: 650, saveUsd: 140, saveText: "Saves every month. You save",
        items: ["Business website, up to 10 pages", "Monthly SEO", "4 articles a month", "12 social posts a month"], featured: true },
      { id: "scale", name: "Scale", tagline: "A full online store with ongoing growth across all four services.",
        setup: 750, monthly: 1100, saveUsd: 140, saveText: "Saves every month. You save",
        items: ["E-commerce store, up to 30 products", "Monthly SEO", "8 articles a month", "20 social posts a month", "Maintenance and support"] },
    ],
  };

  /* ---- Currency detection and storage ---- */
  const safeGet = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const safeSet = (v) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };

  const countryToCurrency = (cc) => {
    if (!cc) return null;
    if (COUNTRY_CURRENCY[cc]) return COUNTRY_CURRENCY[cc];
    if (EURO_COUNTRIES.includes(cc)) return "EUR";
    return null;
  };

  function detectCurrency() {
    const saved = safeGet();
    if (saved && CURRENCIES[saved]) return saved;
    let tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { /* ignore */ }
    const fromTz = countryToCurrency(TZ_COUNTRY[tz]);
    if (fromTz) return fromTz;
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (const lang of langs) {
      const m = /-([A-Za-z]{2})\b/.exec(lang || "");
      if (m) {
        const cur = countryToCurrency(m[1].toUpperCase());
        if (cur) return cur;
      }
    }
    return "USD";
  }

  /* ---- Formatting: convert, then round to a clean price ---- */
  function roundNice(v) {
    const step = v >= 10000 ? 1000 : v >= 1000 ? 100 : v >= 100 ? 5 : v >= 10 ? 1 : 0.5;
    return Math.round(v / step) * step;
  }

  function formatPrice(usd, code) {
    const value = roundNice(usd * CURRENCIES[code].rate);
    const digits = Number.isInteger(value) ? 0 : 1;
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: code,
      minimumFractionDigits: digits, maximumFractionDigits: digits,
    }).format(value);
  }

  /* ---- WhatsApp "Buy now" buttons: message carries service name and price ---- */
  const WA_NUMBER = "923342267926";
  const buyBtn = (name, usd, o = {}) =>
    `<a class="btn btn-primary btn-sm buy-btn mt-3" href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener"` +
    ` data-wa-name="${name}" data-wa-usd="${usd}" data-wa-unit="${o.unit || ""}" data-wa-from="${o.from ? 1 : 0}"` +
    `${o.usd2 ? ` data-wa-usd2="${o.usd2}"` : ""} aria-label="Buy ${name} on WhatsApp">Buy now <i class="ti ti-brand-whatsapp" aria-hidden="true"></i></a>`;

  /* ---- Rendering from PRICING ---- */
  const priceEl = (usd, { from = false, unit = "" } = {}) =>
    `<span class="price" data-usd="${usd}" data-usd-prefix="${from ? "From " : ""}" data-usd-suffix="${unit}"></span>`;

  function renderWebsites(el) {
    el.innerHTML = PRICING.websites.map((p) => `
      <div class="col">
        <article class="price-card tilt${p.featured ? " featured" : ""}">
          ${p.featured ? '<span class="badge-pop">Most chosen</span>' : ""}
          <h3 class="h5">${p.name}</h3>
          <p class="price-desc">${p.desc}</p>
          <div class="price-big" data-usd="${p.price}"></div>
          <ul>${p.items.map((i) => `<li>${i}</li>`).join("")}</ul>
          ${buyBtn(p.name, p.price)}
        </article>
      </div>`).join("");
  }

  function renderRows(el, list) {
    el.innerHTML = list.map((p) => `
      <div class="price-list-row">
        <div>
          <div class="price-name">${p.name}</div>
          <p class="price-desc">${p.desc}</p>
        </div>
        <div class="text-end">${priceEl(p.price, { from: p.from, unit: p.unit || "" })}<div>${buyBtn(p.name, p.price, { from: p.from, unit: p.unit || "" })}</div></div>
      </div>`).join("");
  }

  function renderBundles(el) {
    el.innerHTML = PRICING.bundles.map((b) => `
      <div class="col">
        <article class="price-card tilt${b.featured ? " featured" : ""}">
          ${b.featured ? '<span class="badge-pop">Most popular</span>' : ""}
          <h3 class="h4">${b.name}</h3>
          <p class="price-desc">${b.tagline}</p>
          <div class="price-big" data-usd="${b.setup}"></div>
          <p class="price-note mb-0">${b.monthly ? "one-time setup, then" : "one-time, all in"}</p>
          ${b.monthly ? `<div class="price-note mt-1"><span class="price" data-usd="${b.monthly}" data-usd-suffix="/month" style="color:var(--accent);font-weight:600"></span></div>` : ""}
          <p class="price-save" data-usd="${b.saveUsd}" data-usd-prefix="${b.saveText} ">.</p>
          <ul>${b.items.map((i) => `<li>${i}</li>`).join("")}</ul>
          ${buyBtn(b.name + " bundle", b.setup, { usd2: b.monthly, unit: b.monthly ? "/month" : "" })}
        </article>
      </div>`).join("");
  }

  /* ---- Apply a currency to every price on the page ---- */
  function applyCurrency(code) {
    document.querySelectorAll("[data-usd]").forEach((el) => {
      const usd = Number(el.dataset.usd);
      el.textContent = `${el.dataset.usdPrefix || ""}${formatPrice(usd, code)}${el.dataset.usdSuffix || ""}`;
    });
    const sel = document.getElementById("currency-select");
    if (sel) sel.value = code;
    const note = document.getElementById("currency-note");
    if (note) {
      const c = CURRENCIES[code];
      note.textContent = `Showing prices in ${c.label} (${code}). These are estimates converted from USD. The invoice currency is agreed in writing before work starts.`;
    }
    document.querySelectorAll(".buy-btn").forEach((btn) => {
      const d = btn.dataset;
      let price = (d.waFrom === "1" ? "from " : "") + formatPrice(Number(d.waUsd), code);
      if (d.waUsd2) price += ` + ${formatPrice(Number(d.waUsd2), code)}/month`;
      else if (d.waUnit) price += d.waUnit;
      const msg = `Hi Atta, I'm interested in ${d.waName} (${price}). Please share the details and next steps.`;
      btn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    });
    document.documentElement.dataset.currency = code;
  }

  function init() {
    const set = (id, fn) => { const el = document.getElementById(id); if (el) fn(el); };
    set("price-websites", renderWebsites);
    set("price-custom", (el) => renderRows(el, PRICING.custom));
    set("price-ongoing", (el) => renderRows(el, PRICING.ongoing));
    set("price-bundles", renderBundles);
    set("home-bundles", renderBundles);

    const sel = document.getElementById("currency-select");
    if (sel) {
      sel.innerHTML = Object.entries(CURRENCIES)
        .map(([code, c]) => `<option value="${code}">${code} · ${c.country}</option>`).join("");
      sel.addEventListener("change", () => { safeSet(sel.value); applyCurrency(sel.value); });
    }
    applyCurrency(detectCurrency());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
