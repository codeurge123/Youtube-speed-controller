(function() {
    let video = document.querySelector('video');
    if (!video) {
        console.warn("No video found!");
        return;
    }

    let speed = video.playbackRate;
    let controlsVisible = true;

    function updateSpeedDisplay() {
        speedDisplay.innerText = `Speed: ${video.playbackRate.toFixed(2)}x`;

        // Send speed update to popup
        chrome.runtime.sendMessage({ action: "updateSpeed", speed: video.playbackRate });
    }

    function changeSpeed(value) {
        video.playbackRate += value;
        updateSpeedDisplay();
    }

    function toggleControls() {
        controlsVisible = !controlsVisible;
        controls.style.display = controlsVisible ? "flex" : "none";
    }

    let controls = document.createElement('div');
    controls.style.position = 'fixed';
    controls.style.bottom = '20px';
    controls.style.left = '50%';
    controls.style.transform = 'translateX(-50%)';
    controls.style.background = 'rgba(0,0,0,0.7)';
    controls.style.color = 'white';
    controls.style.padding = '10px 15px';
    controls.style.borderRadius = '10px';
    controls.style.zIndex = '9999';
    controls.style.fontSize = '16px';
    controls.style.display = 'flex';
    controls.style.alignItems = 'center';
    controls.style.gap = '10px';

    let speedDisplay = document.createElement('span');
    speedDisplay.innerText = `Speed: ${video.playbackRate.toFixed(2)}x`;

    let faster = document.createElement('button');
    faster.innerText = "⏩";
    faster.onclick = () => changeSpeed(0.25);

    let slower = document.createElement('button');
    slower.innerText = "⏪";
    slower.onclick = () => changeSpeed(-0.25);

    let reset = document.createElement('button');
    reset.innerText = "🔄";
    reset.onclick = () => {
        video.playbackRate = 1;
        updateSpeedDisplay();
    };

    [faster, slower, reset].forEach(btn => {
        btn.style.margin = '5px';
        btn.style.padding = '5px 10px';
        btn.style.cursor = 'pointer';
        btn.style.background = 'blue';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
    });

    controls.appendChild(slower);
    controls.appendChild(speedDisplay);
    controls.appendChild(faster);
    controls.appendChild(reset);
    document.body.appendChild(controls);

    // Toggle visibility with Ctrl + F9
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'F9') {
            toggleControls();
        }
    });

    // Listen for changes in video speed
    video.addEventListener('ratechange', updateSpeedDisplay);

    console.log("YouTube Speed Controller Loaded");
})();
