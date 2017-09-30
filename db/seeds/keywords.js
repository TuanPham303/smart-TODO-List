
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('keywords').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('keywords').insert({category: 'eat', word: 'eat'}),
        knex('keywords').insert({category: 'eat', word: 'make'}),
        knex('keywords').insert({category: 'eat', word: 'drink'}),
        knex('keywords').insert({category: 'read', word: 'read'}),
        knex('keywords').insert({category: 'read', word: 'study'}),
        knex('keywords').insert({category: 'read', word: 'review'}),
        knex('keywords').insert({category: 'buy', word: 'buy'}),
        knex('keywords').insert({category: 'buy', word: 'get'}),
        knex('keywords').insert({category: 'buy', word: 'pick up'}),
        knex('keywords').insert({category: 'buy', word: 'purchase'}),
        knex('keywords').insert({category: 'watch', word: 'see'}),
        knex('keywords').insert({category: 'watch', word: 'watch'})
      ]);
    });
};
