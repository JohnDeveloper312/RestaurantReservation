const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

function validTable(req, res, next) {
  const { data: { table_name, capacity } = {} } = req.body;
  if (!table_name || table_name === "") {
    return next({
      status: 400,
      message: "table_name is missing!",
    });
  }
  if (!capacity || capacity < 1) {
    return next({
      status: 400,
      message: "Must include a capacity of atleast 1",
    });
  }
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "Must include a table_name longer than one character.",
    });
  }

  next();
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
  create: [validTable, asyncErrorBoundary(create)],
};
