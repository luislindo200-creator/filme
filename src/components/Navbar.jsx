import React from 'react';
import './Navbar.css';

export default function Navbar({ searchQuery, onSearchChange, currentView, setCurrentView, onProfileClick }) {
  return (
    <nav className="navbar glass-panel">
      <div className="container flex-between">
        <div className="logo" onClick={() => { onSearchChange(''); setCurrentView('home'); }} style={{cursor: 'pointer'}}>
          Voyo<span className="logo-accent">.</span>
        </div>
        <div className="nav-links">
          <a href="#" className={currentView === 'home' && !searchQuery ? 'active' : ''} onClick={(e) => { e.preventDefault(); onSearchChange(''); setCurrentView('home'); }}>Início</a>
          <a href="#" className={currentView === 'movies' && !searchQuery ? 'active' : ''} onClick={(e) => { e.preventDefault(); onSearchChange(''); setCurrentView('movies'); }}>Filmes</a>
          <a href="#" className={currentView === 'series' && !searchQuery ? 'active' : ''} onClick={(e) => { e.preventDefault(); onSearchChange(''); setCurrentView('series'); }}>Séries</a>
        </div>
        <div className="nav-actions" style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Pesquisar títulos..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div 
            className={`profile-btn ${currentView === 'profile' ? 'active-profile' : ''}`} 
            onClick={onProfileClick}
            style={{
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: currentView === 'profile' ? 'var(--accent)' : 'rgba(255,255,255,0.1)', 
              color: 'white',
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              transition: 'var(--transition-fast)',
              fontWeight: '500'
            }}
          >
            👤 Perfil
          </div>
        </div>
      </div>
    </nav>
  );
}
