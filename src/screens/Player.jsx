import React, { useEffect } from 'react';
import '../styles/App.css';
import { Info, Like, SkipNext, PauseCircle } from 'stingray-icons';
import stingrayMusicLogo from '../assets/svg/stingrayMusic.svg';
import PlayPauseButton from '../components/PlayPauseButton';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { Button } from '@smtv/tv-component-library';
import { TRANS_BTN_ICON_SIZE } from '../constants/ui';
import AdBanner from '../components/AdBanner';

function Player({ channel, onBack }) {
  // Focusable action buttons for header
  const infoRef = React.useRef(null);
  const likeRef = React.useRef(null);
  // Controls row (PauseCircle, etc.)
  const controlsGroupRef = React.useRef(null);
  const skipRef = React.useRef(null);
  const pauseRef = React.useRef(null);

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: 'var(--color-surface)',
      paddingTop: 'var(--screen-side-padding)',
    },
    backButton: {
      position: 'absolute',
      left: 'var(--screen-side-padding)',
      top: 'var(--screen-side-padding)',
      zIndex: 1,
    },
    channelInfo: {
      padding: '0px var(--screen-side-padding)',
    },
  };

  return (
    <>
      {/* Player Header */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 'var(--screen-side-padding)',
        boxSizing: 'border-box',
      }}>
        {/* Absolute logo */}
        <div style={{
          position: 'absolute',
          left: 'var(--screen-side-padding)',
          top: 'var(--screen-side-padding)',
          width: 245,
          height: 70,
          display: 'flex',
          alignItems: 'center',
          zIndex: 2,
        }}>
          <img src={stingrayMusicLogo} alt="Stingray Music" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* Centered channel title */}
        <h1 style={{
          fontFamily: 'var(--font-family-secondary)',
          fontSize: 'var(--font-size-h3)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          margin: 0,
          textAlign: 'center',
          zIndex: 1,
        }}>
          {channel?.title || 'Unknown Channel'}
        </h1>
        {/* Centered action buttons row */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}>
          <KeyboardWrapper
            ref={infoRef}
            data-stable-id="player-header-action-info"
            onSelect={() => {}}
          >
            <Button
              icon={<Info size={TRANS_BTN_ICON_SIZE}/>}
              showIcon
              size="medium"
              variant="transparent"
            >
            </Button>
          </KeyboardWrapper>
          <KeyboardWrapper
            ref={likeRef}
            data-stable-id="player-header-action-like"
            onSelect={() => {}}
          >
            <Button
              icon={<Like size={TRANS_BTN_ICON_SIZE}/>}
              showIcon
              size="medium"
              variant="transparent"
            >
            </Button>
          </KeyboardWrapper>
        </div>
      </div>

      {/* Main content below header */}
      <div style={{
        position: 'relative',
        width: '100%',
        padding: '24px var(--screen-side-padding) 0px',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Cover Art Placeholder */}
        <div style={{
          width: 360,
          height: 360,
          background: 'var(--color-outline-secondary)',
          borderRadius: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
          fontSize: 32,
          fontFamily: 'var(--font-family-primary)',
          marginBottom: 20,
        }}>
          360x360
        </div>

        {/* Channel Info Placeholder */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <div style={{
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-h3)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            textAlign: 'center',
          }}>
            Song Title
          </div>
          <div style={{
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-body)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
          }}>
            Artist Name
          </div>
          <div style={{
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-body)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--color-text-tertiary, #AAA)',
            textAlign: 'center',
          }}>
            Album
          </div>
        </div>

        {/* Controls Row */}
        <div
          ref={controlsGroupRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            position: 'relative',
            width: '100%',
            minHeight: 120,
            marginBottom: 30,
          }}
        >
          {/* Left controls (empty for now) */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Add left controls here in the future */}
          </div>
          {/* Center PlayPause */}
          <div style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyboardWrapper
              ref={pauseRef}
              data-stable-id="player-control-pause"
            >
              <PlayPauseButton />
            </KeyboardWrapper>
          </div>
          {/* Right controls */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <KeyboardWrapper
              ref={skipRef}
              data-stable-id="player-control-skip"
            >
              <Button
                icon={<SkipNext size={TRANS_BTN_ICON_SIZE}/>} 
                showIcon
                size="medium"
                variant="transparent"
              />
            </KeyboardWrapper>
          </div>
        </div>

        {/* Logo Placeholder (moved out of main content) */}
      </div>
      <AdBanner />
    </>
  );
}

export default Player; 