var router = require("express").Router();

router.use("/crud", require("./crud"));
router.use("/auth", require("./auth"));
router.use("/picklist", require("./picklist"));

module.exports = router;
