const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");
const tryCatch = require("../utils/tryCatch");
const checkUserOwner = require("../middlewares/checkUserOwner");

router.get("/:tableName", tryCatch(dataController.getAll))
router.get("/:tableName/:id", checkUserOwner, tryCatch(dataController.getById))
router.delete("/:tableName/:id", checkUserOwner, tryCatch(dataController.deleteData))
router.put("/:tableName/:id", checkUserOwner, tryCatch(dataController.updateData))


module.exports = router