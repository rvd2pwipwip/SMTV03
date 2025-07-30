import React, { useState, useRef } from 'react';
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

  // Create test data with variable counts
  const testChannels = fakeChannels.slice(0, testCardCount);

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px', color: '#fff' }}>
        <h2>ChannelGrid Test - Phase 1</h2>
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
        </div>
      </div>

      <div
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '20px',
          width: '100%', // Fill parent container completely
        }}
      >
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>Grid Layout ({testCardCount} cards)</h3>

        <ChannelGrid
          ref={gridRef}
          focused={focused}
          style={{ backgroundColor: '#111' }}
          cardWidth={300}
          minGap={32}
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

      <div style={{ marginTop: '20px', color: '#ccc', fontSize: '14px' }}>
        <h4>Test Details:</h4>
        <ul>
          <li>✅ Responsive grid calculation (based on ChannelRow logic)</li>
          <li>✅ Partial row handling (last row left-aligned)</li>
          <li>✅ 300px card width consistency</li>
          <li>✅ Dynamic gap calculation</li>
          <li>🔄 Focus state propagation (ready for Phase 2 navigation)</li>
          <li>🔄 Container width measurement with ResizeObserver</li>
        </ul>
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#222',
            borderRadius: '4px',
          }}
        >
          <strong>Debug Info:</strong>
          <div>Container: Fills parent width (100%)</div>
          <div>Actual container width: {gridRef.current?.offsetWidth || 'Measuring...'}</div>
          <div>
            Cards per row:{' '}
            {gridRef.current?.offsetWidth
              ? Math.floor((gridRef.current.offsetWidth + 32) / (300 + 32))
              : 'Calculating...'}
          </div>
          <div>
            With {testCardCount} cards: ~
            {gridRef.current?.offsetWidth
              ? Math.ceil(
                  testCardCount / Math.floor((gridRef.current.offsetWidth + 32) / (300 + 32))
                )
              : 'Calculating...'}{' '}
            rows expected
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
            Check browser console for detailed calculation logs
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelGridTest;
