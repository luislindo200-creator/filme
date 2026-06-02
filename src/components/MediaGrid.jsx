import React from 'react';
import MediaCard from './MediaCard';
import './MediaGrid.css';

export default function MediaGrid({ title, items, onSelect, wrap = false }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`media-grid-section ${wrap ? 'container' : ''}`}>
      <h2 className="section-title">{title}</h2>
      <div className={`media-grid ${wrap ? 'media-grid-wrap' : ''}`}>
        {items.map(item => (
          <MediaCard key={item.id} item={item} onClick={() => onSelect(item)} />
        ))}
      </div>
    </div>
  );
}
