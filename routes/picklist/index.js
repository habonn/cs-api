var router = require("express").Router();
var auth = require('../../lib/auth');

// router.get("/code-table/:codeTableCode", require("./get-code-table"));
router.get("/:table/:column", require("./get-picklist"));

module.exports = router;