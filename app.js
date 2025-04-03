//-----------------Reload Stream function-------------------
document.addEventListener("DOMContentLoaded", function () {
    const refreshButton = document.querySelector(".refresh i");

    refreshButton.addEventListener("click", function () {
        reloadStream();
    });
});

function reloadStream() {
    let player = document.getElementById("radioPlayer");
    let streamUrl = "https://usa14.fastcast4u.com/proxy/flowradio?mp=/1&nocache={Now}" + new Date().getTime();

    player.src = streamUrl;
    player.load();
    player.play().catch(error => console.error("Playback error:", error));
}
//--------------Service Worker Registration------------------
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker Registered"));
}

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve last selected tab from localStorage, default to "Radio"
    const savedTab = localStorage.getItem("selectedTab") || "Radio";
    changeTab(savedTab);
});

//----------------Changing Tab Function----------------
/*function changeTab(tabName) {
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
*/
//---------------- Radio Player Functionality --------------------
document.addEventListener("DOMContentLoaded", function () {
    const radioPlayer = document.getElementById("radioPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const currentTimeDisplay = document.getElementById("currentTimeDisplay");

    const playIcon = "fa-circle-play";
    const pauseIcon = "fa-circle-pause";

    let isPlaying = false;

    // Play/Pause Functionality
    playPauseBtn.addEventListener("click", function () {
        if (isPlaying) {
            radioPlayer.pause();
        } else {
            radioPlayer.play().catch(error => console.error("Playback error:", error));
        }
    });

    radioPlayer.addEventListener("play", function () {
        isPlaying = true;
        playPauseBtn.innerHTML = `<i class="fa-solid ${pauseIcon}"></i>`;
        playPauseBtn.classList.add("playing"); // ✅ Add glow effect class
    });

    radioPlayer.addEventListener("pause", function () {
        isPlaying = false;
        playPauseBtn.innerHTML = `<i class="fa-solid ${playIcon}"></i>`;
        playPauseBtn.classList.remove("playing"); // ✅ Remove glow effect class
    });

    // Time Update Functionality
    radioPlayer.addEventListener("timeupdate", function () {
        currentTimeDisplay.textContent = formatTime(radioPlayer.currentTime);
    });

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }
});

// Reload Stream Function
function reloadStream() {
    const radioPlayer = document.getElementById("radioPlayer");

    // Reload the stream while keeping play state
    let isPlaying = !radioPlayer.paused;
    radioPlayer.load();
    if (isPlaying) {
        radioPlayer.play().catch(error => console.error("Playback error:", error));
    }
}

//---------------Share Functionaity------------------
document.addEventListener("DOMContentLoaded", function () {
    const shareButton = document.querySelector(".share");

    shareButton.addEventListener("click", function () {
        const shareData = {
            title: "FLOW Internet Radio",
            text: "Check out FLOW Internet Radio! 🎵",
            url: window.location.href
        };

        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log("Shared successfully"))
                .catch(error => console.error("Error sharing:", error));
        } else {
            showFallbackShareModal(shareData.url);
        }
    });

    function showFallbackShareModal(url) {
        // Create the share modal
        const modal = document.createElement("div");
        modal.classList.add("share-modal");
        modal.innerHTML = `
            <div class="share-popup">
                <h2>Share FLOW Internet Radio</h2>
                <p>Share this link with your friends:</p>
                <input type="text" value="${url}" readonly id="shareLink">
                <button onclick="copyToClipboard()">Copy Link</button>
                <div class="share-icons">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank">
                        <i class="fa-brands fa-facebook"></i>
                    </a>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(url)}" target="_blank">
                        <i class="fa-brands fa-whatsapp"></i>
                    </a>
                    <a href="mailto:?subject=Check%20this%20out!&body=${encodeURIComponent(url)}">
                        <i class="fa-solid fa-envelope"></i>
                    </a>
                </div>
                <button class="closeModal">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal event
        document.querySelector(".closeModal").addEventListener("click", function () {
            modal.remove();
        });
    }
});

// Function to copy link to clipboard
function copyToClipboard() {
    const shareLink = document.getElementById("shareLink");
    shareLink.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
}


//-----------------Ad Slider Functionality------------------
document.addEventListener("DOMContentLoaded", function () {
    const ads = document.querySelectorAll(".ad-item");
    const adContainer = document.querySelector(".ad-container");
    const copyBtn = document.querySelector(".copy-ad");
    const dotsContainer = document.querySelector(".ad-pagination");

    let currentIndex = 0;
    let startX = 0;
    let endX = 0;
    let autoSlide = setInterval(nextAd, 12000); // Auto-change every 10 seconds

    // Clear dots before creating new ones (fix duplicate dots issue)
    dotsContainer.innerHTML = "";

    // Create pagination dots dynamically
    ads.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("ad-dot");
        if (index === 0) dot.classList.add("active"); // Ensure only the first one is active initially
        dot.addEventListener("click", () => {
            clearInterval(autoSlide);
            showAd(index);
            autoSlide = setInterval(nextAd, 12000); // Reset timer
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".ad-dot");

    function showAd(index) {
        ads.forEach((ad, i) => {
            ad.classList.toggle("active", i === index);
        });

        // Ensure only one dot is active
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    function nextAd() {
        currentIndex = (currentIndex + 1) % ads.length;
        showAd(currentIndex);
    }

    function prevAd() {
        currentIndex = (currentIndex - 1 + ads.length) % ads.length;
        showAd(currentIndex);
    }

    // Swipe Functionality
    adContainer.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    adContainer.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            clearInterval(autoSlide);
            nextAd(); // Swipe Left → Next Ad
            autoSlide = setInterval(nextAd, 12000);
        } else if (endX - startX > 50) {
            clearInterval(autoSlide);
            prevAd(); // Swipe Right → Previous Ad
            autoSlide = setInterval(nextAd, 12000);
        }
    });

    // Copy ad content functionality (with link recognition)
    copyBtn.addEventListener("click", function () {
        const activeAd = document.querySelector(".ad-item.active");

        if (!activeAd) return;

        // Create a temporary container to hold HTML content
        const tempElement = document.createElement("div");
        tempElement.innerHTML = activeAd.innerHTML;

        // Remove the copy button itself from the copied content
        const buttonToRemove = tempElement.querySelector(".copy-ad");
        if (buttonToRemove) {
            buttonToRemove.remove();
        }

        // Use Clipboard API to copy HTML content while preserving links
        if (navigator.clipboard) {
            navigator.clipboard.writeText(tempElement.innerText).then(() => {
                alert("Ad content copied!");
            }).catch(err => {
                console.error("Failed to copy:", err);
            });
        }
    });

    showAd(currentIndex);
});








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










