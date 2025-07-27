document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".hex-grid");

  fetch("Daily New Tab backup - 2025.07.27 - 23 11 20.json")
    .then((response) => response.json())
    .then((data) => {
      const sites = data.bookmark;
      sites.forEach((site, index) => {
        const a = document.createElement("a");
        a.href = site.url;
        a.target = "_blank";

        const hexagon = document.createElement("div");
        hexagon.className = "hexagon";

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
        };

        if (
          site.display.visual.type === "image" &&
          site.display.visual.image.url
        ) {
          img.src = site.display.visual.image.url;
        } else if (site.display.visual.icon && site.display.visual.icon.name) {
          const iconName = site.display.visual.icon.name;
          const fileName =
            iconMap[iconName] ||
            iconName.replace(/-alt$/, "").replace(/ /g, "-");
          img.src = `icons/${fileName}.svg`;
        } else {
          // Fallback for items with no icon name
          img.src = "icons/default.svg"; // A default icon
        }
        img.alt = site.display.name.text;

        const span = document.createElement("span");
        span.textContent = site.display.name.text;

        hexagon.appendChild(img);
        hexagon.appendChild(span);
        a.appendChild(hexagon);
        grid.appendChild(a);
      });
    })
    .catch((error) => console.error("Error loading site data:", error));
});
