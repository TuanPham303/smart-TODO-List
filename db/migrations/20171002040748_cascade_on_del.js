exports.up = function(knex, Promise) {
    return knex.schema.raw('ALTER TABLE "items" add constraint "items_user_id_fkey" foreign key ("user_id") references "users" ("id") on delete cascade');
      // table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
};

exports.down = function(knex, Promise) {
    return knex.schema.raw('ALTER TABLE "items" drop constraint "items_user_id_fkey"');
};
