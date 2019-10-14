const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/circuits');
const ctrlReviews = require('../controllers/reviews');

// locations
router
  .route('/circuits')
  .get(ctrlLocations.locationsListByDistance)
  .post(ctrlLocations.locationsCreate);

router
  .route('/circuits/:locationid')
  .get(ctrlLocations.locationsReadOne)
  .put(ctrlLocations.locationsUpdateOne)
  .delete(ctrlLocations.locationsDeleteOne);
  
// reviews
router
  .route('/circuits/:locationid/reviews')
  .post(ctrlReviews.reviewsCreate);

router
  .route('/circuits/:locationid/reviews/:reviewid')
  .get(ctrlReviews.reviewsReadOne)
  .put(ctrlReviews.reviewsUpdateOne)
  .delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;
