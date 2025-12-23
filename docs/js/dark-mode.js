// This script is designed for Bootstrap 5.3 +
let darkMode = false;
$(document).ready(function () {
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (prefersDark) {
    	document.documentElement.setAttribute("data-bs-theme", "dark");
		darkMode = true;
	}
	$('#darkModeButton').on('click', function () {
		darkMode = !darkMode;
		document.documentElement.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
	});
});

