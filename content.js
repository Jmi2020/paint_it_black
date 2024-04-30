// Function to check if the color is white or a very light shade.
function isWhite(color) {
  const rgb = color.match(/\d+/g).map(Number);
  return rgb && rgb.length === 3 && rgb.every(c => c > 200);
}

// Function to overlay a semi-transparent gray div on canvas elements.
function overlayCanvasElements() {
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach(canvas => {
      if (!canvas.nextElementSibling || canvas.nextElementSibling.classList.contains('canvas-overlay')) {
          const overlay = document.createElement('div');
          overlay.classList.add('canvas-overlay');
          overlay.style.position = 'absolute';
          overlay.style.left = canvas.offsetLeft + 'px';
          overlay.style.top = canvas.offsetTop + 'px';
          overlay.style.width = canvas.offsetWidth + 'px';
          overlay.style.height = canvas.offsetHeight + 'px';
          overlay.style.backgroundColor = 'rgba(211, 211, 211, 0.5)';
          overlay.style.pointerEvents = 'none';
          canvas.parentNode.insertBefore(overlay, canvas.nextElementSibling);
      }
  });
}

// Function to remove overlays from canvas elements.
function removeCanvasOverlays() {
  document.querySelectorAll('.canvas-overlay').forEach(overlay => overlay.remove());
}

// Function to change the background of white or near-white elements.
function changeWhiteBackgrounds() {
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
      if (isWhite(window.getComputedStyle(el).backgroundColor)) {
          el.style.backgroundColor = 'lightgray';
          el.style.color = 'black';
      }
  });
}

// Listener for messages from the background script.
chrome.runtime.onMessage.addListener(function(request) {
    if (request.action == "applyChanges") {
        applyExtensionChanges(request.color);
    } else if (request.action == "revertChanges") {
        revertExtensionChanges();
    }

  function applyExtensionChanges(color) {
    document.body.style.backgroundColor = color || 'lightgray';
    document.body.style.color = getContrastYIQ(color);
    overlayCanvasElements();
    changeWhiteBackgrounds();
  }

function revertExtensionChanges() {
  document.body.style.backgroundColor = '';
  document.body.style.color = '';
  removeCanvasOverlays();
  revertBackgrounds();
}

// MutationObserver to handle dynamic content loading.
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
          overlayCanvasElements();
          changeWhiteBackgrounds();
      }
  });
});
})

// Observe dynamic content when script loaded.
observer.observe(document.body, { childList: true, subtree: true });
