const mongoose = require('mongoose');
const Cir = mongoose.model('top_circuits');

const _buildLocationList = function (req, res, results, stats) {
    let locations = [];
    results.forEach((doc) => {
        locations.push({
            distance: doc.dis,
            circuitName: doc.obj.circuitName,
            locality: doc.obj.locality,
            country: doc.obj.country,
            coords: doc.obj.coords,
            _id: doc.obj._id
        });
    });
    return locations;
};
const locationsListByDistance = async (req, res) => {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    const near = {
        type: "Point",
        coordinates: [lng, lat]
    };
    const geoOptions = {
        distanceField: "distance.calculated",
        key: 'coords',
        spherical: true,
        maxDistance: 20000,
        limit: 10
    };
    if (!lng || !lat) {
        return res
            .status(404)
            .json({
                "message": "lng and lat query parameters are required"
            });
    }

    try {
        const results = await Cir.aggregate([
            {
                $geoNear: {
                    near
                }
            }
        ]);
        const locations = results.map(result => {
            return {
                id: result._id,
                circuitName: result.circuitName,
                locality: result.locality,
                country: result.country,
                coords: result.coords,
                distance: '${result.distance.calculated.toFixed()}m'
            }
        });

        res
            .status(200)
            .json(locations);
    } catch (err) {
        res
            .status(404)
            .json(err);
    }
};

const locationsCreate = function (req, res) {
    Cir.create({
        circuitName: req.body.circuitName,
        locality: req.body.locality,
        image: req.body.image,
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
                location.image = req.body.image;
                location.country = req.body.country;
                location.coords = req.body.coords;
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
