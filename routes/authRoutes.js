const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
} = require("../controllers/authControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot").post(forgotPassword);
router.route("/me").get(protect, getMe);

module.exports = router;
