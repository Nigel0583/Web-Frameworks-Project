/* GET 'home' page */
const homelist = function(req, res){
  res.render('locations-list', {
    title: 'Top 10 Circuits',
    pageHeader: {
      title: 'Top 10 Circuits',
      strapline: 'The top ten Formula one circuits from around the world'
    },
    sidebar: "Text here",
    circuits: [{
      circuitName: 'Albert Park Grand Prix Circuit',
      locality: 'Melbourne',
        facilities: '../img/Albert_Lake_Park_Street_Circuit_in_Melbourne,_Australia.svg',
      country: 'Australia'
    }, {
      circuitName: 'Red Bull Ring',
      locality: 'Spielberg',
        facilities: '../img/1280px-Circuit_Red_Bull_Ring.svg',
      country: 'Austria'
    }, {
      circuitName: 'Bahrain International Circuit',
      locality: 'Sakhir',
      facilities: '../img/1280px-Bahrain_International_Circuit--Grand_Prix_Layout.svg',
      country: 'Bahrain'
    },{
      circuitName: 'Circuit de Spa-Francorchamps',
      locality: 'Stavelot',
      facilities: '../img/1280px-Spa-Francorchamps_of_Belgium.svg',
      country: 'Belgium'
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