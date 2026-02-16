document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const removeBtn = document.getElementById('removeBtn');
    const filePreviewName = document.getElementById('filePreviewName');
    const imagePreview = document.getElementById('imagePreview');
    const uploadIcon = document.getElementById('uploadIcon');
    const resultsSection = document.getElementById('resultsSection');
    
    // Sidebar logic
    const menuBtn = document.getElementById('menuBtn');
    menuBtn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('mainWrapper').classList.toggle('sidebar-open');
    });

    // File Selection
    filePreviewName.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            filePreviewName.innerHTML = `File: <strong>${file.name}</strong>`;
            analyzeBtn.disabled = false;
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadIcon.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // THE LINK LOGIC: Analyze and Redirect
    analyzeBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) return;

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing AI Models...';

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/predict', { method: 'POST', body: formData });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // 1. SAVE TO LOCALSTORAGE (This is the bridge to visuals.html)
            localStorage.setItem('lastAnalysis', JSON.stringify({
                id: data.id,
                final_class: data.final_class,
                confidence: data.confidence,
                heatmap_url: data.heatmap_url,
                original_url: data.original_url // Provided by updated app.py
            }));

            // 2. REDIRECT TO VISUALS PAGE
            window.location.href = "/visual";

        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Analysis failed. Please check if the Flask server and PostgreSQL are running.");
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Analyze Image';
        }
    });

    removeBtn.addEventListener('click', () => {
        fileInput.value = "";
        imagePreview.style.display = 'none';
        uploadIcon.style.display = 'block';
        filePreviewName.innerHTML = 'Drag & Drop image here or <span style="color: var(--accent-green); font-weight: bold;">Browse</span>';
        analyzeBtn.disabled = true;
    });
});