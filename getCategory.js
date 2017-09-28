require('dotenv').config();
const amazon = require('amazon-product-api');
const request = require('request');

const client = amazon.createClient({
  awsId: process.env.amazon_key_public,
  awsSecret: process.env.amazon_key_secret,
  awsTag: process.env.amazon_tag
});

function searchGmaps(searchTerm) {
  request(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.282039,-123.108090&radius=50000&type=food&keyword=${ process.argv[2] }&key=${ process.env.google_key }`, (error, response, body) => {
  return JSON.parse(body).results.length;
  });

}

function searchAmazon(searchTerm, callback) {
  const res = client.itemSearch({ keywords: searchTerm }, function(err, results, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, searchTerm, response);
    }
  });
}

//takes amazon results and returns an array of categorys
function processAmazonResults(err, amazonResults) {
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

function compareAmazonGmaps(err, searchTerm, amazonResults) {
  const categories = processAmazonResults(null, amazonResults);
  const gmapsTotal = searchGmaps(searchTerm);
  const amazonTotal = amazonResults[0].TotalResults[0];
  console.log('amazonTotal: ' + amazonTotal);
  console.log('gmapsTotal: ' + gmapsTotal);
  console.log('amazon/gmaps: ' + amazonTotal/gmapsTotal);
}

// searchAmazon(process.argv[2], compareAmazonGmaps);

console.log(searchGmaps('spoon'));










