const mongoose = require('mongoose');

const topCircuitSchema = new mongoose.Schema({
    circuitName: String,
    locality: String,
    image: String,
    country: String,
    coords: {type: [[Number]], index: '2dsphere'}
});

mongoose.model('top_circuits', topCircuitSchema);