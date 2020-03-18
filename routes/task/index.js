var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/task-sum", require("./get-task-sum"));

module.exports = router;