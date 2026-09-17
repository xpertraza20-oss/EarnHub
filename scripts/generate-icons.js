const fs = require('fs');
const path = require('path');

// Simple SVG to PNG placeholder generator
// In production, use sharp or canvas for real conversion

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Create a simple blue square SVG as placeholder
const createPlaceholderSVG = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#3B82F6"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="${size/4}" font-family="Arial">₹</text>
  </svg>`;
};

// Generate SVG files (since we can't generate real PNGs without tools)
sizes.forEach(size => {
  const svgContent = createPlaceholderSVG(size);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  
  if (!fs.existsSync(svgPath)) {
    fs.writeFileSync(svgPath, svgContent);
    console.log(`Created: icon-${size}x${size}.svg`);
  }
});

console.log('Icon generation complete!');
console.log('Note: For production, convert SVGs to PNGs using sharp or online tools.');