const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: String,
    createdOn: {
        type: Date,
        'default': Date.now
    }
});

const topCircuitSchema = new mongoose.Schema({
    circuitName: {type: String, required: true},
    locality: String,
    imagePath: String,
    country: String,
    text: String,
    source: String,
    coords: {type: [Number], index: '2dsphere'},
    reviews: [reviewSchema]
});

mongoose.model('top_circuits', topCircuitSchema);
