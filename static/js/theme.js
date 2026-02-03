const colors = [
    { name: 'black', value: '#000000' },
    { name: 'charcoal', value: '#36454F' },
    { name: 'deep-blue', value: '#003366' },
    { name: 'emerald', value: '#004D40' },
    { name: 'wine', value: '#722F37' },
    { name: 'beige', value: '#F5F5DC' },
    { name: 'coral', value: '#FF7F50' },
    { name: 'navy', value: '#000080' }
];

let currentColorIndex = 0;

function changeThemeColor() {
    const root = document.documentElement;
    const color = colors[currentColorIndex];
    
    root.style.setProperty('--primary-color', color.value);
    
    // Calculate RGB for rgba usage
    const rgb = hexToRgb(color.value);
    if (rgb) {
        root.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    
    currentColorIndex = (currentColorIndex + 1) % colors.length;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Change color every 10 seconds
setInterval(changeThemeColor, 10000);

// Initial color change
changeThemeColor();