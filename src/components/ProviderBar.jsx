import React from 'react';
import './ProviderBar.css';

const providers = [
  { id: 8, name: 'Netflix', logo: 'https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
  { id: 119, name: 'Prime Video', logo: 'https://image.tmdb.org/t/p/original/pvske1MyAoymrs5bguRfVqYiM9a.jpg' },
  { id: 337, name: 'Disney+', logo: 'https://image.tmdb.org/t/p/original/97yvRBw1GzX7fXprcF80er19ot.jpg' },
  { id: 1899, name: 'Max', logo: 'https://image.tmdb.org/t/p/original/jbe4gVSfRlbPTdESXhEKpornsfu.jpg' },
  { id: 350, name: 'Apple TV+', logo: 'https://image.tmdb.org/t/p/original/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg' }
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
