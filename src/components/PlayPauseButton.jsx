import React, { forwardRef } from 'react';
import playPauseIcon from '../assets/svg/playPause.svg';

const PlayPauseButton = forwardRef(({ isPlaying = true, padding = 8, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className="tv-button tv-button--transparent tv-button--icon-only"
    style={{
      padding,
      // borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
    }}
    tabIndex={0}
    {...props}
  >
    <img
      src={playPauseIcon}
      alt={isPlaying ? 'Pause' : 'Play'}
      style={{
        display: 'block',
        width: 102,
        height: 101,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      draggable={false}
    />
  </button>
));

export default PlayPauseButton; 