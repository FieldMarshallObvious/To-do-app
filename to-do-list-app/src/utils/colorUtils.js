// Get complementary color from hex color
export const getComplementaryColor = (color) => {
    const colorWithoutHash = color.replace('#', '');
    const base = parseInt(colorWithoutHash, 16); // Convert hex to integer
    const maxColor = 0xFFFFFF; // Max color value in hexadecimal
    const complementaryColor = maxColor - base; // Calculate complementary color
    return `#${complementaryColor.toString(16)}`; // Convert back to hex string
};