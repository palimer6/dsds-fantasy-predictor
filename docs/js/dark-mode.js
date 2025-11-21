// This script is designed for Bootstrap 5.3 +
window.addEventListener('DOMContentLoaded', (event) => {
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (prefersDark) {
    	document.documentElement.setAttribute("data-bs-theme", "dark");
    	document.getElementById('darkModeSwitch').checked = true;
	}
	document.getElementById('darkModeSwitch').addEventListener('change', function() {
        let temp = document.getElementById('darkModeSwitch').checked;
        document.documentElement.setAttribute("data-bs-theme", temp ? "dark" : "light");
    });
});

