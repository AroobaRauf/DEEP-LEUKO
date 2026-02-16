document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Toggle Logic ---
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.getElementById('mainWrapper');

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            mainWrapper.classList.toggle('sidebar-open');
        });
    }

   // --- 2. Data Rendering Logic ---
    const lastData = localStorage.getItem('lastAnalysis');
    const dynamicContent = document.getElementById('dynamicContent');

    if (lastData && dynamicContent) {
        try {
            const data = JSON.parse(lastData);
            
            // Generate a timestamp to prevent browser caching of images
            const cacheBuster = `?t=${new Date().getTime()}`;

            // Update the page with the Heatmap and Results
            dynamicContent.innerHTML = `
                <div class="report-card">
                    <div class="status-header">
                        <div>
                            <h2 style="color: var(--dark-slate);">Diagnostic Visualization</h2>
                            <small style="color: #94a3b8;">
                                Analysis ID: #${data.id || 'N/A'} | Generated: ${new Date().toLocaleString()}
                            </small>
                        </div>
                        <div class="action-btns" style="text-align: right;">
                            <button id="printBtn" class="btn-action btn-print">
                                <i class="fas fa-print"></i> Export Report
                            </button>
                            <a href="/analysis" class="btn-action btn-new">New Scan</a>
                        </div>
                    </div>

                    <div class="comparison-grid">
                        <div class="image-box">
                            <p>ORIGINAL SMEAR</p>
                            <img src="${data.original_url}${cacheBuster}" 
                                 alt="Original Image" 
                                 onerror="this.src='https://via.placeholder.com/400?text=Original+Image+Not+Found'">
                        </div>
                        <div class="image-box">
                            <p>AI HEATMAP (GRAD-CAM)</p>
                            <img src="${data.heatmap_url}${cacheBuster}" 
                                 alt="Heatmap" 
                                 style="border: 2px solid var(--accent-green);"
                                 onerror="this.src='https://via.placeholder.com/400?text=Heatmap+Generation+Failed'">
                        </div>
                    </div>

                    <div class="diagnosis-info">
                        <h3 style="margin-bottom: 10px;">Classification: 
                            <span style="color: var(--primary-emerald);">${data.final_class || 'Unknown'}</span>
                        </h3>
                        <p><strong>Confidence Score:</strong> ${data.confidence || '0'}%</p>
                        <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;">
                        <p style="font-size: 0.9rem; color: #475569; line-height: 1.6;">
                            <strong>Explainable AI (XAI) Note:</strong> The heatmap highlights the specific pixel regions 
                            that contributed most to the model's decision. For <strong>${data.final_class}</strong>, 
                            the focus is typically on nuclear-to-cytoplasmic ratio and chromatin patterns.
                        </p>
                    </div>
                </div>
            `;

            // Handle Print Button click
            document.getElementById('printBtn').addEventListener('click', () => {
                window.print();
            });

        } catch (error) {
            console.error("Error parsing analysis data:", error);
            dynamicContent.innerHTML = `<div class="error-msg">Error loading analysis data. Please try again.</div>`;
        }
    } else {
        dynamicContent.innerHTML = `<div class="error-msg">No analysis data found. Please go to the Analysis page first.</div>`;
    }
});