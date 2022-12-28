const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcampsController");

const { protect } = require("../middleware/authMiddleware");

// Include other resource routers
const courseRouter = require("./coursesRoutes");
// const reviewRouter = require('./reviewsRoutes');

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(getBootcamps).post(protect, createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
