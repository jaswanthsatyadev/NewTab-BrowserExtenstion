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
    }, 800);
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

    const scrollTimeout = isScrollingForward ? 800 : 200;
    setTimeout(() => {
      oldPage.classList.remove('active', 'is-leaving', 'is-returning');
      isAnimating = false;
    }, scrollTimeout);

    currentPage = newIndex;
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentPage);
    });
  }

  // Scroll handling variables
  let lastScrollTime = 0;
  let lastScrollDirection = null;
  let scrollTimeout = null;
  
  // Timeout before allowing another scroll (prevents multiple page changes during one scroll)
  const SCROLL_DEBOUNCE_TIME = 800; // Increased to 800ms for better control
  
  // Minimum scroll delta to trigger page change
  const MIN_SCROLL_DELTA = 10;
  
  function handleScroll(event) {
    // Prevent default to avoid any native scrolling
    event.preventDefault();
    
    // Get scroll delta (normalize for different browsers)
    const deltaY = event.deltaY || -event.deltaY || event.wheelDeltaY || 0;
    
    // Ignore very small scrolls to prevent accidental triggers
    if (Math.abs(deltaY) < MIN_SCROLL_DELTA) {
      return;
    }
    
    const currentTime = Date.now();
    const timeSinceLastScroll = currentTime - lastScrollTime;
    
    // Determine scroll direction (1 for down, -1 for up)
    const currentDirection = deltaY > 0 ? 1 : -1;
    
    // Reset scroll direction if it's been a while since last scroll
    if (timeSinceLastScroll > 1000) {
      lastScrollDirection = null;
    }
    
    // If direction changed, reset the scroll state
    if (lastScrollDirection !== null && lastScrollDirection !== currentDirection) {
      lastScrollDirection = currentDirection;
      // Don't change page on direction change, wait for next scroll
      lastScrollTime = currentTime;
      return;
    }
    
    // If we're still in the cooldown period, ignore this scroll
    if (timeSinceLastScroll < SCROLL_DEBOUNCE_TIME) {
      return;
    }
    
    // If we're currently animating, ignore this scroll
    if (isAnimating) {
      return;
    }
    
    // Update scroll state
    lastScrollTime = currentTime;
    lastScrollDirection = currentDirection;
    
    // Clear any existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Set a timeout to reset scroll state
    scrollTimeout = setTimeout(() => {
      lastScrollDirection = null;
      scrollTimeout = null;
    }, SCROLL_DEBOUNCE_TIME * 2);
    
    // Handle the page change
    if (currentDirection > 0) {
      // Scrolling down - go to next page
      if (currentPage < totalPages - 1) {
        setActivePage(currentPage + 1);
      }
    } else {
      // Scrolling up - go to previous page
      if (currentPage > 0) {
        setActivePage(currentPage - 1);
      }
    }
  }

  // --- Initializers ---
  function initializeNavigation() {
    pages[0].classList.add('active');
    dots[0].classList.add('active');
    
    // Add wheel event with passive: false to allow preventDefault
    document.addEventListener("wheel", handleScroll, { passive: false });
    
    // Add touch events for mobile support
    let touchStartY = 0;
    let touchEndY = 0;
    const MIN_SWIPE_DISTANCE = 50; // Minimum distance to consider it a swipe
    
    // Handle touch start
    document.addEventListener('touchstart', function(e) {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    // Handle touch end
    document.addEventListener('touchend', function(e) {
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
    
    // Handle swipe gestures
    function handleSwipe() {
      const currentTime = new Date().getTime();
      if (isAnimating || (currentTime - lastScrollTime < SCROLL_DEBOUNCE_TIME)) {
        return;
      }
      
      lastScrollTime = currentTime;
      const swipeDistance = touchStartY - touchEndY;
      
      // Swipe up - go to next page
      if (swipeDistance > MIN_SWIPE_DISTANCE && currentPage < totalPages - 1) {
        setActivePage(currentPage + 1);
      } 
      // Swipe down - go to previous page
      else if (swipeDistance < -MIN_SWIPE_DISTANCE && currentPage > 0) {
        setActivePage(currentPage - 1);
      }
    }
    
    // Initialize dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        if (!isAnimating) {
          setActivePage(index);
        }
      });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
      const currentTime = new Date().getTime();
      if (isAnimating || (currentTime - lastScrollTime < SCROLL_DEBOUNCE_TIME)) {
        return;
      }
      
      lastScrollTime = currentTime;
      
      switch(e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ':
          if (currentPage < totalPages - 1) {
            e.preventDefault();
            setActivePage(currentPage + 1);
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          if (currentPage > 0) {
            e.preventDefault();
            setActivePage(currentPage - 1);
          }
          break;
        case 'Home':
          e.preventDefault();
          setActivePage(0);
          break;
        case 'End':
          e.preventDefault();
          setActivePage(totalPages - 1);
          break;
        case '1':
        case '2':
        case '3':
          const pageNum = parseInt(e.key) - 1;
          if (pageNum < totalPages) {
            e.preventDefault();
            setActivePage(pageNum);
          }
          break;
      }
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
    
    const lockScreenBg = document.querySelector(".lock-screen-bg");
    const dashboardBg = document.querySelector(".dashboard-bg");
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const wallpaperIndex1 = dayOfYear % wallpapers.length;
    const wallpaperUrl1 = wallpapers[wallpaperIndex1];
    const wallpaperIndex2 = (dayOfYear + 1) % wallpapers.length;
    const wallpaperUrl2 = wallpapers[wallpaperIndex2];

    if (lockScreenBg) lockScreenBg.style.backgroundImage = `url('${wallpaperUrl1}')`;
    if (dashboardBg) dashboardBg.style.backgroundImage = `url('${wallpaperUrl2}')`;
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

  // --- UPDATED FUNCTION ---
  function loadDashboardIcons() {
    const grid = document.getElementById("circle-grid");
    if (!grid) return;

    // Fetch from the new, simplified JSON file
    fetch("bookmarks.json")
      .then(response => response.ok ? response.json() : Promise.reject('Network error'))
      .then(data => {
        const sites = data.bookmarks; // Use the "bookmarks" array
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

          let iconSrc;
          // Use the simplified structure
          if (site.visual.type === "image" && site.visual.imageUrl) {
            iconSrc = site.visual.imageUrl;
          } else {
            iconSrc = `icons/${iconMap[site.visual.iconName] || 'google'}.svg`;
          }

          const img = document.createElement("img");
          img.src = iconSrc;
          img.alt = site.name || "icon";
          img.onerror = () => { img.src = "icons/google.svg"; };
          
          circleIcon.appendChild(img);
          
          const span = document.createElement("span");
          span.textContent = site.name; // Use simplified name property
          
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
  initializePdfConverter();
});

// --- PDF Converter Functionality ---
function initializePdfConverter() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const convertBtn = document.getElementById('convertBtn');
  const clearBtn = document.getElementById('clearBtn');
  const fileNameSpan = document.getElementById('fileName');
  const fileSizeSpan = document.getElementById('fileSize');
  const previewContainer = document.getElementById('previewContainer');
  const converterOptions = document.getElementById('converterOptions');
  const progressBar = document.querySelector('.progress');
  const progressContainer = document.getElementById('progressBar');
  
  let currentFile = null;

  // Handle drag and drop events
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropZone.classList.add('dragover');
  }

  function unhighlight() {
    dropZone.classList.remove('dragover');
  }

  // Handle dropped files
  dropZone.addEventListener('drop', handleDrop, false);
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
  }

  function handleFiles(files) {
    if (files.length === 0) return;
    
    // For simplicity, we'll only process the first file
    currentFile = files[0];
    
    // Update UI
    fileNameSpan.textContent = currentFile.name;
    fileSizeSpan.textContent = formatFileSize(currentFile.size);
    
    // Show preview
    showPreview(currentFile);
    
    // Show converter options
    converterOptions.style.display = 'block';
    
    // Auto-scroll to options
    converterOptions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function showPreview(file) {
    previewContainer.innerHTML = '';
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '100%';
      img.style.maxHeight = '300px';
      previewContainer.appendChild(img);
    } else if (file.type === 'application/pdf') {
      const embed = document.createElement('embed');
      embed.src = URL.createObjectURL(file);
      embed.type = 'application/pdf';
      embed.style.width = '100%';
      embed.style.height = '500px';
      previewContainer.appendChild(embed);
    } else if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const pre = document.createElement('pre');
        pre.textContent = e.target.result;
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.wordBreak = 'break-word';
        previewContainer.appendChild(pre);
      };
      reader.readAsText(file);
    } else {
      const icon = document.createElement('div');
      icon.innerHTML = '📄';
      icon.style.fontSize = '48px';
      icon.style.textAlign = 'center';
      icon.style.margin = '20px 0';
      previewContainer.appendChild(icon);
      
      const fileType = document.createElement('p');
      fileType.textContent = `${file.name} (${formatFileSize(file.size)})`;
      fileType.style.textAlign = 'center';
      fileType.style.margin = '10px 0';
      previewContainer.appendChild(fileType);
    }
  }

  // Convert to PDF
  convertBtn.addEventListener('click', convertToPdf);
  
  function convertToPdf() {
    if (!currentFile) return;
    
    // Show progress bar
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    
    // Simulate progress (in a real app, this would be the actual conversion progress)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 90) clearInterval(interval);
      progressBar.style.width = `${progress}%`;
    }, 50);
    
    // Create a container for the PDF content
    const pdfContainer = document.createElement('div');
    pdfContainer.style.padding = '20px';
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = currentFile.name;
    title.style.marginTop = '0';
    title.style.color = '#333';
    pdfContainer.appendChild(title);
    
    // Add file info
    const fileInfo = document.createElement('p');
    fileInfo.textContent = `Type: ${currentFile.type} | Size: ${formatFileSize(currentFile.size)}`;
    fileInfo.style.color = '#666';
    fileInfo.style.marginBottom = '20px';
    fileInfo.style.borderBottom = '1px solid #eee';
    fileInfo.style.paddingBottom = '10px';
    pdfContainer.appendChild(fileInfo);
    
    // Add content based on file type
    if (currentFile.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(currentFile);
      img.style.maxWidth = '100%';
      pdfContainer.appendChild(img);
    } else if (currentFile.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const pre = document.createElement('pre');
        pre.textContent = e.target.result;
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.wordBreak = 'break-word';
        pre.style.fontFamily = 'Arial, sans-serif';
        pre.style.color = '#333';
        pdfContainer.appendChild(pre);
        
        // Generate PDF after content is loaded
        generatePdf(pdfContainer);
      };
      reader.readAsText(currentFile);
      return; // Exit early, will continue in callback
    } else {
      const message = document.createElement('p');
      message.textContent = 'File content cannot be displayed in preview.';
      message.style.color = '#666';
      pdfContainer.appendChild(message);
    }
    
    // Generate PDF
    generatePdf(pdfContainer);
    
    function generatePdf(content) {
      // Use html2pdf for conversion
      const element = content;
      const opt = {
        margin: 10,
        filename: `${currentFile.name.split('.')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        onProgress: (progress) => {
          clearInterval(interval);
          const percent = Math.min(90 + Math.floor(progress * 10), 99);
          progressBar.style.width = `${percent}%`;
        }
      };
      
      // Generate and download PDF
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          progressBar.style.width = '100%';
          setTimeout(() => {
            progressContainer.style.display = 'none';
          }, 500);
        });
    }
  }
  
  // Clear button
  clearBtn.addEventListener('click', () => {
    currentFile = null;
    fileInput.value = '';
    previewContainer.innerHTML = '';
    converterOptions.style.display = 'none';
    progressContainer.style.display = 'none';
  });
}

// Helper function to check file type
function getFileType(file) {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('text/')) return 'text';
  return 'other';
}
