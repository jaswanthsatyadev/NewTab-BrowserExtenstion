// Dev Tools JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initQuickNotes();
    initMarkdownScratchpad();
    initBase64Converter();
    initImageOptimizer();
    initTabs();
});

// Quick Notes
function initQuickNotes() {
    const notesArea = document.getElementById('quickNotes');
    const clearBtn = document.getElementById('clearNotes');
    const notesStatus = document.getElementById('notesStatus');
    
    // Load saved notes
    const savedNotes = localStorage.getItem('quickNotes');
    if (savedNotes) notesArea.value = savedNotes;
    
    // Auto-save notes
    notesArea.addEventListener('input', () => {
        localStorage.setItem('quickNotes', notesArea.value);
        showStatus(notesStatus, 'Auto-saved');
    });
    
    // Clear notes
    clearBtn.addEventListener('click', () => {
        if (confirm('Clear all notes?')) {
            notesArea.value = '';
            localStorage.removeItem('quickNotes');
            showStatus(notesStatus, 'Notes cleared');
        }
    });
}

// Markdown Scratchpad
function initMarkdownScratchpad() {
    const markdownInput = document.getElementById('markdownInput');
    const markdownPreview = document.getElementById('markdownPreview');
    const togglePreviewBtn = document.getElementById('togglePreview');
    const clearScratchpadBtn = document.getElementById('clearScratchpad');
    
    // Load saved markdown
    const savedMarkdown = localStorage.getItem('markdownScratchpad');
    if (savedMarkdown) {
        markdownInput.value = savedMarkdown;
        updateMarkdownPreview();
    }
    
    // Auto-update preview
    markdownInput.addEventListener('input', () => {
        localStorage.setItem('markdownScratchpad', markdownInput.value);
        updateMarkdownPreview();
    });
    
    // Toggle preview
    let isPreviewMode = false;
    togglePreviewBtn.addEventListener('click', () => {
        isPreviewMode = !isPreviewMode;
        markdownInput.style.display = isPreviewMode ? 'none' : 'block';
        markdownPreview.style.display = isPreviewMode ? 'block' : 'none';
        togglePreviewBtn.innerHTML = isPreviewMode ? '✏️' : '👁️';
        togglePreviewBtn.title = isPreviewMode ? 'Edit' : 'Preview';
    });
    
    // Clear scratchpad
    clearScratchpadBtn.addEventListener('click', () => {
        if (confirm('Clear scratchpad?')) {
            markdownInput.value = '';
            localStorage.removeItem('markdownScratchpad');
            updateMarkdownPreview();
        }
    });
    
    // Simple markdown to HTML
    function updateMarkdownPreview() {
        if (!markdownInput.value.trim()) {
            markdownPreview.innerHTML = '<em class="placeholder">Start typing to see the preview...</em>';
            return;
        }
        
        let html = markdownInput.value
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/^\s*\* (.*$)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
            
        markdownPreview.innerHTML = html;
    }
}

// Base64 Converter
function initBase64Converter() {
    // Text to Base64
    const textInput = document.getElementById('textInput');
    const base64Output = document.getElementById('base64Output');
    const encodeBtn = document.getElementById('encodeBtn');
    
    // Base64 to Text
    const base64Input = document.getElementById('base64Input');
    const decodedText = document.getElementById('decodedText');
    const decodeBtn = document.getElementById('decodeBtn');
    
    // File to Base64
    const base64FileInput = document.getElementById('base64FileInput');
    
    // Encode text to Base64
    encodeBtn.addEventListener('click', () => {
        try {
            base64Output.value = btoa(unescape(encodeURIComponent(textInput.value)));
        } catch (e) {
            showError('Error encoding text');
        }
    });
    
    // Decode Base64 to text
    decodeBtn.addEventListener('click', () => {
        try {
            decodedText.value = decodeURIComponent(escape(atob(base64Input.value)));
        } catch (e) {
            showError('Invalid Base64');
        }
    });
    
    // File to Base64
    base64FileInput.addEventListener('change', handleFileSelect);
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result.split(',')[1];
            document.getElementById('fileBase64Output').value = base64String;
            document.getElementById('base64FileName').textContent = file.name;
            document.getElementById('base64FileSize').textContent = formatFileSize(file.size);
            document.getElementById('base64FileInfo').style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
}

// Image Optimizer
function initImageOptimizer() {
    const imageOptimizerInput = document.getElementById('imageOptimizerInput');
    const imageQuality = document.getElementById('imageQuality');
    const qualityValue = document.getElementById('qualityValue');
    const imageFormat = document.getElementById('imageFormat');
    
    // Update quality display
    imageQuality.addEventListener('input', () => {
        qualityValue.textContent = imageQuality.value;
        if (window.currentImageFile) {
            optimizeImage(window.currentImageFile);
        }
    });
    
    // Handle format change
    imageFormat.addEventListener('change', () => {
        if (window.currentImageFile) {
            optimizeImage(window.currentImageFile);
        }
    });
    
    // File input change
    imageOptimizerInput.addEventListener('change', handleImageSelect);
    
    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            showError('Please select a valid image file.');
            return;
        }
        
        window.currentImageFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('originalImageContainer').innerHTML = 
                `<img src="${event.target.result}" alt="Original">`;
            document.getElementById('originalSize').textContent = formatFileSize(file.size);
            document.getElementById('imageOptimizerControls').style.display = 'block';
            optimizeImage(file);
        };
        reader.readAsDataURL(file);
    }
    
    function optimizeImage(file) {
        const quality = parseInt(imageQuality.value) / 100;
        const format = imageFormat.value;
        const img = new Image();
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxSize = 1200;
            let width = img.width;
            let height = img.height;
            
            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height *= maxSize / width;
                    width = maxSize;
                } else {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
            const optimizedDataUrl = canvas.toDataURL(mimeType, quality);
            
            document.getElementById('optimizedImageContainer').innerHTML = 
                `<img src="${optimizedDataUrl}" alt="Optimized">`;
                
            const originalSize = file.size / 1024;
            const optimizedSize = (optimizedDataUrl.length * 0.75) / 1024;
            const savings = ((originalSize - optimizedSize) / originalSize) * 100;
            
            document.getElementById('optimizedSize').textContent = `${optimizedSize.toFixed(1)} KB`;
            document.getElementById('savingsPercentage').textContent = `${savings.toFixed(1)}%`;
            
            // Store for download
            window.optimizedImageUrl = optimizedDataUrl;
        };
        
        img.src = URL.createObjectURL(file);
    }
    
    // Download optimized image
    document.getElementById('downloadOptimized').addEventListener('click', () => {
        if (!window.optimizedImageUrl) return;
        const a = document.createElement('a');
        a.href = window.optimizedImageUrl;
        a.download = `optimized.${imageFormat.value}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

// Tab functionality
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Helper functions
function showStatus(element, message) {
    if (typeof element === 'string') element = document.getElementById(element);
    if (!element) return;
    
    const originalText = element.textContent;
    element.textContent = message;
    
    if (element.timeout) clearTimeout(element.timeout);
    element.timeout = setTimeout(() => {
        element.textContent = originalText;
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
