/* ======================================================
DARK MODE FUNCTIONALITY
====================================================== */

// Cache DOM elements
const body = document.body;
const darkModeToggle = document.getElementById("darkModeToggle");

// Key used to store theme preference
const DARK_MODE_KEY = "darkMode";

// ======================================================
// INITIAL STATE CHECK
// ======================================================

// Apply saved dark mode preference on page load
if (localStorage.getItem(DARK_MODE_KEY) === "enabled") {
    enableDarkMode();
}

// ======================================================
// EVENT LISTENERS
// ======================================================

// Toggle dark mode when button is clicked
darkModeToggle.addEventListener("click", () => {
    const isDarkModeActive = body.classList.contains("dark-mode");

    if (isDarkModeActive) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// ======================================================
// HELPER FUNCTIONS
// ======================================================

// Enable dark mode styles and update UI
function enableDarkMode() {
    body.classList.add("dark-mode");
    localStorage.setItem(DARK_MODE_KEY, "enabled");
    darkModeToggle.textContent = "☀️ Light Mode";
}

// Disable dark mode styles and update UI
function disableDarkMode() {
    body.classList.remove("dark-mode");
    localStorage.setItem(DARK_MODE_KEY, "disabled");
    darkModeToggle.textContent = "🌙 Dark Mode";
}