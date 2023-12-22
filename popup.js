document.getElementById('changeColor').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'document.body.style.backgroundColor = document.body.style.backgroundColor === "black" ? "" : "black"; document.body.style.color = document.body.style.color === "white" ? "" : "white";'}
        );
    });
});
