const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const transporter = require("../config/mailTransporter");
const jwt = require("jsonwebtoken");

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  res.send("Registration Succesfull");
  if (user) {
    const token = generateToken(user._id);
    const mailOptions = {
      from: "mochat.verify@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `
            <div>Click the following link to verify your email</div>
            <div>
                <a href='http://localhost:5001/api/user/verify/${token}'>
                    Verify Email
                </a>
            </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});
const verifyUser = expressAsyncHandler(async (req, res) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, 'rodrigo');
    const user = await User.findById(decoded.id);
    user.isVerified = true;
    await user.save();
    res.status(200).redirect("http://localhost:3000/verification/sucess")
  } catch (err) {
    console.log(err);
    res.status(500).redirect("http://localhost:3000/verification/failed");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  console.log(user);
  if (user && (await user.matchPassword(password))) {
    if(!user.isVerified) {
        throw new Error("User's email is not verified")
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  console.log(users);
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers, verifyUser };
