document.getElementById('applyColor').addEventListener('click', function() {
    const color = document.getElementById('colorPicker').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "changeColor", color: color });
    });
});
