exports.seed = function(knex, Promise) {
  return knex('users', 'items').del()
    .then(function () {
      return Promise.all([]);
    });
  };
