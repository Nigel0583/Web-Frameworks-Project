const mongoose = require('mongoose');

const topCircuitSchema = new mongoose.Schema({
  circuitName: String,
  locality: String,
  image: String,
  country: String
});

mongoose.model('TopCircuits', topCircuitSchema);