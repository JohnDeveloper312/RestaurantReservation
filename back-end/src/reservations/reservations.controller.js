const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */


async function list(req, res) {
  const { date } = req.query;
  if (date) {
    res.json({ data: await service.listByDate(date) });
  } else {
    res.json({
      data: await service.list(),
    });
  }
}

async function create(req, res, next) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

function resCheck(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    },
  } = req.body;
  if (!first_name || first_name == "")
    return next({ status: 400, message: `First name is required` });
  if (!last_name || last_name == "")
    return next({ status: 400, message: `Last name is required` });
  if (!mobile_number || (mobile_number == "" && isNaN(mobile_number)))
    return next({ status: 400, message: `Mobile number is required` });
  if (!reservation_date)
    return next({ status: 400, message: `Please select a reservation date` });
  if (!reservation_time)
    return next({ status: 400, message: `Please select a reservation time` });
  res.locals.reservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [resCheck, asyncErrorBoundary(create)],
};
