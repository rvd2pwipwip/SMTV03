import React, { useState, useRef, useEffect } from 'react';
import { ChannelCard } from '@smtv/tv-component-library';
import '@smtv/tv-component-library/dist/style.css';
import ChannelGrid from './ChannelGrid';
import { fakeChannels } from '../data/fakeChannels';

/**
 * ChannelGridTest - Component to test and demonstrate ChannelGrid functionality
 *
 * This component tests:
 * - Responsive grid layout
 * - Partial row handling
 * - Different card counts
 * - Focus state management (prepared for Phase 2)
 */
const ChannelGridTest = () => {
  const [testCardCount, setTestCardCount] = useState(15);
  const [focused, setFocused] = useState(false);

  // Create ref for ChannelGrid to measure container width
  const gridRef = useRef(null);

  // Track container width for debug display
  const [containerWidth, setContainerWidth] = useState(0);

  // Force re-render counter for debugging
  const [forceRender, setForceRender] = useState(0);

  // Add resize observer to track width changes for debug panel
  useEffect(() => {
    if (!gridRef.current) return;

    const element = gridRef.current;

    const updateWidth = () => {
      const width = element.offsetWidth;
      setContainerWidth(prevWidth => (prevWidth !== width ? width : prevWidth));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    // Add window resize listener as backup
    window.addEventListener('resize', updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Create test data with variable counts
  const testChannels = fakeChannels.slice(0, testCardCount);

  return (
    <div
      style={{
        // BYPASS TV app fixed dimensions for responsive testing
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'auto',
        zIndex: 2000,
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '20px', color: '#fff' }}>
        <h2>ChannelGrid Test - Phase 1 (Responsive Testing Mode)</h2>
        <div style={{ marginBottom: '10px', color: '#999', fontSize: '14px' }}>
          🎯 This test bypasses TV app fixed dimensions for true responsive testing
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ color: '#fff' }}>
            Card Count:
            <input
              type="range"
              min="1"
              max="25"
              value={testCardCount}
              onChange={e => setTestCardCount(parseInt(e.target.value))}
              style={{ marginLeft: '10px' }}
            />
            <span style={{ marginLeft: '10px' }}>{testCardCount}</span>
          </label>
          <label style={{ color: '#fff' }}>
            <input
              type="checkbox"
              checked={focused}
              onChange={e => setFocused(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Simulate Focus State
          </label>
          <button
            onClick={() => setForceRender(prev => prev + 1)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              marginLeft: '20px',
              cursor: 'pointer',
            }}
          >
            Force Re-render ({forceRender})
          </button>
        </div>
      </div>

      <div
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '20px',
          width: '100%', // Now truly responsive to viewport
          maxWidth: 'none', // Remove any max-width constraints
        }}
      >
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>Grid Layout ({testCardCount} cards)</h3>

        <ChannelGrid
          ref={gridRef}
          focused={focused}
          style={{ backgroundColor: '#111' }}
          cardWidth={300}
          minGap={32}
          key={forceRender} // Force complete re-mount for debugging
        >
          {testChannels.map(channel => (
            <ChannelCard
              key={channel.id}
              title={channel.title}
              thumbnailUrl={channel.thumbnailUrl}
            />
          ))}
        </ChannelGrid>
      </div>

      {/* Debug Panel - Fixed Overlay */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '16px',
          color: '#fff',
          fontSize: '14px',
          minWidth: '300px',
          maxWidth: '400px',
          zIndex: 1000,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ marginBottom: '12px', fontWeight: 'bold', color: '#4CAF50' }}>
          ChannelGrid Debug Panel
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>Grid Layout:</div>
          <div>Container: 100% width</div>
          <div>
            Actual width:{' '}
            <span style={{ color: '#4CAF50' }}>{containerWidth || 'Measuring...'}px</span>
          </div>
          <div>
            Cards per row:{' '}
            <span style={{ color: '#2196F3' }}>
              {containerWidth ? Math.floor((containerWidth + 32) / (300 + 32)) : 'Calculating...'}
            </span>
          </div>
          <div>
            Total rows:{' '}
            <span style={{ color: '#FF9800' }}>
              {containerWidth
                ? Math.ceil(testCardCount / Math.floor((containerWidth + 32) / (300 + 32)))
                : 'Calculating...'}
            </span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
            Last update: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>Test Settings:</div>
          <div>
            Card count: <span style={{ color: '#E91E63' }}>{testCardCount}</span>
          </div>
          <div>
            Focus mode:{' '}
            <span style={{ color: focused ? '#4CAF50' : '#666' }}>{focused ? 'ON' : 'OFF'}</span>
          </div>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#666',
            borderTop: '1px solid #333',
            paddingTop: '8px',
          }}
        >
          ✅ Resize browser to test responsiveness
          <br />✅ Use controls above to test different scenarios
        </div>
      </div>

      {/* Test Details Panel - Fixed Overlay (Left Side) */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '16px',
          color: '#fff',
          fontSize: '14px',
          minWidth: '320px',
          maxWidth: '400px',
          zIndex: 1000,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ marginBottom: '12px', fontWeight: 'bold', color: '#2196F3' }}>
          Phase 1 Implementation Status
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>Core Features:</div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#4CAF50' }}>✅</span> Responsive grid calculation
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#4CAF50' }}>✅</span> Partial row handling (left-aligned)
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#4CAF50' }}>✅</span> 300px card width consistency
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#4CAF50' }}>✅</span> Dynamic gap calculation
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#4CAF50' }}>✅</span> ResizeObserver integration
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
            Ready for Phase 2:
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#FF9800' }}>🔄</span> 2D navigation (Up/Down/Left/Right)
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#FF9800' }}>🔄</span> Focus position tracking {'{row, col}'}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#FF9800' }}>🔄</span> Boundary escape callbacks
          </div>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#666',
            borderTop: '1px solid #333',
            paddingTop: '8px',
          }}
        >
          🎯 Grid foundation complete
          <br />
          📐 Based on ChannelRow patterns
          <br />
          📱 Ready for TV navigation
        </div>
      </div>
    </div>
  );
};

export default ChannelGridTest;
