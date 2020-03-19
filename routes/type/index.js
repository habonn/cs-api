var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/type-sum", require("./get-type-sum"));

module.exports = router;