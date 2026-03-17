const router = require("express").Router();

const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");


// GET USER UNREAD NOTIFICATIONS
router.get("/", auth, async (req, res) => {

  try {

    const notifications = await Notification.find({
      userId: req.user.id,
      isRead: false
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// MARK NOTIFICATION AS READ
router.put("/:id/read", auth, async (req, res) => {

  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // ensure notification belongs to logged user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    notification.isRead = true;

    await notification.save();

    res.json({ message: "Notification marked as read" });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


module.exports = router;