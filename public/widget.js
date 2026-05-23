(function () {
  var scriptEl = document.currentScript || document.querySelector('script[src*="widget.js"]');
  var BASE = "https://e-cabin.vercel.app";
  if (scriptEl && scriptEl.src) {
    try { BASE = new URL(scriptEl.src).origin; } catch (e) {}
  }

  var panelEl = null;
  var overlayEl = null;

  function closePanel() {
    if (panelEl) { panelEl.remove(); panelEl = null; }
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
    document.body.style.overflow = "";
  }

  function openPanel(garmentId) {
    if (panelEl) { closePanel(); return; }

    document.body.style.overflow = "hidden";

    overlayEl = document.createElement("div");
    overlayEl.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:2147483646;backdrop-filter:blur(2px);";
    overlayEl.addEventListener("click", closePanel);
    document.body.appendChild(overlayEl);

    panelEl = document.createElement("div");
    panelEl.style.cssText =
      "position:fixed;top:0;left:0;width:400px;max-width:100vw;height:100vh;" +
      "background:#fff;z-index:2147483647;box-shadow:4px 0 32px rgba(0,0,0,0.18);" +
      "transition:transform 0.3s cubic-bezier(.4,0,.2,1);transform:translateX(-100%);";
    document.body.appendChild(panelEl);

    var closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cssText =
      "position:absolute;top:14px;right:14px;width:32px;height:32px;border:none;background:#f3f4f6;" +
      "border-radius:50%;font-size:20px;line-height:1;cursor:pointer;color:#6b7280;z-index:1;" +
      "display:flex;align-items:center;justify-content:center;";
    closeBtn.addEventListener("click", closePanel);
    panelEl.appendChild(closeBtn);

    var iframe = document.createElement("iframe");
    iframe.src = BASE + "/embed?g=" + encodeURIComponent(garmentId);
    iframe.style.cssText = "width:100%;height:100%;border:none;display:block;";
    iframe.allow = "camera";
    panelEl.appendChild(iframe);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        panelEl.style.transform = "translateX(0)";
      });
    });
  }

  function removeExisting() {
    var existing = document.querySelectorAll('[data-ecabin-btn], a[href*="e-cabin"], a[href*="ecabin"]');
    for (var i = 0; i < existing.length; i++) existing[i].remove();
  }

  function insertButton(garmentId) {
    removeExisting();
    var btn = document.createElement("button");
    btn.setAttribute("data-ecabin-btn", "1");
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M8 2l-4 4 3 1v13a1 1 0 001 1h8a1 1 0 001-1V7l3-1-4-4"/><path d="M8 2c0 2 1.5 3 4 3s4-1 4-3"/></svg> e-cabin ile dene';
    btn.style.cssText =
      "display:inline-flex;align-items:center;gap:8px;padding:10px 20px;" +
      "background:linear-gradient(135deg,#9F7AEA,#805AD5);color:#fff;" +
      "border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;" +
      "font-family:system-ui,-apple-system,sans-serif;cursor:pointer;" +
      "transition:opacity 0.15s;border:none;margin-top:12px;width:100%;justify-content:center;";
    btn.addEventListener("mouseover", function () { btn.style.opacity = "0.85"; });
    btn.addEventListener("mouseout", function () { btn.style.opacity = "1"; });
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openPanel(garmentId);
    });

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
    var script = document.querySelector('script[data-ecabin-garment]');
    var manualGarmentId = script && script.getAttribute("data-ecabin-garment");
    if (manualGarmentId) {
      insertButton(manualGarmentId);
      return;
    }

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
        insertButton(data.garment.id);
      })
      .catch(function () {});
  }

  run();
  document.addEventListener("page:transition:end", run);
  document.addEventListener("shopify:section:load", run);
})();
