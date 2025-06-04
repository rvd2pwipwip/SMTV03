// Utility for layout-related helpers
/**
 * getSidePadding
 *
 * Returns the value of the CSS custom property --screen-side-padding as an integer (pixels).
 * Falls back to 100 if the variable is not set or cannot be parsed.
 *
 * This utility is used to ensure consistent horizontal padding for major layout elements,
 * such as the FixedSwimlane and VariableSwimlane components. By using the design token
 * from CSS, the swimlanes can align with the overall app layout and adapt to design changes
 * in one place. Pass the result as the sidePadding prop to swimlane components for
 * consistent spacing from the screen edges.
 *
 * Example usage:
 *   import { getSidePadding } from '../utils/ui';
 *   <FixedSwimlane sidePadding={getSidePadding()} ... />
 *   <VariableSwimlane sidePadding={getSidePadding()} ... />
 */
export function getSidePadding() {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue('--screen-side-padding');
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 100 : parsed;
  }
  return 100;
} 