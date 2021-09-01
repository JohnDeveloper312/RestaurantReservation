const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(tableId) {
  return knex("tables").where({ table_id: tableId }).first();
}

function create(table) {
  return knex("tables")
    .insert(table, "*")
    .then((createdTables) => createdTables[0]);
}

function update(table) {
  return knex("tables")
    .where({ table_id: table.table_id })
    .update(table, "*")
    .then((updated) => updated[0]);
}

function destroy(tableId){
    return knex("tables")
    .where({table_id: tableId})
    .update({occupied: false, reservation_id: null}, "*")
}

module.exports = {
  list,
  create,
  read,
  update,
  delete: destroy,
};
