const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/authControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot").post(forgotPassword);
router.route("/me").get(protect, getMe);
router.route("/reset/:resetToken").put(resetPassword);
router.route("/updatedetails").put(protect, updateDetails);
router.route("/updatepassword").put(protect, updatePassword);

module.exports = router;
