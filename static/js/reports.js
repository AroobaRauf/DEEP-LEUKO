// PDF download

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const mainWrapper = document.getElementById("mainWrapper");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("active");
            mainWrapper.classList.toggle("sidebar-open");
        });
    }
});


function downloadPDF(reportId) {
    window.open(`/download-report/${reportId}`, "_blank");
}

// Search filter
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-box input");
    searchInput.addEventListener("keyup", function () {
        const filter = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll("#reportTableBody tr");

        rows.forEach(row => {
            const caseId = row.cells[0].textContent.toLowerCase();
            row.style.display = caseId.includes(filter) ? "" : "none";
        });
    });
});
