import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { auth } from '../firebase-config';
import MovieRecommendationDisplay from './MovieRecommendationDisplay';

const MovieRecommendation = () => {
    const [prompt, setPrompt] = useState('');
    const [recommendation, setRecommendation] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/api/recommendations', {
                prompt
            });
            setRecommendation(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setLoading(false);
        }
    };

    const handleAddToWatchHistory = async () => {
        try {
            await axios.post('http://localhost:3001/api/watch-history', {
                userId,
                recommendation,
                prompt: prompt || ''
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

    const handleAnotherOption = async () => {
        setRecommendation({});
        await handleGetRecommendations();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                minHeight: '80vh',
                
                color: '#fff',
                
                
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 800,  }}>
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
                    sx={{ backgroundColor: '#333' }}
                />
                <Button variant="contained" color="primary" onClick={handleGetRecommendations} sx={{   }}>
                    Get Recommendations
                </Button>
                {loading && <CircularProgress sx={{ marginBottom: 2 }} />}
            </Box>
            {recommendation && recommendation.title && (
                <Box sx={{ width: '100%', maxWidth: 800, maxHeight: 400 }}>
                    <MovieRecommendationDisplay
                        title={recommendation.title}
                        posterUrl={recommendation.posterUrl}
                        overview={recommendation.overview}
                        userRating={userRating}
                        handleAddToWatchHistory={handleAddToWatchHistory}
                        handleRatingChange={handleRatingChange}
                        movieRating={recommendation.rating}
                    />
                    <Button variant="contained" color="secondary" onClick={handleAnotherOption} sx={{ marginTop: 1, marginBottom: 2, }}>
                        Another Option
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MovieRecommendation;
