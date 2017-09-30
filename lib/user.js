const bcrypt = require("bcrypt");

module.exports = function(knex) {
  // check if user exists in db (by email)
  function findEmail(email) {
    return new Promise((resolve, reject) => {
      knex("users")
        .where("email", email)
        .limit(1)
        .then(rows => {
          let user = rows[0];
          return user ? resolve(user) : reject(email);
        })
        .catch(error => reject(error));
    });
  }
  // if exists, check that password matches (add bycrpt later after register)
  function authenticate(email, password) {
    return new Promise((resolve, reject) => {
      findEmail(email)
        .then(user => {
          if (!user) {
            return reject("Not Found");
          }
          // ADD BCRYPT HERE LATER!!
          if (password === user.password) {
            return resolve(user);
          } else {
            return reject("Not Cool, Dude." + user.password);
          }
        })
        .catch(error => reject(error));
    });
  }

  // add new user

  return {
    findEmail: findEmail,
    authenticate: authenticate
  };
};
