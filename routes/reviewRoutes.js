const express = require("express");
const router = express.Router({ mergeParams: true });
const ReviewModel = require("../models/reviewModel");
const { protect, authorize } = require("../middleware/authMiddleware");
const advancedResults = require("../middleware/advancedResults");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewControllers");

router
  .route("/")
  .get(
    advancedResults(ReviewModel, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);

module.exports = router;
