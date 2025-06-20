import React, { forwardRef, useState } from 'react';
import { Button } from '@smtv/tv-component-library';
import { MagnifyingGlass } from 'stingray-icons';

/**
 * SearchField - A TV-optimized search input field
 *
 * Features:
 * - Controlled input with onChange callback
 * - Clear button (appears when there's text)
 * - TV focus management with visual focus indicator
 * - Keyboard navigation (Enter to submit, Escape to clear)
 * - Accessible design
 */
const SearchField = forwardRef(
  (
    {
      value = '',
      onChange,
      onClear,
      onSubmit,
      placeholder = 'Search channels, artists, radio, vibes',
      focused = false,
      onFocus,
      onKeyDown,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = e => {
      onChange?.(e.target.value);
    };

    const handleClear = () => {
      onChange?.('');
      onClear?.();
    };

    const handleKeyDown = e => {
      if (e.key === 'Enter') {
        onSubmit?.(value);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        handleClear();
        e.preventDefault();
      }

      onKeyDown?.(e);
    };

    const handleFocus = e => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <div
        className={`search-field-container ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            border: focused || isFocused ? '2px solid #338DE6' : '2px solid transparent',
            transition: 'border-color 0.2s ease',
            padding: '0 20px',
            height: '70px',
          }}
        >
          {/* Search Icon */}
          <MagnifyingGlass
            size={24}
            style={{
              color: '#FAFAFA',
              marginRight: '16px',
              opacity: 0.7,
            }}
          />

          {/* Input Field */}
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FAFAFA',
              fontSize: '28px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              lineHeight: '1.17em',
            }}
            {...props}
          />

          {/* Clear Button */}
          {value && (
            <Button
              size="small"
              variant="transparent"
              aria-label="Clear search"
              onClick={handleClear}
              style={{
                marginLeft: '16px',
                padding: '8px',
                minWidth: '40px',
                height: '40px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#FAFAFA',
              }}
            >
              ×
            </Button>
          )}
        </div>

        {/* Clear All Button (separate from input, like in Figma) */}
        {value && (
          <Button
            variant="secondary"
            size="medium"
            onClick={handleClear}
            style={{
              marginLeft: '30px',
              flexShrink: 0,
            }}
          >
            Clear
          </Button>
        )}
      </div>
    );
  }
);

SearchField.displayName = 'SearchField';

export default SearchField;
