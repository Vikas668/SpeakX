const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let questionsCollection;

const connectToDatabase = async () => {
    try {
        await client.connect();
        questionsCollection = client.db('questionsDB').collection('questions');
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const getQuestionsCollection = () => {
    if (!questionsCollection) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return questionsCollection;
};

module.exports = { connectToDatabase, getQuestionsCollection };
