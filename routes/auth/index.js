// var router = require("express").Router();
// var auth = require('../../lib/auth');

// router.post("/authenticate", auth.optional, require("./signon"));
// router.post("/register", auth.optional, require("./register"));
// // router.post("/reset-password", auth.optional, require("./reset-password"));

// module.exports = router;


var router = require("express").Router();
var auth = require('../../lib/auth');

router.post("/", require("./signon"));
router.post("/register", require("./register"));
// router.post("/reset-password", auth, require("./reset-password"));
router.get("/genpass", require("./password"));

module.exports = router;
