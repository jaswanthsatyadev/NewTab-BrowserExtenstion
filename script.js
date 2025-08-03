document.addEventListener("DOMContentLoaded", () => {
  // Initialize time and date
  updateTimeAndDate();
  setInterval(updateTimeAndDate, 1000);

  // Initialize 3D layout and navigation
  initialize3DLayout();
  initializePageNavigation();
  initializeLockScreen();

  // Load icons in circular grid
  const grid = document.querySelector(".circle-grid");

  fetch("Daily New Tab backup - 2025.07.27 - 23 11 20.json")
    .then((response) => response.json())
    .then((data) => {
      const sites = data.bookmark;

      // Create a color array for gradient backgrounds
      const colors = [
        "#3b82f6", // blue-500
        "#8b5cf6", // violet-500
        "#ec4899", // pink-500
        "#f43f5e", // rose-500
        "#ef4444", // red-500
        "#f97316", // orange-500
        "#eab308", // yellow-500
        "#22c55e", // green-500
        "#06b6d4", // cyan-500
        "#6366f1", // indigo-500
      ];

      sites.forEach((site, index) => {
        const a = document.createElement("a");
        a.href = site.url;
        a.target = "_blank";

        // Create circular icon container
        const circleIcon = document.createElement("div");
        circleIcon.className = "circle-icon";

        // Set a gradient background based on index
        const colorIndex1 = index % colors.length;
        const colorIndex2 = (index + 3) % colors.length;
        // circleIcon.style.background = `linear-gradient(135deg, ${colors[colorIndex1]}, ${colors[colorIndex2]})`;

        const img = document.createElement("img");
        const iconMap = {
          envelope: "gmail",
          amazon: "amazon",
          "dice-d20": "awesomesheet",
          "reddit-alien": "reddit",
          film: "netflix",
          "google-drive": "drive",
          code: "devdocs",
          github: "github",
          youtube: "youtube",
          robot: "gemini",
          cloud: "clawcloud",
          "graduation-cap": "coursera",
          linkedin: "linkedin",
          "map-marker-alt": "maps",
          google: "google",
          sitemap: "roadmap",
          telegram: "telegram",
          chatgpt: "chatgpt",
          clawcloud: "clawcloud",
          hianime: "hianime",
          n8n: "n8n",
          nxtwave: "nxtwave",
          udemy: "udemy",
          unstop: "unstop",
          leetcode: "leetcode",
        };

        // Handle different visual types
        if (
          site.display.visual.type === "image" &&
          site.display.visual.image.url
        ) {
          // Use custom image if available
          const img = document.createElement("img");
          img.src = site.display.visual.image.url;
          img.alt = site.display.name.text || "Site icon";
          img.onerror = function () {
            this.src = "icons/google.svg";
            this.onerror = null;
          };
          circleIcon.appendChild(img);
        } else if (
          site.display.visual.type === "icon" &&
          site.display.visual.icon.name
        ) {
          // Map FontAwesome icon names to our SVG files
          const iconName = site.display.visual.icon.name;
          const mappedName = iconMap[iconName];
          const iconSrc = mappedName
            ? `icons/${mappedName}.svg`
            : `icons/${iconName}.svg`;

          const img = document.createElement("img");
          img.src = iconSrc;
          img.alt = site.display.name.text || "Site icon";
          img.onerror = function () {
            this.src = "icons/google.svg";
            this.onerror = null;
          };
          circleIcon.appendChild(img);
        } else if (site.display.visual.type === "letter") {
          // Check if we have a custom icon for letter-type sites
          const siteName = site.display.name.text || site.url;
          let iconFile = null;

          if (site.url.includes("unstop.com")) {
            iconFile = "unstop.svg";
          } else if (site.url.includes("hianime.to")) {
            iconFile = "hianime.svg";
          } else if (
            site.url.includes("nxtwave") ||
            site.url.includes("ccbp.in")
          ) {
            iconFile = "nxtwave.svg";
          }

          if (iconFile) {
            const img = document.createElement("img");
            img.src = `icons/${iconFile}`;
            img.alt = site.display.name.text || "Site icon";
            img.onerror = function () {
              // Fallback to letter if icon fails
              const letterDiv = document.createElement("div");
              letterDiv.className = "letter-icon";
              letterDiv.textContent = site.display.visual.letter.text;
              circleIcon.innerHTML = "";
              circleIcon.appendChild(letterDiv);
            };
            circleIcon.appendChild(img);
          } else {
            // Use letter as fallback
            const letterDiv = document.createElement("div");
            letterDiv.className = "letter-icon";
            letterDiv.textContent = site.display.visual.letter.text;
            circleIcon.appendChild(letterDiv);
          }
        } else {
          // Fallback to google icon
          const img = document.createElement("img");
          img.src = "icons/google.svg";
          img.alt = site.display.name.text || "Site icon";
          circleIcon.appendChild(img);
        }

        const span = document.createElement("span");
        span.textContent =
          site.display.name.text || site.display.visual.letter.text || "";

        a.appendChild(circleIcon);
        a.appendChild(span);
        grid.appendChild(a);

        // Add animation delay for staggered appearance
        a.style.animationDelay = `${index * 0.05}s`;
      });
    })
    .catch((error) => {
      console.error("Error loading site data:", error);
      // Fallback content for dashboard
      const grid = document.querySelector(".circle-grid");
      if (grid) {
        const fallbackSites = [
          { url: "https://google.com", name: "Google", icon: "google" },
          { url: "https://github.com", name: "GitHub", icon: "github" },
          { url: "https://youtube.com", name: "YouTube", icon: "youtube" },
          { url: "https://gmail.com", name: "Gmail", icon: "gmail" }
        ];
        
        fallbackSites.forEach((site, index) => {
          const a = document.createElement("a");
          a.href = site.url;
          a.target = "_blank";
          
          const circleIcon = document.createElement("div");
          circleIcon.className = "circle-icon";
          
          const img = document.createElement("img");
          img.src = `icons/${site.icon}.svg`;
          img.alt = site.name;
          img.onerror = () => {
            const letterDiv = document.createElement("div");
            letterDiv.className = "letter-icon";
            letterDiv.textContent = site.name.charAt(0);
            circleIcon.innerHTML = "";
            circleIcon.appendChild(letterDiv);
          };
          
          circleIcon.appendChild(img);
          
          const span = document.createElement("span");
          span.textContent = site.name;
          
          a.appendChild(circleIcon);
          a.appendChild(span);
          a.style.animationDelay = `${index * 0.05}s`;
          
          grid.appendChild(a);
        });
      }
    });
});

// Wallpaper rotation functionality
function initializeWallpaperRotation() {
  const wallpapersDir = "wallpapers/";
  const wallpapers = [
    "pexels-bess-hamiti-83687-36487.jpg",
    "pexels-eberhardgross-1421903.jpg",
    "pexels-eberhardgross-1612351.jpg",
    "pexels-eberhardgross-640781.jpg",
  ];

  // Get today's date
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );

  // Calculate wallpaper index based on day
  const wallpaperIndex = dayOfYear % wallpapers.length;
  const selectedWallpaper = wallpapers[wallpaperIndex];

  // Apply wallpaper to lock screen background
  const lockScreenBg = document.querySelector(".lock-screen-bg");
  if (lockScreenBg) {
    lockScreenBg.style.backgroundImage = `url('${wallpapersDir}${selectedWallpaper}')`;
  }

  // Also apply to dashboard background
  const dashboard = document.querySelector(".dashboard");
  if (dashboard) {
    dashboard.style.backgroundImage = `url('${wallpapersDir}${selectedWallpaper}')`;
  }
}

// Initialize wallpaper rotation when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeWallpaperRotation);

// Function to update time and date
function updateTimeAndDate() {
  const now = new Date();

  // Update time
  const timeElement = document.getElementById("current-time");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  timeElement.textContent = `${hours}:${minutes}`;

  // Update date
  const dateElement = document.getElementById("current-date");
  const options = { weekday: "long", month: "long", day: "numeric" };
  const dateString = now.toLocaleDateString("en-US", options);
  dateElement.textContent = dateString;
}

// 3D page navigation variables
let currentPage = 0; // 0 = lock screen, 1 = dashboard, 2 = dev tools
const totalPages = 3;
let isLocked = true;

// Initialize 3D layout and navigation
document.addEventListener("DOMContentLoaded", function () {
  initialize3DLayout();
  initializePageNavigation();
  initializeLockScreen();
});

function initialize3DLayout() {
  updatePageOverlay();
  window.addEventListener("resize", updatePageOverlay);
}

function initializeLockScreen() {
  const lockScreen = document.querySelector(".lock-screen");

  if (lockScreen) {
    lockScreen.addEventListener("click", unlockScreen);
    lockScreen.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        unlockScreen();
      }
    });

    let touchStartY = 0;
    lockScreen.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    });

    lockScreen.addEventListener("touchend", (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;

      if (swipeDistance > 100) {
        unlockScreen();
      }
    });

    updateLockScreenTime();
    setInterval(updateLockScreenTime, 60000);
  }
}

function unlockScreen() {
  console.log("unlockScreen called, isLocked:", isLocked);
  if (isLocked) {
    isLocked = false;
    setActivePage(1);
    console.log("Unlocked, currentPage:", currentPage);
  }
}

function updateLockScreenTime() {
  const timeElement = document.querySelector(".lock-screen .time");
  const dateElement = document.querySelector(".lock-screen .date");

  if (timeElement && dateElement) {
    const now = new Date();

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    timeElement.textContent = `${hours}:${minutes}`;

    const options = { weekday: "long", month: "long", day: "numeric" };
    dateElement.textContent = now.toLocaleDateString("en-US", options);
  }
}

function initializePageNavigation() {
  const dots = document.querySelectorAll(".dot");

  setActivePage(0);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (index === 0 && !isLocked) {
        isLocked = true;
        setActivePage(0);
      } else if (index > 0) {
        setActivePage(index);
      }
    });
  });

  document.addEventListener("wheel", (event) => {
    if (isLocked) {
      if (event.deltaY > 0) {
        unlockScreen();
      }
      return;
    }

    if (event.deltaY > 0) {
      navigateToNext();
    } else {
      navigateToPrevious();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      if (currentPage === 0 && isLocked) {
        unlockScreen();
      } else {
        navigateToNext();
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      navigateToPrevious();
    } else if (e.key === "Escape") {
      isLocked = true;
      setActivePage(0);
    }
  });

  let touchStartY = 0;
  document.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        if (currentPage === 0 && isLocked) {
          unlockScreen();
        } else {
          navigateToNext();
        }
      } else {
        navigateToPrevious();
      }
    }
  });
}

function updatePageOverlay() {
  const lockScreen = document.querySelector(".lock-screen");
  const dashboard = document.querySelector(".dashboard");
  const devTools = document.querySelector(".dev-tools");
  console.log("updatePageOverlay called, currentPage:", currentPage);
  [lockScreen, dashboard, devTools].forEach((page) => {
    if (page) {
      page.classList.remove("active", "inactive");
    }
  });
  if (currentPage === 0) {
    lockScreen?.classList.add("active");
    dashboard?.classList.add("inactive");
    devTools?.classList.add("inactive");
  } else if (currentPage === 1) {
    lockScreen?.classList.add("inactive");
    dashboard?.classList.add("active");
    devTools?.classList.add("inactive");
  } else if (currentPage === 2) {
    lockScreen?.classList.add("inactive");
    dashboard?.classList.add("inactive");
    devTools?.classList.add("active");
  }
  console.log("Classes after update:", {
    lockScreen: lockScreen?.className,
    dashboard: dashboard?.className,
    devTools: devTools?.className,
  });
}

function setActivePage(pageNum) {
  console.log("setActivePage called with pageNum:", pageNum);
  currentPage = pageNum;

  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === pageNum);
  });

  updatePageOverlay();
  console.log("Page overlay updated, currentPage:", currentPage);
}

function navigateToNext() {
  if (currentPage < totalPages - 1) {
    setActivePage(currentPage + 1);
  }
}

function navigateToPrevious() {
  if (currentPage > 0) {
    if (currentPage === 1 && !isLocked) {
      isLocked = true;
      setActivePage(0);
    } else {
      setActivePage(currentPage - 1);
    }
  }
}
