import React from 'react';
import './MediaCard.css';

export default function MediaCard({ item, onClick }) {
  return (
    <div className="media-card animate-slide-up" onClick={onClick}>
      <div className="poster-container">
        <img src={item.poster} alt={item.title} className="poster-image" />
        <div className="card-overlay flex-center">
          <div className="play-btn">▶</div>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{item.title}</h3>
        <div className="card-meta">
          <span>{item.year}</span>
          <span className="rating">⭐ {item.rating}</span>
        </div>
      </div>
    </div>
  );
}
