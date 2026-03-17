const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  version: {
    type: String,
    default: "1.0"
  },

  releaseDate: {
    type: Date
  },

  genre: {
    type: String,
    required: true,
    enum: ["games","beauty","fashion","women","health"]
  },

  developer: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: ""
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  // ⭐ ADD THIS FIELD (rating points / total reviews)
  ratingCount: {
    type: Number,
    default: 0
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  visibility: {
    type: Boolean,
    default: true
  },

  downloadCount: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("App", appSchema);