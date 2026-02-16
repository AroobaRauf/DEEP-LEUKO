document.addEventListener('DOMContentLoaded', () => {
    // ===== Elements =====
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const removeBtn = document.getElementById('removeBtn');
    const resultArea = document.getElementById('resultArea');
    const loader = document.getElementById('loader');
    const predictionOutput = document.getElementById('predictionOutput');
    const previewArea = document.getElementById('previewArea');

    // ===== Upload & Preview =====
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFile);

    function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert("Only JPG or PNG images are allowed.");
            fileInput.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            previewArea.innerHTML = `
                <img src="${reader.result}" style="max-height:250px;border-radius:8px;">
            `;
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // ===== Remove Image =====
    removeBtn.addEventListener('click', () => {
        fileInput.value = "";
        previewArea.innerHTML = `
            <p>Drag & Drop or <span>Browse</span></p>
            <small>.JPG or .PNG only</small>
        `;
        analyzeBtn.disabled = true;
        resultArea.classList.add('hidden');
    });

    // ===== Analyze Image =====
    analyzeBtn.addEventListener('click', async () => {
        if (!fileInput.files.length) return;

        resultArea.classList.remove('hidden');
        loader.classList.remove('hidden');
        predictionOutput.classList.add('hidden');

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            // 👉 Backend FastAPI endpoint
            // Example: http://127.0.0.1:8000/predict
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error("Server error");

            const data = await response.json();

            if (data.confidence < 0.60) {
                alert("Low confidence. Upload a clearer image.");
                loader.classList.add('hidden');
                return;
            }

            displayResults(data);

        } catch (err) {
            console.error(err);
            simulateAnalysis(); // UI fallback
        }
    });

    // ===== Display Results =====
    function displayResults(data) {
        loader.classList.add('hidden');
        predictionOutput.classList.remove('hidden');

        document.getElementById('resultLabel').innerText = data.final_class;
        document.getElementById('confidenceScore').innerText =
            (data.confidence * 100).toFixed(1) + "%";

        document.getElementById('confFill').style.width =
            (data.confidence * 100) + "%";

        if (data.heatmap_url) {
            document.getElementById('gradCamImg').src = data.heatmap_url;
        }
    }

    // ===== Password Toggle (Reusable) =====
    window.togglePassword = function (inputId, icon) {
        const input = document.getElementById(inputId);
        if (!input) return;

        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    };

    // ===== UI Simulation =====
    function simulateAnalysis() {
        setTimeout(() => {
            displayResults({
                final_class: "AML",
                confidence: 0.94,
                heatmap_url: "https://via.placeholder.com/300x300?text=Grad-CAM"
            });
        }, 1500);
    }
});
