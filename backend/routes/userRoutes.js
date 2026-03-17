const router = require("express").Router();

const User = require("../models/User");
const Download = require("../models/Download");

const auth = require("../middleware/authMiddleware");
const owner = require("../middleware/adminMiddleware");


/* =========================
   OWNER USER MANAGEMENT
========================= */

// GET ALL USERS (owner only)
router.get("/", auth, owner, async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// DELETE USER (owner only)
router.delete("/:id", auth, owner, async (req, res) => {

  try {

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


/* =========================
   CURRENT USER PROFILE
========================= */

router.get("/me", auth, async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


/* =========================
   UPDATE USER PROFILE (NEW)
========================= */

router.put("/update/:id", auth, async (req, res) => {

  try {

    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


/* =========================
   USER DASHBOARD APIs
========================= */


/* GET USER DOWNLOADS */

router.get("/downloads/:id", auth, async (req,res)=>{

  try{

    const downloads = await Download.find({ userId: req.params.id })
      .populate({
        path: "appId",
        select: "name genre image version downloadCount"
      });

    res.json(downloads);

  }catch(err){

    res.status(500).json({error:err.message});

  }

});


/* DELETE DOWNLOADED APP */

router.delete("/download/:id", auth, async(req,res)=>{

  try{

    await Download.findByIdAndDelete(req.params.id);

    res.json({message:"Download removed"});

  }catch(err){

    res.status(500).json({error:err.message});

  }

});


/* DELETE OWN PROFILE */

router.delete("/delete/:id", auth, async(req,res)=>{

  try{

    await User.findByIdAndDelete(req.params.id);

    await Download.deleteMany({userId:req.params.id});

    res.json({message:"User account deleted"});

  }catch(err){

    res.status(500).json({error:err.message});

  }

});


module.exports = router;