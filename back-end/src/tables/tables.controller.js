const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service")

function tableCheck(req, res, next) {
  const {
    data: { table_name, capacity, occupied },
  } = req.body;
  if (!table_name || table_name == "" || table_name.length < 2) {
    return next({
      status: 400,
      message: `Table must have a name and name must be more than 2 characters`,
    });
  }
  res.locals.table = {
    table_name: table_name,
    capacity: capacity,
    occupied: occupied,
  };
  next();
}

async function updateCheck(req, res, next) {
  const table = await service.read(req.params.table_id);
  const reservation = await reservationService.read(
    req.body.data.reservation_id
  );
  const errs = [];
  let goNext = false;
  if (table.occupied == true) {
    goNext = true;
    errs.push(`This table is currently seated, select another table`);
  }
  if (reservation.people > table.capacity) {
    goNext = true;
    errs.push(`Reservation capacity is greater than table capacity`);
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

async function update(req,res,next){
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
  res.json({ data: await service.create(res.locals.table) });
}



module.exports = {
  list: asyncErrorBoundary(list),
  create: [tableCheck, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(updateCheck), asyncErrorBoundary(update)]
};
