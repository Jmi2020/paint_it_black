// This function will check if the color is white or a very light shade that appears white.
function isWhite(color) {
    // Convert hex color to RGB and then check if it's white or a very light shade of gray.
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
  
    const rgb = hexToRgb(color);
    // Threshold can be adjusted to target shades of white more accurately.
    const whiteThreshold = 200; // RGB values close to 255 are also considered white.
    if (rgb && rgb.r > whiteThreshold && rgb.g > whiteThreshold && rgb.b > whiteThreshold) {
      return true;
    }
    return false;
  }
  
  // This function will change all the white or near-white backgrounds to light gray.
  function changeWhiteBackgroundsToGray() {
    // Get all elements on the page.
    const allElements = document.querySelectorAll('*');
  
    // Iterate over all elements and change the background color if it is white.
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      // Check both backgroundColor and backgroundColor (for inline styles).
      if (isWhite(style.backgroundColor) || isWhite(el.style.backgroundColor)) {
        el.style.backgroundColor = 'lightgray';
        el.style.color = 'black'; // Set text color to black to ensure readability.
      }
    });
  }
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleBackground") {
      // Execute color change on document body
      if(document.body.style.backgroundColor === 'lightgray') {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      } else {
        document.body.style.backgroundColor = 'lightgray';
        document.body.style.color = 'black';
        changeWhiteBackgroundsToGray();
      }
    }
  });
  