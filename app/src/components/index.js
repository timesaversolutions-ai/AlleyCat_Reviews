const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to MongoDB (replace with your own connection string)
mongoose.connect('mongodb://localhost:27017/pickleball', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(express.json());

// Define a Court model
const Court = mongoose.model('Court', new mongoose.Schema({
  name: String,
  description: String,
  location: String,
}));

// API endpoint to get all courts
app.get('/api/courts', async (req, res) => {
  const courts = await Court.find();
  res.json(courts);
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
