document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const dots = document.querySelectorAll(".dot");
  const totalPages = pages.length;
  let currentPage = 0;
  let isScrolling = false; // Prevents spamming scroll events

  // --- Core Navigation ---

  function setActivePage(pageIndex) {
    if (pageIndex < 0 || pageIndex >= totalPages) return;

    currentPage = pageIndex;

    pages.forEach((page, index) => {
      // Clear all animation classes
      page.classList.remove("active", "previous", "next");

      if (index === currentPage) {
        // The current page is always 'active'
        page.classList.add("active");
      } else if (index < currentPage) {
        // Pages we've scrolled past are 'previous'
        page.classList.add("previous");
      } else if (index === currentPage + 1) {
        // The very next page is 'next' (visible behind the active one)
        page.classList.add("next");
      }
    });

    // Update navigation dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentPage);
    });
  }

  function handleScroll(event) {
    if (isScrolling) return;
    isScrolling = true;

    if (event.deltaY > 0) { // Scrolling Down
      if (currentPage < totalPages - 1) {
        setActivePage(currentPage + 1);
      }
    } else if (event.deltaY < 0) { // Scrolling Up
      if (currentPage > 0) {
        setActivePage(currentPage - 1);
      }
    }

    // Reset scrolling flag after transition ends (matches CSS duration)
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }

  // --- Initializers ---

  function initializeNavigation() {
    document.addEventListener("wheel", handleScroll);
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => setActivePage(index));
    });
    // Set the initial page state on load
    setActivePage(0);
  }

  function initializeDateTime() {
    const timeElement = document.getElementById("current-time");
    const dateElement = document.getElementById("current-date");
    function update() {
      const now = new Date();
      if (timeElement) timeElement.textContent = now.toTimeString().substring(0, 5);
      if (dateElement) dateElement.textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    }
    update();
    setInterval(update, 1000);
  }

  function initializeWallpaper() {
    const wallpapers = [
      "wallpapers/pexels-bess-hamiti-83687-36487.jpg",
      "wallpapers/pexels-eberhardgross-1421903.jpg",
      "wallpapers/pexels-eberhardgross-1612351.jpg",
      "wallpapers/pexels-eberhardgross-640781.jpg",
    ];
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const wallpaperUrl = wallpapers[dayOfYear % wallpapers.length];
    const lockScreenBg = document.querySelector(".lock-screen-bg");
    if(lockScreenBg) lockScreenBg.style.backgroundImage = `url('${wallpaperUrl}')`;
  }

  function loadDashboardIcons() {
    const grid = document.getElementById("circle-grid");
    if (!grid) return;
    fetch("Daily New Tab backup - 2025.07.27 - 23 11 20.json")
      .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
      .then(data => {
        const sites = data.bookmark;
        if (!sites) return;
        const iconMap = {
          envelope: "gmail", amazon: "amazon", "dice-d20": "awesomesheet", "reddit-alien": "reddit",
          film: "netflix", "google-drive": "drive", code: "devdocs", github: "github", youtube: "youtube",
          robot: "gemini", cloud: "clawcloud", "graduation-cap": "coursera", linkedin: "linkedin",
          "map-marker-alt": "maps", google: "google", sitemap: "roadmap", telegram: "telegram",
        };
        sites.forEach(site => {
          const a = document.createElement("a");
          a.href = site.url;
          a.target = "_blank";
          const circleIcon = document.createElement("div");
          circleIcon.className = "circle-icon";
          let iconSrc = `icons/${iconMap[site.display.visual.icon.name] || 'google'}.svg`;
          if (site.display.visual.type === "image" && site.display.visual.image.url) {
            iconSrc = site.display.visual.image.url;
          }
          const img = document.createElement("img");
          img.src = iconSrc;
          img.alt = site.display.name.text || "icon";
          img.onerror = () => { img.src = "icons/google.svg"; };
          circleIcon.appendChild(img);
          const span = document.createElement("span");
          span.textContent = site.display.name.text || site.url.split('/')[2].replace('www.','');
          a.appendChild(circleIcon);
          a.appendChild(span);
          grid.appendChild(a);
        });
      })
      .catch(error => console.error("Error loading dashboard icons:", error));
  }

  // --- Run Everything ---
  initializeNavigation();
  initializeDateTime();
  initializeWallpaper();
  loadDashboardIcons();
});