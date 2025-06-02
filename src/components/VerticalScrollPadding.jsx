import React from 'react';
import { AD_BANNER_HEIGHT } from '../utils/ui';

/**
 * VerticalScrollPadding
 *
 * Adds vertical space at the end of a scrollable content area to account for overlays (e.g., ad banner, mini-player).
 * Height = 2 * AD_BANNER_HEIGHT + spacingXXL
 *
 * Usage:
 *   <VerticalScrollPadding spacingXXL={spacingXXL} />
 */
function VerticalScrollPadding({ spacingXXL }) {
  return (
    <div
      style={{
        width: '100%',
        height: `${2 * AD_BANNER_HEIGHT + spacingXXL}px`,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

export default VerticalScrollPadding; 