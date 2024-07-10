import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import axios from 'axios';
import MovieFilters from './MovieFilters';
import { auth, db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

// Function to get the user ID from Firebase
const getUserId = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data().userId : null;
};

const MovieRecommendation = () => {
    // State variables
    const [prompt, setPrompt] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [genre, setGenre] = useState('');
    const [rating, setRating] = useState('');
    const [userRating, setUserRating] = useState('');
    const [userId, setUserId] = useState(null);
    const [posterUrl, setPosterUrl] = useState(''); // Add a new state variable for the poster URL

    // Fetch user ID when component mounts
    useEffect(() => {
        const fetchUserId = async () => {
            const user = auth.currentUser;
            if (user) {
                const id = await getUserId(user.uid);
                setUserId(id);
            }
        };
        fetchUserId();
    }, []);

    // Log the userId
    console.log('userId:', userId);

    // Handle input change in the prompt field
    const handleInputChange = (e) => {
        setPrompt(e.target.value);
    };

    // Function to fetch recommendations from backend
    const handleGetRecommendations = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/recommendations', {
                prompt,
                searchTerm,
                genre,
                rating,
                userId // Include filters in the request
            });
            console.log('Response data:', response.data); // Debugging: Log the response data
            setRecommendation(response.data.recommendation); // Update recommendation state
            setPosterUrl(response.data.posterUrl); // Update poster URL state
            console.log('Poster URL:', response.data.posterUrl); // Debugging: Log the poster URL
        } catch (error) {
            console.error('Error fetching recommendation:', error);
        }
    };

    // Function to add the recommendation to watch history
    const handleAddToWatchHistory = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/watch-history', {
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

    const handleRatingChange = async (e) => {
        setUserRating(e.target.value);

        console.log('Saving rating:', e.target.value);
        console.log('User ID:', userId);
        console.log('Movie:', recommendation);

        if (!userId || !recommendation || !e.target.value) {
            console.error('Missing required fields');
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/ratings', {
                userId,
                movie: recommendation,
                rating: e.target.value
            });
        } catch (error) {
            console.error('Error saving rating:', error);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#282c34',
                padding: 2,
                color: 'white',
                maxWidth: '1200px',
                margin: '0 auto',
                '@media (max-width: 600px)': {
                    padding: '1rem',
                },
            }}
        >
            <Typography variant="h4"
             gutterBottom>
                Movie Recommendation Service
            </Typography>
            <TextField
                fullWidth
                label="Enter your movie preferences..."
                variant="outlined"
                value={prompt}
                onChange={handleInputChange}
                sx={{
                    marginBottom: 2,
                    input: { color: 'white' },
                    label: { color: 'white' },
                    bgcolor: '#424242',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white',
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',
                        },
                    },
                }}
            />
            <MovieFilters onSearch={setSearchTerm} onFilter={({ genre, rating }) => { setGenre(genre); setRating(rating); }} />
            <Button
                variant="contained"
                color="primary"
                onClick={handleGetRecommendations}
                sx={{ marginTop: 2, marginBottom: 2 }}
            >
                Get Recommendations
            </Button>
            {recommendation && (
                <Box
                    mt={2}
                    p={2}
                    sx={{
                        border: '1px dotted',
                        borderColor: 'gray',
                        bgcolor: '#383838',
                        borderRadius: 1,
                        color: 'white',
                        maxWidth: '600px',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <Typography variant="h6" align="center">Recommended Movie:</Typography>
                    <Typography variant="body1" align="center">{recommendation}</Typography>
                    {posterUrl && (
                        <Box
                            component="img"
                            src={posterUrl}
                            alt="Movie Poster"
                            sx={{
                                width: '300px',
                                maxHeight: '400px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                mt: 2,
                                mx: 'auto',
                            }}
                        />
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAddToWatchHistory}
                        sx={{ mt: 2, mr: 10 }}
                    >
                        Add to Watch History
                    </Button>
                    <TextField
                        select
                        label="Rate this movie"
                        variant="outlined"
                        value={userRating}
                        onChange={handleRatingChange}
                        sx={{ minWidth: 120, mt: 2, bgcolor: 'lightgray', color: 'black' }}
                    >
                        <MenuItem value="">Select Rating</MenuItem>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                    </TextField>
                </Box>
            )}
        </Box>
    );
};

export default MovieRecommendation;
