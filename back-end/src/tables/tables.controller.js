const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const {
  read: readReservation,
} = require("../reservations/reservations.service");
const { table } = require("../db/connection");

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter((field) => {
    !VALID_PROPERTIES.includes(field);
  });
  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(",")}`,
    });
  next();
}

const hasRequiredProperties = hasProperties("table_name", "capacity");

const hasRequiredUpdateProperties = hasProperties("reservation_id");

function hasValidTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `table_name`,
    });
  }
  next();
}
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  return next({ status: 404, message: `table_id ${table_id} not found.` });
}

async function reservationExists(req, res, next) {
    const { reservation_id } = req.body.data;
    console.log(reservation_id)
    const reservation = await readReservation(reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    return next({
      status: 404,
      message: `Reservation ID: ${reservation_id} is not found.`,
    });
}

function tableNotOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    return next({
      status: 400,
      message: "Table is occupied.",
    });
  }
  next();
}
function tableOccupied(req, res, next) {
  if (!res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: "Table is not occupied",
    });
  }
  next();
}

async function updatecheck(req, res, next) {
  const table = await service.read(req.params.table_id);
  const reservation = await reservationService.read(
    req.body.data.reservation_id
  );
  const errs = [];
  let goNext = false;
  if (table.occupied == true) {
    goNext = true;
    errs.push(`occupied`);
  }
  if (reservation.people > table.capacity) {
    goNext = true;
    errs.push(`capacity`);
  }
  if (!table) {
    goNext = true;
    errs.push(`Table not found`);
  }
  if (!reservation) {
    goNext = true;
    errs.push(`Reservation not found`);
  }
  if (goNext) return next({ status: 400, message: errs });
  res.locals.table = table;
  res.locals.reservation_id = req.body.data.reservation_id;
  return next();
}

async function reservationSeated(req, res, next) {
  const reservation = await reservationService.read(
    req.body.data.reservation_id
  );
  if (reservation.status === "seated") {
    return next({ status: 400, message: "reservation is already seated" });
  }
  return next();
}

function tableCheck(req, res, next) {
  const {
    data: { table_name, capacity, reservation_id, occupied },
  } = req.body;
  if (!table_name || table_name == "" || table_name.length < 2) {
    return next({
      status: 400,
      message: [`table_name`],
    });
  }
  res.locals.table = {
    table_name: table_name,
    reservation_id: reservation_id,
    capacity: capacity,
    occupied: occupied,
  };
  next();
}

async function update(req, res, next) {
  const reservationSeat = {
    ...res.locals.reservation,
    status: "seated",
  };
  await reservationService.updateStatus(reservationSeat);

  const updatedTable = {
    ...res.locals.table,
    reservation_id: res.locals.reservation_id,
    occupied: true,
  };
  res.json({ data: await service.update(updatedTable) });
}

async function list(req, res) {
  const { date } = req.query;
  res.json({ data: await service.list(date) });
}

async function create(req, res) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({
    data: newTable,
  });
}

async function destroy(req, res) {
  const reservationSeat = {
    reservation_id: res.locals.table.reservation_id,
    status: "finished",
  };
  await reservationService.updateStatus(reservationSeat);
  await service.delete(res.locals.table.table_id);
  res.status(200).json({});
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidTableName,
    tableCheck,
    asyncErrorBoundary(create),
  ],
  update: [
    hasOnlyValidProperties,
    hasRequiredUpdateProperties,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updatecheck),
    asyncErrorBoundary(reservationSeated),
    asyncErrorBoundary(tableNotOccupied),
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableOccupied),
    asyncErrorBoundary(destroy),
  ],
};
