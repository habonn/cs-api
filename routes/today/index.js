var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/task-today", require("./get-task-today"));

module.exports = router;