const request = require('request');
const apiOptions = {
    server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://f-1.herokuapp.com';
}
/* GET 'home' page */
const homelist = (req, res) => {
    res.render('locations-list', {
        title: 'Top 10 Circuits',
        pageHeader: {
            title: 'Top 10 Circuits',
            strapline: 'The top ten Formula one circuits from around the world'
        },
        sidebar: "Text here",
        circuits: [{
            circuitName: 'Autodromo Nazionale di Monza',
            locality: 'Monza',
            image: '../img/1024px-Monza_track_map.png',
            country: 'Italy'
        }, {
            circuitName: 'Circuit De Monaco',
            locality: 'Monte Carlo',
            image: '../img/1024px-Monte_Carlo_Formula_1_track_map.png',
            country: 'Monaco'
        }, {
            circuitName: 'Circuit de Spa-Francorchamps',
            locality: 'Stavelot',
            image: '../img/1280px-Spa-Francorchamps_of_Belgium.png',
            country: 'Belgium'
        },{
            circuitName: 'Nürburgring',
            locality: 'Nürburg',
            image: '../img/Nürburgring_-_Grand-Prix-Strecke.png',
            country: 'Germany'
        },{
            circuitName: 'Circuit Gilles Villeneuve',
            locality: 'Montreal',
            image: '../img/1024px-Circuit_Gilles_Villeneuve.png',
            country: 'Canada'
        },{
            circuitName: 'Autódromo José Carlos Pace',
            locality: 'São Paulo',
            image: '../img/800px-Circuit_Interlagos.png',
            country: 'Brazil'
        },{
            circuitName: 'Hockenheimring',
            locality: ' Hockenheim, Baden-Württemberg',
            image: '../img/1024px-Hockenheim2012.png',
            country: 'Germany'
        },{
            circuitName: 'Suzuka Circuit',
            locality: 'Suzuka, Mie Prefecture',
            image: '../img/1024px-Suzuka_circuit_map--2005.png',
            country: 'Japan'
        },{
            circuitName: 'Silverstone Circuit',
            locality: 'Silverstone, Northamptonshire',
            image: '../img/Silverstone_Circuit_2011.png',
            country: 'United Kingdom'
        },{
            circuitName: 'Red Bull Ring',
            locality: ' Spielberg, Styria',
            image: '../img/1280px-Circuit_Red_Bull_Ring.png',
            country: 'Austria'
        }]
    });
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
// PRIVATE METHODS
const _getLocationInfo = function (req, res, callback) {
    const path = `/api/locations/${req.params.locationid}`;
    const requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {}
    };
    request(
        requestOptions,
        (err, response, body) => {
            let data = body;
            if (response.statusCode === 200) {
                data.coords = {
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

const _renderHomepage = function (req, res, responseBody) {
    let message = null;
    if (!(responseBody instanceof Array)) {
        message = 'API lookup error';
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = 'No places found nearby';
        }
    }
    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
        locations: responseBody,
        message: message
    });
};

const _renderDetailPage = function (req, res, locDetail) {
    res.render('location-info', {
        title: locDetail.name,
        pageHeader: {
            title: locDetail.name
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: locDetail
    });
};

const _renderReviewForm = function (req, res, locDetail) {
    res.render('location-review-form', {
        title: `Review ${locDetail.name} on Loc8r`,
        pageHeader: {title: `Review ${locDetail.name}`},
        error: req.query.err
    });
};

const _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const _formatDistance = function (distance) {
    if (distance && _isNumeric(distance)) {
        let thisDistance = 0;
        let unit = 'm';
        if (distance > 1000) {
            thisDistance = parseFloat(distance / 1000).toFixed(1);
            unit = 'km';
        } else {
            thisDistance = Math.floor(distance);
        }
        return thisDistance + unit;
    } else {
        return '?';
    }
};

const _showError = function (req, res, status) {
    let title = '';
    let content = '';
    if (status === 404) {
        title = '404, page not found';
        content = 'Oh dear. Looks like we can\'t find this page. Sorry.';
    } else {
        title = `${status}, something's gone wrong`;
        content = 'Something, somewhere, has gone just a little bit wrong.';
    }
    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    });
};
module.exports = {
    homelist,
    locationInfo,
    addReview
};