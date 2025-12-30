require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI || mongoURI.includes('<db_username>')) {
    console.error('❌ ERROR: MongoDB connection string is not configured properly in .env');
} else {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}

// Result Schema
const ResultSchema = new mongoose.Schema({
    playerX: String,
    playerO: String,
    winner: String, // 'X', 'O', or 'Draw'
    date: { type: Date, default: Date.now }
});

const Result = mongoose.model('Result', ResultSchema);

// Routes
app.post('/api/results', async (req, res) => {
    try {
        const { playerX, playerO, winner } = req.body;
        const newResult = new Result({ playerX, playerO, winner });
        await newResult.save();
        res.status(201).json({ message: 'Result saved successfully', result: newResult });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Failed to save result' });
    }
});

app.get('/api/results', async (req, res) => {
    try {
        const results = await Result.find().sort({ date: -1 }).limit(10);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
