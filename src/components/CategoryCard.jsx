import React from 'react';
import './CategoryCard.css';

/**
 * CategoryCard - TV-optimized category card component
 *
 * Designed for browse categories with:
 * - Centered text overlay on thumbnail
 * - No labels below the card
 * - Bold font weight for category names
 * - Same focus behavior as ChannelCard
 */
const CategoryCard = React.forwardRef(
  ({ title, thumbnailUrl, onClick, onFocus, onBlur, onKeyDown, focused = false, ...rest }, ref) => {
    return (
      <div className="tv-category-card">
        <div
          ref={ref}
          className={`tv-category-card__thumbnail${focused ? ' tv-focus-ring' : ''}`}
          tabIndex={0}
          role="button"
          aria-label={`Browse ${title} category`}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          {...rest}
        >
          {/* Background image or placeholder */}
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={`${title} category`} className="tv-category-card__image" />
          ) : (
            <div className="tv-category-card__placeholder" />
          )}

          {/* Centered overlay text */}
          <div className="tv-category-card__overlay">
            <h3 className="tv-category-card__title">{title}</h3>
          </div>
        </div>
      </div>
    );
  }
);

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
