const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesController");

router
  .route("/")
  .get(getCourses)
  .post(protect, authorize("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
