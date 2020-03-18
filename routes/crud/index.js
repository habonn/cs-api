// var router = require("express").Router();
// var auth = require('../../lib/auth');

// router.get("/:table", auth.optional, require("./get-list"));
// router.get("/:table/:id", auth.optional, require("./get-detail"));
// router.post("/:table", auth.optional, require("./post"));
// router.put("/:table/:id", auth.optional, require("./put"));
// router.delete("/:table/:id", auth.optional, require("./delete"));

// module.exports = router;

var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/:table", require("./get-list"));
router.get("/:table/:id", require("./get-detail"));
router.post("/:table", require("./post"));
router.put("/:table/:id", require("./put"));
router.delete("/:table/:id", require("./delete"));

module.exports = router;
