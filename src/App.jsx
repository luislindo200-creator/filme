import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MediaGrid from './components/MediaGrid';
import WatchPage from './components/WatchPage';
import UserDashboard from './components/UserDashboard';
import ProviderBar from './components/ProviderBar';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import { 
  getTrending, 
  getPopularMovies, 
  getPopularSeries,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaries,
  searchMedia,
  getMediaByProvider
} from './services/tmdb';
import './App.css';

function App() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  const [currentView, setCurrentView] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerMedia, setProviderMedia] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('voyo_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [myList, setMyList] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('voyo_currentUser', JSON.stringify(currentUser));
      const savedList = localStorage.getItem(`voyo_myList_${currentUser.email}`);
      setMyList(savedList ? JSON.parse(savedList) : []);
      const savedHistory = localStorage.getItem(`voyo_history_${currentUser.email}`);
      setHistory(savedHistory ? JSON.parse(savedHistory) : []);
    } else {
      localStorage.removeItem('voyo_currentUser');
      setMyList([]);
      setHistory([]);
      setCurrentView('home');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`voyo_myList_${currentUser.email}`, JSON.stringify(myList));
      localStorage.setItem(`voyo_history_${currentUser.email}`, JSON.stringify(history));
    }
  }, [myList, history, currentUser]);

  const handleAddToList = (item) => {
    setMyList(prev => {
      if (!prev.find(i => i.id === item.id)) return [...prev, item];
      return prev;
    });
  };

  const handleRemoveFromList = (item) => {
    setMyList(prev => prev.filter(i => i.id !== item.id));
  };

  const handleClearList = () => {
    if(window.confirm("Tem certeza que deseja esvaziar sua lista?")) {
      setMyList([]);
    }
  };

  const handleMediaClick = (item) => {
    if (!currentUser) {
      setCurrentView('login');
    } else {
      setSelectedMedia(item);
      setCurrentView('watch'); // Navega para a página dedicada
      setHistory(prev => {
        const filtered = prev.filter(i => i.id !== item.id);
        return [item, ...filtered].slice(0, 20);
      });
    }
  };

  const handleBackFromWatch = () => {
    setCurrentView('home');
    setSelectedMedia(null);
  };

  const handleProfileClick = () => {
    if (!currentUser) {
      setCurrentView('login');
    } else {
      setSearchQuery('');
      setCurrentView('profile');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMyList([]);
    setHistory([]);
    setCurrentView('home');
    localStorage.removeItem('voyo_currentUser');
  };

  const handleUpdateUser = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('voyo_users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...updatedData };
      users[userIndex] = updatedUser;
      localStorage.setItem('voyo_users', JSON.stringify(users));
      setCurrentUser(updatedUser);
      return true;
    }
    return false;
  };

  const [trending, setTrending] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [action, setAction] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [horror, setHorror] = useState([]);
  const [romance, setRomance] = useState([]);
  const [documentaries, setDocumentaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          trendingData, moviesData, seriesData,
          actionData, comedyData, horrorData, romanceData, docsData
        ] = await Promise.all([
          getTrending(), getPopularMovies(), getPopularSeries(),
          getActionMovies(), getComedyMovies(), getHorrorMovies(),
          getRomanceMovies(), getDocumentaries()
        ]);
        
        setTrending(trendingData); setMovies(moviesData); setSeries(seriesData);
        setAction(actionData); setComedy(comedyData); setHorror(horrorData);
        setRomance(romanceData); setDocumentaries(docsData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchMedia(searchQuery);
        setSearchResults(results);
      } catch (err) {} finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedProvider) {
      setProviderMedia([]);
      return;
    }
    const fetchProviderData = async () => {
      setProviderLoading(true);
      try {
        const [moviesData, seriesData] = await Promise.all([
          getMediaByProvider(selectedProvider.id, 'movie'),
          getMediaByProvider(selectedProvider.id, 'tv')
        ]);
        setProviderMedia([...moviesData, ...seriesData].sort(() => Math.random() - 0.5));
      } catch (err) {
        console.error(err);
      } finally {
        setProviderLoading(false);
      }
    };
    fetchProviderData();
  }, [selectedProvider]);

  const kidModeActive = currentUser?.isKidMode;
  const blockedGenres = [28, 27, 80, 53, 10749]; 

  const applyKidFilter = (items) => {
    if (!kidModeActive) return items;
    return items.filter(item => {
      if (item.adult) return false; 
      if (!item.genre_ids || item.genre_ids.length === 0) return true; 
      return !item.genre_ids.some(id => blockedGenres.includes(id));
    });
  };

  if (loading) {
    return (
      <div className="app-container flex-center" style={{ height: '100vh', flexDirection: 'column' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const validTrending = applyKidFilter(trending);
  const validMovies = applyKidFilter(movies);
  const validSeries = applyKidFilter(series);

  const heroItem = 
    currentView === 'series' && validSeries.length > 0 ? validSeries[0] :
    currentView === 'movies' && validMovies.length > 0 ? validMovies[0] :
    validTrending.length > 0 ? validTrending[0] : null;

  return (
    <div className="app-container">
      {/* Esconde a Navbar se estiver na WatchPage ou LoginPage */}
      {currentView !== 'watch' && currentView !== 'login' && (
        <Navbar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          currentView={currentView}
          setCurrentView={setCurrentView}
          onProfileClick={handleProfileClick}
        />
      )}

      {currentView === 'login' ? (
        <LoginPage 
          onLogin={(user) => { 
            setCurrentUser(user);
            setCurrentView('home');
          }} 
          onBack={() => setCurrentView('home')} 
        />
      ) : searchQuery.trim() ? (
        <div className="search-results-section" style={{ paddingTop: '80px', minHeight: '80vh' }}>
          {isSearching ? (
             <div className="flex-center" style={{ padding: '4rem' }}><div className="loading-spinner"></div></div>
          ) : applyKidFilter(searchResults).length > 0 ? (
             <MediaGrid title={`Resultados para "${searchQuery}"`} items={applyKidFilter(searchResults)} onSelect={handleMediaClick} wrap={true} />
          ) : (
             <div className="flex-center" style={{ padding: '4rem', color: 'var(--text-secondary)' }}>
                <h2>Nenhum resultado encontrado.</h2>
             </div>
          )}
        </div>
      ) : currentView === 'watch' && selectedMedia ? (
        <WatchPage 
          item={selectedMedia}
          onBack={handleBackFromWatch}
          myList={applyKidFilter(myList)}
          onAddToList={handleAddToList}
          onRemoveFromList={handleRemoveFromList}
        />
      ) : currentView === 'admin' && (currentUser?.isAdmin || currentUser?.email === 'admin@voyo.com') ? (
        <AdminDashboard onBack={() => setCurrentView('profile')} />
      ) : currentView === 'profile' ? (
        <UserDashboard 
          myList={applyKidFilter(myList)}
          history={applyKidFilter(history)}
          onSelectMedia={handleMediaClick} 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          onClearList={handleClearList}
          onUpdateUser={handleUpdateUser}
          onGoToAdmin={() => setCurrentView('admin')}
        />
      ) : (
        <>
          {heroItem && (
            <div className="hero-section" style={{ backgroundImage: `url(${heroItem.backdrop})` }}>
              <div className="hero-overlay"></div>
              <div className="container hero-content animate-slide-up">
                <h1 className="hero-title">{heroItem.title}</h1>
                <p className="hero-desc">{heroItem.description}</p>
                <button className="play-hero-btn" onClick={() => handleMediaClick(heroItem)}>
                  ▶ Assistir Agora
                </button>
              </div>
            </div>
          )}

          <ProviderBar selectedProvider={selectedProvider} onSelectProvider={setSelectedProvider} />

          <div className="content-sections">
            {selectedProvider ? (
              <div style={{minHeight: '50vh'}}>
                 {providerLoading ? (
                   <div className="flex-center" style={{padding: '3rem'}}><div className="loading-spinner"></div></div>
                 ) : providerMedia.length > 0 ? (
                   <MediaGrid title={`Populares na ${selectedProvider.name}`} items={applyKidFilter(providerMedia)} onSelect={handleMediaClick} wrap={true} />
                 ) : (
                   <p style={{textAlign: 'center', color: '#777'}}>Nenhum título encontrado.</p>
                 )}
              </div>
            ) : (
              <>
              {currentView === 'home' && validTrending.length > 1 && (
              <MediaGrid title="Em Alta" items={validTrending.slice(1)} onSelect={handleMediaClick} />
            )}

            {(currentView === 'home' || currentView === 'movies') && (
              <>
                {validMovies.length > (currentView === 'movies' ? 1 : 0) && (
                  <MediaGrid title="Filmes Populares" items={currentView === 'movies' ? validMovies.slice(1) : validMovies} onSelect={handleMediaClick} />
                )}
                
                {!kidModeActive && action.length > 0 && <MediaGrid title="Ação Explícita" items={action} onSelect={handleMediaClick} />}
                {!kidModeActive && horror.length > 0 && <MediaGrid title="Terror e Suspense" items={horror} onSelect={handleMediaClick} />}
                
                {comedy.length > 0 && <MediaGrid title="Comédias" items={applyKidFilter(comedy)} onSelect={handleMediaClick} />}
                {romance.length > 0 && <MediaGrid title="Romance" items={applyKidFilter(romance)} onSelect={handleMediaClick} />}
                {documentaries.length > 0 && <MediaGrid title="Documentários Aclamados" items={applyKidFilter(documentaries)} onSelect={handleMediaClick} />}
              </>
            )}

            {(currentView === 'home' || currentView === 'series') && (
              <>
                {validSeries.length > (currentView === 'series' ? 1 : 0) && (
                  <MediaGrid title="Séries Imperdíveis" items={currentView === 'series' ? validSeries.slice(1) : validSeries} onSelect={handleMediaClick} />
                )}
              </>
            )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
