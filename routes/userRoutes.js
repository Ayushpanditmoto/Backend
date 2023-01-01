const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");
const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/authMiddleware");
const userModel = require("../models/userModel");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(userModel), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
