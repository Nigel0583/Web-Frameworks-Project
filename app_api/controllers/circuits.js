const mongoose = require('mongoose');
const Cir = mongoose.model('top_circuits');

const _buildLocationList = function (req, res, results, stats) {
    let circuits = [];
    results.forEach((doc) => {
        circuits.push({
            distance: doc.dis,
            circuitName: doc.obj.circuitName,
            locality: doc.obj.locality,
            imagePath: doc.obj.imagePath,
            country: doc.obj.country,
            coords: doc.obj.coords,
            _id: doc.obj._id
        });
    });
    return circuits;
};
const locationsListByDistance = function (req, res) {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    const maxDistance = parseFloat(req.query.maxDistance);
    const point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    const geoOptions = {
        spherical: true,
        maxDistance: 20000,
        num: 10
    };
    if (!lng || !lat || !maxDistance) {
        console.log('locationsListByDistance missing params');
        res
            .status(404)
            .json({
                message : 'lng, lat and maxDistance query parameters are all required'
            });
        return;
    }
    Cir.geoNear(point, geoOptions, (err, results, stats) => {
        const locations = _buildLocationList(req, res, results, stats);
        console.log('Geo Results', results);
        console.log('Geo stats', stats);
        res
            .status(200)
            .json(locations);
    });
};

const locationsCreate = function (req, res) {
    Cir.create({
        circuitName: req.body.circuitName,
        locality: req.body.locality,
        imagePath: req.body.imagePath,
        country: req.body.country,
        coords: req.body.coords
    }, (err, location) => {
        if (err) {
            res
                .status(400)
                .json(err);
        } else {
            res
                .status(201)
                .json(location);
        }
    });
};
const locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        Cir
            .findById(req.params.locationid)
            .exec((err, location) => {
                if (!location) {
                    res
                        .status(404)
                        .json({
                            "message": "locationid not found"
                        });
                    return;
                } else if (err) {
                    res
                        .status(404)
                        .json(err);
                    return;
                }
                res
                    .status(200)
                    .json(location);
            });
    } else {
        res
            .status(404)
            .json({
                "message": "No locationid in request"
            });
    }
};
const locationsUpdateOne = function (req, res) {
    if (!req.params.locationid) {
        res
            .status(404)
            .json({
                "message": "Not found, locationid is required"
            });
        return;
    }
    Cir
        .findById(req.params.locationid)
        .select('-reviews -rating')
        .exec((err, location) => {
                if (!location) {
                    res
                        .json(404)
                        .status({
                            "message": "locationid not found"
                        });
                    return;
                } else if (err) {
                    res
                        .status(400)
                        .json(err);
                    return;
                }
                location.circuitName = req.body.circuitName;
                location.locality = req.body.locality;
                location.imagePath = req.body.imagePath;
                location.country = req.body.country;
                location.coords = [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ];
                location.save((err, location) => {
                    if (err) {
                        res
                            .status(404)
                            .json(err);
                    } else {
                        res
                            .status(200)
                            .json(location);
                    }
                });
            }
        );
};

const locationsDeleteOne = function (req, res) {
    const locationid = req.params.locationid;
    if (locationid) {
        Cir
            .findByIdAndRemove(locationid)
            .exec((err, location) => {
                    if (err) {
                        res
                            .status(404)
                            .json(err);
                        return;
                    }
                    res
                        .status(204)
                        .json(null);
                }
            );
    } else {
        res
            .status(404)
            .json({
                "message": "No locationid"
            });
    }
};


module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};
