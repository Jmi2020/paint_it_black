let tabStates = {}; // State tracking for each tab

chrome.action.onClicked.addListener((tab) => {
    toggleTabState(tab.id); // Toggle state for this tab
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleExtension") {
        toggleTabState(sender.tab.id); // Toggle for this tab
        sendResponse({ isExtensionActive: tabStates[sender.tab.id] && tabStates[sender.tab.id].isExtensionActive });
        return true; // Indicates response will be sent asynchronously
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabStates[tabId];
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "complete" && tabStates[tabId] && tabStates[tabId].isExtensionActive) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: applyExtensionChanges,
            args: [tabStates[tabId].chosenColor]
        });
    }
});

function toggleTabState(tabId) {
    let isExtensionActive = tabStates[tabId] && tabStates[tabId].isExtensionActive;
    tabStates[tabId] = { isExtensionActive: !isExtensionActive, chosenColor: '#D3D3D3' };

    if (tabStates[tabId].isExtensionActive) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: applyExtensionChanges,
            args: [tabStates[tabId].chosenColor]
        });
    } else {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: revertExtensionChanges,
        });
    }
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

function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}
