document.addEventListener("DOMContentLoaded", function () {
    let speedDisplay = document.getElementById("speedDisplay");

    function updateSpeedDisplay(speed) {
        speedDisplay.innerText = `Speed: ${speed.toFixed(2)}x`;
    }

    function changeSpeed(action) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: function (action) {
                    let video = document.querySelector('video');
                    if (!video) return;

                    if (action === "increase") video.playbackRate += 0.25;
                    if (action === "decrease") video.playbackRate -= 0.25;
                    if (action === "reset") video.playbackRate = 1;

                    return video.playbackRate;
                },
                args: [action]
            }, (results) => {
                if (results && results.length > 0) {
                    updateSpeedDisplay(results[0].result); // Update UI immediately
                }
            });
        });
    }

    document.getElementById("increase").addEventListener("click", () => changeSpeed("increase"));
    document.getElementById("decrease").addEventListener("click", () => changeSpeed("decrease"));
    document.getElementById("reset").addEventListener("click", () => changeSpeed("reset"));

    // Get current speed when popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: function () {
                return document.querySelector('video')?.playbackRate || 1;
            }
        }, (results) => {
            if (results && results.length > 0) {
                updateSpeedDisplay(results[0].result);
            }
        });
    });
});
