// Utility functions for UI/layout

export function getSidePadding() {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue('--screen-side-padding');
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 100 : parsed;
  }
  return 100;
} 