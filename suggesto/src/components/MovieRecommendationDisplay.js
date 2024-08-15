import React from 'react';
import { Box, Typography, Button, Rating } from '@mui/material';

const MovieRecommendationDisplay = ({ title, posterUrl, overview, userRating, handleAddToWatchHistory, handleRatingChange, movieRating }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: '#424242',
                padding: 2,
                borderRadius: 1,
                boxShadow: 3,
                maxWidth: '100%',
                margin: '20px 0',
                textAlign: 'center',
            }}
        >
            {posterUrl && <img src={posterUrl} alt={title} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />}
            <Typography variant="h5" gutterBottom sx={{ marginTop: 2 }}>
                {title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {overview}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                <Typography variant="h6" sx={{ marginRight: 1 }}>Your Rating:</Typography>
                <Rating
                    name="user-rating"
                    value={userRating}
                    onChange={handleRatingChange}
                    max={5}
                    precision={0.5}
                    sx={{ marginLeft: 1 }}
                />
            </Box>
            <Button variant="contained" color="secondary" onClick={handleAddToWatchHistory}>
                Add to Watch History
            </Button>
        </Box>
    );
};

export default MovieRecommendationDisplay;
