import type React from "react"
// MPK Brand Colors
export const MPK_COLORS = {
  "mpk-blue": "#7DD3FC",
  "mpk-light-blue": "#BAE6FD",
  "mpk-olive": "#BEF264",
  "mpk-brown": "#D2B48C",
  "mpk-orange": "#FB923C",
  "mpk-yellow": "#FDE047",
  "mpk-pink": "#F9A8D4",
  "mpk-beige": "#F5F5DC",
  "mpk-light-black": "#1F2937",
} as const

export const MPK_COLOR_VALUES = Object.values(MPK_COLORS)

/**
 * Validates if a color is a valid CSS color value
 */
export function isValidColor(color: string): boolean {
  // Check if it's a Tailwind class
  if (color.startsWith("bg-")) {
    return true
  }

  // Check if it's a hex color
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return true
  }

  // Check if it's rgb/rgba
  if (/^rgba?$$\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*$$$/.test(color)) {
    return true
  }

  // Check if it's a named CSS color (basic check)
  const namedColors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "grey",
    "cyan",
    "magenta",
    "lime",
    "navy",
    "teal",
    "silver",
    "gold",
    "indigo",
    "violet",
    "maroon",
    "olive",
  ]

  if (namedColors.includes(color.toLowerCase())) {
    return true
  }

  return false
}

/**
 * Gets a deterministic MPK color based on a string hash
 * This ensures server and client render the same color
 */
export function getDeterministicMPKColor(input: string): string {
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get consistent index
  const index = Math.abs(hash) % MPK_COLOR_VALUES.length
  return MPK_COLOR_VALUES[index]
}

/**
 * Validates backgroundColor and returns valid color or deterministic MPK color
 */
export function validateBackgroundColor(backgroundColor: string, fallbackSeed?: string): string {
  if (isValidColor(backgroundColor)) {
    return backgroundColor
  }

  // If invalid, return a deterministic MPK color based on the input
  // Use the backgroundColor itself as seed, or provided fallbackSeed
  const seed = fallbackSeed || backgroundColor
  return getDeterministicMPKColor(seed)
}

/**
 * Converts color to inline style object
 */
export function getBackgroundStyle(backgroundColor: string, fallbackSeed?: string): React.CSSProperties {
  const validColor = validateBackgroundColor(backgroundColor, fallbackSeed)

  // If it's a Tailwind class, return empty object (let Tailwind handle it)
  if (validColor.startsWith("bg-")) {
    return {}
  }

  // Otherwise, return inline style
  return { backgroundColor: validColor }
}

/**
 * Gets the appropriate className for background
 */
export function getBackgroundClassName(backgroundColor: string, fallbackSeed?: string): string {
  const validColor = validateBackgroundColor(backgroundColor, fallbackSeed)

  // If it's a Tailwind class, return it
  if (validColor.startsWith("bg-")) {
    return validColor
  }

  // If it's a custom color, return empty string (will use inline styles)
  return ""
}
