import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase-config';
import { TextField, Button, Box, MenuItem, Typography } from '@mui/material';

const UserPreferences = () => {
    const [userId, setUserId] = useState(null);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const user = auth.currentUser;
            if (user) {
                setUserId(user.uid);
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSelectedGenres(data.preferences.genres || []);
                    setMinRating(data.preferences.minRating || '');
                }
            }
        };
        fetchUser();
    }, []);

    const handleSavePreferences = async () => {
        if (!userId) return;
        try {
            const userDocRef = doc(db, 'users', userId);
            await setDoc(userDocRef, {
                preferences: {
                    genres: selectedGenres,
                    minRating,
                },
            }, { merge: true });
            alert('Preferences saved!');
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6">User Preferences</Typography>
            <TextField
                select
                label="Preferred Genres"
                value={selectedGenres}
                onChange={(e) => setSelectedGenres(e.target.value)}
                SelectProps={{
                    multiple: true,
                }}
                variant="outlined"
                sx={{ marginBottom: 2, width: '100%' }}
            >
                <MenuItem value="action">Action</MenuItem>
                <MenuItem value="comedy">Comedy</MenuItem>
                <MenuItem value="drama">Drama</MenuItem>
                {/* Add more genres as needed */}
            </TextField>
            <TextField
                select
                label="Minimum Rating"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                variant="outlined"
                sx={{ marginBottom: 2, width: '100%' }}
            >
                <MenuItem value="G">G</MenuItem>
                <MenuItem value="PG">PG</MenuItem>
                <MenuItem value="PG-13">PG-13</MenuItem>
                <MenuItem value="R">R</MenuItem>
                {/* Add more ratings as needed */}
            </TextField>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSavePreferences}
                sx={{ bgcolor: '#e50914' }}
            >
                Save Preferences
            </Button>
        </Box>
    );
};

export default UserPreferences;
