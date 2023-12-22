// This event is fired with the user clicks the browser action icon in the toolbar.
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the content script to toggle the background color
    chrome.tabs.sendMessage(tab.id, {action: "toggleBackground"});
  });
  