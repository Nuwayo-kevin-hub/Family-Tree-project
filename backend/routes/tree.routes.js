const express = require("express");
const router = express.Router();

const treeController = require("../controllers/tree.controller");

router.get("/:familyId", treeController.getTree);
router.get("/ancestors/:memberId", treeController.getAncestors);

router.get("/descendants/:memberId", treeController.getDescendants);

module.exports = router;