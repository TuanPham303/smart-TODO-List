exports.up = function(knex, Promise) {
  return knex.schema.createTable('Items', function (table) {
      table.increments();
      table.integer('user_id');
      table.string('category');
      table.string('content');
      table.boolean('status');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Items', function (table) {
      table.dropColumn('user_id');
      table.dropColumn('category');
      table.dropColumn('content');
      table.dropColumn('status');
  });
};
