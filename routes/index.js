var router = require("express").Router();

router.use("/crud", require("./crud"));
router.use("/auth", require("./auth"));
router.use("/picklist", require("./picklist"));
router.use("/runcode", require("./runcode"));
router.use("/task", require("./task"));
router.use("/type", require("./type"));
router.use("/today", require("./today"));

module.exports = router;
