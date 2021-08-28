
exports.up = function(knex) {
    return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.string("table_name").notNullable();
        table.integer("capacity").notNullable();
        table.boolean("occupied").notNullable();
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tables');
};
