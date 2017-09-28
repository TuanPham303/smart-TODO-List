require('dotenv').config();
const amazon = require('amazon-product-api');
const stringSimilarity = require('string-similarity');

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.google_key,
  Promise: Promise
});

const amazonClient = amazon.createClient({
  awsId: process.env.amazon_key_public,
  awsSecret: process.env.amazon_key_secret,
  awsTag: process.env.amazon_tag
});


function chooseCategories(searchTerm) {

  const searchMaps = googleMapsClient.places({
    query: searchTerm,
    radius: 50000,
    location: [49.282039, -123.108090],
    type: 'restaurant'
  })
    .asPromise()
    .then((response) => {
      return response.json.results;
    })
    .catch((err) => {
      console.log('Google Places API error: ', err);
    });

  const searchAmazon = amazonClient.itemSearch({ keywords: searchTerm })
    .then((amazonResults) => {
      return amazonResults;
    })
    .catch((err) => {
      console.log('Amazon API error: ', err);
      return err;
    });

  function processGoogleResults(googleResults) {
    return new Promise((resolve,reject) => {
      let isRestaurant = 0;
      googleResults.forEach((result) => {
        const similarity = stringSimilarity.compareTwoStrings(searchTerm, result.name);
        if (similarity > 0.7) {
          isRestaurant = 1;
          if (similarity > 0.9) {
            isRestaurant = 2;
          }
        }
      });
      resolve(isRestaurant);
    });
  }

  const processAmazonResults = (amazonResults) => {
    return new Promise((resolve,reject) => {
      const returnArray = [];
      let countMovie = 0;
      let countBook = 0;
      let countOther = 0;
      amazonResults.forEach((searchResult) => {
        const item = searchResult.ItemAttributes[0].ProductGroup[0];
        if (item === 'Movie' || item === 'DVD' || item === 'Video') {
          countMovie += 1;
        } else if (item === 'Book' || item === 'eBooks') {
          countBook += 1;
        } else {
          countOther += 1;
        }
      });
      //adjust values to fine tune accuracy/simplicity of results
      if (countMovie > 0) {
        returnArray.push('watch');
      }
      if (countBook > 1 ) {
        returnArray.push('read');
      }
      if (countOther > 2) {
        returnArray.push('buy');
      }
      resolve(returnArray);
    });
  };

  const combineResults = (values) => {
    const isResturant = values[1];
    const amazonCategories = values[0];
    return new Promise((resolve, reject) => {
      if (isResturant === 2) {
        resolve(['eat']);
      }
      if (isResturant === 1) {
        amazonCategories.push('eat');
      }
      resolve(amazonCategories);
    });
  };

  const amazon = searchAmazon
    .then(amazonResults => {
      return processAmazonResults(amazonResults);
    })
    .then(returnArray => {
      return returnArray;
    });

  const maps = searchMaps
    .then(mapsResults => {
      return processGoogleResults(mapsResults);
    })
    .then(isRestaurant => {
      return isRestaurant;
    });

  return Promise.all([amazon, maps])
    .then(values => {
      console.log(combineResults(values));
      return combineResults(values);
    });
}


chooseCategories(process.argv[2]);







