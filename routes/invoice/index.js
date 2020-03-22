var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/:table/:id", require("./invoice"));

module.exports = router;