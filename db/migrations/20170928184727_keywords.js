exports.up = function(knex, Promise) {
  return knex.schema.createTable('keywords', function (table) {
      table.increments();
      table.string('word');
      table.string('category');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('keywords');
};
