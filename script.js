document.addEventListener("DOMContentLoaded", () => {
  const splashScreen = document.querySelector(".splash-screen");
  const pages = document.querySelectorAll(".page");
  const dots = document.querySelectorAll(".dot");
  const totalPages = pages.length;
  let currentPage = 0;
  let isAnimating = false;

  // --- Splash Screen Logic ---
  function hideSplashScreen() {
    splashScreen.style.opacity = '0';
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 0);
  }
  setTimeout(hideSplashScreen, 2300);

  // --- Core Navigation ---
  function setActivePage(newIndex) {
    const oldIndex = currentPage;
    if (newIndex === oldIndex || isAnimating) return;

    isAnimating = true;
    const oldPage = pages[oldIndex];
    const newPage = pages[newIndex];
    const isScrollingForward = newIndex > oldIndex;

    newPage.classList.add('active');
    
    if (isScrollingForward) {
      oldPage.classList.add('is-leaving');
    } else {
      oldPage.classList.add('is-returning');
    }
    
    const scrolltimeout = isScrollingForward ? 800 : 300;
    setTimeout(() => {
      oldPage.classList.remove('active', 'is-leaving', 'is-returning');
      isAnimating = false;
    }, scrolltimeout);

    currentPage = newIndex;
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentPage);
    });
  }

  function handleScroll(event) {
    if (isAnimating) return;

    if (event.deltaY > 0) {
      if (currentPage < totalPages - 1) {
        setActivePage(currentPage + 1);
      }
    } else if (event.deltaY < 0) {
      if (currentPage > 0) {
        setActivePage(currentPage - 1);
      }
    }
  }

  // --- Initializers ---
  function initializeNavigation() {
    pages[0].classList.add('active');
    dots[0].classList.add('active');
    document.addEventListener("wheel", handleScroll);
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => setActivePage(index));
    });
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
    setInterval(update, 60000);
  }

  function initializeWallpaper() {
    const wallpapers = [
      "wallpapers/pexels-bess-hamiti-83687-36487.jpg",
      "wallpapers/pexels-eberhardgross-1421903.jpg",
      "wallpapers/pexels-eberhardgross-1612351.jpg",
      "wallpapers/pexels-eberhardgross-640781.jpg",
    ];
    
    // Get both background elements
    const lockScreenBg = document.querySelector(".lock-screen-bg");
    const dashboardBg = document.querySelector(".dashboard-bg");

    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

    // Calculate index for Page 1 (Lock Screen)
    const wallpaperIndex1 = dayOfYear % wallpapers.length;
    const wallpaperUrl1 = wallpapers[wallpaperIndex1];

    // Calculate index for Page 2 (Dashboard), offset by 1
    const wallpaperIndex2 = (dayOfYear + 1) % wallpapers.length;
    const wallpaperUrl2 = wallpapers[wallpaperIndex2];

    // Apply wallpapers
    if (lockScreenBg) {
        lockScreenBg.style.backgroundImage = `url('${wallpaperUrl1}')`;
    }
    if (dashboardBg) {
        dashboardBg.style.backgroundImage = `url('${wallpaperUrl2}')`;
    }
  }

  function initializeWeather() {
    const lat = 17.38;
    const lon = 78.48;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    
    const weatherWidget = document.getElementById("weather-widget");
    if (!weatherWidget) return;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const temp = Math.round(data.current_weather.temperature);
        const weatherCode = data.current_weather.weathercode;
        const icon = getWeatherIcon(weatherCode);
        
        weatherWidget.innerHTML = `
          <span class="weather-icon">${icon}</span>
          <span class="weather-temp">${temp}°C</span>
        `;
      })
      .catch(error => {
        console.error("Error fetching weather:", error);
        weatherWidget.innerHTML = `<span>Weather unavailable</span>`;
      });
  }

  function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "⛈️";
    if (code >= 95 && code <= 99) return "🌪️";
    return "❓";
  }

  function loadDashboardIcons() {
    const grid = document.getElementById("circle-grid");
    if (!grid) return;
    fetch("Daily New Tab backup - 2025.07.27 - 23 11 20.json")
      .then(response => response.ok ? response.json() : Promise.reject('Network error'))
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
initializeWeather();
loadDashboardIcons();
});
