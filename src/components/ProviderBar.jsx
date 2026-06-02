import React from 'react';
import './ProviderBar.css';

const providers = [
  { id: 8, name: 'Netflix', logo: 'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjVrCsPhqZf4O1.jpg' },
  { id: 119, name: 'Prime Video', logo: 'https://image.tmdb.org/t/p/original/emthp39XA2YScoYL1p0sfbEKI4x.jpg' },
  { id: 337, name: 'Disney+', logo: 'https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5arvixRVxG.jpg' },
  { id: 1899, name: 'Max', logo: 'https://image.tmdb.org/t/p/original/6UhBX2A3tPrc7zMIsL1P1bX5y9a.jpg' },
  { id: 350, name: 'Apple TV+', logo: 'https://image.tmdb.org/t/p/original/6uhKBfmtzFqOcLousHwZuzcrjhK.jpg' }
];

export default function ProviderBar({ selectedProvider, onSelectProvider }) {
  return (
    <div className="provider-bar-container container">
      <h2 className="provider-title">Navegar por Streaming</h2>
      <div className="provider-list">
        {providers.map(provider => (
          <div 
            key={provider.id}
            className={`provider-item ${selectedProvider?.id === provider.id ? 'active' : ''}`}
            onClick={() => onSelectProvider(selectedProvider?.id === provider.id ? null : provider)}
          >
            <img src={provider.logo} alt={provider.name} title={provider.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
