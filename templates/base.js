// Base JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Web application loaded successfully!');
});

// Helper functions
function getElement(id) {
    return document.getElementById(id);
}

function createElement(tag, attributes = {}, text = '') {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

function appendElement(parent, child) {
    if (typeof parent === 'string') {
        parent = getElement(parent);
    }
    parent.appendChild(child);
}