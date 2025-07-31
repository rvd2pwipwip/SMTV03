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
  const [testCardCount, setTestCardCount] = useState(25); // More cards to test scrolling
  const [focused, setFocused] = useState(false);

  // Create ref for ChannelGrid to measure container width
  const gridRef = useRef(null);

  // Track container width for debug display
  const [containerWidth, setContainerWidth] = useState(0);

  // Force re-render counter for debugging
  const [forceRender, setForceRender] = useState(0);

  // Show/hide overlay panels
  const [showPanels, setShowPanels] = useState(true);

  // Phase 2: 2D Navigation state
  const [focusedPosition, setFocusedPosition] = useState({ row: 0, col: 0 });
  const [navigationLog, setNavigationLog] = useState([]);

  // Debug: scroll offset info
  const [scrollDebugInfo, setScrollDebugInfo] = useState('');

  // Debug: Log state changes
  console.log('ChannelGridTest render:', {
    testCardCount,
    containerWidth,
    focused,
    fakeChannelsLength: fakeChannels.length,
  });

  // Add resize observer to track width changes for debug panel
  useEffect(() => {
    if (!gridRef.current) return;

    const element = gridRef.current;

    const updateWidth = () => {
      const width = element.offsetWidth;
      console.log('ChannelGridTest: Container width update:', width);
      setContainerWidth(prevWidth => {
        if (prevWidth !== width) {
          console.log('ChannelGridTest: Width changed from', prevWidth, 'to', width);
          return width;
        }
        return prevWidth;
      });
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

  // Create test data with variable counts - extend fakeChannels if needed
  const extendedChannels = [];
  for (let i = 0; i < testCardCount; i++) {
    const sourceChannel = fakeChannels[i % fakeChannels.length]; // Cycle through available channels
    extendedChannels.push({
      ...sourceChannel,
      id: `${sourceChannel.id}-${Math.floor(i / fakeChannels.length)}`, // Unique ID
      title: `${sourceChannel.title} ${Math.floor(i / fakeChannels.length) > 0 ? `(${Math.floor(i / fakeChannels.length) + 1})` : ''}`,
    });
  }
  const testChannels = extendedChannels;

  return (
    <div
      style={{
        // TRUE TV SCREEN: Full 1920x1080 dimensions - no scaling
        position: 'fixed',
        top: 0,
        left: 0,
        width: '1920px',
        height: '1080px',
        backgroundColor: '#000',
        overflow: 'hidden', // TV screen doesn't scroll
        zIndex: 2000,
        padding: '20px',
        boxSizing: 'border-box',
        // NO SCALING - true TV dimensions
      }}
    >
      {/* Fixed Controls at Top */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 3000, // Above everything else
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        <h2>ChannelGrid Test - True TV Screen (1920x1080)</h2>
        <div style={{ marginBottom: '10px', color: '#999', fontSize: '14px' }}>
          📺 True TV Screen - No Scaling | 🎯 Use arrow keys (↑↓←→) to navigate the grid. Enter to
          select. Focus mode must be ON.
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ color: '#fff' }}>
            Card Count:
            <input
              type="range"
              min="1"
              max="50"
              value={testCardCount}
              onChange={e => setTestCardCount(parseInt(e.target.value))}
              style={{ marginLeft: '10px' }}
            />
            <span style={{ marginLeft: '10px' }}>
              {testCardCount} {testCardCount >= 25 ? '📜 (Scrolling!)' : '(Try 25+ for scrolling)'}
            </span>
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
          <button
            onClick={() => setShowPanels(prev => !prev)}
            style={{
              padding: '8px 16px',
              backgroundColor: showPanels ? '#4CAF50' : '#666',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              marginLeft: '20px',
              cursor: 'pointer',
            }}
          >
            {showPanels ? '🔍 Hide Panels' : '🔍 Show Panels'}
          </button>
        </div>
      </div>

      {/* Full TV Screen Grid Container - True 1920x1080 */}
      <div
        style={{
          position: 'fixed', // Position relative to viewport, not parent
          top: '0px', // True screen top
          left: '0px', // True screen left
          width: '1920px', // Full TV screen width
          height: '1080px', // Full TV screen height
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '20px',
          paddingTop: '160px', // Original padding - no scaling
          paddingLeft: '40px', // Original padding - no scaling
          paddingRight: '40px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'visible', // Allow rows to show when moving up
          zIndex: 2500, // Above TV background (2000) but below controls (3000)
          // NO SCALING - cards at original size
        }}
      >
        <h3 style={{ color: '#fff', marginBottom: '16px', flexShrink: 0 }}>
          Grid Layout ({testCardCount} cards)
        </h3>

        <div
          style={{
            flex: 1, // Take remaining height - now extends to bottom of screen
            backgroundColor: '#111',
            borderRadius: '4px',
            border: '1px solid #444',
            overflow: 'visible', // Allow rows to show when moving up
            position: 'relative', // For parking indicator
            minHeight: 0, // Allow content to extend beyond container
          }}
        >
          {/* Bottom Parking Zone Indicator */}
          {focused && (
            <div
              style={{
                position: 'absolute',
                bottom: '318px', // Safety padding: 150 + 120 + 48
                left: '0',
                right: '0',
                height: '374px', // Card height: 300px thumbnail + ~74px title
                border: '2px dashed #00FF00',
                borderRadius: '8px',
                pointerEvents: 'none',
                zIndex: 1,
                opacity: 0.4,
              }}
            />
          )}
          {focused && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: '#00FF00',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '4px 8px',
                borderRadius: '4px',
                zIndex: 2,
              }}
            >
              🎯 Last Row Parks Here (bottom + padding)
            </div>
          )}
          <ChannelGrid
            ref={gridRef}
            items={testChannels}
            renderItem={(channel, index, itemFocused) => (
              // Compatible pattern: no KeyboardWrapper for now (simplified test)
              <ChannelCard
                key={channel.id}
                title={channel.title}
                thumbnailUrl={channel.thumbnailUrl}
                focused={itemFocused}
                data-focused={itemFocused ? 'true' : 'false'} // Use library's built-in focus ring
                tabIndex={-1} // Prevent browser focus conflicts
                onFocus={e => e.target.blur()} // Immediately blur browser focus
              />
            )}
            focused={focused}
            style={{ backgroundColor: '#111' }}
            cardWidth={300}
            minGap={32}
            key={forceRender} // Force complete re-mount for debugging
            focusedPosition={focusedPosition}
            onFocusChange={newPosition => {
              setFocusedPosition(newPosition);
              setNavigationLog(prev => [
                ...prev.slice(-4),
                `Focus: Row ${newPosition.row}, Col ${newPosition.col}`,
              ]);
              console.log('Focus changed to:', newPosition);
              // Force blur any browser-focused elements to prevent conflicts
              if (document.activeElement && document.activeElement !== document.body) {
                document.activeElement.blur();
              }
            }}
            onSelect={(item, position) => {
              setNavigationLog(prev => [
                ...prev.slice(-4),
                `Selected: Row ${position.row}, Col ${position.col} - ${item.title}`,
              ]);
            }}
            onNavigationEscape={direction => {
              setNavigationLog(prev => [
                ...prev.slice(-4),
                `Boundary Escape: ${direction.toUpperCase()} from grid`,
              ]);
            }}
          />
        </div>
      </div>

      {/* Debug Panel - Fixed Overlay */}
      {showPanels && (
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
            zIndex: 3500, // Above grid and controls
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
              <br />
              Grid content:{' '}
              <span style={{ color: '#4CAF50' }}>
                {testCardCount} cards ={' '}
                {containerWidth
                  ? Math.ceil(testCardCount / Math.floor((containerWidth + 32) / (300 + 32)))
                  : '?'}{' '}
                rows
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
              2D Navigation:
            </div>
            <div>
              Focus:{' '}
              <span style={{ color: '#E91E63' }}>
                Row {focusedPosition.row}, Col {focusedPosition.col}
              </span>
              <br />
              <span style={{ fontSize: '10px', color: '#888' }}>
                (Card focus rings move, content scrolls until last row parks at bottom)
                <br />
                <span style={{ fontSize: '9px', color: '#666' }}>
                  FixedSwimlane-style parking, transposed vertically
                </span>
              </span>
            </div>
            <div style={{ marginTop: '4px', fontSize: '11px', color: '#666' }}>
              {navigationLog.slice(-3).map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
              Test Settings:
            </div>
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
      )}

      {/* Test Details Panel - Fixed Overlay (Left Side) */}
      {showPanels && (
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
            zIndex: 3500, // Above grid and controls
            fontFamily: 'monospace',
          }}
        >
          <div style={{ marginBottom: '12px', fontWeight: 'bold', color: '#2196F3' }}>
            Phase 1 Implementation Status
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
              Core Features:
            </div>
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
              <span style={{ color: '#4CAF50' }}>✅</span> 2D navigation (Up/Down/Left/Right)
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: '#4CAF50' }}>✅</span> Vertical parking scroll (focus ring
              fixed)
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: '#4CAF50' }}>✅</span> Smart column preservation
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: '#4CAF50' }}>✅</span> Boundary escape (top/bottom rows)
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: '#4CAF50' }}>✅</span> Enter/Space selection
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
            🎯 2D Navigation + Last Row Parking
            <br />
            ↑↓ Content scrolls until last row parks | ←→ Focus moves horizontally
            <br />
            🚪 Escape at boundaries | ⏎ Select with Enter
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelGridTest;
