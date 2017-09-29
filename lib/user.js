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

  // check email uniqueness
  function checkEmailUniqueness(email) {
  return new Promise((resolve, reject) => {
    findEmail(email)
    .then((user) => {
      if (user) {
        return reject({
          type: 409,
          message: 'This email cannot be used'
        });
      } else {
        return resolve(email);
      }
    })
    .catch((email) => resolve(email))
  })
}

  // add new user
  function add(email, password) {
    return (
      checkEmailUniqueness(email)
      .then((email) => {
        return bcrypt.hash(password, 10);
      })
      .then((passwordDigest) => {
        return knex('users').insert({
          email: email,
          password_digest: passwordDigest
        }).returning('id');
      })
      .catch((error) => console.log("WTF:", error))
    )
  }

  // update email and password
  function updateUser(id, newEmail, newPassword) {
    let promises = [];

    if (newEmail) {
      promises.push(checkEmailUniqueness(newEmail));
    } else {
      promises.push(Promise.resolve(false));
    }

    if (newPassword) {
      promises.push(bcrypt.hash(newPassword, 10));
    } else {
      promises.push(Promise.resolve(false));
    }

    return Promise.all(promises).then((emailAndPasswordDigest) => {
      const email = emailAndPassword[0];
      const password = emailAndPassword[1];

      const updatedUser = {};
      if (email) {
        updatedUser.email = email;
      }

      if (passwordDigest) {
        updatedUser.password = password;
      }

      return knex('users')
      .update(updatedUser)
      .where({id: id});
    })
  }

  //
  return {
    findEmail: findEmail,
    authenticate: authenticate,
    updateUser: updateUser
  };
};
