(function () {
  var scriptEl = document.currentScript || document.querySelector('script[src*="widget.js"]');
  var BASE = "https://e-cabin.vercel.app";
  if (scriptEl && scriptEl.src) {
    try { BASE = new URL(scriptEl.src).origin; } catch (e) {}
  }

  function removeExisting() {
    var existing = document.querySelectorAll('[data-ecabin-btn]');
    for (var i = 0; i < existing.length; i++) existing[i].remove();
  }

  function insertButton(garmentId, garmentName) {
    removeExisting();
    var btn = document.createElement("a");
    btn.href = BASE + "/tryon?g=" + garmentId;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.setAttribute("data-ecabin-btn", "1");
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M8 2l-4 4 3 1v13a1 1 0 001 1h8a1 1 0 001-1V7l3-1-4-4"/><path d="M8 2c0 2 1.5 3 4 3s4-1 4-3"/></svg> e-cabin ile dene';
    btn.style.cssText =
      "display:inline-flex;align-items:center;gap:8px;padding:10px 20px;" +
      "background:linear-gradient(135deg,#9F7AEA,#805AD5);color:#fff;" +
      "border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;" +
      "font-family:system-ui,-apple-system,sans-serif;cursor:pointer;" +
      "transition:opacity 0.15s;border:none;margin-top:12px;";
    btn.addEventListener("mouseover", function () { btn.style.opacity = "0.85"; });
    btn.addEventListener("mouseout", function () { btn.style.opacity = "1"; });

    var addToCart = document.querySelector('[name="add"], .product-form__submit, [data-testid="Checkout-button"], .btn-addtocart');
    if (addToCart && addToCart.parentNode) {
      addToCart.parentNode.insertBefore(btn, addToCart.nextSibling);
    } else {
      var script = document.querySelector('script[data-ecabin-shop]');
      if (script && script.parentNode) {
        script.parentNode.insertBefore(btn, script);
      }
    }
  }

  function run() {
    // Mod 1: Manuel garment ID (data-ecabin-garment attribute)
    var script = document.querySelector('script[data-ecabin-garment]');
    var manualGarmentId = script && script.getAttribute("data-ecabin-garment");
    if (manualGarmentId) {
      insertButton(manualGarmentId, "");
      return;
    }

    // Mod 2: Otomatik Shopify ürün tespiti (data-ecabin-shop attribute)
    var shopScript = document.querySelector('script[data-ecabin-shop]');
    var shopDomain = shopScript && shopScript.getAttribute("data-ecabin-shop");
    if (!shopDomain) return;

    var pathParts = window.location.pathname.split("/products/");
    if (pathParts.length < 2) { removeExisting(); return; }
    var rawHandle = pathParts[1].split("?")[0].split("/")[0];
    if (!rawHandle) { removeExisting(); return; }
    var handle;
    try { handle = decodeURIComponent(rawHandle); } catch (e) { handle = rawHandle; }

    fetch(BASE + "/api/public/garment/by-handle?domain=" + encodeURIComponent(shopDomain) + "&handle=" + encodeURIComponent(handle))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.garment) { removeExisting(); return; }
        insertButton(data.garment.id, data.garment.name);
      })
      .catch(function () {});
  }

  run();

  // Shopify View Transitions: re-run on client-side navigation
  document.addEventListener("page:transition:end", run);
  document.addEventListener("shopify:section:load", run);
})();
