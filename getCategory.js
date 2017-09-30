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


function chooseCategoriesDB(searchTerm) {
  return knex('keywords').select('word', 'category').then((words) => {
    let category;
    words.forEach(word => {
      if (searchTerm.includes(word.word)) {
        category = word.category;
      }
    });
    return category;
  });
}


function chooseCategoriesAPI(searchTerm) {

  const timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      resolve(null);
    }, 2000);
  });

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

  const searchAmazon = amazonClient.itemSearch({ keywords: searchTerm })
    .then((amazonResults) => {
      return amazonResults;
    })
    .catch((err) => {
      console.log('Amazon API error: ', err);
      return null;
    });

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
      console.log(`is movie: ${countMovie} - need 1`);
      if (countMovie > 0) {
        returnArray.push('watch');
      }
      console.log(`is book:  ${countBook} - need 2`);
      if (countBook > 1 ) {
        returnArray.push('read');
      }
      console.log(`is buy:   ${countOther} - need 5`);
      if (countOther > 4) {
        returnArray.push('buy');
      }
      resolve(returnArray);
    });
  };

  const combineResults = (values) => {
    const isResturant = values[1];
    const amazonCategories = values[0];
    return new Promise((resolve, reject) => {
      if (isResturant > 0.6) {
        resolve(['eat']);
      }
      if (isResturant > 0.9) {
        amazonCategories.push('eat');
      }
      resolve(amazonCategories);
    });
  };

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
