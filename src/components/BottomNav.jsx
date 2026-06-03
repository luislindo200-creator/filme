import React from 'react';
import './BottomNav.css';

const HomeIcon = () => (<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const MovieIcon = () => (<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>);
const TvIcon = () => (<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>);
const UserIcon = () => (<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);

export default function BottomNav({ currentView, setCurrentView }) {
  const tabs = [
    { id: 'home', label: 'Início', icon: <HomeIcon /> },
    { id: 'movies', label: 'Filmes', icon: <MovieIcon /> },
    { id: 'series', label: 'Séries', icon: <TvIcon /> },
    { id: 'profile', label: 'Perfil', icon: <UserIcon /> }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`bottom-nav-item ${currentView === tab.id ? 'active' : ''}`}
          onClick={() => setCurrentView(tab.id)}
        >
          <div className="icon">{tab.icon}</div>
          <span className="label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
