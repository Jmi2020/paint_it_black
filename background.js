let tabStates = {}; // Object to hold state for each tab

chrome.browserAction.onClicked.addListener((tab) => {
    // Toggle state for the current tab
    let isExtensionActive = tabStates[tab.id] && tabStates[tab.id].isExtensionActive;
    tabStates[tab.id] = { isExtensionActive: !isExtensionActive, chosenColor: '#D3D3D3' };

    // Send message to the content script of the current tab
    chrome.tabs.sendMessage(tab.id, {
        action: isExtensionActive ? "revertChanges" : "applyChanges",
        color: tabStates[tab.id].chosenColor
    });
});

// Listen for tab removal to clean up state
chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabStates[tabId];
});
