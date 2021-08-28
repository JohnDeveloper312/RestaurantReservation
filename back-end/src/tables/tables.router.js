const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./tables.controller");
const router = require("express").Router();

router
.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed)

module.exports = router;