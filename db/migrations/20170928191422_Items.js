exports.up = function(knex, Promise) {
  return knex.schema.renameTable('Items', 'items');

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Items');
};
