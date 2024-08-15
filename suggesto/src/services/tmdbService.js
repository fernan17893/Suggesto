import axios from 'axios';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';

const API_KEY = process.env.REACT_APP_TMDB_AP;
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to get popular movie recommendations from TMDB API
export const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  };

  // Function to store movies in Firestore
export const storeMoviesInFirestore = async (movies) => {
    try {
      const moviesCollection = collection(db, 'movies');
      for (const movie of movies) {
        await addDoc(moviesCollection, {
          id: movie.id,
          title: movie.title,
          genres: movie.genre_ids,
          overview: movie.overview,
          rating: movie.vote_average,
          posterUrl: movie.poster_path,
        });
      }
      console.log('Movies stored successfully');
    } catch (error) {
      console.error('Error storing movies:', error);
    }
  };
  
  // Function to fetch and store popular movies
  export const fetchAndStoreMovies = async () => {
    const movies = await fetchPopularMovies();
    await storeMoviesInFirestore(movies);
  };

