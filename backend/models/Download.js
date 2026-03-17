const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  appId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "App",
    required: true
  },

  downloadedAt: {
    type: Date,
    default: Date.now
  }

});

// optional: prevent duplicate downloads
downloadSchema.index({ userId: 1, appId: 1 }, { unique: false });

module.exports = mongoose.model("Download", downloadSchema);