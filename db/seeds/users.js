exports.seed = function(knex, Promise) {
  return knex('users', 'items', 'keywords').del()
    .then(function () {
      return Promise.all([
<<<<<<< HEAD
        knex('users').insert({ name: 'Alice'}),
        knex('users').insert({ name: 'Bob'}),
        knex('users').insert({ name: 'Charlie'})
=======
>>>>>>> a9673f51c8307708c8b3899c0d238b1ef7366ad0
      ]);
    });
  };
