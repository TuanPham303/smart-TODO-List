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
          resolve(user);
        })
        .catch(error => reject(error));
    });
  }
  // if exists, check that password matches
  function authenticate(email, password) {
    return new Promise((resolve, reject) => {
      findEmail(email)
        .then(user => {
          if (!user) {
            resolve(user);
          }
          bcrypt.compare(password, user.password)
          .then((passwordsMatch) => {
            if (passwordsMatch) {
              return resolve(user);
            } else {
              return reject("Not cool, dude.")
            }
          })
        })
        .catch(error => reject(error));
    });
  }
  //
  return {
    findEmail: findEmail,
    authenticate: authenticate,
  };
};
