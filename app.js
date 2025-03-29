function reloadStream() {
    let player = document.getElementById("radioPlayer");
    let streamUrl = "https://usa14.fastcast4u.com/proxy/flowradio?mp=/1&nocache=" + new Date().getTime();
    
    player.src = streamUrl;
    player.load();
    player.play();
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker Registered"));
}

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve last selected tab from localStorage, default to "Radio"
    const savedTab = localStorage.getItem("selectedTab") || "Radio";
    changeTab(savedTab);
});

//Changing Tab Function
function changeTab(tabName) {
    // Update header title
    document.getElementById("headerTitle").textContent = tabName;

    // Get content sections
    const radioContent = document.getElementById("radioContent");
    const helpContent = document.getElementById("helpContent");
    const subtitle = document.querySelector(".subtitle");

    // Show/Hide content based on tab selection
    if (tabName === "Radio") {
        radioContent.style.display = "block";
        helpContent.style.display = "none";
        subtitle.style.display = "block"; // Show subtitle for Radio tab
    } else if (tabName === "Help") {
        radioContent.style.display = "none";
        helpContent.style.display = "block";
        subtitle.style.display = "none"; // Hide subtitle for Help tab
    }

    // Save selected tab in localStorage
    localStorage.setItem("selectedTab", tabName);
}


//--------------Radio Player Functionalities -------------------
document.addEventListener("DOMContentLoaded", function() {
    const radioPlayer = document.getElementById("radioPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const volumeLowBtn = document.querySelector(".fa-volume-low");
    const volumeHighBtn = document.querySelector(".fa-volume-high");
    const currentTimeDisplay = document.getElementById("currentTimeDisplay");
    const durationDisplay = document.getElementById("durationDisplay");
    const volumeSlider = document.getElementById("volumeSlider");
    const liveProgressBar = document.getElementById("liveProgressBar");
    const refreshBtn = document.getElementById("refreshStreamBtn"); // Refresh button

    const playIcon = "fa-circle-play";
    const pauseIcon = "fa-circle-pause";
    const muteIcon = "fa-volume-xmark";
    const lowVolumeIcon = "fa-volume-low";

    let isPlaying = false;
    
    // Ensure the animation is OFF when the page loads
    liveProgressBar.style.animation = "none";

    // Function to format time in MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return "Live"; // Handle live streams
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    // Function to update volume icon
    function updateVolumeIcon() {
        if (radioPlayer.volume === 0) {
            volumeLowBtn.classList.remove(lowVolumeIcon);
            volumeLowBtn.classList.add(muteIcon);
        } else {
            volumeLowBtn.classList.remove(muteIcon);
            volumeLowBtn.classList.add(lowVolumeIcon);
        }
    }

    // Play/Pause functionality
    playPauseBtn.addEventListener("click", function() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            radioPlayer.play();
            playPauseBtn.innerHTML = `<i class="fa-solid ${pauseIcon}"></i>`;
            playPauseBtn.classList.add("playing");
            liveProgressBar.style.animation = "liveProgress 2s infinite linear";
        } else {
            radioPlayer.pause();
            playPauseBtn.innerHTML = `<i class="fa-solid ${playIcon}"></i>`;
            playPauseBtn.classList.remove("playing");
            liveProgressBar.style.animation = "none"; // Stop animation when paused
        }
    });

    // Volume controls using buttons
    volumeLowBtn.addEventListener("click", function() {
        if (radioPlayer.volume > 0.1) {
            radioPlayer.volume -= 0.1; 
        } else {
            radioPlayer.volume = 0;
        }
        volumeSlider.value = radioPlayer.volume; // Sync slider with volume
        updateVolumeIcon();
    });

    volumeHighBtn.addEventListener("click", function() {
        if (radioPlayer.volume < 0.9) {
            radioPlayer.volume += 0.1; 
        } else {
            radioPlayer.volume = 1;
        }
        volumeSlider.value = radioPlayer.volume; // Sync slider with volume
        updateVolumeIcon();
    });

    // Volume slider functionality
    volumeSlider.addEventListener("input", function() {
        radioPlayer.volume = volumeSlider.value;
        updateVolumeIcon();
    });

    // Ensure the correct icon is displayed when the page loads
    updateVolumeIcon();

    // Update the current time dynamically
    radioPlayer.addEventListener("timeupdate", function () {
        currentTimeDisplay.textContent = formatTime(radioPlayer.currentTime);
    });

    // Set the duration once it's loaded
    radioPlayer.addEventListener("loadedmetadata", function () {
        durationDisplay.textContent = formatTime(radioPlayer.duration);
    });

    // Handle live stream case where duration is not available
    radioPlayer.addEventListener("durationchange", function () {
        if (isNaN(radioPlayer.duration)) {
            durationDisplay.textContent = "Live"; 
        }
    });

    // Refresh Stream Functionality

});

function reloadStream() {
    const radioPlayer = document.getElementById("radioPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");

    // Check if the music is playing (i.e., the playPauseBtn is in playing state)
    if (!radioPlayer.paused) {
        // If music is playing, reload the stream
        radioPlayer.load();
        radioPlayer.play(); // Play the music after reloading
    }
}






//---------------Sidebar Functionality----------------------
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.querySelector(".fa-right-from-bracket");
    const sidebarTexts = document.querySelectorAll(".radio-text, .logo-text");
    const footer = document.querySelector(".footer");
    const header = document.querySelector(".header"); // Target header
    const helpContent = document.querySelector(".helpcontent");
    const helpTitle = document.querySelector(".helptitle"); // Target title

    // Ensure sidebar starts collapsed
    sidebar.classList.add("collapsed");
     // Start with .full-width applied to helpcontent when sidebar is collapsed
     helpContent.classList.add("full-width");

    // Function to toggle sidebar
    toggleButton.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");

        // Hide or show text elements inside the sidebar
        sidebarTexts.forEach(text => {
            if (sidebar.classList.contains("collapsed")) {
                text.style.display = "none"; // Hide text
                helpContent.classList.add("full-width"); // Expand content
            } else {
                text.style.display = "block"; // Show text
                helpContent.classList.remove("full-width"); // Adjust content
            }
        });
    });

    // Function to collapse sidebar when clicking outside of it
    document.addEventListener("click", function (event) {
        // Check if the click was outside the sidebar and the toggle button
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            // If the sidebar is open, collapse it
            if (!sidebar.classList.contains("collapsed")) {
                sidebar.classList.add("collapsed");
                // Hide text elements inside the sidebar
                sidebarTexts.forEach(text => {
                    text.style.display = "none"; // Hide text
                    helpContent.classList.add("full-width"); // Expand content
                });
            }
        }
    });

    // Function to adjust layout based on screen size
    function checkScreenSize() {
        if (window.innerWidth >= 768) {
            footer.style.display = "none"; // Hide footer
            header.style.display = "none"; // Hide header
        } else {
            footer.style.display = "block"; // Show footer
            header.style.display = "block"; // Show header
        }

        // Increase helpTitle font size when screen width is < 768px
        if (window.innerWidth < 768) {
            helpTitle.style.fontSize = "24px"; // Increase font size
        } else {
            helpTitle.style.fontSize = "32px"; // Reset font size
        }
    }

    // Run on load and on resize
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
});


//------------Download Instruction Notification----------------------------
document.addEventListener("DOMContentLoaded", function () {
    function isRunningAsPWA() {
        return (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone);
    }

    // Show popup only if app is NOT installed and user hasn't dismissed it
    if (!isRunningAsPWA() && !localStorage.getItem("installDismissed")) {
        showInstallPopup();
    }
});

// Function to show install popup
function showInstallPopup() {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div class="install-popup">
            <h2>📥 Install FLOW Internet Radio</h2>
            <p><strong>iOS:</strong> Open in Safari, tap Share (⬆️), then select "Add to Home Screen".</p>
            <p><strong>Android:</strong> Tap ⋮ (Menu), then select "Add to Home Screen".</p>
            <button id="dismissPopup">Close</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Close popup and store preference
    document.getElementById("dismissPopup").addEventListener("click", function () {
        popup.remove();
        localStorage.setItem("installDismissed", "true"); // Prevent showing again
    });
}

//-------------------------Register Service Worker------------------------------
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then(registration => {
                console.log("Service Worker registered with scope:", registration.scope);
            })
            .catch(error => {
                console.log("Service Worker registration failed:", error);
            });
    });
}












