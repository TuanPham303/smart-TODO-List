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
    .then((results) => {
      return results;
    })
    .catch((err) => {
      console.log('Amazon API error: ', err[0].Error);
    });

  function processGoogleResults(googleResults) {
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
    return isRestaurant;
  }

  function processAmazonResults(amazonResults) {
    const returnArray = [];
    let countMovie = 0;
    let countBook = 0;
    let countOther = 0;
    amazonResults[0].Item.forEach((searchResult) => {
      const item = searchResult.ItemAttributes[0].ProductGroup[0];
      console.log(item);
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
    return returnArray;
  }

  // searchMaps.then((results) => {
  //   return processGoogleResults(results);
  // });

  // searchAmazon.then((results) => {
  //   return processAmazonResults(results);
  // });


  // Promise.all([searchMaps]).then(values => {
  //   console.log(values);
  // });

  const isResturant = searchMaps.then((results) => {
    return processGoogleResults(results, searchTerm);
  });
  const amazonCategories = searchAmazon.then((results) => {
    return processAmazonResults(results);
  });

  if (isResturant === 2) {
    return ['eat'];
  }
  if (isResturant === 1) {
    amazonCategories.push('eat');
  }
  return amazonCategories;

}



chooseCategories(process.argv[2]);







