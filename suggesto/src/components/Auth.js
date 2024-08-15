import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Box, Button, TextField, Typography } from '@mui/material';
import MovieRecommendation from './MovieRecommendation';
import '../styles/auth.css';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [preferences, setPreferences] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPreferences(docSnap.data().preferences);
                }
            } else {
                setUser(null);
                setPreferences(null);
            }
        });
        return unsubscribe;
    }, []);

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                userId: user.email.split('@')[0],
                preferences: {
                    genres: ['Action', 'Comedy'], // Default preferences
                    minRating: 3 // Default minimum rating
                }
            });
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
    };

    return (
        <div className='container'>
            {user ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        marginTop: 10,
                    }}
                >
                    <Typography variant="h5">Welcome, {user.email.split('@')[0]}</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSignOut}
                        sx={{ mt: 2, bgcolor: '#e50914' }}
                    >
                        Sign Out
                    </Button>
                    <MovieRecommendation user={user} preferences={preferences} />
                </Box>
            ) : (
                <div className='form'>
                    <h2>Sign In / Sign Up</h2>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                        InputProps={{
                            style: { color: 'white' },
                            sx: {
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
                            },
                        }}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                        InputProps={{
                            style: { color: 'white' },
                            sx: {
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
                            },
                        }}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSignIn}
                        
                    >
                        Sign In
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSignUp}
                        
                    >
                        Sign Up
                    </Button>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                </div>
            )}
        </div>
    );
};

export default Auth;
