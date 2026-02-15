// Define the available colors and their hex values
const BLUR_COLORS = {
  blue: "#3b82f6",
  green: "#22c55e",
  orange: "#f97316",
  pink: "#ec4899",
  yellow: "#eab308",
  neutral: "#f3f4f6", // Default light gray
};

type BlurColor = keyof typeof BLUR_COLORS;

/**
 * Generates a base64 SVG string that acts as a blurred placeholder.
 * This is incredibly lightweight and works perfectly with Next.js Image.
 */
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const generateSvgPlaceholder = (hex: string) => {
  // A tiny 1x1 SVG scaled up that mimics a blur
  const svg = `
    <svg width="1" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="1" height="1" fill="${hex}" />
    </svg>`;
  
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

// --- Exports matching your component's needs ---

export const getStaticImagePlaceholder = () => {
  return {
    blurDataURL: generateSvgPlaceholder(BLUR_COLORS.neutral),
  };
};

export const getColoredBlurPlaceholder = (color: BlurColor = "blue") => {
  const hex = BLUR_COLORS[color] || BLUR_COLORS.neutral;
  return {
    blurDataURL: generateSvgPlaceholder(hex),
  };
};