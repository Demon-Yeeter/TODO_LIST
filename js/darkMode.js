// darkMode.js

export const toggleDarkMode = () => {
    const body = document.body;
    const button = document.getElementById('darkModeToggle');

    body.classList.toggle('dark-mode');

    // Ändere das Icon des Buttons
    if (body.classList.contains('dark-mode')) {
        button.innerHTML = '🌞'; // Sonne für Light Mode
    } else {
        button.innerHTML = '🌙'; // Mond für Dark Mode
    };
};
