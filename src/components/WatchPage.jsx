import React, { useEffect } from 'react';
import './WatchPage.css';

export default function WatchPage({ item, onBack, onAddToList, onRemoveFromList, myList }) {
  if (!item) return null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [item]);

  const embedUrl = item.type === 'tv' || item.type === 'series' 
    ? `https://myembed.biz/serie/${item.id}`
    : `https://myembed.biz/filme/${item.id}`;

  const inList = myList.some(i => i.id === item.id);

  return (
    <div className="watch-page animate-fade-in">
      <div className="watch-header">
        <button className="back-btn glass-panel" onClick={onBack}>
          ← Voltar ao Catálogo
        </button>
      </div>

      <div className="video-container">
        <iframe 
          src={embedUrl} 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowFullScreen 
          loading="lazy"
          title={`${item.title} Player`}
        ></iframe>
      </div>

      <div className="watch-details container">
        <h1>{item.title}</h1>
        <div className="meta-info">
          <span className="rating">⭐ {item.rating}</span>
          <span className="year">{item.year}</span>
          <span className="type">{item.type === 'movie' ? 'Filme' : 'Série'}</span>
        </div>
        
        <p className="description">{item.description}</p>
        
        <div className="watch-actions">
          <button 
            className={`list-btn ${inList ? 'in-list' : ''}`}
            onClick={() => inList ? onRemoveFromList(item) : onAddToList(item)}
          >
            {inList ? '✓ Na Minha Lista' : '+ Adicionar à Lista'}
          </button>
        </div>
      </div>
    </div>
  );
}
