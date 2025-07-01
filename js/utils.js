// Removed export statements for browser compatibility
const colors = {
    primary: '#333',
    secondary: '#fff',
    accent: '#f4a261',
};

const fonts = {
    main: 'sans-serif',
};

/**
 * Loads an HTML widget into a target element by id, resolving the correct path from any directory.
 * @param {string} widgetName - The widget HTML file name (e.g., 'navbar.html')
 * @param {string} targetId - The id of the element to inject the widget into
 */
function loadWidgetUniversal(widgetName, targetId) {
    // Get the project root (e.g., '/olfc/')
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const projectRoot = pathParts.length > 0 ? '/' + pathParts[0] : '';
    // Always use absolute path from project root
    const widgetPath = `${projectRoot}/widgets/${widgetName}`;
    fetch(widgetPath)
        .then(res => res.text())
        .then(html => { document.getElementById(targetId).innerHTML = html; });
} 