import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios'; // Import Axios

const MovieRecommendation = () => {
    // State variables
    const [prompt, setPrompt] = useState('');
    const [recommendation, setRecommendation] = useState('');

    // Handle input change in the prompt field
    const handleInputChange = (e) => {
        setPrompt(e.target.value);
    };

    // Function to fetch recommendations from backend
    const handleGetRecommendations = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/recommendations', {
                prompt // Send user input as prompt
            });
            setRecommendation(response.data.recommendation); // Update recommendation state
        } catch (error) {
            console.error('Error fetching recommendation:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Movie Recommendation Service
            </Typography>
            <TextField
                fullWidth
                label="Enter your movie preferences..."
                variant="outlined"
                value={prompt}
                onChange={handleInputChange}
                sx={{ marginBottom: 2, input: { color: 'black' }, label: { color: 'black' }, bgcolor: 'lightgray' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleGetRecommendations}
                sx={{ marginBottom: 2 }}
            >
                Get Recommendations
            </Button>
            {recommendation && (
                <Box mt={2}
                p={2}
                sx={{
                    border: '2px dashed',
                    borderColor: 'gray',
                    bgcolor: '#383838',
                    borderRadius: 1,
                    color: 'white'
                }}>
                    <Typography variant="h4">Recommended Movie:</Typography>
                    <Typography variant="body1">{recommendation}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default MovieRecommendation;
