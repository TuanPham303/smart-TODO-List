exports.seed = function(knex, Promise) {
  return knex('users', 'items', 'keywords').del()
    .then(function () {
      return Promise.all([
      ]);
    });
  };
