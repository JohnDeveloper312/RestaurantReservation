const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./tables.controller");
const router = require("express").Router();

router
.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed)

router
.route("/:table_id/seat")
.put(controller.update)
.all(methodNotAllowed)

module.exports = router;