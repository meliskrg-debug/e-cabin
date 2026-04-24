(function () {
  var script = document.currentScript;
  var garmentId = script && script.getAttribute("data-ecabin-garment");
  if (!garmentId) return;

  var BASE = "https://e-cabin.app";
  // If running locally (for dev/testing), detect origin
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    BASE = window.location.origin;
  }

  var btn = document.createElement("a");
  btn.href = BASE + "/tryon?g=" + garmentId;
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M8 2l-4 4 3 1v13a1 1 0 001 1h8a1 1 0 001-1V7l3-1-4-4"/><path d="M8 2c0 2 1.5 3 4 3s4-1 4-3"/></svg> e-cabin ile dene';
  btn.style.cssText =
    "display:inline-flex;align-items:center;gap:8px;padding:10px 20px;" +
    "background:linear-gradient(135deg,#9F7AEA,#805AD5);color:#fff;" +
    "border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;" +
    "font-family:system-ui,-apple-system,sans-serif;cursor:pointer;" +
    "transition:opacity 0.15s;border:none;";

  btn.addEventListener("mouseover", function () {
    btn.style.opacity = "0.85";
  });
  btn.addEventListener("mouseout", function () {
    btn.style.opacity = "1";
  });

  script.parentNode.insertBefore(btn, script);
})();
