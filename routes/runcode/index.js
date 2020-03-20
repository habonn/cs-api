var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/number", require("./run-code"));
router.put("/:year/:pre_fix", require("./code-update"));

module.exports = router;