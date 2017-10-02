require('dotenv').config();
const amazon           = require('amazon-product-api');
const stringSimilarity = require('string-similarity');
const knexConfig       = require("./knexfile");
const knex             = require("knex")(knexConfig.development);

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.google_key,
  Promise: Promise
});

const amazonClient = amazon.createClient({
  awsId: process.env.amazon_key_public,
  awsSecret: process.env.amazon_key_secret,
  awsTag: process.env.amazon_tag
});

// check database to see if there are matching keywords
function chooseCategoriesDB(searchTerm) {
  return knex('keywords').select('word', 'category').then((words) => {
    let category;
    words.forEach(word => {
      const keywordRegExp = new RegExp(`\\b${word.word}\\b`);
      if (keywordRegExp.test(searchTerm)) {
        category = word.category;
      }
    });
    return category;
  });
}

// use amazon and google places APIs to determine type of object
function chooseCategoriesAPI(searchTerm) {

  console.log('searchTerm: ', searchTerm);

  // promise used to create race condition to timeout API requests after 2 seconds
  const timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      resolve(null);
    }, 2000);
  });

  // query google places API for results with type 'restaurant' within 30km of downtown vancouver
  const searchMaps = googleMapsClient.places({
    query: searchTerm,
    radius: 30000,
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

  // query amazon for first 10 results matching keyword
  const searchAmazon = amazonClient.itemSearch({ keywords: searchTerm })
    .then((amazonResults) => {
      return amazonResults;
    })
    .catch((err) => {
      console.log('Amazon API error: ', err.Error);
      return null;
    });

  // determine if search term is a restaurant
  function processGoogleResults(googleResults) {
    return new Promise((resolve,reject) => {
      if (!googleResults) {
        console.log('No response from Google Places API');
        return resolve(0);
      }
      let isRestaurant = 0;
      googleResults.forEach((result) => {
        const similarity = stringSimilarity.compareTwoStrings(searchTerm, result.name);
        if (similarity > isRestaurant) {
          isRestaurant = similarity;
        }
      });
      console.log(`is restaraunt: ${isRestaurant * 100} % - need 60% for maybe, 90% for sure`);
      resolve(isRestaurant);
    });
  }

  // determine if search term is an item to read, watch or buy
  const processAmazonResults = (amazonResults) => {
    return new Promise((resolve,reject) => {
      if (!amazonResults) {
        console.log('No response from Amazon API');
        return resolve([]);
      }
      const returnArray = [];
      let countMovie = 0;
      let countBook = 0;
      let countOther = 0;
      amazonResults.forEach((searchResult) => {
        // add to category based on if item type is any of the specified item types
        // can add more item types to compare against to improve accuracy
        const item = searchResult.ItemAttributes[0].ProductGroup[0];
        if (item === 'Movie' || item === 'DVD' || item === 'Video') {
          countMovie += 1;
        } else if (item === 'Book' || item === 'eBooks') {
          countBook += 1;
        } else {
          countOther += 1;
        }
      });
      // adjust values to fine tune accuracy/simplicity of results
      console.log(`is movie: ${countMovie > 0}, result ${countMovie} - need 1`);
      if (countMovie > 0) {
        returnArray.push('watch');
      }
      console.log(`is book: ${countBook > 1}, result ${countBook} - need 2`);
      if (countBook > 1) {
        returnArray.push('read');
      }
      console.log(`is buy: ${countOther > 4}, result ${countOther} - need 5`);
      if (countOther > 4) {
        returnArray.push('buy');
      }
      resolve(returnArray);
    });
  };

  // perform final decision making based on computed results from APIs
  const combineResults = (values) => {
    const isResturant = values[1];
    const amazonCategories = values[0];
    return new Promise((resolve, reject) => {
      // adjust values to fine tune accuracy/simplicity of results
      if (isResturant > 0.9) {
        resolve(['eat']);
      }
      if (isResturant > 0.6) {
        amazonCategories.push('eat');
      }
      resolve(amazonCategories);
    });
  };

  // race API requests against timeout function to ensure we aren't waiting too long
  const amazon = Promise.race([searchAmazon, timeout])
    .then(amazonResults => {
      return processAmazonResults(amazonResults);
    })
    .then(returnArray => {
      return returnArray;
    });

  const maps = Promise.race([searchMaps, timeout])
    .then(mapsResults => {
      return processGoogleResults(mapsResults);
    })
    .then(isRestaurant => {
      return isRestaurant;
    });

  return Promise.all([amazon, maps])
    .then(values => {
      return combineResults(values);
    });
}

// only check APIs if result was not found by matching keywords
function ifDBsuccess(result, searchTerm) {
  if (result) {
    return Promise.resolve(result);
  } else {
    return Promise.resolve(chooseCategoriesAPI(searchTerm));
  }
}

module.exports = function chooseCategories(searchTerm){

  return chooseCategoriesDB(searchTerm)
    .then(result => {
      return ifDBsuccess(result, searchTerm);
    });
};
