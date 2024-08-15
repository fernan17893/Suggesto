// recommendationService.js
import { db } from '../firebase-config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

const genreMapping = {
    "Action": 16,
    "Comedy": 35,
    "Drama": 18,
    "Sci-Fi": 878,
    "Thriller": 53,
    "Horror": 27,
    "Romance": 10749,
    "Documentary": 99,
    "Animation": 16,
    "Adventure": 12,
    "Fantasy": 14,
    "Crime": 80,
    "Family": 10751,
    "Mystery": 9648,
    "War": 10752,
    "Music": 10402,
    "History": 36,
    "Western": 37,
    "TV Movie": 10770,
};

export const getRecommendations = async (userId, prompt) => {
    if (!userId) {
        throw new Error('User not found');
    }

    // Fetch user preferences
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    let userPreferences = null;
    if (userDoc.exists()) {
        userPreferences = userDoc.data().preferences;
        // Convert genre names to IDs
        if (userPreferences.genres) {
            userPreferences.genres = userPreferences.genres.map(genre => genreMapping[genre] || genre);
        }
    }

    console.log('User preferences: ', userPreferences);

    let recommendations = [];
    if (userPreferences) {
        // Query movies collection based on user preferences
        const moviesCollection = collection(db, 'movies');
        const q = query(
            moviesCollection,
            where('genres', 'array-contains-any', userPreferences.genres),
            where('rating', '>=', userPreferences.minRating)
        );

        console.log('Executing query with preferences:', q);

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            recommendations.push(doc.data());
        });

        console.log('Recommendations based on preferences:', recommendations);
    }

    if (recommendations.length === 0) {
        // Fallback to user prompt if no preferences or no matches found
        const moviesCollection = collection(db, 'movies');
        const promptQuery = query(
            moviesCollection,
            where('overview', '>=', prompt),
            where('overview', '<=', prompt + '\uf8ff')
        );

        console.log('Executing fallback query with prompt:', promptQuery);

        const querySnapshot = await getDocs(promptQuery);
        querySnapshot.forEach((doc) => {
            recommendations.push(doc.data());
        });

        console.log('Fallback recommendations based on prompt:', recommendations);
    }

    return recommendations;
};
