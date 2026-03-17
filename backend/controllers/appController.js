const App = require("../models/App");
const Download = require("../models/Download");
const Notification = require("../models/Notification");


// CREATE APP
exports.createApp = async (req, res) => {
  try {

    const { name, description, version, genre, releaseDate } = req.body;

    const app = new App({
      name,
      description,
      version,
      genre,
      releaseDate,
      ownerId: req.user.id,
      rating: 0 // ensure rating exists when app is created
    });

    await app.save();

    res.status(201).json(app);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};



// GET APPS (SEARCH + FILTER)
exports.getApps = async (req, res) => {
  try {

    const { search, rating, genre } = req.query;

    let filter = { visibility: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (genre) {
      filter.genre = genre;
    }

    const apps = await App.find(filter);

    // ensure rating always returns a number
    const formattedApps = apps.map(app => ({
      ...app._doc,
      rating: app.rating ? Number(app.rating.toFixed(1)) : 0
    }));

    res.json(formattedApps);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};



// GET SINGLE APP
exports.getAppDetails = async (req, res) => {
  try {

    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    // ensure rating is returned properly
    const result = {
      ...app._doc,
      rating: app.rating ? Number(app.rating.toFixed(1)) : 0
    };

    res.json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};



// UPDATE APP
exports.updateApp = async (req, res) => {
  try {

    const updatedApp = await App.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ message: "App not found" });
    }

    res.json(updatedApp);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};



// DELETE APP
exports.deleteApp = async (req, res) => {
  try {

    const deletedApp = await App.findByIdAndDelete(req.params.id);

    if (!deletedApp) {
      return res.status(404).json({ message: "App not found" });
    }

    res.json({ message: "App deleted successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};



// HIDE APP
exports.hideApp = async (req, res) => {
  try {

    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    app.visibility = false;

    await app.save();

    res.json({ message: "App hidden from users" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};



// DOWNLOAD APP
exports.downloadApp = async (req, res) => {
  try {

    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    // increase download count
    app.downloadCount += 1;
    await app.save();

    // save download record
    const download = new Download({
      userId: req.user.id,
      appId: req.params.id
    });

    await download.save();

    // notify owner
    const notification = new Notification({
      userId: app.ownerId,
      appId: app._id,
      message: "Your app was downloaded"
    });

    await notification.save();

    res.json({ message: "App downloaded successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};