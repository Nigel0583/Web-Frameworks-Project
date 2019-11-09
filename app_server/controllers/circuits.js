const apiOptions = {
    server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://f-1.herokuapp.com';
}

const request = require('request');

const _renderHomepage = function(req, res, responseBody){
    let message = null;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No places found nearby";
        }
    }
    res.render('locations-list', {
        title: 'Top 10 Circuits',
        pageHeader: {
            title: 'Top 10 Circuits',
            strapline: 'The top ten Formula one circuits from around the world'
        },
        circuits: responseBody,
        message: message
    });
};



/* GET 'home' page */
const homelist = function (req, res) {
    const path = '/api/circuits';
    const requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs: {
            lng: 45.6218,
            lat:  9.2848,
            maxDistance: 20
        }
    };
    request(requestOptions, (err, response, body) => {
            let data = body;
            if (response.statusCode === 200 && data.length) {
                for (let i = 0; i < data.length; i++) {
                    data[i].distance = _formatDistance(data[i].distance);
                }
            }
            _renderHomepage(req, res, data);
        }
    );
};

const _formatDistance = function (distance) {
    let thisDistance = 0;
    let unit = 'm';
    if (distance > 1000) {
        thisDistance = parseFloat(distance / 1000).toFixed(1);
        unit = 'km';
    } else {
        thisDistance = Math.floor(distance);
    }
    return thisDistance + unit;
};


/* GET 'Location info' page */
const locationInfo = function (req, res) {
    res.render('location-info', {
        title: 'Location 1',
        pageHeader: {
            title: 'Track'
        },
        sidebar: {
            context: 'Lorem',
            callToAction: 'Lorem ipsum'
        },
        location: {
            name: 'Location 2',
            address: 'Address',
            rating: 3,
            facilities: ['Features'],
            coords: {
                lat: 51.455041,
                lng: -0.9690884
            },
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [{
                author: 'Tom',
                rating: 5,
                timestamp: '18 July 2019',
                reviewText: 'What a great place. I can\'t say enough good things about it.'
            }, {
                author: 'Charlie Chaplin',
                rating: 3,
                timestamp: '16 June 2013',
                reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
            }]
        }
    });
};

/* GET 'Add review' page */
const addReview = function (req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: {title: 'Review Starcups'}
    });
};

module.exports = {
    homelist,
    locationInfo,
    addReview
};