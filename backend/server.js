const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { connectToDatabase, getQuestionsCollection } = require('./db'); // Importing the new db module

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PROTO_PATH = './proto/questions.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const QuestionsService = grpc.loadPackageDefinition(packageDefinition).QuestionsService;

// Connect to the database
connectToDatabase();

const searchQuestions = async (call, callback) => {
  try {
    const query = call.request.query.toLowerCase();
    const questionsCollection = getQuestionsCollection(); 
    const results = await questionsCollection.find({ title: { $regex: query, $options: 'i' } }).toArray();
    const questions = results.map((q) => ({
      id: q._id.toString(),
      type: q.type,
      title: q.title,
    }));
    callback(null, { questions });
  } catch (err) {
    console.error('gRPC error:', err);
    callback(err);
  }
};

const server = new grpc.Server();
server.addService(QuestionsService.service, { SearchQuestions: searchQuestions });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('Failed to start gRPC server:', error);
    return;
  }
  server.start();
  console.log('gRPC server running on port', port);
});



app.post('/api/search', (req, res) => {
  const query = req.body.query;

  const grpcClient = new QuestionsService('localhost:50051', grpc.credentials.createInsecure());

  grpcClient.SearchQuestions({ query }, (error, response) => {
    if (error) {
      console.error('gRPC client error:', error);
      return res.status(500).json({ error: 'gRPC error occurred' });
    }
    res.json(response);
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
