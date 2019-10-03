/* GET 'home' page */
const homelist = function(req, res){
  res.render('locations-list', {
    title: 'Title',
    pageHeader: {
      title: 'Title',
      strapline: ''
    },
    sidebar: "Text here",
    circuits: [{
      circuitName: 'Albert Park Grand Prix Circuit',
      locality: 'Melbourne',
        facilities: ['key'],
      country: 'Australia'
    }, {
      circuitName: 'Bahrain International Circuit',
      locality: 'Sakhir',
        facilities: ['features'],
      country: 'Bahrain'
    }, {
      circuitName: 'Bahrain International Circuit',
      locality: 'Sakhir',
      facilities: ['features'],
      country: 'Bahrain'
    },{
      circuitName: 'Bahrain International Circuit',
      locality: 'Sakhir',
      facilities: ['features'],
      country: 'Bahrain'
    }]
  });
};

/* GET 'Location info' page */
const locationInfo = function(req, res){
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
const addReview = function(req, res){
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: { title: 'Review Starcups' }
  });
};

module.exports = {
  homelist,
  locationInfo,
  addReview
};