const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();
const serviceAccount = require('./firebase-adminsdk.json');
const OpenAI = require('openai');
const axios = require('axios');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const db = admin.firestore();

const app = express();
app.use(express.json());
app.use(cors());

// Configure OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to Suggesto API');
});

// Endpoint for movie recommendations
app.post('/api/recommendations', async (req, res) => {
    const { prompt, searchTerm, genre, rating } = req.body;

    try {
        const filters = [];
        if (searchTerm) filters.push(`with the search term "${searchTerm}"`);
        if (genre) filters.push(`in the ${genre} genre`);
        if (rating) filters.push(`rated ${rating}`);

        const filterText = filters.length > 0 ? `, ${filters.join(', ')}` : '';

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that suggests movies based on user preferences."
                },
                {
                    role: "user",
                    content: `Suggest a movie to watch based on the following preferences: ${prompt}${filterText}.`
                }
            ],
            max_tokens: 150, // Increase this value to allow for longer responses
        });

        const recommendation = completion.choices[0].message.content.trim();

        // Extract movie title from the recommendation text
        const movieTitleMatch = recommendation.match(/"([^"]+)"/);
        const movieTitle = movieTitleMatch ? movieTitleMatch[1] : recommendation;

        // Fetch movie details from TMDb
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query: movieTitle
            }
        });

        const movie = tmdbResponse.data.results[0]; // Assuming the first result is the most relevant

        if (movie) {
            const movieDetails = {
                title: movie.title,
                posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                overview: movie.overview,
                recommendation: recommendation
            };
            res.json(movieDetails);
        } else {
            res.json({ recommendation, message: 'No additional details found' });
        }
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        res.status(500).send('Error fetching recommendation');
    }
});

// Endpoint for creating a user document
app.post('/api/users', async (req, res) => {
    const { userId, name, email, preferences } = req.body;

    try {
        await db.collection('users').doc(userId).set({
            name,
            email,
            preferences
        });

        res.status(200).send('User created');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user: ' + error.message);
    }
});

// Endpoint for saving watch history
app.post('/api/watch-history', async (req, res) => {
    const { userId, prompt = '', searchTerm = '', genre = '', rating = '', recommendation } = req.body;

    // Validate required fields
    if (!userId || !recommendation) {
        return res.status(400).send('Missing required fields: userId or recommendation');
    }

    try {
        await db.collection('watchHistory').add({
            userId,
            prompt,
            searchTerm,
            genre,
            rating,
            recommendation,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).send('Watch history saved');
        console.log('Watch history saved');
    } catch (error) {
        console.error('Error saving watch history:', error);
        res.status(500).send('Error saving watch history: ' + error.message);
    }
});

// Endpoint for saving ratings
app.post('/api/ratings', async (req, res) => {
    const { userId, movie, rating } = req.body;

    // Validation to ensure required fields are present
    if (!userId || !movie || !rating) {
        return res.status(400).send('Missing required fields');
    }

    try {
        await db.collection('ratings').add({
            userId,
            movie,
            rating,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).send('Rating saved');
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).send('Error saving rating: ' + error.message);
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
