import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../styles/auth.css';
import MovieRecommendation from './MovieRecommendation';

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
                <div className='logout'>
                    <h2>Welcome, {user.email.split('@')[0]}</h2>
                    <button onClick={handleSignOut}>Sign Out</button>
                    <MovieRecommendation user={user} preferences={preferences} />
                </div>
            ) : (
                <div className='form'>
                    <h2>Sign In / Sign Up</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleSignIn}>Sign In</button>
                    <button onClick={handleSignUp}>Sign Up</button>
                    {error && <p>{error}</p>}
                </div>
            )}
        </div>
    );
};

export default Auth;
