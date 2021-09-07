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
    .whereNot({status: "finished"})
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations")
  .where({ reservation_id: reservation_id })
  .first();
}

function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*")
    .then((updated) => updated[0]);
}

function  updateStatus(updateReservation) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id: updateReservation.reservation_id })
    .update({ status: updateReservation.status })
    .returning('*');
}


module.exports = {
  create,
  list,
  listByDate,
  read,
  updateStatus,
  update,
};
