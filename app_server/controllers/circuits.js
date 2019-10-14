const request = require('request');
const apiOptions = {
    server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://f-1.herokuapp.com';
}
/* GET 'home' page */
const homelist = (req, res) => {
    const path = '/api/circuits';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {},
        qs: {
            lng: -0.7992599,
            lat: 51.378091
        }
    };
    request(
        requestOptions,
        (err, response, body) => {
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