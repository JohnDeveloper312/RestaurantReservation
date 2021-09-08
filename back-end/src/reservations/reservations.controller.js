const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */
const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
];
const requiredProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasProperties(req, res, next) {
  const { data = {} } = req.body;
  requiredProperties.forEach((property) => {
    if (!data[property]) {
      const error = new Error(`A '${property}' property is required.`);
      error.status = 400;
      return next(error);
    }
  });
  next();
}

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  const timeFormat = /\d\d:\d\d/;
  const invalidFields = Object.keys(data).filter(
    (field) => !validProperties.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  if (typeof data.people != "number" || data.people < 1) {
    return next({
      status: 400,
      message: "the people field must be a number",
    });
  }
  if (!data.reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message: `the ${reservation_date} field must be a valid date`,
    });
  }
  if (!data.reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: `the ${reservation_time} field must be a valid time`,
    });
  }
  if (data.status === "seated") {
    return next({
      status: 400,
      message: "the reservation is already seated.",
    });
  }
  if (data.status === "finished") {
    return next({
      status: 400,
      message: "the reservation is already finished.",
    });
  }
  next();
}

function validReservationTime(req, res, next) {
  let time = Number(req.body.data.reservation_time.replace(":", ""));
  if (time < 1030 || time > 2130)
    return next({
      status: 400,
      message: `Reservation times are only valid from 10:30 AM to 9:30 PM.`,
    });
  next();
}

function validReservationDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const invalidDate = 2;
  const submitDate = new Date(reservation_date + " " + reservation_time);
  const dayAsNum = submitDate.getDay();
  const today = new Date();

  if (!reservation_date) {
    next({
      status: 400,
      message: `Please select a date.`,
    });
  }
  if (submitDate < today) {
    next({
      status: 400,
      message: `The date and time cannot be in the past, please select a reservation date and time in the future.`,
    });
  }
  if (dayAsNum === invalidDate) {
    next({
      status: 400,
      message: `We are currently closed on Tuesdays, please select a different day.`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} not found`,
  });
}

async function reservationStatus(req, res, next) {
  const reservation = res.locals.reservation;
  if (
    req.body.data.status !== "seated" &&
    req.body.data.status !== "finished" &&
    req.body.data.status !== "booked"
  ) {
    return next({ status: 400, message: "Status is unknown" });
  }
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "finished reservation cannot be updated",
    });
  }
  return next();
}

function queryChecker(req, res, next) {
  const { mobile_number } = req.query;
  if (mobile_number) {
    res.locals.mobile_number = mobile_number;
    return search(req, res);
  } else return next();
}

async function search(req, res) {
  res.json({ data: await service.search(res.locals.mobile_number) });
}

async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    res.json({ data: await service.listByDate(date) });
  } else if (mobile_number) {
    res.json({ data: await service.search(mobile_number) });
  } else {
    res.json({ data: await service.list() });
  }
  // res.json({
  //   data: await service.listByDate(date),
  // });
}

async function create(req, res, next) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

async function read(req, res) {
  const { reservation_Id } = req.params;
  const reservation = await service.read(reservation_Id);
  res.status(200).json({ data: reservation });
}

async function update(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  res.json({ data: await service.update(updatedReservation) });
}

module.exports = {
  create: [
    hasProperties,
    hasValidProperties,
    asyncErrorBoundary(validReservationTime),
    asyncErrorBoundary(validReservationDate),
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(queryChecker), asyncErrorBoundary(list)],
  read: asyncErrorBoundary(read),
  update: [
    asyncErrorBoundary(reservationExists),
    reservationStatus,
    asyncErrorBoundary(update),
  ],
};
