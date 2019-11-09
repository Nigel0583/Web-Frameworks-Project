const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/circuits');
const ctrlOthers = require('../controllers/others');

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/circuit/:locationid', ctrlLocations.locationInfo);
router.get('/circuit/review/new', ctrlLocations.addReview);

/* Other pages */
router.get('/about', ctrlOthers.about);
router.get('/login', ctrlOthers.login);
router.get('/register', ctrlOthers.register);

module.exports = router;
