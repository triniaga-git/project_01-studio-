(function () {
  "use strict";

  var currentScript = document.currentScript;
  if (!currentScript) return;

  var productId = currentScript.getAttribute("data-product");
  var lang = currentScript.getAttribute("data-lang") || "id";
  var width = currentScript.getAttribute("data-width") || "100%";
  var height = currentScript.getAttribute("data-height") || "480px";
  var containerSelector = currentScript.getAttribute("data-container");

  if (!productId) {
    console.error("[product-customizer-studio] data-product wajib diisi.");
    return;
  }

  var studioOrigin = currentScript.src
    ? new URL(currentScript.src).origin
    : window.location.origin;

  var iframe = document.createElement("iframe");
  iframe.src =
    studioOrigin +
    "/embed?product=" +
    encodeURIComponent(productId) +
    "&lang=" +
    encodeURIComponent(lang);
  iframe.style.width = width;
  iframe.style.height = height;
  iframe.style.border = "0";
  iframe.setAttribute("title", "Product Customizer Studio");
  iframe.setAttribute("allow", "clipboard-write");

  var container = containerSelector ? document.querySelector(containerSelector) : null;
  if (container) {
    container.appendChild(iframe);
  } else {
    currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);
  }

  // Teruskan event studio sebagai CustomEvent di window, supaya host bisa
  // dengarkan tanpa perlu tahu detail postMessage/origin sendiri.
  window.addEventListener("message", function (event) {
    if (event.source !== iframe.contentWindow) return;
    if (event.origin !== studioOrigin) return;
    var data = event.data;
    if (!data || typeof data.type !== "string") return;

    window.dispatchEvent(
      new CustomEvent("product-customizer-studio:" + data.type, {
        detail: data.payload,
      }),
    );
  });

  // API kecil untuk host mengirim command ke studio.
  window.ProductCustomizerStudio = window.ProductCustomizerStudio || {};
  window.ProductCustomizerStudio[productId] = {
    setProduct: function (id) {
      iframe.contentWindow.postMessage({ type: "set-product", payload: { productId: id } }, studioOrigin);
    },
    getPreview: function () {
      iframe.contentWindow.postMessage({ type: "get-preview", payload: {} }, studioOrigin);
    },
    resetDesign: function () {
      iframe.contentWindow.postMessage({ type: "reset-design", payload: {} }, studioOrigin);
    },
  };
})();
