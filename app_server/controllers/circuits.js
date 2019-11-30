const apiOptions = {
    server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://f-1.herokuapp.com';
}

const request = require('request');

/* GET 'home' page */
const homelist = function (req, res) {
    const path = '/api/circuits';
    const requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs: {
            lng: -9.673084,
            lat: 52.286301,
            maxDistance: 10000000000000000
        }
    };
    request(
        requestOptions, (err, response, body) => {
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
const locationInfo = function(req, res){
    _getLocationInfo(req, res, (req, res, responseData) => {
        console.log(responseData);
        _renderDetailPage(req, res, responseData);
    });
};

/* GET 'Add review' page */
const addReview = function(req, res){
    _getLocationInfo(req, res, (req, res, responseData) => {
        _renderReviewForm(req, res, responseData);
    });
};

const doAddReview = function(req, res) {
    const locationid = req.params.locationid;
    const path = `/api/circuits/${locationid}/reviews`;
    const postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    const requestOptions = {
        url : apiOptions.server + path,
        method : 'POST',
        json : postdata
    };
    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect(`/circuits/${locationid}/review/new?err=val`);
    } else {
        request(
            requestOptions,
            (err, response, body) => {
                if (response.statusCode === 201) {
                    res.redirect(`/circuit/${locationid}`);
                } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError' ) {
                    res.redirect(`/circuit/${locationid}/review/new?err=val`);
                } else {
                    _showError(req, res, response.statusCode);
                }
            }
        );
    }
};

// PRIVATE METHODS
const _getLocationInfo = function(req, res, callback) {
    const path = `/api/circuits/${req.params.locationid}`;
    const requestOptions = {
        url : apiOptions.server + path,
        method : 'GET',
        json : {}
    };
    request(
        requestOptions,
        (err, response, body) => {
            let data = body;
            if (response.statusCode === 200) {
                data.coords = {
                    lng : body.coords[0],
                    lat : body.coords[1]
                };
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

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

const _renderDetailPage = function(req, res, locDetail) {
    res.render('location-info', {
        title: locDetail.circuitName,
        pageHeader: {
            title: locDetail.circuitName
        },
        location: locDetail
    });
};

const _renderReviewForm = function(req, res, locDetail) {
    res.render('location-review-form', {
        title: `Review ${locDetail.circuitName}`,
        pageHeader: { title: `Review ${locDetail.circuitName}`  },
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
        content = 'Looks like we can\'t find this page. Sorry.';
    } else {
        title = `${status}, something's gone wrong`;
        content = 'Something, somewhere, has gone just a little bit wrong.';
    }
    res.status(status);
    res.render('error', {
        title : title,
        content : content
    });
};



module.exports = {
    homelist,
    locationInfo,
    addReview,
    doAddReview
};