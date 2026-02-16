
// Hex values for inline styles
export const quizColorsHex = {
  pink: '#F57799',
  green: '#A5C89E',
  
  correct: {
    solid: '#1a7f5a',
    bg: '#d1fae5',
    border: '#047857',
    text: '#065f46',
  },
  
  incorrect: {
    solid: '#b91c1c',
    bg: '#fee2e2', 
    border: '#dc2626',
    text: '#991b1b',
  },
  
  // Navigation pill colors
  answered: {
    correct: '#86efac',   // green-300
    incorrect: '#fca5a5', // red-300
    neutral: 'rgba(0,0,0,0.2)',
  }
} as const;