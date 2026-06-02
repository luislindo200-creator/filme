const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

const fetchFromTMDB = async (endpoint, extraParams = '') => {
  if (!API_KEY || API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
    throw new Error("TMDb API Key not configured. Please add it to .env.local");
  }

  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR${extraParams}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
};

const formatMedia = (item, type = 'movie') => {
  return {
    id: item.id,
    title: item.title || item.name,
    type: item.media_type || type,
    poster: item.poster_path ? `${IMAGE_BASE_URL}w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
    backdrop: item.backdrop_path ? `${IMAGE_BASE_URL}original${item.backdrop_path}` : 'https://via.placeholder.com/1920x1080?text=No+Backdrop',
    year: (item.release_date || item.first_air_date || '').split('-')[0],
    rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
    description: item.overview || 'Sem descrição disponível.',
    genre_ids: item.genre_ids || [],
    adult: item.adult || false,
  };
};

export const getTrending = async () => {
  const data = await fetchFromTMDB('/trending/all/day');
  return data.results.map(item => formatMedia(item, item.media_type));
};

export const getPopularMovies = async () => {
  const data = await fetchFromTMDB('/movie/popular');
  return data.results.map(item => formatMedia(item, 'movie'));
};

export const getPopularSeries = async () => {
  const data = await fetchFromTMDB('/tv/popular');
  return data.results.map(item => formatMedia(item, 'series'));
};

export const getActionMovies = async () => {
  const data = await fetchFromTMDB('/discover/movie', '&with_genres=28');
  return data.results.map(item => formatMedia(item, 'movie'));
};

export const getComedyMovies = async () => {
  const data = await fetchFromTMDB('/discover/movie', '&with_genres=35');
  return data.results.map(item => formatMedia(item, 'movie'));
};

export const getHorrorMovies = async () => {
  const data = await fetchFromTMDB('/discover/movie', '&with_genres=27');
  return data.results.map(item => formatMedia(item, 'movie'));
};

export const getRomanceMovies = async () => {
  const data = await fetchFromTMDB('/discover/movie', '&with_genres=10749');
  return data.results.map(item => formatMedia(item, 'movie'));
};

export const getDocumentaries = async () => {
  const data = await fetchFromTMDB('/discover/movie', '&with_genres=99');
  return data.results.map(item => formatMedia(item, 'movie'));
};

export const getMediaByProvider = async (providerId, type = 'movie') => {
  const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
  const data = await fetchFromTMDB(endpoint, `&with_watch_providers=${providerId}&watch_region=BR&sort_by=popularity.desc`);
  return data.results.map(item => formatMedia(item, type));
};

export const searchMedia = async (query) => {
  if (!query) return [];
  const data = await fetchFromTMDB('/search/multi', `&query=${encodeURIComponent(query)}`);
  return data.results
    .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
    .map(item => formatMedia(item, item.media_type));
};

// --- New Watch Providers Function ---
export const getWatchProviders = async (id, type = 'movie') => {
  try {
    const data = await fetchFromTMDB(`/${type}/${id}/watch/providers`);
    // Pegar provedores do Brasil (BR)
    const brData = data.results && data.results['BR'];
    
    if (brData && brData.flatrate) {
      return brData.flatrate.map(provider => ({
        provider_id: provider.provider_id,
        provider_name: provider.provider_name,
        logo_path: `${IMAGE_BASE_URL}w92${provider.logo_path}`
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch watch providers", error);
    return [];
  }
};

export const getTvDetails = async (id) => {
  try {
    return await fetchFromTMDB(`/tv/${id}`);
  } catch (error) {
    console.error("Failed to fetch TV details", error);
    return null;
  }
};

export const getTvSeason = async (id, seasonNumber) => {
  try {
    return await fetchFromTMDB(`/tv/${id}/season/${seasonNumber}`);
  } catch (error) {
    console.error("Failed to fetch TV season", error);
    return null;
  }
};
