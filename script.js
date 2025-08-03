document.addEventListener("DOMContentLoaded", () => {
  // Initialize time and date
  updateTimeAndDate();
  setInterval(updateTimeAndDate, 1000);

  // Set up page navigation
  setupPageNavigation();

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
          cloud: "cloud",
          "graduation-cap": "coursera",
          linkedin: "linkedin",
          "map-marker-alt": "maps",
          google: "google",
          sitemap: "roadmap",
          telegram: "telegram",
        };

        if (
          site.display.visual.type === "image" &&
          site.display.visual.image.url
        ) {
          // Check if the image URL is from an external source that might not be available
          if (
            site.display.visual.image.url.includes("registry.npmmirror.com") ||
            !site.display.visual.image.url.startsWith("icons/")
          ) {
            // Use a fallback icon instead
            img.src = "icons/google.svg";
          } else {
            img.src = site.display.visual.image.url;
          }
        } else if (site.display.visual.icon && site.display.visual.icon.name) {
          const iconName = site.display.visual.icon.name;
          const fileName =
            iconMap[iconName] ||
            iconName.replace(/-alt$/, "").replace(/ /g, "-");

          // Check if the icon file exists in our icons directory
          const iconPath = `icons/${fileName}.svg`;
          img.src = iconPath;

          // Add error handler to use fallback if icon doesn't load
          img.onerror = function () {
            this.src = "icons/google.svg";
            this.onerror = null; // Prevent infinite loop
          };
        } else {
          // Fallback for items with no icon name
          img.src = "icons/google.svg"; // A default icon
        }
        img.alt = site.display.name.text;

        const span = document.createElement("span");
        span.textContent = site.display.name.text;

        circleIcon.appendChild(img);
        a.appendChild(circleIcon);
        a.appendChild(span);
        grid.appendChild(a);

        // Add animation delay for staggered appearance
        a.style.animationDelay = `${index * 0.05}s`;
      });
    })
    .catch((error) => console.error("Error loading site data:", error));
});

// Wallpaper rotation functionality
function initializeWallpaperRotation() {
  const wallpapersDir = 'wallpapers/';
  const wallpapers = [
    '1.jpg',
    'pexels-eberhardgross-1421903.jpg',
    'pexels-eberhardgross-1612351.jpg',
    'pexels-life-of-pix-7919.jpg'
  ];

  // Get today's date
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  // Calculate wallpaper index based on day
  const wallpaperIndex = dayOfYear % wallpapers.length;
  const selectedWallpaper = wallpapers[wallpaperIndex];
  
  // Apply wallpaper to page 1
  const page1 = document.getElementById('page1');
  if (page1) {
    page1.style.backgroundImage = `url('${wallpapersDir}${selectedWallpaper}')`;
  }
}

// Initialize wallpaper rotation when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWallpaperRotation);

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

// Function to set up page navigation
function setupPageNavigation() {
  const pages = document.querySelectorAll(".page");
  const dots = document.querySelectorAll(".dot");
  let currentPage = 0;
  const totalPages = pages.length;

  // Initialize dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      navigateToPage(index);
    });
  });

  // Handle wheel events for scrolling between pages
  let isScrolling = false;
  document.addEventListener("wheel", (event) => {
    if (isScrolling) return;
    isScrolling = true;

    if (event.deltaY > 0) {
      // Scroll down - go to next page
      navigateToPage(Math.min(currentPage + 1, totalPages - 1));
    } else {
      // Scroll up - go to previous page
      navigateToPage(Math.max(currentPage - 1, 0));
    }

    // Debounce scrolling
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  });

  // Handle touch events for mobile devices
  let touchStartY = 0;
  document.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0].clientY;
  });

  document.addEventListener("touchend", (event) => {
    const touchEndY = event.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // If the swipe is significant enough
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe up - go to next page
        navigateToPage(Math.min(currentPage + 1, totalPages - 1));
      } else {
        // Swipe down - go to previous page
        navigateToPage(Math.max(currentPage - 1, 0));
      }
    }
  });

  // Function to navigate to a specific page
  function navigateToPage(pageIndex) {
    if (pageIndex === currentPage) return;

    // Update active page
    pages.forEach((page, index) => {
      if (index === pageIndex) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    // Update active dot
    dots.forEach((dot, index) => {
      if (index === pageIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    currentPage = pageIndex;
  }
}
