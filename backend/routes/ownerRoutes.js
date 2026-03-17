const express = require("express");
const router = express.Router();

const User = require("../models/User");

/* GET ALL USERS */
router.get("/users", async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


/* MAKE OWNER */
router.put("/make-owner/:id", async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "owner";

    await user.save();

    res.json({ message: "User promoted to owner" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


/* MAKE USER */
router.put("/make-user/:id", async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "user";

    await user.save();

    res.json({ message: "Role changed to user" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


/* DELETE USER */
router.delete("/delete-user/:id", async (req, res) => {

  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


module.exports = router;