const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();
const serviceAccount = require('./firebase-adminsdk.json');
const OpenAI = require('openai');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

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
    const prompt = req.body.prompt;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            prompt: `Suggest a movie to watch. ${prompt}`,
            max_tokens: 50,
        });

        const recommendation = completion.data.choices[0].text.trim();
        res.json({ recommendation });
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        res.status(500).send('Error fetching recommendation');
    }
});

// Endpoint for user preferences (if needed)
app.post('/api/user-preferences', async (req, res) => {
    const userId = req.body.userId;
    const preferences = req.body.preferences;

    try {
        await db.saveUserPreferences(userId, preferences); // Example function from db.js
        res.status(200).send('Preferences saved');
    } catch (error) {
        res.status(500).send('Error saving preferences: ' + error.message);
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
