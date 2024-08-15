import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import MovieFilters from './MovieFilters';
import { auth } from '../firebase-config';
import MovieRecommendationDisplay from './MovieRecommendationDisplay';

const MovieRecommendation = () => {
    const [prompt, setPrompt] = useState('');
    const [recommendation, setRecommendation] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [genre, setGenre] = useState('');
    const [rating, setRating] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const user = auth.currentUser;
            if (user) {
                setUserId(user.uid);
                console.log('Fetched user ID:', user.uid);
            } else {
                console.log('No user is currently logged in');
            }
        };
        fetchUserId();
    }, []);

    const handleInputChange = (e) => {
        setPrompt(e.target.value);
    };

    const handleGetRecommendations = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/recommendations', {
                prompt,
                searchTerm,
                genre,
                rating
            });
            setRecommendation(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const handleAddToWatchHistory = async () => {
        try {
            await axios.post('http://localhost:3001/api/watch-history', {
                userId,
                recommendation,
                prompt: prompt || '',
                searchTerm: searchTerm || '',
                genre: genre || '',
                rating: rating || ''
            });
            alert('Added to watch history!');
        } catch (error) {
            console.error('Error adding to watch history:', error);
        }
    };

    const handleRatingChange = async (event, newValue) => {
        setUserRating(newValue);
        try {
            await axios.post('http://localhost:3001/api/ratings', {
                userId,
                movie: recommendation.title,
                rating: newValue
            });
        } catch (error) {
            console.error('Error saving rating:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
                label="Enter your prompt"
                value={prompt}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    style: { color: 'white' },
                }}
                InputProps={{
                    style: {
                        color: 'white',
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                    },
                }}
            />
            {/* <MovieFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                genre={genre}
                setGenre={setGenre}
                rating={rating}
                setRating={setRating}
            /> */}
            <Button variant="contained" color="primary" onClick={handleGetRecommendations} sx={{ marginBottom: 2 }}>
                Get Recommendations
            </Button>
            {recommendation && recommendation.title && (
                <MovieRecommendationDisplay
                    title={recommendation.title}
                    posterUrl={recommendation.posterUrl}
                    overview={recommendation.overview}
                    userRating={userRating}
                    handleAddToWatchHistory={handleAddToWatchHistory}
                    handleRatingChange={handleRatingChange}
                    movieRating={recommendation.rating}
                />
            )}
        </Box>
    );
};

export default MovieRecommendation;
