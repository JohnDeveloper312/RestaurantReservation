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

// function update(table) {
//   return knex("tables")
//     .where({ table_id: table.table_id })
//     .update(table, "*")
//     .then((updated) => updated[0]);
// }

function update(table_id, reservation_id){
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .transacting(transaction);

    return knex("tables")
      .where({ table_id })
      .update({ reservation_id }, "*")
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

// function destroy(tableId){
//     return knex("tables")
//     .where({table_id: tableId})
//     .update({occupied: false, reservation_id: null}, "*")
// }

function finish(table) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id: table.reservation_id })
      .update({ status: "finished" })
      .transacting(transaction);

    return knex("tables")
      .where({ table_id: table.table_id })
      .update({ reservation_id: null }, "*")
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

module.exports = {
  list,
  create,
  read,
  update,
  // delete: destroy,
  finish,
};
