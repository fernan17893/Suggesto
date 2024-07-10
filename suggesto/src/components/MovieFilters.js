import React, { useState } from 'react';
import { TextField, MenuItem, Box } from '@mui/material';

const MovieFilters = ({ onSearch, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [genre, setGenre] = useState('');
    const [rating, setRating] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleGenreChange = (e) => {
        setGenre(e.target.value);
        onFilter({ genre: e.target.value, rating });
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
        onFilter({ genre, rating: e.target.value });
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, marginTop: 2, flexDirection: 'column', alignItems: 'center', '@media (min-width: 600px)': { flexDirection: 'row' } }}>
            <TextField
                fullWidth
                label="Search for movies..."
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
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
            <TextField
                select
                label="Genre"
                variant="outlined"
                value={genre}
                onChange={handleGenreChange}
                sx={{
                    minWidth: 120,
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
            >
                <MenuItem value="">All Genres</MenuItem>
                <MenuItem value="action">Action</MenuItem>
                <MenuItem value="comedy">Comedy</MenuItem>
                <MenuItem value="drama">Drama</MenuItem>
                {/* Add more genres as needed */}
            </TextField>
            <TextField
                select
                label="Rating"
                variant="outlined"
                value={rating}
                onChange={handleRatingChange}
                sx={{
                    minWidth: 120,
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
            >
                <MenuItem value="">All Ratings</MenuItem>
                <MenuItem value="G">G</MenuItem>
                <MenuItem value="PG">PG</MenuItem>
                <MenuItem value="PG-13">PG-13</MenuItem>
                <MenuItem value="R">R</MenuItem>
                {/* Add more ratings as needed */}
            </TextField>
        </Box>
    );
};

export default MovieFilters;
