const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
  verifyUser
} = require("../services/userServices");
const { protect } = require("../middleware/authMiddleware");



router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser).get("/verify/:token", verifyUser);

module.exports = router;
