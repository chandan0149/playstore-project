const Review = require("../models/Review");
const App = require("../models/App");


// ADD REVIEW
exports.addReview = async (req, res) => {

  try {

    const { rating, comment } = req.body;

    const app = await App.findById(req.params.appId);

    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    // Prevent same user reviewing multiple times
    const existingReview = await Review.findOne({
      userId: req.user.id,
      appId: req.params.appId
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this app" });
    }

    const review = new Review({
      rating,
      comment,
      userId: req.user.id,
      appId: req.params.appId
    });

    await review.save();

    // Recalculate average rating
    const reviews = await Review.find({ appId: req.params.appId });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);

    const avgRating = totalRating / reviews.length;

    // Save rounded rating
    app.rating = Number(avgRating.toFixed(1));

    // ⭐ ADD THIS LINE (rating points)
    app.ratingCount = reviews.length;

    await app.save();

    res.status(201).json(review);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// GET REVIEWS FOR AN APP
exports.getReviews = async (req, res) => {

  try {

    const reviews = await Review.find({ appId: req.params.appId })
      .populate("userId", "name");

    res.json(reviews);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};