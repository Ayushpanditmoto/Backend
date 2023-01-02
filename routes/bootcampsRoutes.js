const express = require("express");
const router = express.Router();
const BootcampModel = require("../models/bootcampModel");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcampsController");

const { protect, authorize } = require("../middleware/authMiddleware");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const courseRouter = require("./coursesRoutes");
// const reviewRouter = require('./reviewsRoutes');

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

// router.route("/:id/photo").put(protect, authorize("publisher", "admin"), uploadBootcampPhoto;

router
  .route("/")
  .get(advancedResults(BootcampModel, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
