const { MongoClient } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function loadData() {
  const rawData = fs.readFileSync('./speakx_questions.json');
  const data = JSON.parse(rawData);

  
  const transformedData = data.map(item => ({
    ...item,
    _id: item._id.$oid || item._id  
  }));

  await client.connect();
  const questionsCollection = client.db('questionsDB').collection('questions');
  await questionsCollection.insertMany(transformedData);
  console.log('Data loaded successfully');
  await client.close();
}

loadData().catch(console.error);

