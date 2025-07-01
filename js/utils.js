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
    // Find the path from the current page to the widgets folder
    let path = window.location.pathname;
    let depth = (path.match(/\//g) || []).length - 1;
    let prefix = '';
    if (depth > 0) {
        prefix = '../'.repeat(depth);
    }
    fetch(prefix + 'widgets/' + widgetName)
        .then(res => res.text())
        .then(html => { document.getElementById(targetId).innerHTML = html; });
} 