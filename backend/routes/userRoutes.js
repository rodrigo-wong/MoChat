const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  verifyUser
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser).get("/verify/:token", verifyUser);

module.exports = router;
