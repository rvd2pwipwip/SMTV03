import React from 'react';

/**
 * AdBanner must be placed inside a parent with position: relative and size 1920x1080 (the .app div)
 * It will anchor to the bottom and span the full width of the parent.
 */
const AdBanner = ({ children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 150,
        background: '#888',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      {children || (
        <span style={{ color: 'var(--color-outline-secondary)', fontSize: 32, fontWeight: 700 }}>Ad Banner Placeholder</span>
      )}
    </div>
  );
};

export default AdBanner; 