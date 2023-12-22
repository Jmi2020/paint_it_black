// Function to check if the color is white or a very light shade.
function isWhite(color) {
    const rgb = color.match(/\d+/g).map(Number);
    return rgb && rgb.length === 3 && rgb.every(c => c > 200);
  }
  
  // Function to overlay a semi-transparent gray div on canvas elements.
  function overlayCanvasElements() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      if (!canvas.nextElementSibling || !canvas.nextElementSibling.classList.contains('canvas-overlay')) {
        const overlay = document.createElement('div');
        overlay.classList.add('canvas-overlay');
        overlay.style.position = 'absolute';
        overlay.style.left = canvas.offsetLeft + 'px';
        overlay.style.top = canvas.offsetTop + 'px';
        overlay.style.width = canvas.offsetWidth + 'px';
        overlay.style.height = canvas.offsetHeight + 'px';
        overlay.style.backgroundColor = 'rgba(211, 211, 211, 0.5)';
        overlay.style.pointerEvents = 'none';
        canvas.parentNode.insertBefore(overlay, canvas.nextSibling);
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
  
  // Function to revert the background color of elements.
  function revertBackgrounds() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.backgroundColor = '';
      el.style.color = '';
    });
  }
  
  // Variable to track the state of the extension.
  let isExtensionActive = false;
  
  // Listen for messages from the background script.
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleBackground") {
      isExtensionActive = !isExtensionActive;
      if (isExtensionActive) {
        document.body.style.backgroundColor = 'lightgray';
        document.body.style.color = 'black';
        overlayCanvasElements();
        changeWhiteBackgrounds();
      } else {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        removeCanvasOverlays();
        revertBackgrounds();
      }
    }
  });
  