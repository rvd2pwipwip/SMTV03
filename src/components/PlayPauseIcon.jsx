import React from 'react';

const PlayPauseIcon = ({ isPlaying = true, width = 64, height = 64, ...props }) => (
  <svg width={width} height={height} viewBox="0 0 102 101" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="1.5" y="2" width="97" height="97" rx="48.5" stroke="white" strokeOpacity="0.3" strokeWidth="3"/>
    {/* Pause icon (default) */}
    <path fillRule="evenodd" clipRule="evenodd" d="M46.9474 35H40V66H46.9474V35ZM62 35H55.0526V66H62V35Z" fill="#FAFAFA"/>
    {/* In the future, you can add a play icon here if !isPlaying */}
  </svg>
);

export default PlayPauseIcon; 