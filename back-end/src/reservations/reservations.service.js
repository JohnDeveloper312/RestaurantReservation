const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

function list() {
  return knex("reservations").select("*");
}

function listByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations")
  .where({ reservation_id: reservation_id })
  .first();
}

module.exports = {
  create,
  list,
  listByDate,
  read,
};
