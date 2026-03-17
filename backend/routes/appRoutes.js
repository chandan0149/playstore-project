const express = require("express");
const router = express.Router();

const App = require("../models/App");
const Download = require("../models/Download");
const Notification = require("../models/Notification");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const ownerMiddleware = require("../middleware/adminMiddleware");


// ADD APP (Owner only)
router.post("/", authMiddleware, ownerMiddleware, async (req, res) => {

  try {

    const { name, description, version, genre, releaseDate } = req.body;

    const app = new App({
      name,
      description,
      version,
      genre,
      releaseDate,
      ownerId: req.user.id,
      downloadCount: 0
    });

    await app.save();

    res.status(201).json(app);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// GET ALL APPS
router.get("/", async (req, res) => {

  try {

    const apps = await App.find({ visibility: true });

    res.json(apps);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// GET OWNER APPS
router.get("/owner/apps", authMiddleware, ownerMiddleware, async (req, res) => {

  try {

    const apps = await App.find({ ownerId: req.user.id });

    res.json(apps);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// SEARCH APPS
router.get("/search/app", async (req, res) => {

  try {

    const { name } = req.query;

    const apps = await App.find({
      name: { $regex: name, $options: "i" },
      visibility: true
    });

    res.json(apps);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// FILTER BY RATING
router.get("/filter/rating", async (req, res) => {

  try {

    const { rating } = req.query;

    const apps = await App.find({
      rating: { $gte: Number(rating) },
      visibility: true
    });

    res.json(apps);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// GET APPS BY CATEGORY
router.get("/category/:genre", async (req, res) => {

  try {

    const apps = await App.find({
      genre: req.params.genre,
      visibility: true
    });

    res.json(apps);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


/* =====================================
   DOWNLOAD APP
===================================== */

router.post("/:id/download", authMiddleware, async (req, res) => {

  try {

    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    const existingDownload = await Download.findOne({
      userId: req.user.id,
      appId: req.params.id
    });

    if (!existingDownload) {

      const download = new Download({
        userId: req.user.id,
        appId: req.params.id
      });

      await download.save();

      app.downloadCount = (app.downloadCount || 0) + 1;

      await app.save();


      /* -------- OWNER NOTIFICATION (ADDED) -------- */

      const notification = new Notification({
        userId: app.ownerId,
        message: `Your app "${app.name}" was downloaded by a user`
      });

      await notification.save();

    }

    res.json({ message: "App downloaded successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// GET APP DETAILS
router.get("/:id", async (req, res) => {

  try {

    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    res.json(app);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// UPDATE APP
router.put("/:id", authMiddleware, ownerMiddleware, async (req, res) => {

  try {

    const updatedApp = await App.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );


    /* -------- USER NOTIFICATIONS (ADDED) -------- */

    const downloads = await Download.find({ appId: req.params.id });

    for (let d of downloads) {

      const notification = new Notification({
        userId: d.userId,
        message: `App "${updatedApp.name}" has been updated`
      });

      await notification.save();

    }


    res.json(updatedApp);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// DELETE APP
router.delete("/:id", authMiddleware, ownerMiddleware, async (req, res) => {

  try {

    await App.findByIdAndDelete(req.params.id);

    res.json({ message: "App deleted successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// TOGGLE VISIBILITY
router.put("/:id/visibility", authMiddleware, ownerMiddleware, async (req, res) => {

  try {

    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    app.visibility = !app.visibility;

    await app.save();

    res.json({ message: "Visibility updated" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router;