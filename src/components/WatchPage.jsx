import React, { useState, useEffect } from 'react';
import { getTvDetails, getTvSeason } from '../services/tmdb';
import './WatchPage.css';

export default function WatchPage({ item, onBack, onAddToList, onRemoveFromList, myList }) {
  if (!item) return null;

  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  
  const isTv = item.type === 'tv' || item.type === 'series';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isTv) {
      getTvDetails(item.id).then(data => {
        if (data && data.seasons) {
          const validSeasons = data.seasons.filter(s => s.season_number > 0);
          setSeasons(validSeasons);
          if (validSeasons.length > 0) {
            handleSeasonSelect(validSeasons[0].season_number);
          }
        }
      });
    }
  }, [item, isTv]);

  const handleSeasonSelect = async (seasonNum) => {
    setSelectedSeason(seasonNum);
    setSelectedEpisode(1);
    setLoadingEpisodes(true);
    const data = await getTvSeason(item.id, seasonNum);
    if (data && data.episodes) {
      setEpisodes(data.episodes);
    }
    setLoadingEpisodes(false);
  };

  const embedUrl = isTv 
    ? `https://myembed.biz/serie/${item.id}/${selectedSeason}/${selectedEpisode}`
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
          <span className="type">{isTv ? 'Série' : 'Filme'}</span>
        </div>

        {isTv && seasons.length > 0 && (
          <div className="tv-selector-container">
            <h3 style={{marginBottom: '1rem', color: '#fff'}}>Temporadas</h3>
            <div className="season-carousel">
              {seasons.map(s => (
                <button 
                  key={s.id || s.season_number} 
                  className={`season-btn ${selectedSeason === s.season_number ? 'active' : ''}`}
                  onClick={() => handleSeasonSelect(s.season_number)}
                >
                  {s.name || `Temporada ${s.season_number}`}
                </button>
              ))}
            </div>
            
            <h3 style={{margin: '1.5rem 0 1rem', color: '#fff'}}>Episódios</h3>
            {loadingEpisodes ? (
              <div className="flex-center" style={{padding: '2rem'}}><div className="loading-spinner"></div></div>
            ) : (
              <div className="episode-grid">
                {episodes.map(ep => (
                  <button 
                    key={ep.id || ep.episode_number} 
                    className={`episode-btn ${selectedEpisode === ep.episode_number ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedEpisode(ep.episode_number);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {ep.episode_number}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
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
