const router = require("express").Router();

const Review = require("../models/Review");
const App = require("../models/App");
const auth = require("../middleware/authMiddleware");


// ADD REVIEW
router.post("/:appId", auth, async (req, res) => {

  try {

    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const app = await App.findById(req.params.appId);

    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    const existingReview = await Review.findOne({
      userId: req.user.id,
      appId: req.params.appId
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this app" });
    }

    const review = new Review({
      appId: req.params.appId,
      userId: req.user.id,
      rating,
      comment
    });

    await review.save();

    // recalculate rating
    const reviews = await Review.find({ appId: req.params.appId });

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    app.rating = avg;

    await app.save();

    res.status(201).json({
      message: "Review added successfully",
      review
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// GET REVIEWS FOR AN APP
router.get("/:appId", async (req, res) => {

  try {

    const reviews = await Review.find({ appId: req.params.appId })
      .populate("userId", "name");

    res.json(reviews);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// UPDATE REVIEW
router.put("/:reviewId", auth, async (req, res) => {

  try {

    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your review" });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    await review.save();

    // recalculate app rating
    const reviews = await Review.find({ appId: review.appId });

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const app = await App.findById(review.appId);

    app.rating = avg;

    await app.save();

    res.json({
      message: "Review updated successfully",
      review
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// DELETE REVIEW
router.delete("/:reviewId", auth, async (req, res) => {

  try {

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your review" });
    }

    const appId = review.appId;

    await review.deleteOne();

    // recalculate rating
    const reviews = await Review.find({ appId });

    let avg = 0;

    if (reviews.length > 0) {
      avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }

    const app = await App.findById(appId);

    if (app) {
      app.rating = avg;
      await app.save();
    }

    res.json({ message: "Review deleted successfully" });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});

module.exports = router;